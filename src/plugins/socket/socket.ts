import { ISocketConnectionStatusResponse } from '@/modules/camera/types';
import io, { Socket } from 'socket.io-client';

export const SocketEvents = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    WEB_APP_USER_LOGIN: 'web_app_user_login',
    WEB_APP_SEND_ONVIF_PROFILE: 'web_app_send_onvif_profile',
    WEB_APP_UPDATE_CAMERA_CONNECTION_STATUS: 'WEB_APP_UPDATE_CAMERA_CONNECTION_STATUS',
};

const SOCKET_BASE_URL = process.env.VUE_APP_CVM_SOCKET_SERVER_URL as string;
let socket: Socket;

interface ISocketConnectInfo {
    senderId: number;
    senderUsername: string;
    senderEmail: string | null;
}

type SocketSubscribeReceiveOnvifProfileCallback = (
    message: Record<string, string | number>,
) => void;

type SocketSubcribeReceiveCameraStatusCallback = (
    message: ISocketConnectionStatusResponse,
) => void;

export default {
    getSocket(): Socket {
        return socket;
    },
    connect(info: ISocketConnectInfo): void {
        if (socket) {
            this.login(info);
        } else {
            socket = io(SOCKET_BASE_URL, {
                reconnection: true,
            });
            if (info?.senderId) this.login(info);
        }
    },
    disconnect(): void {
        if (socket) {
            socket.disconnect();
        }
    },
    login(info: ISocketConnectInfo): void {
        if (socket) {
            socket.emit(SocketEvents.WEB_APP_USER_LOGIN, info);
        }
    },
    // receive onvif profile
    subscribeReceiveOnvifProfile(
        listener: SocketSubscribeReceiveOnvifProfileCallback,
    ): void {
        if (socket) {
            socket.on(
                SocketEvents.WEB_APP_SEND_ONVIF_PROFILE,
                (result: Record<string, string | number>) => {
                    listener(result);
                },
            );
        }
    },
    // receive camera connection status
    subscribeReceiveCameraStatus(
        listener: SocketSubcribeReceiveCameraStatusCallback,
    ): void {
        if (socket) {
            socket.on(
                SocketEvents.WEB_APP_UPDATE_CAMERA_CONNECTION_STATUS,
                (result: ISocketConnectionStatusResponse) => {
                    listener(result);
                },
            );
        }
    },
};
