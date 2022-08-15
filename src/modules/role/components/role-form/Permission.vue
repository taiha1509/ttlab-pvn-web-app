<template>
    <div class="card-body">
        <div class="permission-tree">
            <div class="title d-flex">
                <div class="w-25 text-right label" style="margin-right: 10px">
                    {{ $t('role.role.detail.permissionControl') }}
                    <span style="color: red">*</span>
                </div>
                <div class="click-all w-75">
                    <el-checkbox
                        v-model="checkAll"
                        @change="onCheckAll"
                        :label="$t('role.role.actions.all')"
                    ></el-checkbox>
                    <div class="error-text text-left d-block" v-show="error">
                        {{ error ? $t(error) : '' }} &nbsp;
                    </div>
                </div>
            </div>

            <div class="row d-flex">
                <div class="left-side w-25"></div>
                <div class="remain-side w-75 p-0/">
                    <div class="custom-tree-node-container">
                        <div class="block">
                            <el-tree
                                :data="permissionTree"
                                show-checkbox
                                node-key="id"
                                default-expand-all
                                :props="defaultProps"
                                :expand-on-click-node="false"
                                @check="onCheckNode"
                                ref="refPermissionTree"
                            >
                                <template #default="{ data }">
                                    <div v-if="!data.children">
                                        {{
                                            data.name
                                                ? $t(`role.role.actions.${data.name}`)
                                                : ''
                                        }}
                                    </div>
                                    <div v-else>
                                        {{ data.name ? $t(data.name) : '' }}
                                    </div>
                                </template>
                            </el-tree>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue } from 'vue-class-component';
import { Model, Prop, Watch } from 'vue-property-decorator';
import { PermissionActions } from '../../role.constant';
import { roleModule } from '../../store';
import {
    IPermission,
    IPermissionTree,
    IRole,
    ITreeStatus,
    PermissionTree,
} from '../../type';

export default class Permission extends Vue {
    defaultProps = {
        label: 'name',
        children: 'children',
    };

    @Prop({ type: String, default: '' })
    readonly error!: string;

    @Model('value')
    selectedPermissionIds!: number[];

    checkAll = false;

    get permissionList(): IPermission[] {
        return roleModule.permissionList;
    }

    get permissionIds(): number[] {
        const results: number[] = [];
        this.permissionList.forEach((permission) => {
            permission.actions.forEach((action) => {
                results.push(action.permissionId);
            });
        });

        return results;
    }

    get permissionTree(): IPermissionTree[] {
        if (this.permissionList.length === 0) {
            return [];
        }

        const permissions: IPermissionTree[] = [];
        this.permissionList.forEach((permission) => {
            const temp: IPermissionTree = {
                resource: permission.resource,
                children: [],
                name: `role.role.resources.${_.camelCase(permission.resource)}`,
            };
            permission.actions.forEach((action) => {
                (temp.children as IPermissionTree[]).push({
                    name: action.action,
                    id: action.permissionId,
                    resource: permission.resource,
                });
            });
            permissions.push(temp);
        });
        return permissions;
    }

    get treeRef(): PermissionTree {
        return this.$refs.refPermissionTree as PermissionTree;
    }

    get role(): IRole {
        return roleModule.role;
    }

    // user click check all button
    onCheckAll(): void {
        // checked all
        if (this.checkAll) {
            this.selectedPermissionIds = [];
            this.permissionIds.forEach((item) => {
                this.treeRef.setChecked(item, true, false);
            });
            this.selectedPermissionIds = this.permissionIds;
        } else {
            // unchecked all
            this.permissionIds.forEach((id) => {
                this.treeRef.setChecked(id, false, false);
            });
            this.selectedPermissionIds = [];
        }
    }

    // update status of check all button
    updateCheckAllStatus(): void {
        if (this.selectedPermissionIds.length !== this.permissionIds.length) {
            this.checkAll = false;
        } else {
            this.checkAll = true;
        }
    }

    onCheckNode(node: IPermissionTree, status: ITreeStatus): void {
        const selectedPermissionIds = _.compact(
            status.checkedNodes.map((item) => item.id),
        );
        // check if this node isn't node having read action then check the node with read action in the same resource (parent)
        if (node.id) {
            // find permissionId of read & other actions
            const selectedResource = this.permissionList.find(
                (permission) => node.resource === permission.resource,
            );
            const readPermissionId =
                (selectedResource?.actions || []).find(
                    (action) => action.action === PermissionActions.READ,
                )?.permissionId || NaN;
            const remainPermissionIds = (selectedResource?.actions || [])
                .filter((action) => action.action !== PermissionActions.READ)
                .map((action) => action.permissionId);

            if (!isNaN(readPermissionId)) {
                if (
                    node.id !== readPermissionId &&
                    !selectedPermissionIds.includes(readPermissionId) &&
                    // if check
                    selectedPermissionIds.includes(node.id)
                ) {
                    selectedPermissionIds.push(readPermissionId);
                }
                // if uncheck node with read action, then unckeck all remain nodes in same resource (parent)
                if (
                    node.id === readPermissionId &&
                    // if uncheck
                    !selectedPermissionIds.includes(readPermissionId)
                ) {
                    _.remove(selectedPermissionIds, (id: number) => {
                        return remainPermissionIds?.includes(id);
                    });
                }
            }
        }
        this.selectedPermissionIds = selectedPermissionIds;
    }

    @Watch('selectedPermissionIds')
    onChangeSelectedPermissionIds(): void {
        // unchecked all
        this.permissionIds.forEach((id) => {
            this.treeRef.setChecked(id, false, false);
        });
        // check nodes that indicate the permission of role
        this.selectedPermissionIds.forEach((id) => {
            this.treeRef.setChecked(id as number, true, false);
        });
        this.$nextTick(() => {
            this.updateCheckAllStatus();
        });
    }
}
</script>

<style lang="scss" scoped>
.error-text {
    color: #f5325c;
    font-size: 13px;
}

.title {
    position: sticky;
    top: 0px;
    z-index: 100;
    background-color: white;
}

.card-body {
    padding: 0px;
    overflow-x: hidden !important;
    margin-bottom: 16px !important;
}

.label {
    font-size: 13px;
    color: #656d9a;
    padding-top: 6px;
}
</style>
