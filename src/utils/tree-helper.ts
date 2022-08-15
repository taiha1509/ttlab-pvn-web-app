import { ITreeNode } from '@/modules/common/types';
import { vietnameseStringInclude } from './commonFunction';

/**
 *
 * @param node current node
 * @param keyword keyword to filter
 * @returns boolean
 * check if current node or any it's children have name contain that keyword
 */
export function childContainKeyword<T extends ITreeNode>(
    node: T,
    keyword: string,
): boolean {
    if (vietnameseStringInclude(node.name, keyword)) return true;
    if ((node.children as ITreeNode[]).length === 0) {
        return false;
    }

    let flag = false;
    for (const temp of node.children as ITreeNode[]) {
        if (childContainKeyword(temp, keyword)) {
            flag = true;
            break;
        }
    }

    return flag;
}

/**
 * prune tree by keyword
 * @param tree node must be cut children
 * @param keyword keyword
 * @returns void
 */
export function pruneTree<T extends ITreeNode>(tree: T, keyword: string): void {
    if (!childContainKeyword(tree, keyword)) {
        for (const member in tree) delete tree[member];
        return;
    }
    const pointer = tree?.children;
    if (!pointer || pointer?.length === 0) {
        return;
    }

    tree.children = pointer.filter((item) => childContainKeyword(item, keyword));

    for (const node of pointer) {
        pruneTree(node, keyword);
    }
}
