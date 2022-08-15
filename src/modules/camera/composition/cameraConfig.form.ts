import * as yup from 'yup';
import { reactive, ref } from '@vue/runtime-core';
import moment from 'moment';
import { useField, useForm } from 'vee-validate';
import { Encoding, Resolution, ScheduleRepeatType } from '../constants';
import { round } from '@/modules/common/helpers';
import { REGEX } from '@/modules/common/constants';

const recordingCameraConfigSchema = yup.object({
    resolution: yup.string().nullable(),
    encoding: yup.string().nullable(),
    hasAudio: yup.boolean(),
    gpsLocate: yup.boolean(),
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function initRecordingCameraConfigForm() {
    const initCamera = {
        resolution: null,
        encoding: null,
        hasAudio: true,
        gpsLocate: true,
    };

    const { validate, resetForm } = useForm({
        initialValues: initCamera,
        validationSchema: recordingCameraConfigSchema,
    });

    const resolution = useField<Resolution>('resolution');
    const encoding = useField<Encoding>('encoding');
    const hasAudio = useField<boolean>('hasAudio');
    const gpsLocate = useField<boolean>('gpsLocate');

    return {
        validate,
        resetForm,
        data: reactive({
            resolution: resolution.value,
            encoding: encoding.value,
            hasAudio: hasAudio.value,
            gpsLocate: gpsLocate.value,
        }),
        error: reactive({
            resolution: resolution.errorMessage,
            encoding: encoding.errorMessage,
            hasAudio: hasAudio.errorMessage,
            gpsLocate: gpsLocate.errorMessage,
        }),
    };
}

const scheduleFormSchema = yup.object({
    _id: yup.string().nullable(),
    startDate: yup.string().nullable().label('startDate'),
    endDate: yup.string().nullable().label('endDate'),
    timeRange: yup.object({
        start: yup
            .string()
            .required()
            .matches(REGEX.TIME_REGEX)
            .nullable()
            .label('startTime'),
        end: yup
            .string()
            .required()
            .matches(REGEX.TIME_REGEX)
            .nullable()
            .label('endTime'),
    }),
    repeatType: yup.string().required().label('repeatType'),
    repeatDays: yup.array().when('repeatType', {
        is: ScheduleRepeatType.CUSTOM,
        then: yup.array().of(yup.string()).min(1).required().label('repeatDay'),
        otherwise: yup.array().of(yup.string()).min(0).label('repeatDay'),
    }),
    recordAtServer: yup.boolean().required().label('recordAtServer'),
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function initScheduleRepetitionForm() {
    const initSchedule = {
        _id: null,
        startDate: moment().fmDayString(),
        endDate: '',
        timeRange: {
            start: round(moment(), moment.duration(15, 'minutes')),
            end: '',
        },
        repeatType: ScheduleRepeatType.ONCE,
        repeatDays: [],
        recordAtServer: true,
    };

    const { validate, resetForm, setErrors } = useForm({
        initialValues: initSchedule,
        validationSchema: scheduleFormSchema,
    });

    const resetData = () => {
        resetForm({ values: initSchedule });
    };

    const startDate = useField<string>(`startDate`);
    const endDate = useField<string>(`endDate`);
    const startTime = useField<string>(`timeRange.start`);
    const endTime = useField<string>(`timeRange.end`);
    const repeatType = useField<string>(`repeatType`);
    const repeatDays = useField<string[]>(`repeatDays`);
    const recordAtServer = useField<boolean>(`recordAtServer`);

    return {
        validate,
        resetData,
        setErrors,
        resetForm,
        data: reactive({
            startDate: startDate.value,
            endDate: endDate.value,
            startTime: startTime.value,
            endTime: endTime.value,
            repeatType: repeatType.value,
            repeatDays: repeatDays.value,
            recordAtServer: recordAtServer.value,
        }),
        error: ref({
            startDate: startDate.errorMessage,
            endDate: endDate.errorMessage,
            startTime: startTime.errorMessage,
            endTime: endTime.errorMessage,
            repeatType: repeatType.errorMessage,
            repeatDays: repeatDays.errorMessage,
            recordAtServer: recordAtServer.errorMessage,
        }),
    };
}
