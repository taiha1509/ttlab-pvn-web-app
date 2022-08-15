<template>
    <component :is="tag" v-bind="$attrs">
        <slot></slot>
        <template v-for="(_, slot) of $slots.default()" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
        </template>
    </component>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import DragAwareMixin from '../mixins/DragAwareMixin';
import { dnd } from '../ts/DnD';

@Options({})
export default class DropMask extends DragAwareMixin {
    isDropMask = true;

    @Prop({ default: 'div', type: [String, Object, Function] })
    tag: any;

    mounted() {
        const el = this.$el;
        el.addEventListener('easy-dnd-move', this.onMouseMove);
    }

    onMouseMove(e: any) {
        dnd.mouseMove(e, this);
    }

    createDragImage() {
        return 'source';
    }
}
</script>
