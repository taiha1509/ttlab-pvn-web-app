import { useField, useForm } from 'vee-validate';
import { cameraGroupService } from '../services/api.service';
import { ElLoading } from 'element-plus';
import { IBodyResponse } from '../../common/types';
import { ICameraGroupDetail } from '../types';
import i18n from '@/plugins/vue-i18n';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { cameraGroupListModule } from '../store/cameraGroup.store';
import { cameraGroupSchema } from '../constants';

export function initData() {
    const initValues = {
        name: '',
    };
    const { handleSubmit, errors, resetForm, validate } = useForm({
        initialValues: initValues,
        validationSchema: cameraGroupSchema,
    });
    const onSubmit = handleSubmit(async (values) => {
        const loading = ElLoading.service({
            target: '.camera-group-layout',
        });
        const isCreated = cameraGroupListModule.isCreate;
        let response = {} as IBodyResponse<ICameraGroupDetail>;
        if (!isCreated) {
            response = (await cameraGroupService.update(
                cameraGroupListModule.cameraGroupDetail._id,
                {
                    name: values.name?.trim(),
                },
            )) as IBodyResponse<ICameraGroupDetail>;
        } else {
            response = (await cameraGroupService.create({
                name: values.name?.trim(),
                parentId: cameraGroupListModule.cameraGroupDetail._id || null,
            })) as IBodyResponse<ICameraGroupDetail>;
        }
        if (response.success) {
            const message = !isCreated
                ? (i18n.global.t(
                      'cameraGroup.cameraGroup.cameraGroupForm.updateSuccess',
                  ) as string)
                : (i18n.global.t(
                      'cameraGroup.cameraGroup.cameraGroupForm.createSuccess',
                  ) as string);
            cameraGroupListModule.setLoadingTree(true);
            await cameraGroupListModule.getCameraGroupList();
            resetForm({
                values: {
                    ...initValues,
                },
            });
            cameraGroupListModule.setIsShowFormPopup(false);
            showSuccessNotificationFunction(
                message,
                i18n.global.t('common.app.notification') as string,
            );
            cameraGroupListModule.setLoadingTree(false);
        } else if (!response.isRequestError) {
            showErrorNotificationFunction(response.message);
        }
        loading.close();
    });

    const { value: name } = useField('name');

    const initDataPopup = () => {
        if (cameraGroupListModule.cameraGroupDetail._id) {
            const val = cameraGroupListModule.cameraGroupDetail;
            resetForm({
                values: {
                    name: val.name,
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
    return {
        errors,
        name,

        onSubmit,
        validate,
        resetForm,
        initDataPopup,
    };
}
