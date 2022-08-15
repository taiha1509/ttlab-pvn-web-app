<template>
    <component
        :is="rootTag"
        v-bind="rootProps"
        v-on="rootListeners"
        :class="clazz"
        :style="style"
    >
        <template v-if="dropIn && dropAllowed">
            <template v-if="reordering">
                <template v-if="hasReorderingFeedback">
                    <slot
                        name="item"
                        v-for="item in itemsBeforeReorderingFeedback"
                        :item="item"
                    />
                    <slot name="reordering-feedback" :item="items[fromIndex]" />
                    <slot
                        name="item"
                        v-for="item in itemsAfterReorderingFeedback"
                        :item="item"
                    />
                </template>
                <template v-else>
                    <slot
                        name="item"
                        v-for="(item, index) in reorderedItems"
                        :item="item"
                        :reorder="index === closestIndex"
                    />
                </template>
            </template>
            <template v-else>
                <slot
                    name="item"
                    v-for="item in itemsBeforeFeedback"
                    :item="item"
                    :reorder="false"
                />
                <slot name="feedback" :data="dragData" :type="dragType" />
                <slot
                    name="item"
                    v-for="item in itemsAfterFeedback"
                    :item="item"
                    :reorder="false"
                />
            </template>
        </template>
        <template v-else>
            <slot name="item" v-for="item in items" :item="item" :reorder="false" />
        </template>
        <drag-feedback
            class="__feedback"
            v-if="showDragFeedback"
            ref="feedback"
            key="drag-feedback"
        >
            <slot name="feedback" :data="dragData" :type="dragType" />
        </drag-feedback>
        <div
            class="__drag-image"
            v-if="showInsertingDragImage"
            ref="drag-image"
            key="inserting-drag-image"
        >
            <slot name="drag-image" :type="dragType" :data="dragData" />
        </div>
        <div
            class="__drag-image"
            v-if="showReorderingDragImage"
            ref="drag-image"
            key="reordering-drag-image"
        >
            <slot name="reordering-drag-image" :item="items[fromIndex]" />
        </div>
        <div key="drop-list-content">
            <slot />
        </div>
    </component>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */

import { Prop } from 'vue-property-decorator';
import DropMixin from '../mixins/DropMixin';
import DragFeedback from './DragFeedback.vue';
import Grid from '../ts/Grid';
import { DnDEvent, InsertEvent, ReorderEvent } from '../ts/events';
import { createDragImage } from '../ts/createDragImage';
import { dnd } from '../ts/DnD';
import get from 'lodash/get';
import { Options } from 'vue-class-component';

@Options({
    components: { DragFeedback },
    inheritAttrs: false,
})
export default class DropList extends DropMixin {
    @Prop({ default: 'div', type: [String, Object, Function] })
    tag: any;

    @Prop()
    items!: any[];

    @Prop({ default: null })
    row!: boolean;

    @Prop({ default: null, type: Boolean })
    column!: boolean;

    @Prop({ default: false, type: Boolean })
    noAnimations!: boolean;

    grid: Grid | null = null;
    forbiddenKeys: any = [];
    feedbackKey = null;
    fromIndex: number | null = null;

    get rootTag() {
        if (this.noAnimations) {
            return this.tag ? this.tag : 'div';
        } else {
            return 'transition-group';
        }
    }

    get rootProps() {
        if (this.noAnimations) {
            return this.$attrs;
        } else {
            return {
                tag: this.tag,
                duration: { enter: 0, leave: 0 },
                css: false,
            };
        }
    }

    get rootListeners() {
        if (this.noAnimations) {
            return this.$attrs;
        } else {
            return {};
        }
    }

    created() {
        dnd.on('dragstart', this.onDragStart);
        dnd.on('dragend', this.onDragEnd);
    }

    get direction() {
        if (this.row) return 'row';
        if (this.column) return 'column';
        return 'auto';
    }

    destroyed() {
        dnd.off('dragstart', this.onDragStart);
        dnd.off('dragend', this.onDragEnd);
    }

