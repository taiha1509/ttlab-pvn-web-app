import { VuexModule, Module, getModule, Action, Mutation } from 'vuex-module-decorators';
import store from '@/store';
import { IPermission, IRole } from './type';
import { roleApiService } from './services/api.service';
import { PermissionActions, PermissionResources } from './role.constant';
import { appService } from '@/utils/app';
@Module({ dynamic: true, namespaced: true, store, name: 'role' })
class RoleModule extends VuexModule {
    initRole = {
        id: NaN,
        name: '',
        description: '',
        permissions: [],
    };

    roles: IRole[] = [];
    role: IRole = { ...this.initRole };
    permissionList: IPermission[] = [];

    // getters
    // return the user permission in role module
    get userPermissions(): PermissionActions[] {
        return appService.getUserPermissionsByResource(PermissionResources.ROLE);
    }

    // ACTION
    @Action
    setRoles(value: IRole[]) {
        this.MUTATE_SET_ROLES(value);
    }

    @Action
    setPermissionList(value: IPermission[]) {
        this.MUTATE_SET_PERMISSION_LIST(value);
    }

    @Action
    setRole(value: IRole) {
        this.MUTATE_SET_ROLE(value);
    }

    @Action
    async getRoles() {
        const response = await roleApiService.getRoles();
        if (response.data) {
            this.setRoles(response.data);
        } else {
            this.setRoles([]);
        }
    }

    @Action
    async getPermissionList() {
        const response = await roleApiService.getPermissionList();
        if (response.data) {
            this.setPermissionList(response.data.items);
        } else {
            this.setPermissionList([]);
        }
    }

    @Action
    async getRole(id: number) {
        const response = await roleApiService.getRole(id);
        if (response.data) {
            this.setRole(response.data);
        } else {
            this.setRole({ ...this.initRole });
        }
    }

    // MUTATION
    @Mutation
    MUTATE_SET_ROLES(value: IRole[]) {
        this.roles = value;
    }

    @Mutation
    MUTATE_SET_ROLE(value: IRole) {
        this.role = value;
    }

    @Mutation
    MUTATE_SET_PERMISSION_LIST(value: IPermission[]) {
        this.permissionList = value;
    }
}
export const roleModule = getModule(RoleModule);
