import i18n from '@/plugins/vue-i18n';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { useField, useForm } from 'vee-validate';
import { groupSchema } from '../constants';
import { groupUserService } from '../services/api.service';
import { groupUserModule } from '../store';

export const initGroupUserForm = () => {
    const initValues = {
        name: '',
        parentId: null,
    };

    const { handleSubmit, errors, resetForm, validate } = useForm({
        initialValues: initValues,
        validationSchema: groupSchema,
    });

    const onSubmit = handleSubmit(async (values) => {
        groupUserModule.setQueryParams({ keyword: '' });
        groupUserModule.setLoadingTree(true);
        const loading = ElLoading.service({
            target: '.user-group-layout',
        });
        let response;
        if (groupUserModule.popupParams.isCreate) {
            response = await groupUserService.createGroup({
                name: values.name?.trim() as string,
                parentId: groupUserModule.parentId,
            });
            loading.close();
        } else {
            response = await groupUserService.updateGroup(groupUserModule.group.id, {
                name: (values.name as string).trim(),
            });
            loading.close();
        }

        if (response.success) {
            if (groupUserModule.popupParams.isCreate) {
                showSuccessNotificationFunction(
                    i18n.global.t('userGroup.group.popup.create.success'),
                );
            } else {
                showSuccessNotificationFunction(
                    i18n.global.t('userGroup.group.popup.update.success'),
                );
            }
            groupUserModule.setPopupParams({
                ...groupUserModule.popupParams,
                isShow: false,
            });
            await groupUserModule.getGroups();
            groupUserModule.setGroup(response.data);
            resetForm();
        } else if (!response.isRequestError) {
            showErrorNotificationFunction(response.message);
        }
        groupUserModule.setLoadingTree(false);
    });

    const initDataPopup = () => {
        if (!groupUserModule.popupParams.isCreate) {
            resetForm({
                values: {
                    parentId: groupUserModule.parentId,
                    name: groupUserModule.group.name,
                },
            });
        } else {
            resetForm({
                values: {
                    ...initValues,
                },
            });
        }
    };

    const closePopup = () => {
        resetForm({
            values: {
                ...initValues,
            },
        });
        groupUserModule.setPopupParams({
            ...groupUserModule.popupParams,
            isShow: false,
        });
    };

    const { value: name, setValue: setName } = useField('name');
    const { value: parentId } = useField('parentId');

    return {
        onSubmit,
        setName,
        parentId,
        errors,
        name,
        resetForm,
        validate,
        initDataPopup,
        closePopup,
    };
};
