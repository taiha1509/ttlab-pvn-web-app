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
                v-model="inputValue"
                :fetch-suggestions="querySearch"
                :placeholder="placeholder"
                :size="size"
                :maxlength="maxLength"
                :disabled="disabled"
                @select="onSelectItem"
                @focus="onScroll"
                popper-append-to-body="true"
            >
                <template #suffix>
                    <el-icon v-if="canClearItem" @click="onClearItem">
                        <CircleCloseIcon />
                    </el-icon>
                </template>
                <template #default="{ item }">
                    <div
                        :class="`is-${disabledTime(item)}`"
                        :id="`el-${item.split(':').join('')}`"
                    >
                        {{ item }}
                    </div>
                </template>
            </el-autocomplete>
            <div
                class="invalid-feedback text-start d-block"
                v-show="error"
                v-if="hasError"
            >
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { DATE_TIME_FORMAT, TEXT_MAX_LENGTH } from '@/modules/common/constants';
import { Model, Options, Prop, Vue } from 'vue-property-decorator';
import { CircleClose as CircleCloseIcon } from '@element-plus/icons-vue';
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';

@Options({
    components: {
        CircleCloseIcon,
    },
})
export default class AutoComplete extends Vue {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: true }) readonly clearable!: boolean;
    @Prop({ default: false }) readonly disabled!: string;
    @Prop({ default: 15 }) readonly timeStep!: number;
    @Prop({ default: 'default' }) readonly size!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: true }) readonly hasError!: boolean;
    @Prop({ default: TEXT_MAX_LENGTH }) readonly maxLength!: number;
    @Prop({ default: null }) readonly minTime!: string;
    @Prop({ default: null }) readonly maxTime!: string;
    @Prop({ default: '' }) readonly scrollComponent!: string;
    // index of component if there are multiple time picker in one form
    @Prop({ default: 0 }) readonly index!: number;

    @Model('value')
    inputValue!: string;

    queryString = '';

    get selectedItem(): string {
        const foundItem = this.cloneOptions.find((item) => item === this.inputValue);
        return foundItem || '';
    }

    get cloneOptions(): string[] {
        return cloneDeep(this.timesOptions);
    }

    get canClearItem(): boolean {
        return this.clearable && !!this.inputValue;
    }

    // func to return time options in format HH:mm from 00:00 to 23:xx depends on timeStep
    get timesOptions(): string[] {
        const times = []; // time array
        let startTime = 0; // start time

        for (let i = 0; startTime < 24 * 60; i++) {
            const hh = Math.floor(startTime / 60); // getting hours of day in 0-24 format
            const mm = startTime % 60;
            times[i] = ('0' + (hh % 24)).slice(-2) + ':' + ('0' + mm).slice(-2);
            startTime = startTime + this.timeStep;
        }
        return times;
    }

    id = '';

    mounted(): void {
        this.id = this.scrollComponent
            ? `scroll-wrap-${this.scrollComponent}-${+new Date()}`
            : `scroll-wrap-${+new Date()}`;
    }

    roundTime(time: string, minutesToRound: number): string {
        const hours = parseInt(time.split(':')[0]);
        const minutes = parseInt(time.split(':')[1]);

        // Convert hours and minutes to time in minutes
        const times = hours * 60 + minutes;

        const rounded = Math.round(times / minutesToRound) * minutesToRound;
        const rHr = '' + Math.floor(rounded / 60);
        const rMin = '' + (rounded % 60);

        return rHr.padStart(2, '0') + ':' + rMin.padStart(2, '0');
    }

    // TODO: improve later
    onScroll(): void {
        const scrollWraps = document.getElementsByClassName(
            'el-autocomplete-suggestion__wrap',
            // eslint-disable-next-line no-undef
        ) as HTMLCollectionOf<HTMLElement>;
        const scrollWrap = scrollWraps[this.index] as HTMLElement;
        scrollWrap.setAttribute('id', this.id);
        this.$nextTick(() => {
            setTimeout(() => {
                this.scrollToEnableTime();
            }, 300);
        });
    }

    scrollToEnableTime(): void {
        const index = this.minTime
            ? this.roundTime(this.minTime, 15).split(':').join('')
            : '0000';
        const ele = document.getElementById(`el-${index}`) as HTMLElement;
        const container = document.getElementById(this.id) as HTMLElement;
        if (ele && container) {
            container.style.scrollBehavior = 'smooth';
            container.scrollTop = ele?.offsetTop;
        }
    }

    disabledTime(option: string): boolean {
        return (
            moment(moment(this.minTime, DATE_TIME_FORMAT.HH_mm_COLON).toString()).isAfter(
                moment(option, DATE_TIME_FORMAT.HH_mm_COLON).toString(),
            ) ||
            moment(
                moment(this.maxTime, DATE_TIME_FORMAT.HH_mm_COLON).toString(),
            ).isBefore(moment(option, DATE_TIME_FORMAT.HH_mm_COLON).toString())
        );
    }

    querySearch(queryString: string, cb: CallableFunction): void {
        const queryStr = queryString.toLowerCase();
        const filteredOptions = this.cloneOptions.filter((option) => {
            const optionLabel = option.toLowerCase();
            return optionLabel.includes(queryStr);
        });
        cb(filteredOptions);
    }

    onSelectItem(item: string): void {
        if (!this.disabledTime(item)) this.inputValue = item;
    }

    onClearItem(): void {
        this.inputValue = '';
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
:deep .el-autocomplete {
    width: 100% !important;
}
.mark-required {
    color: #de2b2b;
}
.is-true {
    pointer-events: none !important;
    opacity: 0.4 !important;
}
:deep(.el-input__suffix) {
    .el-input__suffix-inner {
        align-items: center;
        .el-icon {
            cursor: pointer;
        }
    }
}
</style>
