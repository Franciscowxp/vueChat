<template>
    <transition name="ripple">
        <span class="ripple" :style="rippleStyle" ></span>
    </transition>
</template>
<script>
    export default {
        data() {
            return {};
        },
        props: {
            rippleStyle: {
                type: Object
            }
        }
    }
</script>
<style lang="sass">
    .ripple {
        position: absolute;
        width: 1px;
        height: 1px;
        left: 0;
        top: 0;
        pointer-events: none;
        user-select: none;
        border-radius: 50%;
        background-color: currentColor;
        box-shadow:0 0 0 100px currentColor;
        opacity: 0.2;
    }
    .ripple-enter {
        transform:scale(0);
        opacity: 0.6;
    }
    .ripple-leave-active {
        opacity: 0!important;
    }
    .ripple-enter-active,.ripple-leave-active {
        transition: opacity 2s cubic-bezier(0.23, 1, 0.32, 1), transform 1s cubic-bezier(0.23, 1, 0.32, 1);
    }
</style>