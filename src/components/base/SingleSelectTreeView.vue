<template>
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
            <el-select
                v-model="selectedValue"
                :placeholder="selectedValue ? '' : placeholder"
                :filterable="filterable"
                :teleported="teleported"
                popper-class="select-options"
                @focus="onFocus"
                :fit-input-width="true"
                :size="size"
                :disabled="isDisabled"
                :clearable="clearable"
                ref="treeSingleSelect"
                :filter-method="filterText"
            >
                <el-option
                    v-for="option in optionsData"
                    :label="selectedLabel(option)"
                    :key="option._id"
                    :value="option._id"
                    :style="optionStyle"
                    :class="{ 'is-visible': option.level !== rootLevel }"
                >
                    <el-tree
                        :data="[option]"
                        :node-key="nodeKey"
                        accordion
                        default-expand-all
                        @node-click="onClickTreeNode"
                        :expand-on-click-node="false"
                        :filter-node-method="search"
                        :props="defaultProps"
                        @focus="onFocus"
                        :highlight-current="true"
                        ref="treeRef"
                    >
                        <template #default="{ data }">
                            <div class="folder-icon">
                                <Folder style="width: 1em; height: 1em" />
                            </div>
                            <span
                                :class="{
                                    'is-selected': data?.[nodeKey] === selectedValue,
                                }"
                                :style="optionStyle"
                            >
                                {{ data?.name }}
                            </span>
                        </template>
                    </el-tree>
                </el-option>
            </el-select>
            <div class="invalid-feedback text-start d-block" v-show="error">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ITreeNode, ISelectForm } from '@/modules/common/types';
import { Model, Prop, Vue, Options, Watch } from 'vue-property-decorator';
import { Folder } from '@element-plus/icons-vue';
import { ROOT_LEVEL } from '@/modules/common/constants';
import { vietnameseStringInclude } from '@/utils/commonFunction';
import { mapTreeToFlatList } from '@/modules/common/helpers';

type TreeForm = Vue & {
    filter: (val: string) => boolean;
    setCurrentKey: (nodeKey: string) => void;
    visible: boolean;
};

@Options({
    components: { Folder },
})
export default class SingleTreeViewSelect extends Vue {
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: '' }) readonly size!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly filterable!: boolean;
    @Prop({ default: true }) readonly clearable!: boolean;
    @Prop({ default: true }) readonly teleported!: boolean;
    @Prop({ default: '' }) readonly title!: string;
    @Prop({ default: null }) readonly treeData!: ITreeNode[];
    @Prop({ default: '_id' }) readonly nodeKey!: string;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: false }) readonly isRequired!: boolean;

    @Model('value', { type: Object })
    selectedValue!: string;

    keyword = '';

    rootLevel = ROOT_LEVEL;

    optionStyle: Record<string, string> = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: 'auto',
    };

    get selectedRef(): unknown {
        return this.$refs.treeSingleSelect;
    }

    onFocus(): void {
        this.filterText('');
        const clientWidth = (this.selectedRef as ISelectForm)?.selectWrapper?.clientWidth;
        this.optionStyle = {
            ...this.optionStyle,
            maxWidth: `${clientWidth}px`,
        };
    }

    // return name of nodes and its children
    findAllChildrenOfNodes(nodes: ITreeNode[]): string[][] {
        const list = nodes.map((node: ITreeNode) => {
            if (node?.children && node.children?.length > 0)
                return mapTreeToFlatList([node]).map((ele) => ele.name);
            return [node.name];
        });
        return list;
    }

    optionsData = [] as ITreeNode[];

    @Watch('treeData')
    changeOptionsData(): void {
        this.optionsData = mapTreeToFlatList(this.treeData);
    }

    filterText(val: string): void {
        if (!val) {
            this.optionsData = mapTreeToFlatList(this.treeData);
        } else {
            const treeWithAllChildrenInRoot = this.findAllChildrenOfNodes(this.treeData);
            // Find if tree nodes contain keyword
            const treeNodesContainsKeyword = treeWithAllChildrenInRoot.filter((ele) => {
                const i = ele.findIndex((e) => vietnameseStringInclude(e, val));
                return i > -1;
            });
            // Return array of all nodes in tree that contains keyword
            const roots = [].concat.apply([], treeNodesContainsKeyword as never[]);
            this.optionsData = mapTreeToFlatList(this.treeData).filter(
                (node: ITreeNode) => {
                    const index = roots.findIndex((ele) => ele === node?.name);
                    return index > -1;
                },
            );
        }
        this.keyword = val;
    }

    @Watch('keyword')
    onFilter(): void {
        const tree = this.$refs.treeRef as TreeForm;
        if (this.keyword && tree) tree.filter(this.keyword);
    }

    search(value: string, data: ITreeNode): boolean {
        if (!value) return true;
        return vietnameseStringInclude(data.name, value);
    }

    selectedLabel(option: ITreeNode): string {
        return option?._id === this.selectedValue ? option.name : '';
    }

    onClickTreeNode(data: ITreeNode): void {
        this.$emit('update:value', data._id);
        this.$emit('onClickNode', data);
        this.filterText('');
        (this.$refs.treeSingleSelect as TreeForm).visible = false;
    }

    defaultProps = {
        label: 'name',
        children: 'children',
    };
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
.el-select {
    width: 100% !important;
}
:deep .el-input {
    .el-icon-arrow-up:before {
        content: '\e78f';
    }
}
.is-visible {
    display: none;
}
.mark-required {
    color: #de2b2b;
}
::v-deep .el-input__inner {
    height: 36px !important;
}
.is-selected {
    font-weight: 600;
    color: #3c61e0;
}
.el-select-dropdown__item.selected {
    font-weight: 400;
}
.el-select-dropdown__item {
    height: 100% !important;
    padding: 0px;
    &:hover {
        background: transparent;
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
.el-select-dropdown__item {
    padding-left: 0px !important;
}
</style>
