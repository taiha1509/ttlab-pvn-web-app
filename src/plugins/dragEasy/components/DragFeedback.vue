<template>
    <div class="DragFeedback">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class DragFeedback extends Vue {}
</script>

<style scoped lang="scss"></style>
