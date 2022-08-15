<template>
    <component :is="type" v-bind="linkProps(to)">
        <slot />
    </component>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';
import { Options } from 'vue-class-component';
import { isExternal } from '@/utils/helper';

@Options({})
export default class AppLink extends Vue {
    @Prop({ required: true }) to!: string;

    get isExternal(): boolean {
        return isExternal(this.to);
    }

    get type(): string {
        if (this.isExternal) {
            return 'a';
        }
        return 'router-link';
    }

    linkProps(to: string): Record<string, string> {
        if (this.isExternal) {
            return {
                href: to,
                target: '_blank',
                rel: 'noopener',
            };
        }
        return {
            to: to,
        };
    }
}
</script>

<style scoped></style>
