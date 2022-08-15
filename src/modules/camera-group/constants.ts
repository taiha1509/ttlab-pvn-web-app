import * as yup from 'yup';
import { TEXT_MAX_LENGTH, REGEX } from '../common/constants';

export enum ConnectionType {
    P2P = 'P2P',
    ONVIF = 'ONVIF',
}

export const cameraGroupSchema = yup.object({
    name: yup
        .string()
        .trim()
        .matches(REGEX.TEXT_WITHOUT_SPECIAL_CHARACTERS)
        .max(TEXT_MAX_LENGTH)
        .required()
        .label('groupName'),
});
