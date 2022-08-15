import { TEXT_MAX_LENGTH, REGEX } from '@/modules/common/constants';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { reactive } from 'vue-demi';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function initLayoutMapUploadForm() {
    const initialValues = {
        name: '',
        fileName: '',
    };
    const { validate, resetForm } = useForm({
        initialValues,
        validationSchema: yup.object({
            name: yup
                .string()
                .matches(REGEX.TEXT_WITHOUT_SPECIAL_CHARACTERS)
                .trim()
                .max(TEXT_MAX_LENGTH)
                .required()
                .label('layoutMapName'),
            fileName: yup.string().trim().required().label('layoutMapFile'),
        }),
    });
    const name = useField('name');
    const fileName = useField('fileName');

    return {
        resetForm,
        validate,
        data: reactive({
            name: name.value,
            fileName: fileName.value,
        }),
        error: reactive({
            name: name.errorMessage,
            fileName: fileName.errorMessage,
        }),
    };
}
