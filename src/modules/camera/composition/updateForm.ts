import { useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { cameraFormModule } from '../store/camera.form.store';
import { cameraListModule } from '../store/camera.list.store';
import { cameraService } from '../services/api.service';
import { ElLoading } from 'element-plus';
import { IBodyResponse } from '../../common/types';
import { ICameraDetail, IUpdateCamera } from '../types';
import i18n from '@/plugins/vue-i18n';
import { TEXT_MAX_LENGTH, REGEX } from '@/modules/common/constants';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import yup from '@/plugins/yup';
import { POPUP_NAME } from '../constants';

export const updateCameraValidation = {
    name: yup
        .string()
        .trim()
        .matches(REGEX.TEXT_WITHOUT_SPECIAL_CHARACTERS)
        .max(TEXT_MAX_LENGTH)
        .required()
        .label('cameraName'),
    cameraGroups: yup.array().of(yup.string()).optional().nullable().label('cameraGroup'),
    userGroupIds: yup
        .array()
        .of(yup.number().optional())
        .optional()
        .nullable()
        .label('groupUser'),
    userIds: yup.array().of(yup.number().optional()).optional().nullable().label('users'),
};

export function initData() {
    const initUpdateValues = {
        name: '',
        cameraGroups: [] as string[],
        userIds: [] as number[],
        userGroupIds: [] as number[],
    };
    const isCreate = computed(() => !cameraFormModule.cameraDetail._id);
    const { handleSubmit, errors, resetForm, validate } = useForm({
        initialValues: initUpdateValues,
        validationSchema: updateCameraValidation,
    });
    const onSubmit = handleSubmit(async (updatedCamera: IUpdateCamera) => {
        const loading = ElLoading.service({
            target: '.el-dialog',
        });
        const response = (await cameraService.update(cameraFormModule.cameraDetail._id, {
            name: updatedCamera.name,
            cameraGroups: updatedCamera?.cameraGroups || null,
            userIds: updatedCamera.userIds,
            userGroupIds: updatedCamera.userGroupIds,
        })) as IBodyResponse<ICameraDetail>;
        if (response.success) {
            showSuccessNotificationFunction(
                i18n.global.t('camera.cameraForm.update.message') as string,
                i18n.global.t('common.app.notification') as string,
            );
            cameraListModule.closeCameraPopup(POPUP_NAME.UPDATE_FORM_POPUP);
            await cameraListModule.getCameraList();
        } else if (!response.isRequestError) {
            showErrorNotificationFunction(response.message);
        }
        loading.close();
    });

    const { value: name } = useField('name');
    const { value: cameraGroups } = useField('cameraGroups');
    const { value: userGroupIds } = useField('userGroupIds');
    const { value: userIds } = useField('userIds');
    const { value: onvifProfile } = useField('onvifProfile');

    const initDataPopup = () => {
        if (!isCreate.value) {
            const val = cameraFormModule.cameraDetail;
            resetForm({
                values: {
                    name: val.name,
                    cameraGroups:
                        (val?.cameraGroups?.map((ele) => ele?._id) as string[]) || null,
                    userGroupIds: val.userGroupIds as number[],
                    userIds: val.userIds as number[],
                },
            });
        } else {
            resetForm({
                values: {
                    ...initUpdateValues,
                },
            });
        }
    };
    return {
        errors,
        name,
        cameraGroups,
        userGroupIds,
        userIds,
        onvifProfile,

        onSubmit,
        validate,
        resetForm,
        initDataPopup,
    };
}
