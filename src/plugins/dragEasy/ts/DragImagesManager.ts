/* eslint-disable no-unused-expressions */
/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Options, Vue } from 'vue-class-component';
import { dnd } from './DnD';
import { nextTick } from 'vue';
/**
 * This class reacts to drag events emitted by the dnd object to manage a sequence of drag images and fade from one to the
 * other as the drag progresses.
 */
@Options({}) // Necessary to set proper "this" context in event listeners.
export class DragImagesManager extends Vue {
    selfTransform = '';
    clones: Map<Vue, HTMLElement> | null = null;
    source: (Vue & { goBack: unknown; createDragImage: Function }) | null = null;
    sourcePos: { x: number; y: number } | null = null;
    sourceClone: HTMLElement | null = null;

    constructor() {
        super({});
        dnd.on('dragstart', this.onDragStart);
        dnd.on('dragtopchanged', this.onDragTopChanged);
        dnd.on('dragpositionchanged', this.onDragPositionChanged);
        dnd.on('dragend', this.onDragEnd);
    }

    onDragStart = (event: any) => {
        this.sourcePos = {
            x: event.source.$el.getBoundingClientRect().left,
            y: event.source.$el.getBoundingClientRect().top,
        };
        this.selfTransform =
            'translate(-' +
            (event.position.x - this.sourcePos.x) +
            'px, -' +
            (event.position.y - this.sourcePos.y) +
            'px)';
        this.clones = new Map<Vue, HTMLElement>();
        this.source = event.source;
    };

    onDragEnd = (event: any) => {
        nextTick(() => {
            if (!event.success && this.source?.goBack) {
                // Restore the drag image that is active when hovering outside any drop zone :
                const img = this.switch(null) as HTMLElement;

                // Move it back to its original place :
                window.requestAnimationFrame(() => {
                    img.style.transition = 'all 0.5s';
                    window.requestAnimationFrame(() => {
                        img.style.left = this.sourcePos?.x + 'px';
                        img.style.top = this.sourcePos?.y + 'px';
                        img.style.transform = 'translate(0,0)';
                        const handler = () => {
                            this.cleanUp();
                            img.removeEventListener('transitionend', handler);
                        };
                        img.addEventListener('transitionend', handler);
                    });
                });
            } else {
                this.cleanUp();
            }
        });
    };

    cleanUp = () => {
        this.clones?.forEach((clone: HTMLElement) => {
            if (clone.parentNode === document.body) {
                document.body.removeChild(clone);
            }
        });
        if (this.sourceClone !== null) {
            if (this.sourceClone.parentNode === document.body) {
                document.body.removeChild(this.sourceClone);
            }
        }
        this.selfTransform = '';
        this.clones = null;
        this.source = null;
        this.sourceClone = null;
        this.sourcePos = null;
    };

    onDragTopChanged = (event: any) => {
        this.switch(event.top);
    };

    switch = (top: any) => {
        this.clones?.forEach((clone: any) => {
            clone.style.opacity = '0';
        });
        if (this.sourceClone) {
            this.sourceClone.style.opacity = '0';
        }

        let activeClone;
        if (top === null) {
            activeClone = this.getSourceClone();
        } else {
            if (!this.clones?.has(top)) {
                let clone = top.createDragImage(this.selfTransform);
                if (clone === 'source') {
                    clone = this.getSourceClone();
                } else if (clone !== null) {
                    clone.style.opacity = '0';
                    document.body.appendChild(clone);
                }
                this.clones?.set(top, clone);
            }
            activeClone = this.clones?.get(top);
        }

        if (activeClone && activeClone !== null) {
            activeClone.offsetWidth; // Forces broswer reflow
            activeClone.style.opacity = (
                activeClone as HTMLElement & {
                    __opacity: string;
                }
            ).__opacity;
            activeClone.style.visibility = 'visible';
        }

        return activeClone;
    };

    getSourceClone = () => {
        if (this.sourceClone === null && this.source) {
            this.sourceClone = this.source.createDragImage(this.selfTransform);
            if (this.sourceClone) {
                this.sourceClone.style.opacity = '0';
                document.body.append(this.sourceClone);
            }
        }
        return this.sourceClone;
    };

    onDragPositionChanged = () => {
        this.clones?.forEach((clone: any) => {
            clone.style.left = dnd.position?.x + 'px';
            clone.style.top = dnd.position?.y + 'px';
        });
        if (this.sourceClone) {
            this.sourceClone.style.left = dnd.position?.x + 'px';
            this.sourceClone.style.top = dnd.position?.y + 'px';
        }
    };
}

new DragImagesManager();
