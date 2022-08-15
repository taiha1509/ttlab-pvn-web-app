import { capitalizeFirstLetter } from '@/utils/commonFunction';
import { MessageContext, MessageFunctionCallable } from '@intlify/runtime';

export default {
    mixed: {
        required: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `The ${fieldName} field is required.`;
        }) as MessageFunctionCallable,
        default: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} field is invalid.`;
        }) as MessageFunctionCallable,
        selectRequired: `This field is required`,
        oneOf: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} field is required.`;
        }) as MessageFunctionCallable,
        notOneOf: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} must not be one of the following values: ${ctx.named(
                'values',
            )}.`;
        }) as MessageFunctionCallable,
        defined: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} must be defined.`;
        }) as MessageFunctionCallable,
    },

    string: {
        length: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} must be exactly ${ctx.named('length')} characters.`;
        }) as MessageFunctionCallable,
        min: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} must be more than ${ctx.named('length')} characters`;
        }) as MessageFunctionCallable,
        max: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} must be less than ${ctx.named('length')} characters`;
        }) as MessageFunctionCallable,
        matches: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} must be correct format.`;
        }) as MessageFunctionCallable,
        email: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} field must be a valid email.`;
        }) as MessageFunctionCallable,
        url: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return capitalizeFirstLetter(`${fieldName}`) + ` must be a valid URL.`;
        }) as MessageFunctionCallable,
        uuid: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return capitalizeFirstLetter(`${fieldName}`) + ` must be a valid UUID.`;
        }) as MessageFunctionCallable,
        trim: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} must be a trimmed string.`;
        }) as MessageFunctionCallable,
        lowercase: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} must be a lowercase string.`;
        }) as MessageFunctionCallable,
        uppercase: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} must be a uppercase string.`;
        }) as MessageFunctionCallable,
    },

    number: {
        min: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} field must be at least ${ctx.named('min')} characters.`;
        }) as MessageFunctionCallable,
        max: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} field must be at most ${ctx.named('max')} characters.`;
        }) as MessageFunctionCallable,
        lessThan: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} must be less than ${ctx.named('less')}.`;
        }) as MessageFunctionCallable,
        moreThan: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} must be greater than ${ctx.named('more')}.`;
        }) as MessageFunctionCallable,
        positive: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} must be a positive number.`;
        }) as MessageFunctionCallable,
        negative: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} must be a negative number.`;
        }) as MessageFunctionCallable,
        integer: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} must be an integer.`;
        }) as MessageFunctionCallable,
    },

    date: {
        max: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} field must be at most ${ctx.named('max')}.`;
        }) as MessageFunctionCallable,
        min: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} field must be at least ${ctx.named('min')}.`;
        }) as MessageFunctionCallable,
    },

    boolean: {
        isValue: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} field must be ${ctx.named('value')}.`;
        }) as MessageFunctionCallable,
    },

    array: {
        min: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} field must have at least ${ctx.named('min')} items.`;
        }) as MessageFunctionCallable,
        max: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} field must have less than or equal to ${ctx.named(
                'max',
            )} items.`;
        }) as MessageFunctionCallable,
        length: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} field must have ${ctx.named('length')} items.`;
        }) as MessageFunctionCallable,
    },

    object: {
        noUnknown: ((ctx: MessageContext) => {
            const fieldName = ctx.linked(`common.app.fields.${ctx.named('path')}`);
            return `${fieldName} field has unspecified keys: ${ctx.named('unknown')}.`;
        }) as MessageFunctionCallable,
    },
};
