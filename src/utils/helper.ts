import { IPopupAttributes } from '@/modules/common/types';
import i18n from '@/plugins/vue-i18n';
import { ElMessageBox, ElNotification, MessageBoxData } from 'element-plus';

export function makeFileUrl(filepath: string): string {
    const temp =
        'https://' +
        process.env.VUE_APP_S3_BUCKET_NAME +
        '.s3.' +
        process.env.VUE_APP_S3_REGION +
        '.amazonaws.com/' +
        filepath;
    return temp;
}

export async function showConfirmPopUpFunction(
    message: string,
    title: string,
    object?: IPopupAttributes,
): Promise<void | MessageBoxData> {
    const confirmButtonText =
        object?.confirmButtonClass ||
        (i18n.global.t('common.app.buttons.delete') as string);
    const cancelButtonText =
        object?.cancelButtonClass ||
        (i18n.global.t('common.app.buttons.cancel') as string);
    const confirmButtonClass = object?.confirmButtonClass || 'el-button--danger';
    const cancelButtonClass = object?.cancelButtonClass || 'el-button--default';
    const result = await ElMessageBox.confirm(
        message,
        title,
        {
            distinguishCancelAndClose: true,
            type: 'warning',
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            confirmButtonClass: confirmButtonClass,
            cancelButtonClass: cancelButtonClass,
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
    ).catch(() => {});
    return result;
}

export function showSuccessNotificationFunction(message: string, title?: string): void {
    ElNotification({
        type: 'success',
        title: title || (i18n.global.t('common.app.notification') as string),
        message: message,
    });
}

export function showErrorNotificationFunction(message: string, title?: string): void {
    ElNotification({
        type: 'error',
        title: title || (i18n.global.t('common.app.notification') as string),
        message: message,
    });
}

export async function showAlertMessageFunction(
    message: string,
    title?: string,
): Promise<MessageBoxData> {
    return await ElMessageBox.alert(
        message,
        title || i18n.global.t('common.app.notification'),
        {
            type: 'error',
            showConfirmButton: false,
            showCancelButton: true,
        },
    );
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string): boolean {
    return /^(https?:|mailto:|tel:)/.test(path);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce(fn: Function, ms: number): Function {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: typeof Function, ...args: unknown[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
}
