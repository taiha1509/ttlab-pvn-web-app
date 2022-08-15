import i18n from '@/plugins/vue-i18n';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { useField, useForm } from 'vee-validate';
import { updateProfileSchema } from '../constants';
import { authApiService } from '../services/api.service';
import { authModule } from '../store';
import { IUpdateProfile } from '../types';

export const updateProfileAction = () => {
    const initValues = {
        fullName: '',
        phoneNumber: '',
    };

    const { errors, handleSubmit, resetForm, validate } = useForm({
        initialValues: initValues,
        validationSchema: updateProfileSchema,
    });

    const { value: fullName, setValue: setFullName } = useField('fullName');
    const { value: phoneNumber, setValue: setPhoneNumber } = useField('phoneNumber');

    const onSubmit = handleSubmit(async (values) => {
        const loading = ElLoading.service({});
        const response = await authApiService.updateProfile(values as IUpdateProfile);
        if (response.success) {
            showSuccessNotificationFunction(
                i18n.global.t('auth.auth.updateProfile.success'),
            );
            authModule.setProfile(response.data);
            setFullName(response?.data?.fullName || '');
            setPhoneNumber(response?.data?.phoneNumber || '');
        } else if (!response?.isRequestError) {
            showErrorNotificationFunction(response.message);
        }
        loading.close();
    });

    const resetDefault = () => {
        resetForm({ values: { ...initValues } });
    };

    return {
        resetDefault,
        errors,
        validate,
        onSubmit,
        fullName,
        phoneNumber,
    };
};
