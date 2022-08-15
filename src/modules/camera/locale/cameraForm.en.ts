export default {
    cameraDetail: {
        title: 'Camera information',
    },
    fields: {
        name: {
            label: 'Camera name',
            placeholder: 'Input camera name',
        },
        uid: {
            label: 'UID',
            placeholder: 'Input UID',
        },
        model: {
            label: 'Model',
            placeholder: 'Choose model',
        },
        serialNumber: {
            label: 'Serial number',
            placeholder: 'Input serial number',
        },
        connection: {
            placeholder: 'Choose a connection status',
        },
        cameraGroupId: {
            label: 'Camera groups',
            placeholder: 'Choose camera groups',
        },
        userIds: {
            label: 'Users',
            placeholder: 'Choose users',
        },
        password: {
            label: 'Password',
            placeholder: 'Input camera password',
        },
        userName: {
            label: 'Username',
            placeholder: 'Input username',
        },
        groupUserIds: {
            label: 'User groups',
            placeholder: 'Choose user groups',
        },
        requestONVIF: 'Request ONVIF profile',
    },
    confirmPopup: {
        title: 'Delete camera',
        message: 'Are you sure you want to delete {name} ?',
        deleteSuccess: 'Delete camera successfully!',
    },
    update: {
        title: 'Update camera',
        message: 'Update camera successfully!',
        error: 'Update camera unsuccessfully!',
    },
    create: {
        title: 'Create camera',
        P2P: 'P2P',
        ONVIF: 'ONVIF',
        message: 'Create camera successfully!',
        error: 'Create camera successfully!',
    },
    button: {
        settings: 'Settings',
    },
    filterForm: {
        name: {
            label: 'Keyword',
            placeholder: 'Search',
        },
        uid: {
            label: 'UID',
            placeholder: 'UID',
        },
    },
    connection: {
        offline: 'Offline',
        online: 'Online',
    },
    errors: {
        onvifProfile: "Can't connect to camera!",
    },
};
