<template>
    <div>
        <div class="vms-form-item" :class="{ 'flex-column': !isHorizontal }">
            <label
                v-if="label"
                class="vms-form-label"
                :class="{
                    'w-100 mb-2': !isHorizontal,
                    'w-25 pt-2 text-right': isHorizontal,
                }"
            >
                {{ label }}
                <span v-if="isRequired" class="mark-required">*</span>
            </label>
            <div
                class="vms-form-content"
                :class="{ 'w-100': !isHorizontal, 'w-75': isHorizontal }"
            >
                <div class="vms-form-content w-100">
                    <el-select
                        v-model="selectedValues"
                        :placeholder="hasPlaceholder ? placeholder : ''"
                        :filterable="filterable"
                        :teleported="teleported"
                        popper-class="select-options"
                        multiple
                        :fit-input-width="true"
                        collapse-tags
                        @focus="onFocus"
                        :size="size"
                        :disabled="isDisabled"
                        ref="refMultipleSelectTreeView"
                        :filter-method="filterMethod"
                    >
                        <el-option
                            v-for="(option, index) in filteredOptions"
                            :key="option.value"
                            :value="option.value"
                            :label="option.label"
                            :style="optionStyle"
                            :class="{ 'is-hidden': index != 0 }"
                        >
                            <div v-if="index == 0">
                                <el-tree
                                    :data="filteredTrees"
                                    :node-key="nodeKey"
                                    accordion
                                    default-expand-all
                                    @node-click="onClickTreeNode"
                                    :expand-on-click-node="false"
                                    :props="defaultProps"
                                    :highlight-current="true"
                                >
                                    <template #default="{ data }">
                                        <div class="folder-icon">
                                            <Folder style="width: 1em; height: 1em" />
                                        </div>
                                        <span
                                            :style="optionStyle"
                                            :class="{
                                                'is-selected': selectedNode(
                                                    data?.[nodeKey],
                                                ),
                                            }"
                                        >
                                            {{ data?.name }}
                                        </span>
                                    </template>
                                </el-tree>
                            </div>
                        </el-option>
                    </el-select>
                    <div class="invalid-feedback text-start d-block" v-show="error">
                        {{ error }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ITreeNode, ISelectForm, ISelectOptions } from '@/modules/common/types';
import { Model, Prop, Vue, Options } from 'vue-property-decorator';
import { Folder, CircleClose as CircleCloseIcon } from '@element-plus/icons-vue';
import { ROOT_LEVEL } from '@/modules/common/constants';
import { cloneDeep, reject, isUndefined } from 'lodash';
import { pruneTree } from '@/utils/tree-helper';

@Options({
    components: { Folder, CircleCloseIcon },
})
export default class MultipleSelectTreeView extends Vue {
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: '' }) readonly size!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly filterable!: boolean;
    @Prop({ default: true }) readonly teleported!: boolean;
    @Prop({ default: '' }) readonly title!: string;
    @Prop({ default: [] }) readonly treeData!: ITreeNode[];
    @Prop({ default: '_id' }) readonly nodeKey!: string & keyof ITreeNode;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: false }) readonly isRequired!: boolean;

    @Model('value', { type: [String, Number] })
    selectedValues!: string[] | number[];

    defaultProps = {
        label: 'name',
        children: 'children',
    };

    rootLevel = ROOT_LEVEL;

    keyword = '';

    optionStyle: Record<string, string> = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: 'auto',
    };

    get hasPlaceholder(): boolean {
        return this.selectedValues?.length === 0 && !this.keyword;
    }

    get filteredTrees(): ITreeNode[] {
        const trees = cloneDeep(this.treeData);
        if (this.keyword) {
            for (const tree of trees) {
                pruneTree(tree, this.keyword);
            }
        }
        return trees.filter((tree) => !!tree[this.nodeKey]);
    }

    get filteredOptions(): ISelectOptions[] {
        return this.getAllNode(this.filteredTrees);
    }

    get refMultipleSelectTreeView(): unknown {
        return this.$refs.refMultipleSelectTreeView;
    }

    // get all names and ids of nodes in entire trees
    getAllNode(trees: ITreeNode[]): ISelectOptions[] {
        const options: ISelectOptions[] = [];
        const iterate = (children: ITreeNode[]) => {
            for (const child of children) {
                options.push({
                    value: child[this.nodeKey] as string | number,
                    label: child.name,
                });
                if (child.children && child.children?.length > 0) {
                    iterate(child.children);
                }
            }
        };
        for (const tree of trees) {
            options.push({
                value: tree[this.nodeKey] as string | number,
                label: tree.name,
            });
            if (tree.children && tree.children?.length > 0) {
                iterate(tree.children);
            }
        }
        return options;
    }

    filterMethod(val: string): void {
        this.keyword = val;
    }

    onFocus(): void {
        this.keyword = '';
        const clientWidth = (this.refMultipleSelectTreeView as ISelectForm)?.selectWrapper
            ?.clientWidth as number;
        this.optionStyle = {
            ...this.optionStyle,
            maxWidth: `${clientWidth}px`,
        };
    }

    onClickTreeNode(data: ITreeNode): void {
        const index = this.selectedValues?.findIndex((ele) => ele === data[this.nodeKey]);
        const selectedNode = data[this.nodeKey] as string | number;
        if (index === -1) this.selectedValues.push(selectedNode as never);
        else this.selectedValues.splice(index, 1);
        this.$emit('update:value', reject(this.selectedValues, isUndefined));
        this.keyword = '';
    }

    selectedNode(id: string): boolean {
        return this.selectedValues?.findIndex((ele) => ele === id) > -1;
    }
}
</script>

<style lang="scss" scoped>
.vms-form-item {
    display: flex;
    margin-bottom: 15px;
}
.vms-form-label {
    font-size: 13px;
    color: #656d9a;
}
:deep .el-select {
    width: 100% !important;
}
.is-hidden {
    display: none;
}
:deep .el-input {
    .el-icon-arrow-up:before {
        content: '\e78f';
    }
}
:deep .popper__arrow {
    display: none !important;
}
.mark-required {
    color: #de2b2b;
}
::v-deep .el-input__inner {
    height: 36px !important;
}
::v-deep .el-select-dropdown__list {
    padding: 0px !important;
}
.is-selected {
    font-weight: 600;
    color: #3c61e0;
}
.el-select-dropdown__item {
    height: 100% !important;
    padding: 0px;
    &:hover {
        background: transparent;
    }
    &.selected {
        font-weight: 400;
        .el-icon {
            position: unset !important;
            right: 0 !important;
        }
    }
}
:deep .el-input {
    .el-icon-arrow-up:before {
        content: '\e78f';
    }
}
:deep(.el-tree-node__content) {
    height: 34px;
    width: 100%;
    &:hover {
        width: 100% !important;
    }
}
::v-deep .el-input__inner {
    height: 36px !important;
}
.folder-icon {
    margin-right: 15px;
    padding-bottom: 2px;
}

:deep(.el-select__tags) {
    max-width: unset !important;
}
</style>
