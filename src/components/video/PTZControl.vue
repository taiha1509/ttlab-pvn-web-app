<template>
    <div class="ptz-control">
        <template v-for="icon in iconData" :key="icon">
            <el-icon class="ptz-icon">
                <component :is="icon.component" @click="onClickIcon(icon.value)" />
            </el-icon>
        </template>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { PTZValue } from '../../modules/device-controller/constants';
import {
    CaretBottom,
    CaretTop,
    CaretLeft,
    CaretRight,
    ZoomIn,
    ZoomOut,
} from '@element-plus/icons-vue';
import { Prop } from 'vue-property-decorator';

interface IPTZIconData {
    component: string;
    value: PTZValue;
    isShow: boolean;
}

@Options({
    components: {
        CaretBottom,
        CaretTop,
        CaretLeft,
        CaretRight,
        ZoomIn,
        ZoomOut,
    },
})
export default class PTZControl extends Vue {
    @Prop({ default: false }) readonly isShowPanControl!: boolean;
    @Prop({ default: false }) readonly isShowTiltControl!: boolean;
    @Prop({ default: false }) readonly isShowZoomControl!: boolean;

    get iconData(): IPTZIconData[] {
        const iconData = [
            {
                component: 'CaretBottom',
                value: PTZValue.TILT_DOWN,
                isShow: this.isShowTiltControl,
            },
            {
                component: 'CaretTop',
                value: PTZValue.TILT_UP,
                isShow: this.isShowTiltControl,
            },
            {
                component: 'CaretLeft',
                value: PTZValue.PAN_LEFT,
                isShow: this.isShowPanControl,
            },
            {
                component: 'CaretRight',
                value: PTZValue.PAN_RIGHT,
                isShow: this.isShowPanControl,
            },
            {
                component: 'ZoomIn',
                value: PTZValue.ZOOM_IN,
                isShow: this.isShowZoomControl,
            },
            {
                component: 'ZoomOut',
                value: PTZValue.ZOOM_OUT,
                isShow: this.isShowZoomControl,
            },
        ];
        return iconData.filter((item) => item.isShow);
    }

    ptzValue = '';

    onClickIcon(ptzValue: PTZValue): void {
        this.ptzValue = ptzValue;
    }
}
</script>

<style lang="scss" scoped>
.ptz-icon {
    width: 20px;
    transition: all 0.1s;
    .icon {
        font-size: 16px !important;
        width: 20px !important;
        color: white;
        height: 20px !important;
        &:hover {
            background-color: white;
            color: black;
        }
    }
    &:not(:last-child) {
        margin-right: 2px;
    }
}
</style>
