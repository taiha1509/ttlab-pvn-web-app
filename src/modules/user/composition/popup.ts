import i18n from '@/plugins/vue-i18n';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { useField, useForm } from 'vee-validate';
import { POPUP_NAME, UserAction, userBaseSchema } from '../constant';
import { userApiService } from '../services/api.service';
import { userModule } from '../store';
import { IUserRequest, IUserDetailReponse } from '../types';

export const initData = () => {
    const initValues = {
        username: '',
        email: '',
        phoneNumber: '',
        fullName: '',
        roleIds: [],
        groupIds: [],
        status: null,
        password: '',
        confirmPassword: '',
        action: UserAction.CREATE,
        cameraIds: [],
        cameraGroupIds: [],
    };
    const { handleSubmit, errors, resetForm, validate } = useForm({
        initialValues: initValues,
        validationSchema: userBaseSchema,
    });

    const { value: username } = useField('username');
    const { value: email } = useField('email');
    const { value: phoneNumber } = useField('phoneNumber');
    const { value: fullName } = useField('fullName');
    const { value: roleIds } = useField('roleIds');
    const { value: groupIds } = useField('groupIds');
    const { value: password } = useField('password');
    const { value: confirmPassword } = useField('confirmPassword');
    const { value: action, setValue: setAction } = useField('action');
    const { value: cameraIds } = useField('cameraIds');
    const { value: cameraGroupIds } = useField('cameraGroupIds');
    const resetUserForm = () => {
        resetForm({
            values: {
                ...initValues,
            },
        });
    };

    const onSubmit = handleSubmit(async (values) => {
        // trim body
        const body = {
            ...values,
            username: values.username?.trim(),
            email: values.email?.trim(),
            phoneNumber: values.phoneNumber?.trim(),
            fullName: values.fullName?.trim(),
        };
        const loading = ElLoading.service({
            target: '.el-dialog',
        });
        let response;
        const isCreate = !userModule.user.id;
        if (isCreate) {
            response = await userApiService.addUser(body as IUserRequest);
        } else {
            response = await userApiService.updateUser(
                body as IUserRequest,
                userModule.user.id as number,
            );
        }

        if (response.success) {
            resetUserForm();
            userModule.closeUserPopup(POPUP_NAME.FORM_POPUP);
            if (isCreate) {
                showSuccessNotificationFunction(
                    i18n.global.t('user.userForm.message.create.success'),
                );
            } else {
                showSuccessNotificationFunction(
                    i18n.global.t('user.userForm.message.update.success'),
                );
            }
            await userModule.getUsers();
        } else if (!response.isRequestError) {
            showErrorNotificationFunction(response.message);
        }

        loading.close();
    });

    const setInputDataToUpdate = (data: IUserDetailReponse) => {
        resetForm({
            values: {
                cameraIds: data.cameras?.map((item) => item._id) || [],
                cameraGroupIds: data.cameraGroups?.map((item) => item._id) || [],
                confirmPassword: '',
                action: UserAction.UPDATE,
                password: '',
                username: data.username,
                email: data.email,
                fullName: data.fullName,
                phoneNumber: data.phoneNumber,
                roleIds: data.roles?.map((role) => role.id) || [],
                groupIds: data.groups?.map((item) => item.id) || [],
            },
        });
    };

    return {
        errors,
        resetForm,
        validate,
        resetUserForm,
        username,
        email,
        phoneNumber,
        fullName,
        roleIds,
        groupIds,
        action,
        setAction,
        password,
        confirmPassword,
        cameraIds,
        cameraGroupIds,
        onSubmit,
        setInputDataToUpdate,
    };
};
