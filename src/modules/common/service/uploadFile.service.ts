import { IBodyResponse } from '../types';
import axiosOrigin from 'axios';
import axios from '@/plugins/axios';

const FILE_UPLOAD_URL = `${process.env.VUE_APP_CVM_API_URL}/file`;

export enum FileUploadFlow {
    GET_PRESIGNED_URL = 'get_presigned_url',
    UPLOAD_FILE_TO_S3 = 'upload_file_to_s3',
    REGISTER_FILE = 'register_file',
}

export interface IFormatFile {
    size: number;
    originalName: string;
    extension: string;
    mimetype: string;

    isValidSize?: boolean;
    checkingFileType?: {
        isValid: boolean;
        errorMessage: string;
    };
    isTypeNSizeValid?: boolean;
    //
    id?: number;
    success?: boolean;
    url?: string;
    file: File;
}

export interface IUploadFileToS3Response {
    success: boolean;
    flow?: FileUploadFlow;
    code?: number;
    fileName?: string;
    originalName?: string;
    id?: number;
    url?: string;
}

export interface IGetPreSignedUrlResponse extends IBodyResponse<unknown> {
    data: {
        path: string;
        originalName: string;
        fileName: string;
        presignedUrl: string;
    };
}

export interface IRegisterFileParams {
    id?: number;
    path: string;
    fileName: string;
    originalName: string;
    extension: string;
    mimetype: string;
    size: number;
}

export interface IRegisterFileResponse extends IBodyResponse<unknown> {
    data: {
        id: number;
        originName: string;
        fileName: string;
        path: string;
        extension: string;
        mimetype: string;
        size: number;
        url: string;
    };
}

class FileService {
    url: string;
    constructor(url: string) {
        this.url = url;
    }

    async getPreSignedUrl(
        path: string,
        originalName: string,
    ): Promise<IGetPreSignedUrlResponse> {
        return await axios.get(`${this.url}/presigned-url`, {
            params: {
                path,
                originalName,
            },
        });
    }

    async uploadFileToS3(
        file: File,
        presignedUrl: string,
    ): Promise<IUploadFileToS3Response> {
        try {
            await axiosOrigin.put(presignedUrl, file, {
                headers: {
                    'x-amz-acl': 'public-read',
                    'Content-Type': file.type,
                },
            });
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    }

    async registerFile(params: IRegisterFileParams): Promise<IRegisterFileResponse> {
        return await axios.post(FILE_UPLOAD_URL, params);
    }
}

export const fileService = new FileService(FILE_UPLOAD_URL);

export async function uploadFile(
    filePath: string,
    fileItem: IFormatFile,
): Promise<IUploadFileToS3Response> {
    const getS3PreSignedUrlResponse = await fileService.getPreSignedUrl(
        filePath,
        fileItem.originalName,
    );
    if (!getS3PreSignedUrlResponse.success)
        return {
            success: getS3PreSignedUrlResponse.success,
            flow: FileUploadFlow.GET_PRESIGNED_URL,
        };

    const { path, originalName, fileName, presignedUrl } = getS3PreSignedUrlResponse.data;

    const uploadToS3Response = await fileService.uploadFileToS3(
        fileItem.file,
        presignedUrl,
    );

    if (!uploadToS3Response.success) {
        return {
            success: uploadToS3Response.success,
            flow: FileUploadFlow.UPLOAD_FILE_TO_S3,
        };
    }

    const registerFileResponse = await fileService.registerFile({
        path,
        fileName,
        originalName,
        extension: fileItem.extension,
        mimetype: fileItem.mimetype,
        size: fileItem.size,
    });

    if (!registerFileResponse.success) {
        return {
            success: registerFileResponse.success,
            flow: FileUploadFlow.REGISTER_FILE,
        };
    }

    return {
        success: true,
        id: registerFileResponse.data.id,
        url: registerFileResponse.data.url,
    };
}
