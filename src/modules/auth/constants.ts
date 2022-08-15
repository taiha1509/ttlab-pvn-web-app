import yup from '@/plugins/yup';
import { TEXT_MAX_LENGTH, REGEX } from '../common/constants';

export enum GenderValue {
    male = 'male',
    female = 'female',
    other = 'other',
}
export enum UserGender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}
export enum TokenType {
    REFRESH_TOKEN = 'refresh_token',
    EMAIL_INVITATION = 'email_invitation',
    FORGOT_PASSWORD = 'forgot_password',
}
export const MIN_PASSWORD = 6;
export const loginFormSchema = yup.object({
    credential: yup.string().trim().required().max(TEXT_MAX_LENGTH).label('username'),
    password: yup
        .string()
        .matches(REGEX.PASSWORD, 'auth.auth.errors.password.misMatch')
        .trim()
        .required(),
});
export const forgotPasswordFormSchema = yup.object({
    email: yup
        .string()
        .trim()
        .transform((val) => val.replace(/\s\s+/g, ' '))
        .transform((val) => (!val ? undefined : val))
        .required()
        .matches(REGEX.EMAIL, 'user.userForm.errors.invalid.email')
        .label('email'),
});
export const resetPasswordFormSchema = yup.object({
    newPassword: yup
        .string()
        .trim()
        .transform((val) => (!val ? undefined : val))
        .matches(REGEX.PASSWORD, 'auth.auth.errors.password.misMatch')
        .required(),
    confirmPassword: yup
        .string()
        .trim()
        .transform((val) => (!val ? undefined : val))
        .matches(REGEX.PASSWORD, 'auth.auth.errors.password.misMatch')
        .required()
        .oneOf(
            [yup.ref('newPassword'), null],
            'user.userForm.errors.invalid.confirmPassword',
        ),
});

export const verifyEmailInvitationFormSchema = yup.object({
    token: yup.string().optional(),
});

export const updatePasswordSchema = yup.object({
    oldPassword: yup
        .string()
        .transform((val) => (!val ? undefined : val))
        .max(TEXT_MAX_LENGTH)
        .matches(REGEX.PASSWORD, 'auth.auth.errors.password.misMatch')
        .required()
        .label('oldPassword'),
    newPassword: yup
        .string()
        .transform((val) => (!val ? undefined : val))
        .max(TEXT_MAX_LENGTH)
        .matches(REGEX.PASSWORD, 'auth.auth.errors.password.misMatch')
        .required()
        .notOneOf([yup.ref('oldPassword')], 'user.userForm.errors.invalid.newPassword')
        .label('newPassword'),
    confirmPassword: yup
        .string()
        .transform((val) => (!val ? undefined : val))
        .required()
        .oneOf(
            [yup.ref('newPassword'), null],
            'user.userForm.errors.invalid.confirmPassword',
        )
        .label('confirmPassword'),
});

export const updateProfileSchema = yup.object({
    phoneNumber: yup
        .string()
        .trim()
        .transform((val) => val.replace(/\s\s+/g, ' '))
        .transform((val) => (!val ? null : val))
        .matches(REGEX.PHONE, 'user.userForm.errors.invalid.phoneNumber')
        .optional()
        .notRequired()
        .nullable()
        .label('phoneNumber'),
    fullName: yup
        .string()
        .trim()
        .matches(
            REGEX.TEXT_WITHOUT_SPECIAL_CHARACTERS,
            'user.userForm.errors.invalid.fullName',
        )
        .transform((val) => val.replace(/\s\s+/g, ' '))
        .transform((val) => (!val ? null : val))
        .notRequired()
        .nullable()
        .label('fullName'),
});
