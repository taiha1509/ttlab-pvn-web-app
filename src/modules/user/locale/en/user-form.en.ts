export default {
    popup: {
        titleCreate: 'Create user',
        titleUpdate: 'Update user',
        titleDetail: 'User information',
        delete: {
            title: 'Delete user',
            confirmAsk: 'Are you sure you want to delete account {username} ?',
        },
    },
    button: {
        cancel: 'Cancel',
        submit: 'Save',
        resend: 'Resend',
        update: 'Update',
        delete: 'Delete',
    },
    table: {
        fullName: 'Full name',
        phoneNumber: 'Phone number',
        email: 'Email',
        username: 'Username',
        roles: 'Roles',
        status: 'Status',
        groups: 'User groups',
        password: 'Password',
        newPassword: 'New password',
        confirmPassword: 'Confirm password',
        cameras: 'Cameras',
        cameraGroups: 'Camera groups',
        firstLogin: 'First login',
    },
    errors: {
        invalid: {
            fullName: 'Full name must not contain special characters.',
            username: 'Username must not contain special characters.',
            email: 'Email is incorrect, please try again.',
            phoneNumber: 'Phone number is incorrect, please try again.',
            password:
                'Password must be at least 8 characters, contains at least 1 number, both uppercase and lowercase and 1 special charecter',
            confirmPassword: 'Confirm password must be identical with password.',
            newPassword: 'The New password must be different with old password.',
        },
        empty: {
            role: 'The role field is required',
        },
    },
    placeholder: {
        username: 'Input username',
        email: 'Input email',
        phoneNumber: 'Input phone number',
        fullName: 'Input full name',
        groupIds: 'Select groups',
        cameraGroupIds: 'Select camera groups',
        cameraIds: 'Select cameras',
        roleIds: 'Select roles',
        password: 'Input password',
        confirmPassword: 'Input confirm password',
    },
    message: {
        delete: {
            success: 'Delete user successfully!',
        },
        create: {
            success: 'Create user successfully!',
        },
        update: {
            success: 'Update user successfully!',
        },
        resend: {
            success: 'Resend activate link successfully!',
        },
    },
    status: {
        active: 'Active',
        inactive: 'Inactive',
        registering: 'Registering',
    },
};
