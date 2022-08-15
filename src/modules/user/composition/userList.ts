import i18n from '@/plugins/vue-i18n';
import {
    showConfirmPopUpFunction,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { POPUP_NAME } from '../constant';
import { userApiService } from '../services/api.service';
import { userModule } from '../store';
import { IUserDetailReponse, IUserFilterForm } from '../types';

export const action = () => {
    const onSearch = async (params: IUserFilterForm) => {
        const loading = ElLoading.service({});
        userModule.setPaginationParams({
            ...userModule.paginationParams,
            currentPage: userModule.queryString.page,
        });
        userModule.setQueryString({
            ...userModule.queryString,
            keyword: params.keyword?.trim(),
            groupIds: params.groupIds,
            roleIds: params.roleIds,
            statuses: params.statuses,
        });
        const response = await userModule.getUsers();
        if (!response.success && !response?.isRequestError) {
            showErrorNotificationFunction(response.message);
        }

        loading.close();
    };

    const openPopupCreate = () => {
        if (userModule.previousDisplayPopup === '')
            userModule.setUser({ ...userModule.initUser });
        userModule.openUserPopup(POPUP_NAME.FORM_POPUP);
    };

    const openPopupUpdate = async () => {
        userModule.openUserPopup(POPUP_NAME.FORM_POPUP);
    };

    const openPopupDetail = async () => {
        userModule.openUserPopup(POPUP_NAME.DETAIL_POPUP);
    };

    const openPopupDelete = async (user: IUserDetailReponse) => {
        const result = await showConfirmPopUpFunction(
            i18n.global.t('user.userForm.popup.delete.confirmAsk', {
                username: user.username,
            }),
            i18n.global.t('user.userForm.popup.delete.title'),
        );

        if (result) {
            const loading = ElLoading.service({
                target: '.content',
            });
            const response = await userApiService.deleteUser(user.id as number);
            if (response.success) {
                showSuccessNotificationFunction(
                    i18n.global.t('user.userForm.message.delete.success'),
                );
                userModule.getUsers();
                if (userModule.displayUsersPopups[POPUP_NAME.DETAIL_POPUP])
                    userModule.closeUserPopup(POPUP_NAME.DETAIL_POPUP);
            } else if (!response?.isRequestError) {
                showErrorNotificationFunction(response.message);
            }
            loading.close();
        }
    };

    return {
        onSearch,
        openPopupCreate,
        openPopupUpdate,
        openPopupDelete,
        openPopupDetail,
    };
};
