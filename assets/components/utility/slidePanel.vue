<template>
    <nav class="v-slide-panel"
    :class = "className"
    @touchstart="slideStart($event)"
    @touchmove="slideMove($event)"
    @touchend="slideEnd($event)"
    @mousewheel="mousewheel($event)" >
        <div  :style="{'transform' : 'translate3d(' + translateX + 'px, 0, 0)'}" :class="[dragging ? 'dragging' : '']">
            <span v-for="(item,index) in listData" @click="changeCate(index)">{{item.name}}</span>
            <strong :style="activeBarStyle"></strong>
        </div>
    </nav>
</template>
<script>
    export default {
        data() {
            return {
                translateX:0,
                startPos:0,
                deltaX:0,
                startTranslateX:0,
                dragging: false,
                direction:0,
                oldPageX:0,
                wrap:null,
                activeIndex: -1,
                wrapWidth:0,
                rightBoundary:0,
                parentWidth:0,
                activeBarStyle: {
                    width:'0px',
                    left: '0px'
                }
            };
        },
        props: {
            listData: {
                type: Array,
                require: true
            },
            curIndex: {
                type: Number,
                default() {
                    return 0;
                }
            },
            className: {
                type: String
            }
        },
        methods: {
            mousewheel(){
                let direction = 'up';
                let offset = 20;
                if(event.wheelDelta < 0) {
                    direction = 'down';
                }
                if(direction === 'up') {
                    if (this.translateX + offset < 0) {
                        this.translateX = this.translateX + offset;
                    }
                }
                if(direction === 'down') {
                    if(this.translateX - offset >= -this.rightBoundary) {
                        this.translateX = this.translateX - offset;
                    }
                }
            },
            slideStart(event) {
                this.startPos = event.changedTouches[0].pageX;
                this.oldPageX = this.startPos;
                this.startTranslateX = this.translateX;
            },
            slideMove(event) {
                event.stopImmediatePropagation();
                this.deltaX = event.changedTouches[0].pageX - this.startPos;
                this.direction = event.changedTouches[0].pageX - this.oldPageX;
                this.oldPageX = event.changedTouches[0].pageX;
                this.dragging = true;
                this.translateX = this.startTranslateX + this.deltaX;
            },
            slideEnd(event) {
                this.dragging = false;
                if(this.translateX > 0) {
                    this.translateX = 0;
                }
                if(this.translateX < -this.rightBoundary) {
                    this.translateX = -this.rightBoundary;
                }
            },
            clickTranslate(item){
                // 根据 外层的contain 的中线来 判断 wrap 该如何移动
                let half = this.parentWidth / 2;
                // 中线右边
                if(item.offsetX - Math.abs(this.translateX)>= half ) {
                    let tempX = this.translateX - item.width;
                    let moveX = tempX > - this.rightBoundary ? tempX : -this.rightBoundary;
                    this.translateX = moveX;
                } else {
                // 中线左边
                    let tempX = this.translateX + item.width;
                    let moveX = tempX <=0 ? tempX : 0;
                    this.translateX = moveX;
                }
            },
            changeCate(index) {
                this.panelChange(index);
            },
            getWidth() {
                this.wrap = this.$el.querySelector('div');
                this.parentWidth = this.$el.parentNode.clientWidth;
                Array.from(this.wrap.querySelectorAll('span')).forEach((val,index) => {
                    this.wrapWidth += val.clientWidth;
                    this.$set(this.listData[index], 'width', val.clientWidth);
                    let offsetX = index === 0 ? 0 : this.listData[index-1].width + this.listData[index-1].offsetX;
                    this.$set(this.listData[index], 'offsetX', offsetX);
                });
                this.rightBoundary = this.wrapWidth - this.parentWidth > 0 ? this.wrapWidth - this.parentWidth : 0;
            },
            panelChange(index) {
                let item = this.listData[index];
                if(index !== this.activeIndex) {
                    this.activeIndex = index;
                    if(!item.width) {
                        this.getWidth();
                    }
                    this.setPanelPosition(item,index);
                }
            },
            setPanelPosition(item,index) {
                this.activeBarStyle = {
                    width:item.width + 'px',
                    left: item.offsetX + 'px'
                };
                this.clickTranslate(item);
                this.$emit('panel-invoke',{index,...item});
            }
        },
        watch: {
            curIndex(val) {
                this.panelChange(val);
            }
        },
        mounted() {
            this.getWidth();
            this.panelChange(this.curIndex);
        }
    }
</script>
<style lang="scss">
    .v-slide-panel {
        vertical-align: middle;
        box-sizing:border-box;
        text-align: center;
        overflow:hidden;
        div {
            font-size: 0;
            height:100%;
            display:flex;
            flex-flow:row nowrap;
            justify-content:flex-start;
            align-items:stretch;
            position: relative;
            width:100%;
            text-align: left;
            transition: all 0.4s ease;
            &.dragging {
                transition: none;
            }
        }
        strong {
            position:absolute;
            bottom:0;
            left: 0;
            height:2px;
            background:#fdd835;
            width:100px;
            transition:all .3s ease;
        }
        span {
            flex: 0 0 auto;
            text-transform: capitalize;
            color:white;
            display:block;
            height:100%;
            box-sizing:border-box;
            text-align: center;
            font-size:18px;
            padding:5px 10px;
            transition:all .2s ease;
            cursor: pointer;
            margin:0;
        }
    }
</style>
