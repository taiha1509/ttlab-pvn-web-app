<template>
    <div class="row">
        <div class="col-sm-12">
            <div class="page-title-box" style="height: 64px">
                <div class="row">
                    <!--start breadcrumb -->
                    <div class="col align-self-center">
                        <h4 class="page-title">{{ pageTitle }}</h4>
                        <ol class="breadcrumb">
                            <li
                                class="breadcrumb-item"
                                v-for="(item, index) in breadcrumbs"
                                :key="index"
                                :class="{ active: item.isActive }"
                            >
                                <a
                                    @click="goToLink(item.to)"
                                    :class="{ 'cursor-pointer': item.to }"
                                >
                                    {{ item.title }}
                                </a>
                            </li>
                        </ol>
                    </div>
                    <!--end breadcrumb -->
                    <!-- start-title-top-right -->
                    <div class="col-auto align-self-center">
                        <slot name="title-top-right"> </slot>
                    </div>
                    <!-- stop-title-top-right -->
                </div>
                <!--end row-->
            </div>
            <!--end page-title-box-->
        </div>
        <!--end col-->
    </div>
</template>

<script lang="ts">
import { IBreadcrumb } from '@/modules/common/types';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({})
export default class PageTitle extends Vue {
    @Prop({ default: '' }) pageTitle!: string;
    @Prop({ default: () => ({}) }) breadcrumbs!: IBreadcrumb[];

    goToLink(to: string): void {
        if (to) {
            this.$router.push(to);
        }
    }
}
</script>

<style lang="scss" scoped>
.breadcrumb-item.active a {
    color: #7081b9;
}
.cursor-pointer {
    cursor: pointer;
}
.page-title-box {
    display: block !important;
}
</style>
