import { PASSWORD_MIN_LENGTH, TEXT_MAX_LENGTH, REGEX } from '@/modules/common/constants';
import { IBodyResponse } from '@/modules/common/types';
import i18n from '@/plugins/vue-i18n';
import yup from '@/plugins/yup';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { useField, useForm } from 'vee-validate';
import { ConnectionType, POPUP_NAME } from '../constants';
import { cameraService } from '../services/api.service';
import { cameraFormModule } from '../store/camera.form.store';
import { cameraListModule } from '../store/camera.list.store';
import { ICameraDetail } from '../types';

export const createCameraValidation = yup.object({
    name: yup
        .string()
        .matches(REGEX.TEXT_WITHOUT_SPECIAL_CHARACTERS)
        .trim()
        .max(TEXT_MAX_LENGTH)
        .required()
        .label('cameraName'),
    password: yup
        .string()
        .min(PASSWORD_MIN_LENGTH)
        .trim()
        .max(TEXT_MAX_LENGTH)
        .required()
        .label('password'),
    serialNumber: yup
        .string()
        .trim()
        .matches(REGEX.UID_REGEX)
        .max(TEXT_MAX_LENGTH)
        .required()
        .label('serialNumber'),
    connectionType: yup
        .string()
        .trim()
        .oneOf([ConnectionType.ONVIF, ConnectionType.P2P])
        .label('connectionType'),
    model: yup
        .string()
        .trim()
        .max(TEXT_MAX_LENGTH)
        .matches(REGEX.TEXT_WITHOUT_SPECIAL_CHARACTERS)
        .required()
        .label('model'),
    uid: yup
        .string()
        .trim()
        .max(TEXT_MAX_LENGTH)
        .matches(REGEX.UID_REGEX)
        .required()
        .label('uid'),
    userName: yup
        .string()
        .trim()
        .when('connectionType', {
            is: ConnectionType.ONVIF,
            then: yup.string().trim().max(TEXT_MAX_LENGTH).required().label('username'),
        }),
    cameraGroups: yup.array().of(
        yup.string().when('connectionType', {
            is: ConnectionType.P2P,
            then: yup.array().of(yup.string()).optional().label('cameraGroupId'),
        }),
    ),
});

export function initData() {
    const initCreateValues = {
        _id: '',
        uid: '',
        model: '',
        serialNumber: '',
        name: '',
        connectionType: ConnectionType.P2P,
        userName: '',
        password: '',
        cameraGroups: [] as string[],
    };

    const { handleSubmit, errors, resetForm, validate } = useForm({
        initialValues: initCreateValues,
        validationSchema: createCameraValidation,
    });

    const onSubmit = handleSubmit(async (values) => {
        cameraFormModule.setIsCreatingCamera(true);
        const loading = ElLoading.service({
            target: '.create-layout',
        });
        const cameraInfo = {
            name: values.name?.trim(),
            uid: values.uid?.trim(),
            model: values.model,
            serialNumber: values.serialNumber?.trim(),
            password: values.password,
        };
        if (values.connectionType === ConnectionType.P2P) {
            Object.assign(cameraInfo, {
                cameraGroups: values?.cameraGroups || null,
            });
        } else {
            Object.assign(cameraInfo, {
                userName: values?.userName,
            });
        }
        const response = (await cameraService.create(
            cameraInfo,
        )) as IBodyResponse<ICameraDetail>;
        if (response.success) {
            showSuccessNotificationFunction(
                i18n.global.t('camera.cameraForm.create.message') as string,
                i18n.global.t('common.app.notification') as string,
            );
            cameraListModule.closeCameraPopup(POPUP_NAME.CREATE_FORM_POPUP);
            resetForm();
            await cameraListModule.getCameraList();
        } else if (!response.isRequestError) {
            showErrorNotificationFunction(response.message);
        }
        cameraFormModule.setIsCreatingCamera(false);
        loading.close();
    });

    const { value: name } = useField('name');
    const { value: cameraGroups } = useField('cameraGroups');
    const { value: model } = useField('model');
    const { value: uid } = useField('uid');
    const { value: password } = useField('password');
    const { value: connectionType } = useField('connectionType');
    const { value: serialNumber } = useField('serialNumber');
    const { value: userName } = useField('userName');

    return {
        errors,
        name,
        model,
        cameraGroups,
        connectionType,
        password,
        uid,
        userName,
        serialNumber,

        onSubmit,
        validate,
        resetForm,
    };
}
