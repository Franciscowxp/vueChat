<template>
    <section class="components-scroll"
    :style="{height:height,width:width}"
    @mousewheel="mousewheel($event)" >
        <div class="scroll-contain" :style="scrollContentStyle">
            <slot>
            </slot>
        </div>
        <div class="scroll-bar" @click="clickScrollBarMove($event)" :class="[isShowScrollBar ? 'active': '']">
            <div :style="scrollBarStyle" ></div>
        </div>
    </section>
</template>
<script>
    export default {
        data() {
            return {
                scrollContentStyle: {
                    transform: 'translateY(0)'
                },
                scrollBarStyle: {
                    height: '100%',
                    transform: 'translateY(0)'
                },
                containWidth: 0,
                containHeight: 0,
                scrollContentHeight: 0,
                offsetScrollContentH:0,
                offsetScrollBarH:0,
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
            clickScrollBarMove(event){
                let barOffsetY = this.getScrollBarInfo().distance;
                if(event.target.classList.contains('scroll-bar')) {
                    let offset = event.layerY > barOffsetY ? event.layerY - this.scrollBarHeight : event.layerY;
                    this.contentMoveByBar(-offset);
                    this.dragScrollBarMove(offset);
                }
            },
            mousewheel(event) {
                let direction = 'up';
                let distance = this.getScrollContentInfo().distance;
                let offset = 20;
                if(event.wheelDelta < 0) {
                    direction = 'down';
                }
                if(direction === 'up') {
                    let offsetY =distance + offset < 0 ? distance + offset : 0;
                    if(distance < 0) {
                        this.BarMoveByContent(-offsetY);
                        this.moveScrollContent(offsetY);
                    }
                }
                if(direction === 'down') {
                    let offsetY = distance - offset > this.offsetScrollContentH ? distance - offset : this.offsetScrollContentH;
                    if(distance > this.offsetScrollContentH) {
                        this.BarMoveByContent(-offsetY);
                        this.moveScrollContent(offsetY);
                    }
                }
                this.scrollBarAction();
            },
            getScrollContentInfo(){
                let result = /(\-?\d+)(px)?/.exec(this.scrollContentStyle.transform);
                return {
                    distance:Number.parseInt(result[1],10),
                    height: this.scrollContentHeight
                };
            },
            getScrollBarInfo() {
                let result = /(\-?\d+)(px)?/.exec(this.scrollBarStyle.transform);
                return {
                    distance:Number.parseInt(result[1],10),
                    height:this.scrollBarHeight
                }
            },
            updateContainRect() {
                this.scrollContentHeight = this.$el.querySelector('.scroll-contain').clientHeight;
            },
            dragScrollBarMove(num) {
                let actualNum = num;
                if(num <= 0) {
                    actualNum = 0;
                }
                if(num >= (this.containHeight - this.scrollBarHeight)) {
                    actualNum = this.containHeight - this.scrollBarHeight;
                }
                this.scrollBarStyle.transform = 'translateY(' + actualNum +'px)';

            },
            moveScrollContent(num){
                this.scrollContentStyle.transform = 'translateY(' + num +'px)';
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
                let height = Math.pow(this.containHeight,2) / this.scrollContentHeight;
                let finalHeight = height <= 20 ? 20 : height;
                this.scrollBarHeight = finalHeight;
                this.scrollBarStyle.height =  finalHeight + 'px';
                this.offsetScrollBarH = this.scrollContentHeight - this.scrollBarHeight;
            },
            contentMoveByBar(offset) {
                let h = 0;
                h = offset * this.scrollContentHeight / this.containHeight;
                this.scrollContentStyle.transform = `translateY(${h}px)`;
            },
            BarMoveByContent(offset) {
                let h = 0;
                if(offset !== undefined) {
                    h = offset / this.scrollContentHeight * this.containHeight;
                } else {
                    h = this.containHeight - this.scrollBarHeight;
                }
                this.scrollBarStyle.transform = `translateY(${h}px)`;
            },
            updateStyle(){
                this.$nextTick(() => {
                    this.updateContainRect();
                    if(this.scrollContentHeight > this.containHeight) {
                        this.scrollContentStyle = {
                            transform: 'translateY(' + (this.containHeight - this.scrollContentHeight) + 'px)'
                        }
                        this.offsetScrollContentH = this.containHeight - this.scrollContentHeight;
                        this.scrollBarAction();
                        this.calculateBar();
                        this.BarMoveByContent();
                    }
                })
            }
        },
        mounted() {
            this.containWidth = this.$el.clientWidth;
            this.containHeight = this.$el.clientHeight;
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
            // cursor: move;
        }
        &.active,&:hover {
            opacity: 1;
            will-change:opacity;
        }
    }
</style>