    onDragStart(event: DnDEvent) {
        if (this.candidate(dnd.type, dnd.data, dnd.source)) {
            if (this.reordering) {
                this.fromIndex = Array.prototype.indexOf.call(
                    event.source?.$el.parentElement?.children,
                    event.source?.$el,
                );
                this.grid = this.computeReorderingGrid();
            } else {
                this.$nextTick(() => {
                    // Presence of feedback node in the DOM and of keys in the virtual DOM required => delayed until what
                    // depends on drag data has been processed.
                    this.grid = this.computeInsertingGrid();
                    this.feedbackKey = this.computeFeedbackKey() as any;
                    this.forbiddenKeys = this.computeForbiddenKeys() as any;
                });
            }
        }
    }

    onDragEnd() {
        this.fromIndex = null;
        this.feedbackKey = null;
        this.forbiddenKeys = null;
        this.grid = null;
    }

    get reordering() {
        if (dnd.inProgress) {
            console.log('this.$attrs', this.$attrs);

            return (
                dnd.source.$el.parentElement === this.$el &&
                this.$attrs?.hasOwnProperty('reorder')
            );
        } else {
            return null;
        }
    }

    get closestIndex() {
        if (this.grid && dnd.position) {
            return this.grid.closestIndex(dnd.position);
        } else {
            return null;
        }
    }

    get dropAllowed() {
        if (this.dragInProgress) {
            if (this.reordering) {
                return this.items.length > 1;
            } else {
                const superDropAllowed =
                    DropMixin.options.computed.dropAllowed.get.call(this);
                if (!superDropAllowed) {
                    return false;
                } else {
                    if (this.forbiddenKeys !== null && this.feedbackKey !== null) {
                        return !this.forbiddenKeys.includes(this.feedbackKey);
                    } else {
                        return null;
                    }
                }
            }
        } else {
            return null;
        }
    }

    get itemsBeforeFeedback() {
        if (this.closestIndex === 0) {
            return [];
        } else {
            return this.items.slice(0, this.closestIndex as number);
        }
    }

    get itemsAfterFeedback() {
        if (this.closestIndex === this.items.length) {
            return [];
        } else {
            return this.items.slice(this.closestIndex as number);
        }
    }

    get itemsBeforeReorderingFeedback() {
        if ((this.closestIndex as number) <= (this.fromIndex as number)) {
            return this.items.slice(0, this.closestIndex as number);
        } else {
            return this.items.slice(0, (this.closestIndex as number) + 1);
        }
    }

    get itemsAfterReorderingFeedback() {
        if ((this.closestIndex as number) <= (this.fromIndex as number)) {
            return this.items.slice(this.closestIndex as number);
        } else {
            return this.items.slice((this.closestIndex as number) + 1);
        }
    }

    get reorderedItems() {
        const toIndex = this.closestIndex;
        const reordered = [...this.items];
        const temp = reordered[this.fromIndex as number];
        reordered.splice(this.fromIndex as number, 1);
        reordered.splice(toIndex || 0, 0, temp);
        return reordered;
    }

    get clazz() {
        return {
            'drop-list': true,
            reordering: this.reordering === true,
            inserting: this.reordering === false,
            ...(this.reordering === false ? this.cssClasses : { 'dnd-drop': true }),
        };
    }

    get style() {
        return {
            ...(this.reordering === false ? this.cssStyle : {}),
        };
    }

    get showDragFeedback() {
        return this.dragInProgress && this.typeAllowed && !this.reordering;
    }

    get showInsertingDragImage() {
        console.log('showInsertingDragImage this.$slots', this.$slots);

        return (
            this.dragInProgress &&
            this.typeAllowed &&
            !this.reordering &&
            this.$slots?.hasOwnProperty('drag-image')
        );
    }

    get showReorderingDragImage() {
        console.log('showReorderingDragImage this.$slots', this.$slots);
        return (
            this.dragInProgress &&
            this.reordering &&
            this.$slots?.hasOwnProperty('reordering-drag-image')
        );
    }

