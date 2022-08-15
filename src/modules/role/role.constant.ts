import yup from '@/plugins/yup';
import { TEXT_MAX_LENGTH, REGEX } from '../common/constants';

export enum PermissionActions {
    READ = 'read',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    INVITE = 'invite',
    CONFIG = 'config',
}

export enum PermissionResources {
    USER = 'user',
    CAMERA = 'camera',
    USER_GROUP = 'user_group',
    CAMERA_GROUP = 'camera_group',
    ROLE = 'role',
    LIVEVIEW = 'liveview',
    PLAYBACK = 'playback',
    E_MAP = 'e_map',
}

export const permissionSchema = yup.object({
    description: yup.string().trim().notRequired().max(TEXT_MAX_LENGTH),
    name: yup
        .string()
        .trim()
        .max(TEXT_MAX_LENGTH)
        .matches(
            new RegExp(REGEX.TEXT_WITHOUT_SPECIAL_CHARACTERS),
            'role.role.errors.invalidName',
        )
        .label('roleName')
        .required(),
    permissionIds: yup.array().min(1, 'role.role.errors.emptyPermission').required(),
});
