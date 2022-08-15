<template>
    <div class="page-title-box">
        <div class="col page-header">
            <el-breadcrumb class="breadcrumb" :separator="separator">
                <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
                    <el-breadcrumb-item :to="breadcrumb.to">
                        {{ breadcrumb.title }}
                    </el-breadcrumb-item>
                </template>
            </el-breadcrumb>
        </div>
        <!--end col-->
    </div>
    <!--end row-->
    <!--end page-title-box-->
</template>

<script lang="ts">
import { IBreadcrumb } from '@/modules/common/types';
import { Prop, Vue } from 'vue-property-decorator';

export default class PageHeader extends Vue {
    @Prop({ default: '' }) readonly pageTitle!: string;
    @Prop({ default: () => [] }) breadcrumbs!: IBreadcrumb[];
    // separator character
    @Prop({ default: '/' }) separator!: string;
}
</script>

<style lang="scss" scoped>
::v-deep .el-breadcrumb__inner {
    font-size: 15px;
    font-weight: bold;
    &.active {
        color: #7081b9;
    }
}
::v-deep .el-breadcrumb__separator {
    color: #7081b9;
    font-size: 14px;
    font-weight: 300px;
}
::v-deep .is-link {
    color: black;
    font-size: 15px;
    font-weight: 500;
}
:deep .page-title {
    font-size: 17px;
    margin: 0;
    color: #343a40;
    font-weight: 500;
    line-height: 18px;
}
.page-title-box {
    display: block !important;
    padding-bottom: 0px;
    border-bottom: 1px solid #e0e0e0;
}
.breadcrumb {
    margin-bottom: 10px;
}
</style>
