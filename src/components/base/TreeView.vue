<template>
    <div class="tree-wrapper">
        <div class="heading">
            <h4>
                {{ title }}
            </h4>
            <div class="d-flex align-items-center">
                <BaseInputText
                    class="search-input"
                    v-model:value="keyword"
                    :placeholder="$t('common.app.filterForm.search')"
                    suffixIcon="el-icon-search"
                    :hasError="hasFilterError"
                >
                </BaseInputText>
            </div>
        </div>

        <el-tree
            v-show="!loading && hasFilteredData"
            :data="treeData"
            :node-key="nodeKey"
            accordion
            :default-expand-all="isExpandAll"
            :filter-node-method="search"
            :expand-on-click-node="false"
            :props="defaultProps"
            :highlight-current="true"
            ref="treeRef"
            empty-text=""
        >
            <template #default="{ data }">
                <div class="d-flex align-items-center node-content">
                    <div class="main-content d-flex" @click="onClickNode(data)">
                        <div class="folder-icon">
                            <Folder style="width: 1em; height: 1em" />
                        </div>
                        <span class="data-name">
                            {{ data?.name }}
                        </span>
                    </div>
                    <div class="action-group">
                        <div class="group-button">
                            <el-tooltip
                                effect="dark"
                                :content="$t('common.app.tooltip.addRoot')"
                                placement="right"
                                :hide-after="0"
                                :visible-arrow="false"
                                v-if="
                                    data?.level < maxGroup &&
                                    isShowBtnAddNode &&
                                    !isGetMaxChildren(data)
                                "
                            >
                                <el-button
                                    type="primary"
                                    size="small"
                                    circle
                                    plain
                                    @click="addNode(data)"
                                >
                                    <el-icon>
                                        <CirclePlus />
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip
                                effect="dark"
                                :content="$t('common.app.tooltip.edit')"
                                placement="right"
                                :hide-after="0"
                                :visible-arrow="false"
                                v-if="isShowBtnUpdateNode"
                            >
                                <el-button
                                    type="primary"
                                    size="small"
                                    circle
                                    plain
                                    @click="editNode(data)"
                                >
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip
                                effect="dark"
                                :content="$t('common.app.tooltip.delete')"
                                placement="right"
                                :hide-after="0"
                                :visible-arrow="false"
                                v-if="data?.children?.length === 0 && isShowBtnDeleteNode"
                            >
                                <el-button
                                    type="primary"
                                    size="small"
                                    circle
                                    plain
                                    @click="deleteNode(data)"
                                >
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </template>
        </el-tree>
        <BaseEmptyData v-if="!loading && !hasFilteredData" />
    </div>
</template>

<script lang="ts">
import { Model, Options, Prop, Vue, Watch } from 'vue-property-decorator';
import {
    CirclePlus,
    Folder,
    Delete,
    Edit,
    CirclePlusFilled,
} from '@element-plus/icons-vue';
import { ITreeNode } from '@/modules/common/types';
import { MAX_CHILDREN, MAX_GROUP_LEVEL } from '../../modules/common/constants';
import { vietnameseStringInclude } from '@/utils/commonFunction';
import { debounce } from '@/utils/helper';
import { mapTreeToFlatList } from '@/modules/common/helpers';

export type TreeForm = Vue & {
    filter: (val: string) => boolean;
    setCurrentKey: (nodeKey: string) => void;
};

@Options({
    components: { CirclePlus, Folder, Delete, Edit, CirclePlusFilled },
})
export default class TreeView extends Vue {
    @Prop({ default: null }) readonly treeData!: ITreeNode[];
    @Prop({ default: '' }) readonly title!: string;
    @Prop({ default: '_id' }) readonly nodeKey!: string;
    @Prop({ default: MAX_GROUP_LEVEL }) readonly maxGroup!: number;
    @Prop({ default: true }) readonly isExpandAll!: boolean;
    @Prop({ default: true }) readonly hasFilterError!: boolean;
    @Prop({ default: false }) readonly loading!: boolean;
    @Prop({ default: true }) readonly isShowBtnAddNode!: boolean;
    @Prop({ default: true }) readonly isShowBtnUpdateNode!: boolean;
    @Prop({ default: true }) readonly isShowBtnDeleteNode!: boolean;
    @Prop({ default: MAX_CHILDREN }) readonly maxChildren!: number;

