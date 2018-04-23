<template>
    <button class="component-btn" @mousedown="rippleStar($event)" :class="className" @mouseup="rippleEnd">
        <slot></slot>
        <ripple v-for="(wave,index) in waves" :ripple-style="wave.style"></ripple>
    </button>
</template>
<script>
    import ripple from 'components/utility/ripple';
    export default {
        data() {
            return {
                waves:[],
                rippleStyle: {
                    background: '#08759e'
                }
            };
        },
        props: {
            className: {
                type: String
            }
        },
        components: {
            ripple
        },
        methods: {
            rippleStar(event){
                let x = event.offsetX || event.layerX;
                let y = event.offsetY || event.layerY;
                this.waves.push({style: {
                    left: x + 'px',
                    top: y + 'px',
                    color: '#14779c'
                }});
                this.$emit('click');
            },
            rippleEnd() {
                if(this.waves.length === 0) {
                    return false;
                }
                this.waves.splice(0,1);
            }
        }
    }
</script>
<style lang="scss">
    .component-btn{
        position: relative;
        border:none;
        font-size:14px;
        box-sizing:border-box;
        cursor: pointer;
        overflow:hidden;
        &[disabled] {
            cursor: not-allow;
        }
        .wave {
            position:absolute;
            background:red;
            width:1px;
            height:1px;
            background:currentColor;
            padding:0;
            margin:0;
            opacity: 0;
            border-radius:50%;
            transform:scale(0);
            box-shadow:0 0 0px 0px currentColor;
            transition: box-shadow .2s cubic-bezier(.4,0,1,1),background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1);
            &.animate {
                animation: wave 0.5s;
            }
        }
    }
</style>
