<template>
    <section class="components-scroll"
    :style="{height:height,width:width}"
    @mousewheel="mousewheel($event)">
        <div class="scroll-contain" :style="scrollStyle">
            <slot>
            </slot>
        </div>
        <div class="scroll-bar" :class="[isShowScrollBar ? 'active': '']">
            <div :style="scrollBarStyle" @mousedown="dragScrollStart" @mouseup="dragScrollEnd" @mousemove="dragScrollMove"></div>
        </div>
    </section>
</template>
<script>
    export default {
        data() {
            return {
                scrollStyle: {
                    transform: 'translateY(0)'
                },
                scrollBarStyle: {
                    height: '100%',
                    transform: 'translateY(0)'
                },
                actualW: 0,
                actualH: 0,
                containH: 0,
                offsetH:0,
                dataChange: false,
                isShowScrollBar:false,
                scrollBarHandler: null,
                scrollBarHeight: 0,
            };
        },
        props: {
            height:{
                type:String,
                default:'100%'
            },
            width:{
                type:String,
                default:'100%'
            }
        },
        methods: {
            dragScrollEnd(){

            },
            dragScrollStart(){

            },
            dragScrollMove(){

            },
            mousewheel(event) {
                let direction = 'up';
                let distence = this.getCurrentTranslate();
                let offset = 20;
                if(event.wheelDelta < 0) {
                    direction = 'down';
                }
                if(direction === 'up') {
                    let offsetY = Number.parseInt(distence,10) + offset < 0 ? Number.parseInt(distence,10) + offset : 0;
                    if(distence < 0) {
                        this.scrollStyle.transform = 'translateY(' + offsetY +'px)';
                        this.scrollBarMove(offsetY);
                    }
                }
                if(direction === 'down') {
                    let offsetY = Number.parseInt(distence,10) - offset > this.offsetH ? Number.parseInt(distence,10) - offset : this.offsetH;
                    if(distence > this.offsetH) {
                        this.scrollStyle.transform = 'translateY(' + offsetY +'px)';
                        this.scrollBarMove(offsetY);
                    }
                }
                this.scrollBarAction();
            },
            getCurrentTranslate(){
                let result = /(\-?\d+)(px)?/.exec(this.scrollStyle.transform);
                return result[1];
            },
            updateContainRect() {
                this.containH = this.$el.querySelector('.scroll-contain').clientHeight;
            },
            scrollBarAction() {
                this.isShowScrollBar = true;
                if(this.scrollBarHandler) {
                    clearTimeout(this.scrollBarHandler)
                }
                this.scrollBarHandler = setTimeout(() => {
                    this.isShowScrollBar = false;
                }, 2000);
            },
            calculateBar() {
                let height = Math.pow(this.actualH,2) / this.containH;
                let finalHeight = height <= 20 ? 20 : height;
                this.scrollBarHeight = finalHeight;
                this.scrollBarStyle.height =  finalHeight + 'px';
            },
            scrollBarMove(offset) {
                let h = 0;
                if(offset !== undefined) {
                    h = offset / this.containH * this.actualH;
                } else {
                    h = this.scrollBarHeight - this.actualH;
                }
                this.scrollBarStyle.transform = `translateY(${-h}px)`;
            },
            updateStyle(){
                this.$nextTick(() => {
                    this.updateContainRect();
                    if(this.containH > this.actualH) {
                        this.scrollStyle = {
                            transform: 'translateY(' + (this.actualH - this.containH) + 'px)'
                        }
                        this.offsetH = this.actualH - this.containH;
                        this.scrollBarAction();
                        this.calculateBar();
                        this.scrollBarMove();
                    }
                })
            }
        },
        mounted() {
            this.actualW = this.$el.clientWidth;
            this.actualH = this.$el.clientHeight;
            this.updateContainRect();
        }
    }
</script>
<style lang="sass">
    .components-scroll {
        overflow: hidden;
        position: relative;
    }
    .scroll-contain {
        transition:all 0.2s ease-in-out;
        will-change:transform;
    }
    .scroll-bar {
        position: absolute;
        height:100%;
        width:5px;
        right: 0;
        top: 0;
        background: rgba(0,0,0,0.5);
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        div {
            position: absolute;
            left: 0;
            top: 0;
            width: 5px;
            height: 20px;
            background: #fe3e50;
            border-radius: 10px;
            transition: transform 0.2s ease-in-out;
            will-change:transform;
            cursor: move;
        }
        &.active,&:hover {
            opacity: 1;
            will-change:opacity;
        }
    }
</style>
