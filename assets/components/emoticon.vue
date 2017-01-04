<template>
    <float-tip :position="position">
        <section class="component-emoticon">
            <slide-panel :listData="panelData" @panel-invoke="switchData" className="emoticon-panel" :curIndex="currentIndex"></slide-panel>
            <div class="component-emoticon-switch">
                <swipe :auto="0" :showIndicators="false" @swipe-invoke="swipeInvoke" :curIndex="currentIndex">
                    <swipeItem v-for="sec in emoticonPackage">
                        <div class="emoticon-list">
                            <span v-for="item in sec.emoticon" @click="chooseEmo(sec.name,item)" unselectable="on">
                                <icon :base="sec.name" :name="item"></icon>
                            </span>
                        </div>
                    </swipeItem>
                </swipe>
            </div>
        </section>
    </float-tip>
</template>
<script>
    import slidePanel from 'components/utility/slidePanel';
    import floatTip from 'components/utility/floatTip';
    import swipeItem from 'components/utility/swipeItem';
    import swipe from 'components/utility/swipe';
    import emoticonPackage from 'data/emoticon';
    import icon from 'components/utility/icon';
    import { mapActions, mapGetters } from 'vuex';
    import { getCaretPosition, setCaretPosition } from 'modules/util';
    export default {
        data() {
            return {
                emoticonPackage,
                currentIndex: 0
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
            },
            ...mapGetters(['getCaret'])
        },
        props: {
            position: {
                required: true,
                type: Object
            }
        },
        components: {
            slidePanel,
            swipe,
            swipeItem,
            floatTip,
            icon
        },
        methods: {
            createEmojiItem(emoName,emoItem){
                return `<img class="svgEmoji" src="/assets/static/images/svg/emoticon/${emoName}/${emoItem}.svg" alt="">`;
            },
            switchData(item) {
                this.currentIndex = item.index;
            },
            chooseEmo(emoName,emoItem){
                let editBox = document.querySelector('div[contenteditable]');
                editBox.focus(this.getCaretPosition);
                setCaretPosition(this.getCaret);
                document.execCommand('insertHTML', false, this.createEmojiItem(emoName,emoItem));
            },
            swipeInvoke(data) {
                this.currentIndex = data.index;
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
        height:340px;
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