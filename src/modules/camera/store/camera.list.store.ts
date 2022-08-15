import { VuexModule, Action, Module, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import {
    ICamera,
    ICameraFilterForm,
    IGetListCameraResponse,
    IQueryStringCamera,
} from '../types';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_ORDER_BY,
    DEFAULT_SIZE_PER_PAGE,
    OrderDirection,
} from '@/modules/common/constants';
import { cameraService } from '../services/api.service';
import { PermissionActions, PermissionResources } from '@/modules/role/role.constant';
import { dropdownCVMService } from '@/modules/common/service/api.service';
import { ICameraModelDropDown } from '@/modules/common/types';
import { appService } from '@/utils/app';
import { POPUP_NAME } from '../constants';

@Module({ dynamic: true, namespaced: true, store, name: 'cameraList' })
class CameraListModule extends VuexModule {
    cameras: ICamera[] = [];
    totalCameras = 0;
    itemsPerPage = DEFAULT_SIZE_PER_PAGE;
    loadingCameraTable = false;

    queryString: IQueryStringCamera = {
        page: DEFAULT_FIRST_PAGE,
        limit: DEFAULT_SIZE_PER_PAGE,
        orderBy: DEFAULT_ORDER_BY,
        orderDirection: OrderDirection.DESC,
    };

    displayCameraPopups: Record<POPUP_NAME, boolean> = {
        updateFormPopup: false,
        createFormPopup: false,
        detailFormPopup: false,
        recordingConfigurationPopup: false,
        scheduleFormConfigruationPopup: false,
        scheduleListConfigruationPopup: false,
    };

    previousDisplayPopup: POPUP_NAME | '' = '';

    // getters
    // return the user permission in role module
    get userPermissions(): PermissionActions[] {
        return appService.getUserPermissionsByResource(PermissionResources.CAMERA);
    }

    cameraModels: ICameraModelDropDown[] = [];

    @Action
    async getCameraList(): Promise<IGetListCameraResponse> {
        const response = (await cameraService.getList({
            ...this.queryString,
        })) as IGetListCameraResponse;
        if (response.success) {
            this.MUTATE_CAMERAS(response?.data?.items);
            this.MUTATE_TOTAL_CAMERAS(response?.data?.totalItems);
        } else {
            this.MUTATE_CAMERAS([]);
            this.MUTATE_TOTAL_CAMERAS(0);
        }
        return response;
    }

    @Action
    async getCameraModels() {
        const response = await dropdownCVMService.getDropdownCameraModels();
        this.MUTATE_CAMERA_MODELS(response?.data || []);
        return response;
    }

    @Action
    setPage(page: number) {
        this.MUTATE_CAMERA_PAGE(page);
    }

    @Action
    setCameras(value: ICamera[]) {
        this.MUTATE_CAMERAS(value);
    }

    @Action
    setQueryString(value: IQueryStringCamera) {
        this.MUTATE_QUERY_STRING(value);
    }

    @Action
    setItemsPerPage(value: number) {
        this.MUTATE_ITEMS_PER_PAGE(value);
    }

    @Action
    setLimit(limit: number) {
        this.MUTATE_CAMERA_LIMIT(limit);
    }

    @Action
    setFilterForm(form: ICameraFilterForm) {
        this.MUTATE_CAMERA_FILTER_FORM(form);
    }

    @Action
    setLoadingCameraTable(value: boolean) {
        this.MUTATE_SET_LOADING_CAMERA_TABLE(value);
    }

    @Action
    clearFilterForm() {
        this.MUTATE_CAMERA_FILTER_FORM({});
        this.MUTATE_CAMERA_LIMIT(DEFAULT_SIZE_PER_PAGE);
        this.MUTATE_CAMERA_PAGE(DEFAULT_FIRST_PAGE);
        this.MUTATE_ITEMS_PER_PAGE(DEFAULT_SIZE_PER_PAGE);
    }

    @Action
    openCameraPopup(popupName: POPUP_NAME) {
        // find current open popup
        const currentDislayPopup = Object.keys(this.displayCameraPopups).find(
            (key: string) => this.displayCameraPopups[key as POPUP_NAME],
        ) as POPUP_NAME;
        if (currentDislayPopup) {
            this.MUTATE_PREVIOUS_DISPLAY_POPUP(currentDislayPopup);
        }
        // set display popup
        const displayCameraPopups: Record<POPUP_NAME, boolean> = {
            updateFormPopup: false,
            createFormPopup: false,
            detailFormPopup: false,
            recordingConfigurationPopup: false,
            scheduleListConfigruationPopup: false,
            scheduleFormConfigruationPopup: false,
        };
        displayCameraPopups[popupName] = true;
        this.MUTATE_DISPLAY_CAMERA_POPUPS(displayCameraPopups);
    }

    @Action
    closeCameraPopup(popupName: POPUP_NAME) {
        const displayCameraPopups = {
            ...this.displayCameraPopups,
        };
        displayCameraPopups[popupName] = false;
        if (this.previousDisplayPopup) {
            displayCameraPopups[this.previousDisplayPopup] = true;
            this.MUTATE_PREVIOUS_DISPLAY_POPUP('');
        }
        this.MUTATE_DISPLAY_CAMERA_POPUPS(displayCameraPopups);
    }

    @Mutation
    MUTATE_CAMERA_PAGE(page: number) {
        this.queryString.page = page;
    }

    @Mutation
    MUTATE_QUERY_STRING(value: IQueryStringCamera) {
        this.queryString = value;
    }

    @Mutation
    MUTATE_CAMERA_LIMIT(limit: number) {
        this.queryString.limit = limit;
    }

    @Mutation
    MUTATE_CAMERA_FILTER_FORM(form: ICameraFilterForm) {
        this.queryString.keyword = form.keyword?.trim() || null;
        this.queryString.uid = form.uid?.trim() || null;
    }

    @Mutation
    MUTATE_CAMERAS(cameras: ICamera[]) {
        this.cameras = cameras;
    }

    @Mutation
    MUTATE_TOTAL_CAMERAS(totalCameras: number) {
        this.totalCameras = totalCameras;
    }

    @Mutation
    MUTATE_ITEMS_PER_PAGE(value: number) {
        this.itemsPerPage = value;
    }

    @Mutation
    MUTATE_SET_LOADING_CAMERA_TABLE(value: boolean) {
        this.loadingCameraTable = value;
    }

    @Mutation
    MUTATE_CAMERA_MODELS(value: ICameraModelDropDown[]) {
        this.cameraModels = value;
    }

    @Mutation
    MUTATE_DISPLAY_CAMERA_POPUPS(displayCameraPopups: Record<POPUP_NAME, boolean>) {
        this.displayCameraPopups = displayCameraPopups;
    }

    @Mutation
    MUTATE_PREVIOUS_DISPLAY_POPUP(previousDisplayPopup: POPUP_NAME | '') {
        this.previousDisplayPopup = previousDisplayPopup;
    }
}

export const cameraListModule = getModule(CameraListModule);