    doDrop(event: DnDEvent) {
        if (this.reordering) {
            if (this.fromIndex !== (this.closestIndex as number)) {
                this.$emit(
                    'reorder',
                    new ReorderEvent(
                        this.fromIndex as number,
                        this.closestIndex as number,
                    ),
                );
            }
        } else {
            DropMixin.options.methods.doDrop.call(this, event);
            this.$emit(
                'insert',
                new InsertEvent(event.type, event.data, this.closestIndex as number),
            );
        }
    }

    candidate(type: any, data: any, source: any): boolean {
        const superCandidate = DropMixin.options.methods.candidate.call(this, [
            type,
            data,
            source,
        ]);
        console.log('candidate this.$attrs', this.$attrs);

        return (
            ((superCandidate as boolean) &&
                ((this.$attrs?.hasOwnProperty('insert') as boolean) ||
                    (this.$attrs?.hasOwnProperty('drop') as boolean))) ||
            (this.reordering as boolean)
        );
    }

    computeForbiddenKeys() {
        console.log('computeForbiddenKeys $refs', this.$refs);

        const vnodes: any = [];
        // const vnodes = this.noAnimations
        //   ? []
        //   : this.$refs[0]?.$vnode?.context?.$children[0].$slots.default;
        return (vnodes as any)
            .map((vn: any) => vn.key)
            .filter(
                (k: string | undefined) =>
                    k !== undefined && k !== 'drag-image' && k !== 'drag-feedback',
            );
    }

    computeFeedbackKey() {
        return get(this.$refs, 'feedback.$slots.default.0.key');
    }

    get hasReorderingFeedback() {
        console.log('hasReorderingFeedback $slots', this.$slots);

        return this.$slots?.hasOwnProperty('reordering-feedback');
    }

    computeInsertingGrid() {
        const feedbackParent = get(this.$refs, 'feedback.$el') as HTMLElement;
        const feedback = feedbackParent.children[0];
        if (!feedback) return null;
        const clone = feedback.cloneNode(true) as HTMLElement;
        const tg = this.$el as HTMLElement;
        if (tg.children.length > this.items.length) {
            tg.insertBefore(clone, tg.children[this.items.length]);
        } else {
            tg.appendChild(clone);
        }
        const grid = new Grid(tg.children, this.items.length, this.direction, null);
        tg.removeChild(clone);
        return grid;
    }

    computeReorderingGrid() {
        const tg = this.$el as HTMLElement;
        return new Grid(
            tg.children,
            this.items.length - 1,
            this.direction,
            this.fromIndex,
        );
    }

    createDragImage() {
        let image;
        if (this.$refs['drag-image']) {
            const el = this.$refs['drag-image'] as HTMLElement;
            let model;
            if (el.childElementCount !== 1) {
                model = el;
            } else {
                model = el.children.item(0);
            }
            const clone = model?.cloneNode(true) as HTMLElement;
            const tg = this.$el as HTMLElement;
            tg.appendChild(clone);
            image = createDragImage(clone);
            tg.removeChild(clone);
            (image as any).__opacity = this.dragImageOpacity;
        } else {
            image = 'source';
        }
        return image;
    }
}
</script>

<style scoped lang="scss">
.drop-list {
    &::v-deep > * {
        transition: transform 0.2s;
    }
}

.__feedback {
    display: none;
}

/* Places a drag image out of sight while keeping its computed styles accessibles. */
.__drag-image {
    position: fixed;
    top: -10000px;
    left: -10000px;
    will-change: left, top;
}

.drop-list:not(.drop-in) {
    &::v-deep .drag-source {
        // transition: none !important;
    }
}
</style>

<style lang="scss">
.drop-allowed.drop-in * {
    cursor: inherit !important;
}

.drop-forbidden.drop-in {
    &,
    * {
        cursor: no-drop !important;
    }
}
</style>
