import { sendRefreshToken } from '@/plugins/axios/middlewares/authMiddleware';
import i18n from '@/plugins/vue-i18n';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { useField, useForm } from 'vee-validate';
import { updatePasswordSchema } from '../constants';
import { authApiService } from '../services/api.service';
import { authModule } from '../store';
import { IUpdatePassword } from '../types';

export const updatePasswordAction = () => {
    const initValues = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    };
    const { errors, handleSubmit, resetForm } = useForm({
        initialValues: initValues,
        validationSchema: updatePasswordSchema,
    });

    const onSubmit = handleSubmit(async (values) => {
        const loading = ElLoading.service();
        const response = await authApiService.updatePassword(values as IUpdatePassword);
        const newProfileRes = await authApiService.getProfile();
        await sendRefreshToken();
        if (response.success) {
            showSuccessNotificationFunction(
                i18n.global.t('auth.auth.updatePassword.success'),
            );
            resetDefault();
            authModule.setProfile(newProfileRes.data);
            await authModule.getProfile();
        } else if (!response?.isRequestError) {
            showErrorNotificationFunction(response.message);
        }
        if (!newProfileRes.isRequestError && !newProfileRes.success) {
            showErrorNotificationFunction(newProfileRes.message);
        }
        loading.close();
    });

    const resetDefault = () => {
        resetForm({
            values: {
                ...initValues,
            },
        });
    };

    const { value: oldPassword } = useField('oldPassword');
    const { value: confirmPassword } = useField('confirmPassword');
    const { value: newPassword } = useField('newPassword');

    return {
        resetDefault,
        errors,
        onSubmit,
        oldPassword,
        newPassword,
        confirmPassword,
    };
};
