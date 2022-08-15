/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop } from 'vue-property-decorator';
import DragAwareMixin from './DragAwareMixin';
import { createDragImage } from '../ts/createDragImage';
import { DnDEvent } from '../ts/events';
import { dnd } from '../ts/DnD';
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class DropMixin extends DragAwareMixin {
    isDrop = true;

    @Prop({ default: () => () => true, type: [String, Array, Function] })
    acceptsType!: string | string[] | { (type: any): boolean };

    @Prop({ default: () => true, type: Function })
    acceptsData!: { (data: any, type: string): boolean };

    @Prop({ default: 'pointer' })
    cursor?: string;

    @Prop({ default: 'copy' })
    mode!: string;

    @Prop({ default: 0.7, type: Number })
    dragImageOpacity: any;

    static options: any;

    constructor() {
        super({});
    }

    effectiveAcceptsType(type: string) {
        if (this.acceptsType === null) return true;
        else if (typeof this.acceptsType === 'string') return this.acceptsType === type;
        else if (
            typeof this.acceptsType === 'object' &&
            Array.isArray(this.acceptsType)
        ) {
            return this.acceptsType.includes(type);
        } else {
            return this.acceptsType(type);
        }
    }

    effectiveAcceptsData(data: any, type: any) {
        return this.acceptsData(data, type);
    }

    created() {
        dnd.on('dragpositionchanged', this.onDragPositionChanged);
        dnd.on('dragtopchanged', this.onDragTopChanged);
        dnd.on('drop', this.onDrop);
    }

    destroyed() {
        dnd.off('dragpositionchanged', this.onDragPositionChanged);
        dnd.off('dragtopchanged', this.onDragTopChanged);
        dnd.off('drop', this.onDrop);
    }

    onDragPositionChanged(event: DnDEvent) {
        if (this === event.top) {
            this.$emit('dragover', event);
        }
    }

    onDragTopChanged(event: DnDEvent) {
        if (this === event.top) {
            this.$emit('dragenter', event);
        }
        if (this === event.previousTop) {
            this.$emit('dragleave', event);
        }
    }

    onDrop(event: DnDEvent) {
        if (this.dropIn && this.compatibleMode && this.dropAllowed) {
            this.doDrop(event);
        }
    }

    doDrop(event: any) {
        this.$emit('drop', event);
        event.source.$emit(this.mode, event);
    }

    mounted() {
        const el = this.$el;
        el.addEventListener('easy-dnd-move', this.onMouseMove);
    }

    onMouseMove(e: Event) {
        dnd.mouseMove(e, this);
    }

    get compatibleMode() {
        if (this.dragInProgress) {
            return this.mode === 'copy' || dnd.sourceListeners?.hasOwnProperty(this.mode);
        } else {
            return null;
        }
    }

    get dropIn() {
        if (this.dragInProgress) {
            return this.dragTop === this;
        } else {
            return null;
        }
    }

    get typeAllowed() {
        if (this.dragInProgress) {
            return this.effectiveAcceptsType(this.dragType);
        } else {
            return null;
        }
    }

    get dropAllowed() {
        if (this.dragInProgress) {
            if (this.typeAllowed) {
                return (
                    this.compatibleMode &&
                    this.effectiveAcceptsData(this.dragData, this.dragType)
                );
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    get cssClasses() {
        let clazz = {
            'dnd-drop': true,
        } as any;
        if (this.dropIn !== null) {
            clazz = {
                ...clazz,
                'drop-in': this.dropIn,
                'drop-out': !this.dropIn,
            };
        }
        if (this.typeAllowed !== null) {
            clazz = {
                ...clazz,
                'type-allowed': this.typeAllowed,
                'type-forbidden': !this.typeAllowed,
            };
        }
        if (this.dropAllowed !== null) {
            clazz = {
                ...clazz,
                'drop-allowed': this.dropAllowed,
                'drop-forbidden': !this.dropAllowed,
            };
        }
        return clazz;
    }

    get cssStyle() {
        return {};
    }

    /**
     * Returns true if the current drop area participates in the current drag operation.
     */
    candidate(type: any, data: any, source: Vue) {
        return this.effectiveAcceptsType(type);
    }

    createDragImage() {
        let image: any;
        if (this.$refs['drag-image']) {
            const el = this.$refs['drag-image'] as HTMLElement;
            if (el.childElementCount !== 1) {
                image = createDragImage(el);
            } else {
                image = createDragImage(el.children.item(0) as HTMLElement);
            }
            image.__opacity = this.dragImageOpacity;
        } else {
            image = 'source';
        }
        return image;
    }
}
