import { useField, useForm } from 'vee-validate';
import { forgotPasswordFormSchema } from '../constants';

export const initData = () => {
    const initValues = {
        email: '',
    };

    const { errors, resetForm, validate, setErrors } = useForm({
        initialValues: initValues,
        validationSchema: forgotPasswordFormSchema,
    });
    const { value: email } = useField('email');
    return {
        email,
        errors,
        setErrors,
        resetForm,
        validate,
    };
};
