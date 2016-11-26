<template>
    <float-tip :position="position">
        <section class="component-emoticon">
            <slide-panel :list-data="panelData" v-on:panel-invoke="switchData" className="emoticon-panel"></slide-panel>
            <div class="component-emoticon-switch">
                <Swipe>
                    <SwipeItem v-for="sec in emoticonPackage">
                        <div class="emoticon-list">
                            <span v-for="item in sec.emoticon" @click="chooseEmo(sec.name,item)">
                                <icon :base="sec.name" :name="item"></icon>
                            </span>
                        </div>
                    </SwipeItem>
                </Swipe>
            </div>
        </section>
    </float-tip>
</template>
<script>
    import slidePanel from 'components/utility/slidePanel';
    import floatTip from 'components/utility/floatTip';
    import { Swipe, SwipeItem } from 'vue-swipe';
    import  emoticonPackage from 'data/emoticon';
    import icon from 'components/utility/icon';
    export default {
        data() {
            return {
                emoticonPackage
            };
        },
        computed: {
            panelData() {
                let newData = [];
                for(let [key, value] of this.emoticonPackage.entries()) {
                    newData.push({
                        name: value.name
                    })
                }
                return newData;
            }
        },
        props: {
            position: {
                required: true,
                type: Object
            }
        },
        components: {
            slidePanel,
            Swipe,
            SwipeItem,
            floatTip,
            icon
        },
        methods: {
            switchData(item) {
                console.log(item);
            },
            chooseEmo(emoName,emoItem){

            }
        },
        mounted(){
        }
    }
</script>
<style lang="sass">
    .component-emoticon {
        background: #28282d;
        width:400px;
        position: relative;
        >div {

        }
    }
    .emoticon-panel {
        strong {
        }
        span {
            background:#2184f6;
        }
    }
    .component-emoticon-switch {
        width:400px;
        // height:300px;
        padding:20px;
        box-sizing: border-box;
    }
    .emoticon-list {
        display:flex;
        flex-flow:row wrap;
        justify-content:space-between;
        align-items:stretch;
        >span {
            flex:1 1 auto;
            width:40px;
            margin:5px;
            height:40px;
            display:inline-block;
            cursor: pointer;
        }
    }
</style>