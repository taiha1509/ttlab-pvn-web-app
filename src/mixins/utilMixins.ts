import { IYupError } from '@/modules/auth/types';
import { IPopupAttributes } from '@/modules/common/types';
import {
    showAlertMessageFunction,
    showConfirmPopUpFunction,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { MessageBoxData } from 'element-plus';
import { Vue } from 'vue-class-component';

export class UtilMixins extends Vue {
    async showConfirmPopUp(
        message: string,
        title: string,
        object?: IPopupAttributes,
    ): Promise<void | MessageBoxData> {
        return showConfirmPopUpFunction(message, title, object);
    }

    showSuccessNotification(message: string, title?: string): void {
        return showSuccessNotificationFunction(message, title);
    }

    showErrorNotification(message: string, title?: string): void {
        return showErrorNotificationFunction(message, title);
    }

    async showAlertMessage(message: string, title?: string): Promise<MessageBoxData> {
        return await showAlertMessageFunction(message, title);
    }

    translateYupError(yupError: IYupError | string): string {
        if (!yupError) return '';
        if ((yupError as IYupError)?.i18nKey)
            return this.$t((yupError as IYupError)?.i18nKey as string, {
                ...((yupError as IYupError)?.params as Record<string, string>),
            });
        return this.$t(yupError as string);
    }
}
