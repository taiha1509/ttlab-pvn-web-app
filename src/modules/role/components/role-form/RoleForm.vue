<template>
    <div class="card">
        <div class="card-header d-flex align-items-center">
            <h4 v-if="!isCreate" class="my-0">
                {{ $t('role.role.detail.title') }}
            </h4>
            <h4 v-else class="my-0">
                {{ $t('role.role.create.title') }}
            </h4>
        </div>
        <div class="card-body" id="permission-form">
            <div class="align-left">
                <BaseInputText
                    :isHorizontal="true"
                    :label="$t('role.role.detail.roleName')"
                    :isRequired="true"
                    v-model:value="form.name"
                    :error="translateYupError(form.errors.name)"
                />
            </div>
            <div class="pt-2 align-left">
                <BaseInputText
                    :isHorizontal="true"
                    type="textarea"
                    :label="$t('role.role.detail.description')"
                    :isRequired="false"
                    :error="translateYupError(form.errors.description)"
                    v-model:value="form.description"
                />
            </div>
            <Permission
                v-model:value="selectedPermissionIds"
                :error="form.errors.permissionIds"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins, Options, setup } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { roleModule } from '../../store';
import { permisionForm } from '../../compositions/roleForm';
import { IRole } from '../../type';
import Permission from './Permission.vue';

@Options({ components: { Permission } })
export default class RoleForm extends mixins(UtilMixins) {
    // list all of node ids in tree ui, this property is immutable
    permissionIds: number[] = [];

    get selectedPermissionIds(): number[] {
        return this.form.permissionIds as number[];
    }

    set selectedPermissionIds(value: number[]) {
        if (value.length === 0) {
            this.form.resetPermissionIds();
        } else {
            this.form.setPermissionIds(value);
        }
    }

    get role(): IRole {
        return roleModule.role;
    }

    get isCreate(): boolean {
        return !roleModule.role.id;
    }

    form = setup(() => permisionForm());

    @Watch('form.errors')
    onCheckRoleForm(): void {
        if (
            this.form.errors.permissionIds ||
            this.form.errors.name ||
            this.form.errors.description
        )
            (document.getElementById('permission-form') as Element).scrollTo({
                top: 0,
                behavior: 'smooth',
            });
    }

    @Watch('role')
    onChangeRole(): void {
        // set data
        this.form.setForm({
            ...this.form.initValue,
            name: this.role.name,
            description: this.role.description,
        });
        if (!this.isCreate) {
            const listIds: number[] = [];
            this.role.permissions.forEach((item) => {
                listIds.push(item.id);
            });
            this.selectedPermissionIds = listIds;
        }
        (document.getElementById('permission-form') as Element).scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
}
</script>

<style lang="scss" scoped>
.card {
    height: calc(100vh - 192px);
}

.card-body {
    overflow: auto;
    overflow-x: hidden;
    margin-bottom: 16px;
}
</style>
