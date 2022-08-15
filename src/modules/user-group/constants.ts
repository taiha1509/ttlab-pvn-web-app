import yup from '@/plugins/yup';
import { REGEX } from '../common/constants';

export const groupSchema = yup.object({
    name: yup
        .string()
        .trim()
        .matches(REGEX.TEXT_WITHOUT_SPECIAL_CHARACTERS)
        .transform((val) => val.replace(/\s\s+/g, ' '))
        .required()
        .label('groupName'),
    parentId: yup.number().nullable().label('parentId'),
});
