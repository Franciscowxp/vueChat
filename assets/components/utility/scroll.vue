<template>
    <section class="components-scroll"
    :style="componentRectStyle"
    @mousewheel="mousewheel($event)" >
        <div class="scroll-overflow">
            <div class="scroll-contain" :style="scrollContentStyle">
                <slot>
                </slot>
            </div>
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
                componentRectStyle: {
                    height: '100%',
                    width: '100%'
                },
                containWidth: 0,
                containHeight: 0,
                scrollContentHeight: 0,
                offsetScrollContentH:0,
                offsetScrollBarH:0,
                isShowScrollBar:false,
                scrollBarHandler: null,
                scrollBarHeight: 0,
                scrollContentOffsetTop:0 // 滚动内容最上边相对于固定容器最上边的距离

            };
        },
        props: {
            height:{
                type:String,
                default:''
            },
            width:{
                type:String,
                default:''
            }
        },
        methods: {
            clickScrollBarMove(event){
                let barOffsetY = this.getScrollBarInfo().distance;
                if(event.target.classList.contains('scroll-bar')) {
                    let offset = event.layerY > barOffsetY ? event.layerY - this.scrollBarHeight : event.layerY;
                    this.ClickScrollBarMove(offset);
                    this.contentMoveByBar(offset);
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
                    let offsetY;
                    offsetY = distance + offset < this.scrollContentOffsetTop ? distance + offset : this.scrollContentOffsetTop;
                    if(distance < this.scrollContentOffsetTop) {
                        this.BarMoveByContent(this.scrollContentOffsetTop - offsetY);
                        this.moveScrollContent(offsetY);
                    }
                }
                if(direction === 'down') {
                    let tmpOffset = this.scrollContentOffsetTop - this.offsetScrollContentH;
                    let offsetY = distance - offset > tmpOffset ? distance - offset : tmpOffset;
                    if(distance >= tmpOffset) {
                        this.BarMoveByContent(this.scrollContentOffsetTop - offsetY);
                        this.moveScrollContent(offsetY);
                    }
                }
                this.scrollBarAction();
            },
            updateScrollContentOffsetTop(){
                let contain = this.$el.querySelector('.scroll-contain');
                let overlayer = this.$el.querySelector('.scroll-overflow');
                let translateY = this.getScrollContentInfo().distance;
                this.scrollContentOffsetTop =  overlayer.getBoundingClientRect().top - contain.getBoundingClientRect().top + translateY;
            },
            getScrollContentInfo(){
                let result = /(\-?\d+)(px)?/.exec(this.scrollContentStyle.transform);
                return {
                    distance:Number.parseInt(result[1],10), // the value of the transform attribute like the 10 of the translateY(10px)
                    height: this.scrollContentHeight // the heigth of the actual content
                };
            },
            getScrollBarInfo() {
                let result = /(\-?\d+)(px)?/.exec(this.scrollBarStyle.transform);
                return {
                    distance:Number.parseInt(result[1],10),// as same as the scrollContent
                    height:this.scrollBarHeight// as same as the scrollContent
                }
            },
            updateContainRect() {
                this.scrollContentHeight = this.$el.querySelector('.scroll-contain').clientHeight; // caculate the height of the container containing the scroll content
            },
            ClickScrollBarMove(num) {
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
                h = this.scrollContentOffsetTop - offset * this.scrollContentHeight / this.containHeight;
                this.scrollContentStyle.transform = `translateY(${h}px)`;
            },
            BarMoveByContent(offset) {
                let h = 0;
                h = offset / this.scrollContentHeight * this.containHeight;
                this.scrollBarStyle.transform = `translateY(${h}px)`;
            },
            updateStyle(){
                this.$nextTick(() => {
                    this.updateContainRect();
                    this.updateScrollContentOffsetTop();
                    let translateY = this.getScrollContentInfo().distance;
                    if(this.scrollContentHeight > this.containHeight) {
                        this.offsetScrollContentH = this.scrollContentHeight - this.containHeight; 
                        this.scrollBarAction();
                        this.calculateBar();
                        if(this.scrollContentOffsetTop === 0) {
                            this.scrollContentStyle = {
                                transform: 'translateY(' + (this.containHeight - this.scrollContentHeight) + 'px)'
                            }
                        }
                        this.BarMoveByContent(this.scrollContentOffsetTop - this.getScrollContentInfo().distance);

                    } else {
                        this.offsetScrollContentH = 0;
                        this.calculateBar();
                    }
                })
            }
        },
        created() {
            if(this.height) {
                this.componentRectStyle = {
                    height: this.height,
                    width: this.width
                }
            }
        },
        mounted() {
            if(!this.height) {
                this.componentRectStyle = {
                    height: this.$el.parentNode.offsetHeight + 'px',
                    width: this.$el.parentNode.offsetWidth + 'px'
                }
            }
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
        width:100%;
        box-sizing:border-box;
    }
    .scroll-overflow {
        width:100%;
        height:100%;
        overflow:hidden;
        position: relative;
    }
    .scroll-contain {
        transition:all 0.2s ease-in-out;
        will-change:transform;
        width:100%;
        box-sizing: border-box;
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
