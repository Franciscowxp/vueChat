<template>
    <section class="component-dialog">
        <div class="message-box">
            <message-list :listData='msgList'></message-list>
        </div>
        <div class="input-box">
            <button type="" @click="addOne">add a message</button>
        </div>
    </section>
</template>
<script>
    import messageList from 'components/messageList';
    import mockList from 'mock/message';
    export default {
        data() {
            return {
                msgList:mockList,
                status:true
            };
        },
        components: {
            messageList
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
    }
</style>