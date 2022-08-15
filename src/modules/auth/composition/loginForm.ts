import { appService } from '@/utils/app';
import { ElLoading } from 'element-plus';
import { useField, useForm } from 'vee-validate';
import { loginFormSchema } from '../constants';
import { authApiService } from '../services/api.service';
import { authModule } from '../store';
import { ILoginForm } from '../types';
import router from '@/router';
import { PageName } from '@/modules/common/constants';

export const initData = () => {
    const initValues = {
        credential: '',
        password: '',
        isRemember: false,
    };

    const { handleSubmit, errors, resetForm, validate, setErrors } = useForm({
        initialValues: initValues,
        validationSchema: loginFormSchema,
    });

    const onSubmit = handleSubmit(async (values) => {
        const loading = ElLoading.service({});
        await authModule.login(values as ILoginForm);
        loading.close();
    });
    const { value: credential } = useField('credential');
    const { value: password } = useField('password');
    return {
        credential,
        password,
        onSubmit,
        errors,
        setErrors,
        resetForm,
        validate,
    };
};

export const logout = async (): Promise<void> => {
    await authApiService.logout();
    appService.token.resetAll();
    appService.resetUser();
    router.push({
        name: PageName.LOGIN_PAGE,
    });
};
