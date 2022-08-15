import { PageName } from '@/modules/common/constants';
import { IMenu } from '@/modules/common/types';
import { PermissionActions, PermissionResources } from '@/modules/role/role.constant';

const cameraGroupMenu: IMenu = {
    icon: require('@/assets/images/sidebar/camera.svg'),
    name: 'common.app.sidebar.camera',
    class: '',
    active: false,
    subdrop: false,
    hasNotify: false,
    highlightMenu: 'CameraGroupManagement',
    childs: [
        {
            name: 'common.app.sidebar.cameraGroupManagement',
            to: '/camera-group',
            class: '',
            active: false,
            highlightMenu: PageName.CAMERA_GROUP_PAGE,
            requiredPermissions: [
                `${PermissionResources.CAMERA_GROUP}_${PermissionActions.READ}`,
                `${PermissionResources.CAMERA_GROUP}_${PermissionActions.CREATE}`,
                `${PermissionResources.CAMERA_GROUP}_${PermissionActions.UPDATE}`,
                `${PermissionResources.CAMERA_GROUP}_${PermissionActions.DELETE}`,
            ],
        },
        {
            name: 'common.app.sidebar.cameraManagement',
            to: '/camera',
            class: '',
            active: false,
            highlightMenu: PageName.CAMERA_PAGE,
            requiredPermissions: [
                `${PermissionResources.CAMERA}_${PermissionActions.READ}`,
                `${PermissionResources.CAMERA}_${PermissionActions.CREATE}`,
                `${PermissionResources.CAMERA}_${PermissionActions.CONFIG}`,
                `${PermissionResources.CAMERA}_${PermissionActions.UPDATE}`,
                `${PermissionResources.CAMERA}_${PermissionActions.DELETE}`,
            ],
        },
    ],
};

const userMenu: IMenu = {
    icon: require('@/assets/images/sidebar/user.svg'),
    name: 'common.app.sidebar.user',
    class: '',
    active: false,
    subdrop: false,
    hasNotify: false,
    highlightMenu: 'UserManagement',
    childs: [
        {
            name: 'common.app.sidebar.groupUser',
            to: '/user-group',
            class: '',
            active: false,
            highlightMenu: PageName.GROUP_USER_PAGE,
            requiredPermissions: [
                `${PermissionResources.USER_GROUP}_${PermissionActions.READ}`,
                `${PermissionResources.USER_GROUP}_${PermissionActions.CREATE}`,
                `${PermissionResources.USER_GROUP}_${PermissionActions.UPDATE}`,
                `${PermissionResources.USER_GROUP}_${PermissionActions.DELETE}`,
            ],
        },
        {
            name: 'common.app.sidebar.userManagement',
            to: '/user',
            class: '',
            active: false,
            highlightMenu: PageName.USER_PAGE,
            requiredPermissions: [
                `${PermissionResources.USER}_${PermissionActions.READ}`,
                `${PermissionResources.USER}_${PermissionActions.INVITE}`,
                `${PermissionResources.USER}_${PermissionActions.CREATE}`,
                `${PermissionResources.USER}_${PermissionActions.UPDATE}`,
                `${PermissionResources.USER}_${PermissionActions.DELETE}`,
            ],
        },
        {
            name: 'common.app.sidebar.role',
            to: '/role',
            class: '',
            active: false,
            highlightMenu: PageName.ROLE,
            requiredPermissions: [
                `${PermissionResources.ROLE}_${PermissionActions.READ}`,
                `${PermissionResources.ROLE}_${PermissionActions.CREATE}`,
                `${PermissionResources.ROLE}_${PermissionActions.UPDATE}`,
                `${PermissionResources.ROLE}_${PermissionActions.DELETE}`,
            ],
        },
    ],
};

const monitoringMenu: IMenu = {
    icon: require('@/assets/images/sidebar/monitor.svg'),
    name: 'common.app.sidebar.monitoring',
    class: '',
    active: false,
    subdrop: false,
    hasNotify: false,
    childs: [
        {
            name: 'common.app.sidebar.liveview',
            to: '/liveview',
            class: '',
            active: false,
            highlightMenu: PageName.MONITOR_PAGE,
            requiredPermissions: [
                `${PermissionResources.LIVEVIEW}_${PermissionActions.READ}`,
                `${PermissionResources.LIVEVIEW}_${PermissionActions.CREATE}`,
                `${PermissionResources.LIVEVIEW}_${PermissionActions.UPDATE}`,
                `${PermissionResources.LIVEVIEW}_${PermissionActions.DELETE}`,
            ],
        },
        {
            name: 'common.app.sidebar.playback',
            to: '/playback',
            class: '',
            active: false,
            highlightMenu: PageName.PLAYBACK_PAGE,
            requiredPermissions: [
                `${PermissionResources.PLAYBACK}_${PermissionActions.READ}`,
                `${PermissionResources.PLAYBACK}_${PermissionActions.CREATE}`,
                `${PermissionResources.PLAYBACK}_${PermissionActions.UPDATE}`,
                `${PermissionResources.PLAYBACK}_${PermissionActions.DELETE}`,
            ],
        },
        {
            name: 'common.app.sidebar.layoutMap',
            to: '/layout-map',
            class: '',
            active: false,
            highlightMenu: PageName.LAYOUT_MAP_PAGE,
            requiredPermissions: [
                `${PermissionResources.E_MAP}_${PermissionActions.READ}`,
                `${PermissionResources.E_MAP}_${PermissionActions.CREATE}`,
                `${PermissionResources.E_MAP}_${PermissionActions.UPDATE}`,
                `${PermissionResources.E_MAP}_${PermissionActions.DELETE}`,
            ],
        },
    ],
};

export const menus = {
    class: '',
    submenu: [cameraGroupMenu, userMenu, monitoringMenu],
};
