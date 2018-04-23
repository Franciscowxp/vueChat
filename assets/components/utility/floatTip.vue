<template>
    <transition name="fade">
        <div class="components-floattip" :style="boxPosition">
            <slot></slot>
            <span :style="tagPosition"></span>
        </div>
    </transition>
</template>
<script>
    export default {
        data() {
            return {
                width: 0,
                height: 0,
                boxPosition: {
                    left: '0px',
                    top: '0px'
                },
                tagPosition: {
                    left: '0px'
                }
            };
        },
        props:{
            position: { // the getBoundingClientRect object of the click dom
                required: true,
                type: Object
            }
        },
        methods: {
            setPosition() {
                let pos = this.$el.offsetParent.getBoundingClientRect();
                let top = this.position.top - this.height - 100;
                let left = this.position.left - (this.width - this.position.width) / 2 - pos.left;
                left = left + this.width > pos.width ? pos.width - this.width : left;
                this.boxPosition = {
                    left: left + 'px',
                    top: top + 'px'
                }
                let tagLeft = this.position.left + this.position.width / 2 - pos.left - left;
                this.tagPosition.left = tagLeft - this.$el.querySelector('span').clientWidth / 2 + 'px';
            }
        },
        mounted(){
            this.width = this.$el.clientWidth;
            this.height = this.$el.clientHeight;
            this.setPosition();
        }
    }
</script>
<style lang="scss">
    .components-floattip {
        position: absolute;
        background:#2b2c31;
        top:100px;
        left:100px;
        z-index: 10;
        border-bottom:2px solid #2184f6;
        >span {
            position: absolute;
            left:0;
            width:10px;
            &:after {
                content:'';
                width:0;
                height:0;
                border-top:10px solid #2184f6;
                border-right:10px solid transparent;
                border-bottom:10px solid transparent;
                border-left:10px solid transparent;
                position:absolute;
            }
        }
    }
</style>
