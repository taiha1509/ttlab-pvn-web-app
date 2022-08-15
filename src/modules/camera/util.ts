import { ISelectOptions } from '../common/types';
import { ICameraGroup } from '../camera-group/types';

export function parseSelectOptions(options: ICameraGroup[]): ISelectOptions[] {
    return options.map((option: ICameraGroup) => ({
        label: option.name,
        value: option._id,
    }));
}
