import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';
import { capitalizeFirstLetter } from './commonFunction';

const parseFile = (
    file: string,
    obj: Record<string, Record<string, unknown>>,
    type = '.vue',
) => {
    let filename = `${file}`.replace(/^.*[\\/]/, '');
    const arr = file.split('/');
    arr.shift();
    const tmp: Record<string, unknown> = {};
    if (arr.length > 1) {
        let componentName = arr.join('').replace('.vue', '');
        componentName = capitalizeFirstLetter(camelCase(componentName));
        filename = filename.replace(type, '');
        filename = startCase(camelCase(filename));
        file = file.replace('./', '/');
        tmp[filename] = require('@/components' + file);
        obj[componentName] = (
            tmp[filename] as { default: Record<string, unknown> }
        ).default;
    }
};

// function to get base component
export const getGlobalComponents = (): Record<string, unknown> => {
    const files = require.context('@/components', true, /.vue$/);
    const components: Record<string, Record<string, unknown>> = {};
    if (files) {
        files.keys().forEach((file) => {
            parseFile(file, components);
        });
    }

    return components;
};
