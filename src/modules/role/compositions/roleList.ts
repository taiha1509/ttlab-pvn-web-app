import i18n from '@/plugins/vue-i18n';
import {
    showConfirmPopUpFunction,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { roleApiService } from '../services/api.service';
import { roleModule } from '../store';
import { IRole } from '../type';

export const roleAction = () => {
    const deleteRole = async (role: IRole) => {
        const confirmation = await showConfirmPopUpFunction(
            i18n.global.t('role.role.delete.message', { name: role.name }),
            i18n.global.t('role.role.delete.title'),
        );
        if (confirmation) {
            const loading = ElLoading.service({ target: 'el-content' });

            const response = await roleApiService.deleteRole(role.id as number);
            if (response.success) {
                showSuccessNotificationFunction(
                    i18n.global.t('role.role.delete.success'),
                );
                await roleModule.getRoles();
                roleModule.setRole(roleModule.roles[0]);
            } else if (!response?.isRequestError) {
                showErrorNotificationFunction(response.message);
            }
            loading.close();
        }
    };
    return {
        deleteRole,
    };
};
