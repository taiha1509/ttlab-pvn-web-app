import { capitalizeFirstLetter } from '@/utils/commonFunction';
import { MessageContext, MessageFunctionCallable } from '@intlify/runtime';

export default {
    mixed: {
        required: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return capitalizeFirstLetter(`${fieldName}`) + ` là trường bắt buộc.`;
        }) as MessageFunctionCallable,
        default: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} không hợp lệ.`;
        }) as MessageFunctionCallable,
        selectRequired: `Đây là trường bắt buộc`,
        oneOf: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return capitalizeFirstLetter(`${fieldName}`) + ` là trường bắt buộc.`;
        }) as MessageFunctionCallable,
        notOneOf: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải là giá trị ngoại trừ: ${ctx.named(
                'values',
            )}.`;
        }) as MessageFunctionCallable,
        defined: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải được định nghĩa.`;
        }) as MessageFunctionCallable,
    },

    string: {
        length: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải đúng ${ctx.named('length')} ký tự.`;
        }) as MessageFunctionCallable,
        min: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải ít nhất ${ctx.named('length')} ký tự.`;
        }) as MessageFunctionCallable,
        max: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải nhiều nhất ${ctx.named('length')} ký tự.`;
        }) as MessageFunctionCallable,
        matches: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} không hợp lệ.`;
        }) as MessageFunctionCallable,
        email: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải đúng định dạng email.`;
        }) as MessageFunctionCallable,
        url: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return capitalizeFirstLetter(`${fieldName}`) + ` đúng định dạng url.`;
        }) as MessageFunctionCallable,
        uuid: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return capitalizeFirstLetter(`${fieldName}`) + ` đúng địng dạng UUID.`;
        }) as MessageFunctionCallable,
        trim: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải được cắt chuỗi.`;
        }) as MessageFunctionCallable,
        lowercase: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải là chữ thường.`;
        }) as MessageFunctionCallable,
        uppercase: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải là chữ hoa.`;
        }) as MessageFunctionCallable,
    },

    number: {
        min: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải có ít nhất ${ctx.named('min')} ký tự.`;
        }) as MessageFunctionCallable,
        max: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} chỉ được có nhiều nhất ${ctx.named(
                'max',
            )} ký tự.`;
        }) as MessageFunctionCallable,
        lessThan: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải ít hơn ${ctx.named('less')}.`;
        }) as MessageFunctionCallable,
        moreThan: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải lớn hơn ${ctx.named('more')}.`;
        }) as MessageFunctionCallable,
        positive: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải là số  dương.`;
        }) as MessageFunctionCallable,
        negative: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải là số âm.`;
        }) as MessageFunctionCallable,
        integer: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải là số nguyên.`;
        }) as MessageFunctionCallable,
    },

    date: {
        max: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải nhỏ hơn ngày ${ctx.named('max')}.`;
        }) as MessageFunctionCallable,
        min: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải lớn hơn ngày ${ctx.named('min')}.`;
        }) as MessageFunctionCallable,
    },

    boolean: {
        isValue: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải có giá trị là ${ctx.named('value')}.`;
        }) as MessageFunctionCallable,
    },

    array: {
        min: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải có ít nhất ${ctx.named('min')} phần tử.`;
        }) as MessageFunctionCallable,
        max: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải ít hơn hoặc bằng ${ctx.named(
                'max',
            )} phần tử.`;
        }) as MessageFunctionCallable,
        length: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải có ${ctx.named('length')} phần tử.`;
        }) as MessageFunctionCallable,
    },

    object: {
        noUnknown: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `Trường ${fieldName} phải có khóa: ${ctx.named('unknown')}.`;
        }) as MessageFunctionCallable,
    },
};
