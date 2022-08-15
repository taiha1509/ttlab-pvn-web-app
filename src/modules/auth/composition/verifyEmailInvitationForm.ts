import { ElLoading } from 'element-plus';
import { useField, useForm } from 'vee-validate';
import { useRoute } from 'vue-router';
import { verifyEmailInvitationFormSchema } from '../constants';
import { authModule } from '../store';
import { IVerifyEmailInvitationForm } from '../types';

export const initData = () => {
    const route = useRoute();
    const initValues = {
        token: (route.query?.token || '') as string,
    };

    const { handleSubmit, errors, resetForm, validate } = useForm({
        initialValues: initValues,
        validationSchema: verifyEmailInvitationFormSchema,
    });

    const onSubmit = handleSubmit(async (values) => {
        const loading = ElLoading.service({});
        await authModule.verifyEmailInvitation(values as IVerifyEmailInvitationForm);
        loading.close();
    });
    const { value: password } = useField('password');
    const { value: confirmPassword } = useField('confirmPassword');
    return {
        password,
        confirmPassword,
        onSubmit,
        errors,
        resetForm,
        validate,
    };
};
