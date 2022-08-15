<template>
    <div class="block pb-2 pagination-container">
        <el-pagination
            :hide-on-single-page="false"
            layout="sizes, prev, pager, next"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :total="totalItems"
            v-model:current-page="currentPage"
            popper-class="pagination-select"
            @size-change="changePageSize"
            @current-change="handlePaginate"
        >
        </el-pagination>
    </div>
</template>

<script lang="ts">
import {
    DEFAULT_SIZE_PER_PAGE,
    DEFAULT_SIZE_PER_PAGE_OPTIONS,
} from '@/modules/common/constants';
import { Vue, Prop, Model } from 'vue-property-decorator';

export default class Pagination extends Vue {
    @Prop({ default: 0 }) readonly totalItems!: number;
    @Prop({ default: DEFAULT_SIZE_PER_PAGE_OPTIONS }) readonly pageSizes!: number[];
    pageSize = DEFAULT_SIZE_PER_PAGE;

    @Model('onChangePage', { type: Number })
    currentPage!: number;

    changePageSize(val: number): void {
        this.pageSize = val;
        this.$emit('changePageSize', val);
    }

    handlePaginate(pageNumber: number): void {
        this.$emit('handlePaginate', pageNumber);
    }
}
</script>

<style lang="scss" scoped>
:deep .el-pagination {
    right: 0px;
    text-align: right;
    padding-right: 0px;
    .el-input {
        margin-left: 0px;
        width: 100% !important;
    }
    .btn-prev,
    .btn-next {
        border: 1px solid #ededed;
        margin: 0 !important;
    }
    .btn-next {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border-left: 0px !important;
    }
    .btn-prev {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-right: 0px !important;
    }
    .el-input__inner {
        height: 32px !important;
    }
}
:deep(.el-pagination__sizes) > .el-select {
    width: 138px !important;
}
:deep(.el-select__popper) {
    width: 138px !important;
}
:deep .el-pager {
    .number,
    .more {
        border: 1px solid #ededed;
        margin: 0 !important;
        padding: 0 !important;
    }
    .number {
        &.active {
            background-color: #ededed;
            color: black;
        }
    }
}
:deep(.el-select__caret) {
    transform: rotateZ(-180deg) !important;
}
.pagination-container {
    display: flex;
    justify-content: flex-end;
}
</style>
