import { useField, useForm } from 'vee-validate';
import { resetPasswordFormSchema } from '../constants';

export const initData = () => {
    const initValues = {
        confirmPassword: '',
        newPassword: '',
    };

    const { errors, resetForm, validate, setErrors } = useForm({
        initialValues: initValues,
        validationSchema: resetPasswordFormSchema,
    });

    const { value: confirmPassword } = useField('confirmPassword');
    const { value: newPassword } = useField('newPassword');
    return {
        confirmPassword,
        newPassword,
        errors,
        setErrors,
        resetForm,
        validate,
    };
};
