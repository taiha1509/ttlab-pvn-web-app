<template>
    <el-table
        :data="data"
        :max-height="layoutHasFilterForm ? maxHeight : scrollHeight"
        :style="style"
        :header-cell-style="headerStyle"
        :span-method="objectSpanMethod"
        :border="border"
        :stripe="true"
        :cell-style="cellStyle"
        :highlight-current-row="true"
        @cell-click="handleCellClick"
        @row-click="handleRowClick"
        @sort-change="onSort"
    >
        <slot name="table-columns" />
    </el-table>
</template>

<script lang="ts">
import { HEIGHT_HEADER_FOOTER_AND_PAGINATION } from '@/modules/common/constants';
import { IPropSortTable } from '@/modules/common/types';
import { Prop, Vue } from 'vue-property-decorator';

export default class TableLayout extends Vue {
    @Prop({ default: { 'font-weight': '600' } }) readonly headerStyle!: string;
    @Prop({ default: null }) readonly data!: any;
    @Prop({ default: { width: '100%' } }) readonly style!: string;
    @Prop({ default: true }) readonly border!: boolean;
    @Prop({ default: true }) readonly stripe!: boolean;
    @Prop({ default: null }) readonly cellStyle!: unknown;
    @Prop({ default: false }) readonly layoutHasFilterForm!: boolean;
    @Prop({ default: null }) readonly scrollHeight!: string | number;
    @Prop({
        default: null,
    })
    readonly objectSpanMethod!: unknown;

    handleCellClick(row: Record<string, string>, column: Record<string, string>): void {
        this.$emit('cell-click', row, column);
    }

    handleRowClick(row: Record<string, string>): void {
        this.$emit('row-click', row);
    }

    onSort(scoped: IPropSortTable): void {
        this.$emit('on-sort', scoped);
    }

    get maxHeight(): number {
        const height = window.innerHeight;
        return height - HEIGHT_HEADER_FOOTER_AND_PAGINATION - this.filterHeight;
    }

    filterHeight = 0;

    created(): void {
        window.addEventListener('resize', this.resizeHandle);
    }

    unmounted(): void {
        window.removeEventListener('resize', this.resizeHandle);
    }

    resizeHandle(): void {
        const filterForm = document.getElementById('base-filter-form') as HTMLElement;
        this.height = +filterForm?.offsetHeight;
    }

    mounted(): void {
        this.resizeHandle();
    }

    get height(): number {
        return this.filterHeight;
    }

    set height(val: number) {
        this.filterHeight = +val;
    }
}
</script>

<style scoped lang="scss">
:deep .test {
    background-color: white !important;
}
::v-deep .el-table__fixed-right {
    @media (max-width: 1468px) and (min-width: 920px) {
        height: calc(100%) !important;
    }
    @media (max-width: 920px) {
        height: calc(100% - 10px) !important;
    }
}
::v-deep .el-table__body-wrapper {
    .el-table__body {
        width: 100% !important;
    }
}
</style>
