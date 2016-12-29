<template>
    <section class="component-dialog">
        <div class="message-box">
            <message-list :listData='msgList'></message-list>
        </div>
        <div class="input-box">
            <div class="input-contain" @click="focusEditor">
                <scroll ref="scroll">
                    <div contenteditable="true" @input="updateInput($event)" @blur="saveTheCaret($event)">
                    </div>
                </scroll>
            </div>
            <div class="tool-bar">
                <component :is="floatComponent" :position="floatTipPosition"></component>
                <span class="tool-bar-svg" v-for="tool in toolBar" @click="switchComponent($event, tool)" unselectable="on">
                    <icon :base="tool.icon.base" :name="tool.icon.name"></icon>
                </span>
                <wave-btn v-on:click="sendOne" class-name="tool-bar-send">Send</wave-btn>
            </div>
        </div>
    </section>
</template>
<script>
    import messageList from 'components/messageList';
    import scroll from 'components/utility/scroll';
    import icon from 'components/utility/icon';
    import waveBtn from 'components/utility/button';
    import emoticon from 'components/emoticon';
    import Notify from 'modules/notify';
    import { mapActions, mapGetters } from 'vuex';
    import { getCaretPosition } from 'modules/util';
    export default {
        data() {
            return {
                msgList:[],
                status:true,
                contentHeight:0,
                editHander: null,
                wsclient: null,
                toolBar: [{
                    icon: {
                        base: 'common',
                        name: 'emoticon'
                    },
                    linkComponent:'emoticon'
                }],
                floatComponent:'',
                floatTipPosition:{}
            };
        },
        components: {
            messageList,
            scroll,
            icon,
            emoticon,
            waveBtn
        },
        computed: {
            ...mapGetters(['getUser'])
        },
        methods: {
            ...mapActions(['caretAct']),
            transformClientRect(clientRect) {
                let newObj = {};
                for(var key in clientRect) {
                    newObj[key] = clientRect[key];
                }
                return newObj;
            },
            saveTheCaret(event) {
                this.caretAct((getCaretPosition(event.target)));
            },
            switchComponent(event, item){
                this.floatTipPosition = this.transformClientRect(event.target.getBoundingClientRect());
                this.floatComponent = this.floatComponent === item.linkComponent ? '' : item.linkComponent;
            },
            msgMaker({receiver = 'other',detail = ''}) {
                let timestamp = new Date().getTime();
                if(!detail) return false;
                return {
                    action: 'exchangeMsg',
                    owner: this.getUser.name,
                    receiver,
                    timestamp,
                    detail
                }
            },
            sendOne(){
                let content = this.editHander.innerHTML;
                if(!content) return false;
                const data = this.msgMaker({
                    detail: this.editHander.innerHTML
                });
                this.getUser.ws.send(data);
                this.msgList.push({ ...data, name: this.getUser.name, avatar: this.getUser.avatar});
                this.editHander.innerHTML = '';
            },
            updateInput(event) {
                if(this.contentHeight !== event.target.clientHeight) {
                    this.contentHeight = event.target.clientHeight;
                    this.$refs.scroll.updateStyle();
                }
            },
            focusEditor() {
                this.editHander.focus();
            }
        },
        mounted(){
            this.editHander = this.$el.querySelector('div[contenteditable]');
            this.$nextTick(() => {
                this.getUser.ws.register('exchangeMsg', (data) => {
                    Notify.send(data.owner, data.detail);
                    this.msgList.push(data);
                })
            });
        }
    }
</script>
<style lang="sass">
    .component-dialog {
        flex:1 1 auto;
        display:flex;
        flex-flow:column nowrap;
        justify-content:space-between;
        align-items:stretch;
        height: 100%;
    }
    .message-box {
        padding:20px;
        flex:4 1 auto;
        background: #2b2b31;
        margin-bottom: 20px;
        overflow-y: auto;
        height:100%;
    }
    .input-box {
        padding:20px;
        flex:0 0 auto;
        background: #2b2b31;
        height:200px;
        box-sizing: border-box;
        display:flex;
        flex-flow:column nowrap;
        justify-content:space-between;
    }
    .input-contain {
        width:100%;
        flex: 1 1 auto;
        box-sizing:border-box;
        margin-bottom:10px;
        border:none;
        background:none;
        color:white;
        display:flex;
        flex-flow:column nowrap;
        justify-content:space-between;
        align-items:stretch;
        section {
            flex: 1 1 auto;
        }
    }
    .tool-bar {
        height:40px;
        font-size: 0;
        text-align: right;
        display:flex;
        flex-flow:row nowrap;
        justify-content:flex-end;
        align-items:stretch;
        svg {
            width:40px;
            height:100%;
        }
        >span {
            flex: 0 0 auto;
            margin-left: 20px;
        }
    }
    .tool-bar-svg {
        cursor: pointer;
    }
    .tool-bar-send {
        color:white;
        text-align: center;
        background:#00aeef;
        font-size:14px;
        line-height: 40px;
        padding:0 20px;
        border-radius: 2px;
        cursor: pointer;
        margin-left:20px;
        transition:all 0.2s ease;
        -moz-user-select:none; /*火狐*/
        -webkit-user-select:none; /*webkit浏览器*/
        -ms-user-select:none; /*IE10*/
        -khtml-user-select:none; /*早期浏览器*/
        user-select:none;
        &:hover {
            background:darken(#00aeef,5%);
        }
        .wave {
            color:darken(#00aeef,7%);
        }
    }
    div[contenteditable] {
        width:100%;
        min-height: 100%;
        outline:none;
        box-sizing:border-box;
        word-break: break-all;
        word-wrap: break-word;
        text-align:left;
    }
    .svgEmoji {
        width:40px;
        height:40px;
        display: inline-block;
        vertical-align:bottom;
    }

</style>