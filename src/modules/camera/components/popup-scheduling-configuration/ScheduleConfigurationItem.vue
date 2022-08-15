<template>
    <div class="schedule-configuration-item">
        <CalendarIcon class="calendar-icon" />
        <div class="schedule-date-content">
            <div class="schedule-date-time">
                <span class="start__date">{{ startDate }}</span>
                <span class="start__time">{{ startTime }}</span>
                <span class="dash">–</span>
                <span class="end__time">{{ endTime }}</span>
                <span class="end__date">{{ endDate }}</span>
            </div>
            <div>{{ $t('camera.cameraConfig.schedule.repeatOn') }}: {{ weekday }}</div>
        </div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Options, Prop, Vue } from 'vue-property-decorator';
import { Calendar as CalendarIcon } from '@element-plus/icons-vue';
import { IScheduleConfiguration } from '../../types';
import moment from 'moment';
import { ScheduleRepeatType, Weekday, weekdaysByRepeatType } from '../../constants';
import { DATE_TIME_FORMAT } from '@/modules/common/constants';

@Options({ components: { CalendarIcon } })
export default class ScheduleConfigurationItem extends Vue {
    @Prop({ default: () => ({}) }) scheduleConfiguration!: IScheduleConfiguration;

    get startDate(): string {
        return moment(this.scheduleConfiguration.initStartAt).format(
            DATE_TIME_FORMAT.DD_MM_YYYY_SLASH,
        );
    }

    get startTime(): string {
        return moment(this.scheduleConfiguration.initStartAt).fmHM();
    }

    get endDate(): string {
        return moment(this.scheduleConfiguration.repeatEndDate).format(
            DATE_TIME_FORMAT.DD_MM_YYYY_SLASH,
        );
    }

    get endTime(): string {
        return moment(this.scheduleConfiguration.initEndAt).fmHM();
    }

    get weekday(): string {
        if (!this.scheduleConfiguration.repeatType) return '';
        switch (this.scheduleConfiguration.repeatType) {
            case ScheduleRepeatType.ONCE:
                return this.$t('camera.cameraConfig.repeatType.once');
            case ScheduleRepeatType.CUSTOM: {
                const { repeatDays } = this.scheduleConfiguration;
                return this.getWeekDayByLocale(repeatDays);
            }
            default: {
                const weekdays =
                    weekdaysByRepeatType[this.scheduleConfiguration.repeatType];
                return this.getWeekDayByLocale(weekdays);
            }
        }
    }

    getWeekDayByLocale(weekdays?: Weekday[]): string {
        if (!weekdays?.length) return '';
        const localeWeekday = weekdays.map((wday) =>
            this.$t(`camera.cameraConfig.shortWeekday.${wday}`),
        );
        return localeWeekday.join(', ');
    }
}
</script>

<style lang="scss" scoped>
.schedule-configuration-item {
    display: flex;
}
.calendar-icon {
    width: 24px;
    height: 24px;
    margin-right: 16px;
}
.schedule-date-time {
    font-size: 16px;
    font-weight: 500;
}
.start,
.end {
    &__time {
        padding: 0 12px;
        font-weight: 600;
    }
}
</style>
