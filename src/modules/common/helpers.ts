import axiosOrigin from 'axios';
import moment from 'moment';
import { Moment, Duration } from 'moment-timezone';
import { ITreeNode } from './types';

export async function downloadFile(urlFile = '', fileName = ''): Promise<boolean> {
    try {
        const response = await axiosOrigin({
            method: 'get',
            url: urlFile,
            responseType: 'arraybuffer',
        });

        const blob = new Blob([response.data], { type: 'text' });
        const fileURL = window.URL.createObjectURL(blob);
        const fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', fileName);
        document.body.appendChild(fileLink);
        fileLink.click();
        return true;
    } catch (e) {
        return false;
    }
}

export function getFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + '' + sizes[i];
}

export function round(date: Moment, duration: Duration): string {
    return moment(Math.ceil(+date / +duration) * +duration)
        .fmHM()
        .toString();
}

export function mapTreeToFlatList(trees: ITreeNode[]): ITreeNode[] {
    const list: ITreeNode[] = [];
    const getListRecursively = (tree: ITreeNode[]) => {
        tree.forEach((subTree) => {
            list.push(subTree);
            if (subTree?.children?.length) {
                getListRecursively(subTree.children);
            }
        });
    };
    getListRecursively(trees);
    return list;
}
