/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue } from 'vue-class-component';
import mitt from 'mitt';
import { reactive } from 'vue';

/**
 * This is the class of the global object that holds the state of the drag and drop during its progress. It emits events
 * reporting its state evolution during the progress of the drag and drop. Its data is reactive and listeners can be
 * attachted to it using the method on.
 */

interface IPosition {
    x: number;
    y: number;
}
export class DnD {
    public inProgress = false;
    public type: any = null;
    public data: any = null;
    public source: Vue | any = null;
    public top: Vue | any = null;
    public position: IPosition | null = null;
    private eventBus = mitt();
    public sourceListeners: any = null;
    public success = false;

    public startDrag(
        source: Vue,
        event: MouseEvent | TouchEvent,
        x: number,
        y: number,
        type: any,
        data: any,
    ) {
        this.type = type;
        this.data = data;
        this.source = source;
        this.position = {
            x,
            y,
        };
        this.top = null;
        this.sourceListeners = source.$attrs;
        this.inProgress = true;
        this.emit(event, 'dragstart');
        this.emit(event, 'dragtopchanged', { previousTop: null });
    }

    public stopDrag(event: MouseEvent | TouchEvent) {
        this.success =
            this.top !== null && this.top.compatibleMode && this.top.dropAllowed;
        if (this.top !== null) {
            this.emit(event, 'drop');
        }
        this.emit(event, 'dragend');
        this.inProgress = false;
        this.data = null;
        this.source = null;
        this.position = null;
        this.success = false;
    }

    public mouseMove(event: any, comp: Vue | any) {
        if (this.inProgress) {
            let prevent = false;
            const previousTop = this.top;
            if (comp === null) {
                // The mouse move event reached the top of the document without hitting a drop component.
                this.top = null;
                prevent = true;
            } else if (comp.isDropMask) {
                // The mouse move event bubbled until it reached a drop mask.
                this.top = null;
                prevent = true;
            } else if (comp.candidate(this.type, this.data, this.source)) {
                // The mouse move event bubbled until it reached a drop component that participates in the current drag operation.
                this.top = comp;
                prevent = true;
            }
            if (prevent) {
                // We prevent the mouse move event from bubbling further up the tree because it reached the foremost drop component and that component is all that matters.
                event.stopPropagation();
            }
            if (this.top !== previousTop) {
                this.emit(event.detail.native, 'dragtopchanged', {
                    previousTop: previousTop,
                });
            }
            this.position = {
                x: event.detail.x,
                y: event.detail.y,
            };
            this.emit(event.detail.native, 'dragpositionchanged');
        }
    }

    private emit(native: any, event: any, data?: any) {
        this.eventBus.emit(event, {
            type: this.type,
            data: this.data,
            top: this.top,
            source: this.source,
            position: this.position,
            success: this.success,
            native,
            ...data,
        });
    }

    public on(event: string, callback: Function) {
        this.eventBus.on(event as any, callback as any);
    }

    public off(event: string, callback: Function) {
        this.eventBus.off(event as any, callback as any);
    }
}

export let dnd = new DnD();
dnd = reactive(dnd) as any;
