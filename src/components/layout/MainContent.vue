<template>
    <div class="page-content-custom">
        <div class="layout-container">
            <!-- Page-Title -->
            <PageTitle :pageTitle="pageTitle" :breadcrumbs="breadcrumbs">
                <template #title-top-right>
                    <slot name="title-top-right" />
                </template>
            </PageTitle>
            <slot name="filter-form"></slot>
            <div class="row row-content">
                <!-- Sub right side bar -->
                <div class="col-3" v-if="isShowSubSideBar">
                    <slot name="sub-side-bar"></slot>
                </div>
                <!-- Main-content -->
                <div :class="isShowSubSideBar ? `col-9` : `col-12`">
                    <slot name="content" />
                </div>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { IBreadcrumb } from '@/modules/common/types';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import PageTitle from './main-content/PageTitle.vue';

@Options({
    components: { PageTitle },
})
export default class MainContent extends Vue {
    @Prop({ default: '' }) pageTitle!: string;
    @Prop({ default: () => ({}) }) breadcrumbs!: IBreadcrumb[];
    @Prop({ default: true }) isShowSubSideBar!: boolean;
}
</script>

<style lang="scss" scoped>
.page-content-custom {
    padding-bottom: 16px;
}
.layout-container {
    height: calc(100vh - 108px);
    padding-left: 10px;
    padding-right: 10px;
}
</style>