    @Model('value', { type: Object })
    readonly selectedNode!: ITreeNode;

    keyword = '';

    defaultProps = {
        label: 'name',
        children: 'children',
    };

    get hasFilteredData(): boolean {
        return (
            mapTreeToFlatList(this.treeData).filter((item) =>
                vietnameseStringInclude(item.name, this.keyword),
            )?.length > 0
        );
    }

    get firstNoteKey(): string {
        if (this.nodeKey === '_id') {
            return this.selectedNode?._id as string;
        }
        return this.selectedNode?.id?.toString() as string;
    }

    isGetMaxChildren(data: ITreeNode): boolean {
        return (data.children?.length || -1) >= this.maxChildren;
    }

    addNode(data: ITreeNode): void {
        this.$emit('addNode', data);
    }

    editNode(data: ITreeNode): void {
        this.$emit('editNode', data);
    }

    deleteNode(data: ITreeNode): void {
        this.$emit('deleteNode', data);
    }

    onClickNode(data: ITreeNode): void {
        this.$emit('onClickNode', data);
        this.$emit('update:value', data);
    }

    mapTreeToFlatList(trees: ITreeNode[]): ITreeNode[] {
        const list: ITreeNode[] = [];
        const getListRecursively = (tree: ITreeNode[]) => {
            tree.forEach((subTree) => {
                list.push(subTree);
                if (subTree?.children?.length) {
                    getListRecursively(subTree.children);
                }
            });
        };
        getListRecursively(trees);
        return list;
    }

    @Watch('keyword')
    filterText(val: string): void {
        const tree = this.$refs.treeRef as TreeForm;
        debounce(() => {
            if (tree) {
                tree.filter(val);
            }
        }, 300)();
    }

    @Watch('treeData')
    onTreeDataChange(): void {
        const tree = this.$refs.treeRef as TreeForm;
        if (tree) {
            this.$nextTick(() => {
                tree.filter(this.keyword);
            });
        }
    }

    @Watch('selectedNode')
    selectedNodeChanged(): void {
        setTimeout(() => {
            // TODO remove timeout
            this.$nextTick(() => {
                (this.$refs.treeRef as TreeForm).setCurrentKey(this.firstNoteKey);
            });
        }, 500);
    }

    search(value: string, data: ITreeNode): boolean {
        if (!value) return true;
        return vietnameseStringInclude(data.name, value?.trim());
    }
}
</script>

<style lang="scss" scoped>
.search-input {
    flex-grow: 1;
}
.group-button {
    button {
        margin-left: 0px !important;
    }
}
.node-content {
    justify-content: space-between;
    flex-grow: 1;
}
.add-button {
    display: flex;
    &:hover {
        cursor: pointer;
    }
}
.main-content {
    cursor: pointer;
    flex-grow: 15;
}
:deep(.el-button--primary.is-plain) {
    background: transparent;
    color: #303e67;
    .el-icon {
        font-size: 14px;
        font-weight: 600;
    }
    &:hover {
        border-color: #3c61e0;
        color: #3c61e0;
        background: transparent;
    }
    &:focus {
        background: transparent;
        color: #303e67 !important;
    }
}
.action-group {
    margin-left: auto;
    display: flex !important;
    flex-grow: 1;
    justify-content: flex-end;
}
.data-name {
    color: #303e67;
}
:deep(.el-tree-node__content) {
    height: 40px;
    width: 100%;
}
.folder-icon {
    margin-right: 15px;
    padding-bottom: 2px;
}
:deep(.el-button--primary.is-plain) {
    border: 0px solid;
}
.el-input__suffix-inner {
    button {
        padding-right: 7px !important;
        padding-left: 7px !important;
    }
}
:deep(.el-input__suffix) {
    right: 0px !important;
}
.action-button {
    .el-icon {
        font-size: 16px !important;
    }
}
.heading {
    top: 0px;
    position: sticky;
    z-index: map-get($map: $zIndex, $key: TreeView);
    background-color: white;
}
:deep(.el-tree) {
    margin-top: 10px;
    overflow-x: auto;
    max-height: 550px;
}
::v-deep .el-tree-node__content {
    height: fit-content;
    span {
        word-break: break-all;
        width: fit-content;
        max-width: 177px;
        word-wrap: break-word;
        white-space: pre-wrap;
    }
}
</style>
