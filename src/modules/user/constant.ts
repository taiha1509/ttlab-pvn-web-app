import yup from '@/plugins/yup';
import { TEXT_MAX_LENGTH, REGEX } from '../common/constants';

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    REGISTERING = 'registering',
}
export enum UserAction {
    CREATE = 'create',
    UPDATE = 'update',
}

export enum UserTypes {
    SYSTEM_ADMIN = 'system_admin',
    DEVICE_ADMIN = 'device_admin',
}

export enum POPUP_NAME {
    DETAIL_POPUP = 'detailPopup',
    FORM_POPUP = 'formPopup',
}

export const userBaseSchema = yup.object({
    email: yup
        .string()
        .transform((val) => val?.replace(/\s\s+/g, ' '))
        .trim()
        .required()
        .matches(REGEX.EMAIL, 'user.userForm.errors.invalid.email')
        .label('email'),
    phoneNumber: yup
        .string()
        .trim()
        .transform((val) => val?.replace(/\s\s+/g, ' '))
        .transform((val) => (!val ? null : val))
        .matches(REGEX.PHONE, 'user.userForm.errors.invalid.phoneNumber')
        .optional()
        .notRequired()
        .nullable()
        .label('phoneNumber'),
    fullName: yup
        .string()
        .trim()
        .transform((val) => val?.replace(/\s\s+/g, ' '))
        .transform((val) => (!val ? null : val))
        .matches(
            REGEX.TEXT_WITHOUT_SPECIAL_CHARACTERS,
            'user.userForm.errors.invalid.fullName',
        )
        .notRequired()
        .nullable()
        .label('fullName'),
    roleIds: yup
        .array()
        .of(yup.number().positive().required())
        .min(1, 'user.userForm.errors.empty.role')
        .required()
        .label('roleId'),
    groupIds: yup
        .array()
        .of(yup.number().positive().notRequired().nullable())
        .notRequired()
        .nullable()
        .label('groupId'),
    username: yup
        .string()
        .transform((val) => val?.replace(/\s\s+/g, ' '))
        .trim()
        .required()
        .matches(
            REGEX.TEXT_WITHOUT_SPECIAL_CHARACTERS,
            'user.userForm.errors.invalid.username',
        )
        .label('username'),
    action: yup.string().oneOf([...Object.values(UserAction)]),
    password: yup.string().when('action', {
        is: UserAction.CREATE,
        then: yup
            .string()
            .max(TEXT_MAX_LENGTH)
            .matches(REGEX.PASSWORD, 'user.userForm.errors.invalid.password')
            .required()
            .label('password'),
        otherwise: yup.string().oneOf([null, undefined, '']).label('password'),
    }),
    confirmPassword: yup.string().when('action', {
        is: UserAction.CREATE,
        then: yup
            .string()
            .oneOf(
                [yup.ref('password'), null],
                'user.userForm.errors.invalid.confirmPassword',
            )
            .required()
            .label('confirmPassword'),
        otherwise: yup.string().oneOf([null, undefined, '']).label('confirmPassword'),
    }),
    cameraIds: yup
        .array()
        .of(yup.string().matches(REGEX.OBJECT_ID).notRequired())
        .notRequired()
        .nullable()
        .label('cameraIds'),
    cameraGroupIds: yup
        .array()
        .of(yup.string().matches(REGEX.OBJECT_ID).notRequired())
        .notRequired()
        .nullable()
        .label('cameraGroupIds'),
});
