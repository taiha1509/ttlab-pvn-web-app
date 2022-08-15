export enum Resolution {
    R_1080 = '1080p',
    R_720 = '720p',
    R_480 = '480p',
}

export enum Encoding {
    NONE = 'none',
    AES_256 = 'aes_256',
    AES_128 = 'aes_128',
}

export enum ConnectionStatus {
    ONLINE = 'online',
    OFFLINE = 'offline',
}

export const DEFAULT_SCHEDULE_TIME_SEPARATION = 15;

export enum Weekday {
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday',
    SUNDAY = 'sunday',
}

export const WEEKDAY_INDEX = {
    [Weekday.MONDAY]: 1,
    [Weekday.TUESDAY]: 2,
    [Weekday.WEDNESDAY]: 3,
    [Weekday.THURSDAY]: 4,
    [Weekday.FRIDAY]: 5,
    [Weekday.SATURDAY]: 6,
    [Weekday.SUNDAY]: 0,
};

export enum ScheduleRepeatType {
    ONCE = 'once',
    DAILY = 'daily',
    WEEKEND = 'weekend',
    WORKDAY = 'workday',
    CUSTOM = 'custom',
}

export const weekdaysByRepeatType = {
    [ScheduleRepeatType.DAILY]: [
        Weekday.MONDAY,
        Weekday.TUESDAY,
        Weekday.WEDNESDAY,
        Weekday.THURSDAY,
        Weekday.FRIDAY,
        Weekday.SATURDAY,
        Weekday.SUNDAY,
    ],
    [ScheduleRepeatType.WORKDAY]: [
        Weekday.MONDAY,
        Weekday.TUESDAY,
        Weekday.WEDNESDAY,
        Weekday.THURSDAY,
        Weekday.FRIDAY,
    ],
    [ScheduleRepeatType.WEEKEND]: [Weekday.SATURDAY, Weekday.SUNDAY],
    [ScheduleRepeatType.ONCE]: [],
};

export const SECONDS_BETWEEN_SCHEDULES = 300; // 5 minutes by seconds

export enum ConnectionType {
    P2P = 'P2P',
    ONVIF = 'ONVIF',
}

export enum ConfigurationAttribute {
    DO_NOT_DISTURB = 'do_not_disturb',
    DISPLAY_TIMESTAMP = 'display_timestamp',
    NIGHT_VISION = 'night_vision',
    MOTION_DETECTION = 'motion_detection',
    MOTION_ZONE = 'motion_zone',
    SOUND = 'sound',
    EMERGENCY_CALL = 'emergency_call',
    CONTROL_PAN = 'control_pan',
    CONTROL_TILT = 'control_tilt',
    CONTROL_ZOOM = 'control_zoom',
    ONVIF_CONNECTION = 'onvif_connection',
    HAS_MEMORY_CARD = 'has_memory_card',
}

export enum POPUP_NAME {
    UPDATE_FORM_POPUP = 'updateFormPopup',
    CREATE_FORM_POPUP = 'createFormPopup',
    DETAIL_FORM_POPUP = 'detailFormPopup',
    RECORDING_CONFIGURATION_POPUP = 'recordingConfigurationPopup',
    SCHEDULE_LIST_CONFIGURATION_POPUP = 'scheduleListConfigruationPopup',
    SCHEDULE_FORM_CONFIGURATION_POPUP = 'scheduleFormConfigruationPopup',
}
