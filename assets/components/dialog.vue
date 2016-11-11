<template>
    <section class="component-dialog">
        <div class="message-box">
            <message-list :listData='msgList'></message-list>
        </div>
        <div class="input-box">
            <div class="input-contain">
                <scroll ref="scroll">
                    <div contenteditable @input="updateInput($event)">
                    </div>
                </scroll>
            </div>
            <div class="tool-bar">
                <span @click="addOne" class="tool-bar-send">Send</span>
            </div>
        </div>
    </section>
</template>
<script>
    import messageList from 'components/messageList';
    import mockList from 'mock/message';
    import scroll from 'components/scroll';

    export default {
        data() {
            return {
                msgList:mockList,
                status:true,
                contentHeight:0
            };
        },
        components: {
            messageList,
            scroll
        },
        methods: {
            addOne(){
                if(this.status) {
                    this.msgList.push({
                        "owner": "wxp",
                        "receiver": "other",
                        "timestamp": 36000,
                        "detail": "this is new test message from wxp to other"
                    })
                } else {
                    this.msgList.push({
                        "owner": "test",
                        "receiver": "wxp",
                        "timestamp": 36000,
                        "detail": "this is new test message from wxp to other"
                    })
                }
                this.status = !this.status;
            },
            updateInput(event) {
                if(this.contentHeight !== event.target.clientHeight) {
                    this.contentHeight = event.target.clientHeight;
                    this.$refs.scroll.updateStyle();
                }
            }
        },
        mounted(){
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
    }
    .tool-bar-send {
        color:white;
        text-align: center;
        background:#00aeef;
        font-size:14px;
        flex: 0 0 auto;
        line-height: 40px;
        padding:0 20px;
        border-radius: 2px;
        cursor: pointer;
        transition:all 0.2s ease;
        -moz-user-select:none; /*火狐*/
        -webkit-user-select:none; /*webkit浏览器*/
        -ms-user-select:none; /*IE10*/
        -khtml-user-select:none; /*早期浏览器*/
        user-select:none;
        &:hover {
            background:darken(#00aeef,5%);
        }
    }
    div[contenteditable] {
        width:100%;
        min-height: 100%;
        outline:none;
        box-sizing:border-box;
        word-break: break-all;
        word-wrap: break-word;
    }

</style>