import i18n from '@/plugins/vue-i18n';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { useField, useForm } from 'vee-validate';
import { permissionSchema } from '../role.constant';
import { roleApiService } from '../services/api.service';
import { roleModule } from '../store';
import { ICreateRoleDto, IUpdateRoleDto } from '../type';
export const permisionForm = () => {
    const initValue = {
        permissionIds: [],
        name: '',
        description: '',
    };

    const { errors, resetForm, handleSubmit } = useForm({
        validationSchema: permissionSchema,
        initialValues: initValue,
    });

    const onSubmit = handleSubmit(async (values) => {
        const loading = ElLoading.service({ target: '.page-content' });
        let response;

        // create mode
        if (!roleModule.role.id) {
            response = await roleApiService.createRole(values as ICreateRoleDto);
        } else {
            response = await roleApiService.updateRole(
                roleModule.role.id,
                values as IUpdateRoleDto,
            );
        }
        if (response.success) {
            if (!roleModule.role.id) {
                showSuccessNotificationFunction(
                    i18n.global.t('role.role.create.success'),
                );
            } else {
                showSuccessNotificationFunction(
                    i18n.global.t('role.role.update.success'),
                );
            }
            await roleModule.getRoles();
            roleModule.setRole(response?.data || roleModule.initRole);
        } else if (!response?.isRequestError) {
            showErrorNotificationFunction(response.message);
        }
        loading.close();
    });

    const setForm = (value: ICreateRoleDto) => {
        resetForm({
            values: {
                ...value,
            },
        });
    };

    const { value: name } = useField('name');
    const { value: description } = useField('description');
    const {
        value: permissionIds,
        resetField: resetPermissionIds,
        setValue: setPermissionIds,
    } = useField('permissionIds');

    return {
        errors,
        resetForm,
        onSubmit,
        setForm,
        initValue,
        permissionIds,
        description,
        name,
        resetPermissionIds,
        setPermissionIds,
    };
};
