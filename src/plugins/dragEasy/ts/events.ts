/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue } from 'vue-class-component';

export class DnDEvent {
    type: any;
    data: any;
    top?: Vue;
    previousTop?: Vue;
    source?: Vue;
    position?: { x: number; y: number };
    success?: boolean;
    native?: TouchEvent | MouseEvent;
}

export class ReorderEvent {
    constructor(public from: number, public to: number) {}

    apply(array: any[]) {
        const tmp = array[this.from];
        array.splice(this.from, 1);
        array.splice(this.to, 0, tmp);
    }
}

export class InsertEvent {
    constructor(public type: any, public data: any, public index: number) {}
}
