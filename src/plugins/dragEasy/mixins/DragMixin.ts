/* eslint-disable no-undef */
/* eslint-disable getter-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prop } from 'vue-property-decorator';
import DragAwareMixin from './DragAwareMixin';
import { createDragImage } from '../ts/createDragImage';
import { dnd } from '../ts/DnD';
import { Options } from 'vue-class-component';

@Options({})
export default class DragMixin extends DragAwareMixin {
    isDrag = true;

    @Prop({ default: '' })
    type!: string;

    @Prop({ default: null })
    data: any;

    @Prop({ default: 0.7, type: Number })
    dragImageOpacity: any;

    @Prop({ default: false, type: Boolean })
    disabled!: boolean;

    @Prop({ default: false, type: Boolean })
    goBack!: boolean;

    @Prop({ required: false, type: String })
    handle: string | undefined;

    @Prop({ type: Number, default: 3 })
    delta!: number;

    @Prop({ default: 0 })
    parentId!: string;

    mouseIn = false;

    created() {
        this.reEmit('dragstart');
        this.reEmit('dragend');
    }

    reEmit(eventName: string) {
        dnd.on(eventName, (ev: any) => {
            const sourceId = ev.data?.sourceId;
            if (
                (sourceId && this.parentId && this.parentId === sourceId) ||
                ev.source === this
            ) {
                this.$emit(eventName, ev);
            }
        });
    }

    downEvent: TouchEvent | MouseEvent | any = null;
    dragStarted = false;
    initialUserSelect: any;
    startPosition: any = null;

    mounted() {
        const isNodeList = (
            el: Element | NodeListOf<Element>,
        ): el is NodeListOf<Element> => {
            return 'item' in el;
        };

        let el: Element | NodeListOf<Element> = this.$el;

        if (this.handle) {
            el = this.$el.querySelectorAll(this.handle);
        }
        let supportsPassive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsPassive = true;
                },
            });
            const emptyFun = () => {
                console.log('empty');
            };
            window.addEventListener('testPassive', emptyFun, opts);
            window.removeEventListener('testPassive', emptyFun, opts);
        } catch (e) {
            console.log(e);
        }
        const options = supportsPassive ? { capture: true, passive: true } : true;
        if (isNodeList(el)) {
            el.forEach((element) => {
                element.addEventListener('mousedown', this.onMouseDown);
                element.addEventListener('touchstart', this.onMouseDown, options);
                element.addEventListener('mouseenter', this.onMouseEnter);
                element.addEventListener('mouseleave', this.onMouseLeave);
            });
        } else {
            el.addEventListener('mousedown', this.onMouseDown);
            el.addEventListener('touchstart', this.onMouseDown, options);
            el.addEventListener('mouseenter', this.onMouseEnter);
            el.addEventListener('mouseleave', this.onMouseLeave);
        }
    }

    noop(e: any) {
        e.stopPropagation();
        e.preventDefault();
    }

    onMouseDown(e: any) {
        if (!this.disabled && this.downEvent === null) {
            this.initialUserSelect = document.body.style.userSelect;
            document.documentElement.style.userSelect = 'none'; // Permet au drag de se poursuivre normalement même
            // quand on quitte un élémént avec overflow: hidden.
            this.dragStarted = false;
            this.downEvent = e;
            if (this.downEvent.type === 'mousedown') {
                const mouse = event as MouseEvent;
                this.startPosition = {
                    x: mouse.clientX,
                    y: mouse.clientY,
                };
            } else {
                const touch = event as TouchEvent;
                this.startPosition = {
                    x: touch.touches[0].clientX,
                    y: touch.touches[0].clientY,
                };
            }
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('touchmove', this.onMouseMove, {
                passive: false,
            });
            document.addEventListener('easy-dnd-move', this.onEasyDnDMove);
            document.addEventListener('mouseup', this.onMouseUp);
            document.addEventListener('touchend', this.onMouseUp);
            document.addEventListener('selectstart', this.noop);
            // Prevents event from bubbling to ancestor drag components and initiate several drags at the same time
            e.stopPropagation();
            // Prevents touchstart event to be converted to mousedown
            // e.preventDefault();
        }
    }

    onMouseMove(e: TouchEvent | MouseEvent) {
        // We ignore the mousemove event that follows touchend :
        if (this.downEvent === null) return;

        // On touch devices, we ignore fake mouse events and deal with touch events only.
        if (this.downEvent.type === 'touchstart' && e.type === 'mousemove') return;

        // Find out event target and pointer position :
        let target: Element | any;
        let x: number;
        let y: number;
        if (e.type === 'touchmove') {
            const touch = e as TouchEvent;
            x = touch.touches[0].clientX;
            y = touch.touches[0].clientY;
            target = document.elementFromPoint(x, y);
        } else {
            const mouse = e as MouseEvent;
            x = mouse.clientX;
            y = mouse.clientY;
            target = mouse.target as Element;
        }

        // Distance between current event and start position :
        const dist = Math.sqrt(
            Math.pow(this.startPosition.x - x, 2) + Math.pow(this.startPosition.y - y, 2),
        );

        // If the drag has not begun yet and distance from initial point is greater than delta, we start the drag :
        if (!this.dragStarted && dist > this.delta) {
            this.dragStarted = true;
            dnd.startDrag(
                this,
                this.downEvent,
                this.startPosition.x,
                this.startPosition.y,
                this.type,
                this.data,
            );
            document.documentElement.classList.add('drag-in-progress');
        }

        // Dispatch custom easy-dnd-move event :
        if (this.dragStarted) {
            const custom = new CustomEvent('easy-dnd-move', {
                bubbles: true,
                cancelable: true,
                detail: {
                    x,
                    y,
                    native: e,
                },
            });
            target.dispatchEvent(custom);
        }

        // Prevent scroll on touch devices :
        e.preventDefault();
    }

    onEasyDnDMove(e: any) {
        dnd.mouseMove(e, null);
    }

    onMouseEnter() {
        this.mouseIn = true;
    }

    onMouseLeave() {
        this.mouseIn = false;
    }

    onMouseUp(e: MouseEvent | TouchEvent) {
        // On touch devices, we ignore fake mouse events and deal with touch events only.
        if (this.downEvent.type === 'touchstart' && e.type === 'mouseup') return;

        this.downEvent = null;

        // This delay makes sure that when the click event that results from the mouseup is produced, the drag is still
        // in progress. So by checking the flag dnd.inProgress, one can tell appart true clicks from drag and drop artefacts.
        setTimeout(() => {
            if (this.dragStarted) {
                document.documentElement.classList.remove('drag-in-progress');
                dnd.stopDrag(e);
            }
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('touchmove', this.onMouseMove);
            document.removeEventListener('easy-dnd-move', this.onEasyDnDMove);
            document.removeEventListener('mouseup', this.onMouseUp);
            document.removeEventListener('touchend', this.onMouseUp);
            document.removeEventListener('selectstart', this.noop);
            document.documentElement.style.userSelect = this.initialUserSelect;
        }, 0);
    }

    get dragIn() {
        return !this.dragInProgress && this.mouseIn;
    }

    get cssClasses() {
        const clazz = {
            'dnd-drag': true,
        } as any;
        if (!this.disabled) {
            return {
                ...clazz,
                'drag-source': this.dragInProgress && this.dragSource === this,
                'drag-in': this.dragIn,
                'drag-out': !this.dragIn,
                'drag-mode-copy': this.currentDropMode === 'copy',
                'drag-mode-cut': this.currentDropMode === 'cut',
                'drag-mode-reordering': this.currentDropMode === 'reordering',
                'drag-no-handle': !this.handle,
            };
        } else {
            return {
                ...clazz,
            };
        }
    }

    get currentDropMode() {
        if (this.dragInProgress && this.dragSource === this) {
            if (this.dragTop && this.dragTop.dropAllowed) {
                if (this.dragTop.reordering) return 'reordering';
                else return this.dragTop.mode;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    createDragImage(selfTransform: string) {
        let image: any;
        // $scopedSlots TODO
        console.log('this.$slots drag-image ', this.$slots['drag-image']);

        if (this.$slots['drag-image']) {
            const el = this.$refs['drag-image'] as HTMLElement;
            if (el.childElementCount !== 1) {
                image = createDragImage(el);
            } else {
                image = createDragImage(el.children.item(0) as HTMLElement);
            }
        } else {
            image = createDragImage(this.$el as HTMLElement);
            image.style.transform = selfTransform;
        }
        image.__opacity = this.dragImageOpacity;
        (image as HTMLElement).classList.add('drag-move');
        (image as HTMLElement).style.top = '';
        (image as HTMLElement).style.left = '';
        (image as HTMLElement).style.bottom = '';
        (image as HTMLElement).style.right = '';
        return image;
    }
}
