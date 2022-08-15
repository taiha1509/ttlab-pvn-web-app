import { Options, Vue } from 'vue-class-component';
import { dnd } from '../ts/DnD';

@Options({})
export default class DragAwareMixin extends Vue {
    get dragInProgress() {
        return dnd.inProgress;
    }

    get dragData() {
        return dnd.data;
    }

    get dragType() {
        return dnd.type;
    }

    get dragPosition() {
        return dnd.position;
    }

    get dragSource() {
        return dnd.source;
    }

    get dragTop() {
        return dnd.top;
    }
}
