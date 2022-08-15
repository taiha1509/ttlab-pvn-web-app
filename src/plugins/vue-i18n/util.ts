import camelCase from 'lodash/camelCase';
import { LocaleMessages, VueMessageType } from 'vue-i18n';
import langVi from 'element-plus/lib/locale/lang/vi';
import langEn from 'element-plus/lib/locale/lang/en';
import yupEn from '../yup/locale/en';
import yupVi from '../yup/locale/vi';

const Config = {
    vi: {
        extension: '.vi.ts',
        regex: /vi\.ts$/,
        code: 'vi',
    },
    en: {
        extension: '.en.ts',
        regex: /en\.ts$/,
        code: 'en',
    },
};

const parseLocale = (
    file: string,
    type = Config.vi.extension,
    obj: Record<string, Record<string, unknown>>,
) => {
    let filename = `${file}`.replace(/^.*[\\/]/, '');
    const arr = file.split('/');
    const tmp: Record<string, unknown> = {};
    if (arr.length > 1) {
        let moduleName = file.split('/')[1];
        filename = filename.replace(type, '');
        filename = camelCase(filename);
        moduleName = camelCase(moduleName);
        file = file.replace('./', '/');
        tmp[filename] = require('@/modules' + file);
        if (!obj[moduleName]) {
            obj[moduleName] = {};
        }
        obj[moduleName][filename] = (
            tmp[filename] as { default: Record<string, unknown> }
        ).default;
    }
};

const getViModuleFromCode = () => {
    const locale: LocaleMessages<VueMessageType> = {};
    const files = require.context('@/modules', true, /vi\.ts$/);
    if (files) {
        files.keys().forEach((file) => {
            parseLocale(file, Config.vi.extension, locale);
        });
    }
    locale.el = { ...langVi.el };
    locale.yup = yupVi;
    return locale;
};

const getEnModuleFromCode = () => {
    const locale: LocaleMessages<VueMessageType> = {};
    const files = require.context('@/modules', true, /en\.ts$/);
    if (files) {
        files.keys().forEach((file) => {
            parseLocale(file, Config.en.extension, locale);
        });
    }
    locale.el = { ...langEn.el };
    locale.yup = yupEn;
    return locale;
};

export const getLocaleFromModules = (): LocaleMessages<VueMessageType> => {
    const localeVi = getViModuleFromCode();
    const localeEn = getEnModuleFromCode();
    return {
        [Config.en.code]: localeEn,
        [Config.vi.code]: localeVi,
    };
};
