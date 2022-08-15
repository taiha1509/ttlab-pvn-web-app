<template>
    <div class="base-custom-filter-form" ref="filter" id="base-filter-form">
        <div class="filter-content">
            <div class="filter-action mb-2">
                <div class="d-flex justify-content-flex-start">
                    <slot name="filter-title" />
                </div>
            </div>
        </div>
        <div class="filter-slot">
            <slot />
        </div>
        <div class="d-flex justify-content-center">
            <el-button size="small" v-if="isShowSearchButton" @click="handleFilter">
                {{ $t('common.app.filterForm.search') }}
            </el-button>
            <el-button
                size="small"
                style="margin-left: 16px"
                v-if="isShowCreateButton"
                type="primary"
                @click="onClickCreateButton"
            >
                {{ $t('common.app.buttons.create') }}
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Prop, Vue } from 'vue-property-decorator';
import { Search, CirclePlus } from '@element-plus/icons-vue';

@Options({
    components: { Search, CirclePlus },
})
export default class FilterForm extends Vue {
    @Prop({ default: true }) readonly isShowSearchButton!: boolean;
    @Prop({ default: true }) readonly isShowCreateButton!: boolean;

    handleFilter(): void {
        this.$emit('search');
    }

    onClickCreateButton(): void {
        this.$emit('create');
    }
}
</script>

<style scoped lang="scss">
.button-action {
    margin-left: auto;
}
:deep .filter-title {
    font-size: 15px;
    margin: 0;
    color: #303e67;
    font-weight: 500;
    line-height: 18px;
}
.filter-slot {
    margin-right: 0px !important;
}
.base-custom-filter-form {
    text-align: left;
    background-color: white;
    top: 121px;
    z-index: map-get($map: $zIndex, $key: input);
    width: 100%;
}
.create-button {
    @media (max-width: 575px) {
        padding-top: 10px;
    }
}
.search-col {
    padding: 0 10px 10px 0;
}
.button-action {
    border: 0;
    justify-items: center;
    padding-top: 0;
    padding-right: 16px;
}
.search-icon {
    width: 3em;
    height: 3em;
}
</style>
