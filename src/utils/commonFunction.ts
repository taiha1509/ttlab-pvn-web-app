import { IUserDetailReponse } from '@/modules/user/types';
import { intersection } from 'lodash';
import { appService } from './app';

export const capitalizeFirstLetter = (letter: string): string => {
    if (letter) {
        return letter.charAt(0).toUpperCase() + letter.slice(1);
    }
    return letter;
};

/**
 * remove accents and return it
 * example 'Nguyễn' => 'Nguyen'
 * @param str string
 * @returns string
 */
export function removeAccents(str: string): string {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

/**
 * check if str includes keyword ignore case sensitive and accents
 * example 'Nguyễn' includes 'uyen'
 * @param str string
 * @param keyword string
 * @returns boolean
 */
export function vietnameseStringInclude(str: string, keyword: string): boolean {
    return removeAccents(str.toLowerCase()).includes(
        removeAccents(keyword.toLowerCase()),
    );
}

export function hasPermissionToAccessRoute(requiredPermissions: string[]): boolean {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    const user = appService.getUser<IUserDetailReponse>();

    const resourceActionList: string[] = [];
    user.roles.forEach((role) => {
        role.permissions
            .filter((item) => item)
            .forEach((item) => {
                resourceActionList.push(
                    `${item.resource.content}_${item.action.content}`,
                );
            });
    });
    return intersection(resourceActionList, requiredPermissions).length > 0;
}
