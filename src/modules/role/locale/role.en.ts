export default {
    sidebar: {
        title: 'Roles list',
    },
    detail: {
        title: 'Role information',
        roleName: 'Role name',
        permissionControl: 'List permissions',
        description: 'Description',
    },
    errors: {
        invalidName: 'The role name is incorrect, please try again',
        emptyPermission: 'The role must have at least one permission',
    },
    actions: {
        all: 'All',
        read: 'Read',
        create: 'Create',
        update: 'Update',
        delete: 'Delete',
        config: 'Config',
        invite: 'Invite',
    },
    resources: {
        user: 'User',
        camera: 'Camera',
        cameraGroup: 'Camera group',
        monitor: 'Monitor management',
        liveview: 'Liveview',
        dashboard: 'Dashboard',
        userManagement: 'User management',
        userGroup: 'Group management',
        cameraManagement: 'Camera management',
        cameraGroupManagement: 'Group management',
        monitoring: 'Monitoring',
        playback: 'Playback',
        eMap: 'E-map',
        role: 'Role management',
    },
    delete: {
        title: 'Delete role',
        message: 'Are you sure you want to delete role {name} ?',
        success: 'Delete role successfully!',
    },
    create: {
        success: 'Create a role successfully!',
        title: 'Create a role',
    },
    update: {
        success: 'Update a role successfully!',
    },
};
