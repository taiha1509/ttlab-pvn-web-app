import {
    RTCConfiguration,
    RTCIceServer,
    RTCSessionDescriptionInit,
    RTCIceCandidateInit,
} from './types';
import { IceServer } from 'aws-sdk/clients/kinesisvideosignalingchannels';
import { ResourceEndpointListItem } from 'aws-sdk/clients/kinesisvideo';
import AWS, { KinesisVideo, KinesisVideoSignalingChannels } from 'aws-sdk';
import { SignalingClient, Role } from 'amazon-kinesis-video-streams-webrtc';
import { appService } from '@/utils/app';

export async function getAWSLiveView(
    region: string,
    accessKeyId: string,
    secretAccessKey: string,
    channelARN: string,
    remoteView: HTMLMediaElement,
): Promise<unknown> {
    // TODO: remove log and resolve any
    const viewer = {} as any;

    viewer.remoteView = remoteView;

    // Create KVS client
    const kinesisVideoClient = new AWS.KinesisVideo({
        region: region,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        correctClockSkew: true,
    });

    // Get signaling channel endpoints
    const getSignalingChannelEndpointResponse = (await kinesisVideoClient
        .getSignalingChannelEndpoint({
            ChannelARN: channelARN,
            SingleMasterChannelEndpointConfiguration: {
                Protocols: ['WSS', 'HTTPS'],
                Role: Role.VIEWER,
            },
        })
        .promise()) as KinesisVideo.Types.GetSignalingChannelEndpointOutput;
    const endpointsByProtocol =
        getSignalingChannelEndpointResponse?.ResourceEndpointList?.reduce(
            (endpoints: any, endpoint: ResourceEndpointListItem) => {
                if (endpoint.Protocol)
                    endpoints[endpoint.Protocol] = endpoint?.ResourceEndpoint;
                return endpoints;
            },
            {},
        );
    console.log('[VIEWER] Endpoints: ', endpointsByProtocol);

    const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
        region: region,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        endpoint: endpointsByProtocol.HTTPS,
        correctClockSkew: true,
    }) as KinesisVideoSignalingChannels;

    // Get ICE server configuration
    const getIceServerConfigResponse = (await kinesisVideoSignalingChannelsClient
        .getIceServerConfig({
            ChannelARN: channelARN,
        } as KinesisVideoSignalingChannels.Types.GetIceServerConfigRequest)
        .promise()) as KinesisVideoSignalingChannels.Types.GetIceServerConfigResponse;
    const iceServers = [] as RTCIceServer[];
    if (getIceServerConfigResponse.IceServerList)
        getIceServerConfigResponse.IceServerList.forEach((iceServer: IceServer) =>
            iceServers.push({
                urls: iceServer?.Uris || '',
                username: iceServer?.Username,
                credential: iceServer?.Password,
            }),
        );

    // Create Signaling Client
    const clientId = `${appService.getUser().id}_${+new Date()}_${Math.random()
        .toString(36)
        .substr(2, 5)}`;
    viewer.signalingClient = new SignalingClient({
        channelARN: channelARN,
        channelEndpoint: endpointsByProtocol.WSS,
        role: Role.VIEWER,
        clientId: clientId,
        region: region,
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
        },
        systemClockOffset: kinesisVideoClient.config.systemClockOffset,
    });

    const configuration = {
        iceServers,
        iceTransportPolicy: 'all',
    } as RTCConfiguration;
    viewer.peerConnection = new RTCPeerConnection(configuration);

    viewer.signalingClient.on('open', async () => {
        // Create an SDP offer to send to the master
        await viewer.peerConnection.setLocalDescription(
            await viewer.peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            }),
        );

        // When trickle ICE is enabled, send the offer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
        viewer.signalingClient.sendSdpOffer(viewer.peerConnection.localDescription);
    });

    viewer.signalingClient.on('sdpAnswer', async (answer: RTCSessionDescriptionInit) => {
        // Add the SDP answer to the peer connection
        await viewer.peerConnection.setRemoteDescription(answer);
    });

    viewer.signalingClient.on('iceCandidate', (candidate: RTCIceCandidateInit) => {
        // Add the ICE candidate received from the MASTER to the peer connection
        viewer.peerConnection.addIceCandidate(candidate);
    });

    viewer.signalingClient.on('close', () => {
        console.log('[VIEWER] Disconnected from signaling channel');
    });

    viewer.signalingClient.on('error', (error: string) => {
        console.error('[VIEWER] Signaling client error: ', error);
    });

    // Send any ICE candidates to the other peer
    viewer.peerConnection.addEventListener(
        'icecandidate',
        ({ candidate }: RTCIceCandidate) => {
            if (candidate) {
                // When trickle ICE is enabled, send the ICE candidates as they are generated.
                viewer.signalingClient.sendIceCandidate(candidate);
            } else {
                // When trickle ICE is disabled, send the offer now that all the ICE candidates have ben generated.
                viewer.signalingClient.sendSdpOffer(
                    viewer.peerConnection.localDescription,
                );
            }
        },
    );
    // As remote tracks are received, add them to the remote view
    viewer.peerConnection.addEventListener('track', (event: RTCTrackEvent) => {
        if (remoteView.srcObject) {
            return;
        }
        viewer.remoteStream = event.streams[0];
        remoteView.srcObject = viewer.remoteStream;
    });
    viewer.signalingClient.open();
    return viewer;
}

export async function stopViewerKinesis(viewer: any): Promise<void> {
    if (viewer?.signalingClient) {
        viewer.signalingClient.close();
        viewer.signalingClient = null;
    }

    if (viewer?.peerConnection) {
        viewer.peerConnection.close();
        viewer.peerConnection = null;
    }

    if (viewer?.localStream) {
        viewer.localStream.getTracks().forEach((track: any) => track.stop());
        viewer.localStream = null;
    }

    if (viewer?.remoteStream) {
        viewer.remoteStream.getTracks().forEach((track: any) => track.stop());
        viewer.remoteStream = null;
    }

    if (viewer?.peerConnectionStatsInterval) {
        clearInterval(viewer.peerConnectionStatsInterval);
        viewer.peerConnectionStatsInterval = null;
    }

    if (viewer?.remoteView) {
        viewer.remoteView.srcObject = null;
    }

    if (viewer?.dataChannel) {
        viewer.dataChannel = null;
    }
}
