<template>
    <div class="vms-form-item" :class="{ 'flex-column': !isHorizontal }">
        <label
            v-if="label"
            class="vms-form-label"
            :class="{
                'w-100 mb-2': !isHorizontal,
                'w-25 pt-2': isHorizontal,
            }"
        >
            {{ label }}
            <span v-if="isRequired" class="mark-required">*</span></label
        >
        <div
            class="vms-form-content"
            :class="{ 'w-100': !isHorizontal, 'w-75': isHorizontal }"
        >
            <el-autocomplete
                v-model="queryString"
                :fetch-suggestions="querySearch"
                :placeholder="placeholder"
                :size="size"
                :maxlength="maxLength"
                :disabled="disabled"
                @select="onSelectItem"
                @change="onChangeInput"
                @focus="onFocus"
                @blur="onBlur"
            >
                <template #suffix>
                    <el-icon v-if="canClearItem" @click="onClearItem">
                        <CircleCloseIcon />
                    </el-icon>
                    <el-icon
                        v-if="!canClearItem"
                        :class="{ 'on-focus': isFocusing, 'on-blur': !isFocusing }"
                    >
                        <ArrowDown />
                    </el-icon>
                </template>
                <template #default="{ item }">
                    <div :style="optionStyle">{{ item[itemText] }}</div>
                </template>
            </el-autocomplete>
            <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    DEFAULT_PADDING_DROPDOWN_ITEM,
    TEXT_MAX_LENGTH,
} from '@/modules/common/constants';
import { Model, Options, Prop, Vue, Watch } from 'vue-property-decorator';
import { CircleClose as CircleCloseIcon, ArrowDown } from '@element-plus/icons-vue';
import cloneDeep from 'lodash/cloneDeep';

interface ItemObject {
    [key: string]: string | number;
}

@Options({
    components: {
        CircleCloseIcon,
        ArrowDown,
    },
})
export default class AutoComplete extends Vue {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: () => [] }) readonly options!: ItemObject[];
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: true }) readonly clearable!: boolean;
    @Prop({ default: false }) readonly disabled!: string;
    @Prop({ default: 'default' }) readonly size!: string;
    @Prop({ default: 'label' }) readonly itemText!: string;
    @Prop({ default: 'value' }) readonly itemValue!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: TEXT_MAX_LENGTH }) readonly maxLength!: number;

    @Model('value')
    inputValue!: string | number;

    queryString = '';

    optionStyle: Record<string, string> = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: 'auto',
    };

    get selectedItem(): ItemObject {
        const foundItem = this.cloneOptions.find(
            (item) => item[this.itemValue] === this.inputValue,
        );
        return foundItem || {};
    }

    get cloneOptions(): ItemObject[] {
        return cloneDeep(this.options);
    }

    get canClearItem(): boolean {
        return this.clearable && !!this.inputValue;
    }

    querySearch(queryString: string, cb: CallableFunction): void {
        const queryStr = queryString.toLowerCase();
        const filteredOptions = this.cloneOptions.filter((option) => {
            const optionLabel = option[this.itemText]?.toString().toLowerCase();
            return optionLabel.includes(queryStr);
        });
        cb(filteredOptions);
    }

    onSelectItem(item: ItemObject): void {
        this.inputValue = item[this.itemValue];
        this.queryString = item[this.itemText] as string;
    }

    onClearItem(): void {
        this.inputValue = '';
        this.queryString = '';
    }

    // triggers when the icon inside Input value change
    onChangeInput(): void {
        if (!this.queryString) {
            this.inputValue = '';
            return;
        }
        if (this.inputValue) {
            this.queryString = (this.selectedItem[this.itemText] || '') as string;
        } else {
            this.queryString = '';
        }
    }

    mounted(): void {
        window.addEventListener('resize', this.onFocus);
    }

    unmounted(): void {
        window.removeEventListener('resize', this.onFocus);
    }

    // TODO: wait element-plus to fix skaking when first time open error
    onFocus(): void {
        const clientWidth = this.$el?.clientWidth;
        this.$nextTick(() => {
            this.optionStyle = {
                ...this.optionStyle,
                maxWidth: `${clientWidth - DEFAULT_PADDING_DROPDOWN_ITEM}px`,
            };
        });
        this.isFocusing = true;
    }

    isFocusing = false;

    onBlur(): void {
        this.isFocusing = false;
    }

    @Watch('inputValue', { immediate: true })
    onChangeInputValue(value: string): void {
        if (value && value === this.selectedItem[this.itemValue] && !this.queryString) {
            this.queryString = (this.selectedItem[this.itemText] || '') as string;
        }
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
:deep(.el-autocomplete) {
    width: 100% !important;
}
.mark-required {
    color: #de2b2b;
}
:deep(.el-input__suffix) {
    .el-input__suffix-inner {
        align-items: center;
        .el-icon {
            cursor: pointer;
        }
    }
}
:deep(.el-input__suffix) {
    right: 10px;
}
.on-focus {
    transform: rotate(-180deg);
    transition: transform 300ms;
    transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}
.on-blur {
    transition: transform 300ms;
    transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}
</style>
