<template>
        <section class="components-messageList">
            <scroll ref="scroll">
                <transition-group name="flipIn" tag="div">
                    <div v-for="item in listData" class="msgItem" :class="[item.owner === getUser.name ? 'owner': '']" :key="item">
                        <div class="msgWrap">
                            <div>
                                <icon class-name="avatar" base="avatar" :name="item.avatar"></icon>
                                <div class="msgContent">
                                    <p><span>{{item.name}}</span><time>{{item.timestamp | time}}</time></p>
                                    <p v-html="item.detail"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition-group>
            </scroll>
        </section>
</template>
<script>
    import { mapGetters } from 'vuex';
    import scroll from 'components/utility/scroll';
    import icon from 'components/utility/icon';
    export default {
        data() {
            return {};
        },
        computed: {
            ...mapGetters(['getUser'])
        },
        components: {
            scroll,
            icon
        },
        props: {
            listData: {
                required: true,
                type:Array
            }
        },
        filters: {
            time(time) {
                // 2016-12-28 17:31:46
                let date = new Date(time);
                return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            }
        },
        updated(){
            this.$refs.scroll.updateStyle();
        }
    }
</script>
<style lang="sass">
    .components-messageList {
        height: 100%;
        overflow-x:hidden;
        width:100%;
    }
    .msgItem {
        text-align: left;
        margin-bottom: 10px;
        font-family: 'Lato-Regular';
        color:white;
        .avatar {
            flex: 0 0 auto;
            width:40px;
            height:40px;
            order:1;
        }

        time {
            margin-left:10px;
        }
        p {
            border-radius: 2px;
            flex: 1 1 auto;
            &:nth-of-type(2) {
                margin-top:10px;
                padding:10px;
                display: inline-block;
                background: #00aeef;
            }
        }
        &.owner {
            text-align: right;
            .msgWrap {
                text-align:right;
            }
            .msgContent {
                order:1;
                margin-right:10px;
                margin-left:0;
                text-align:right;
                p {
                    &:first-child {
                        time {
                            margin-left:0px;
                            margin-right:10px;
                            order:1;
                        }
                        span {
                            order:2;
                        }
                    }
                }
            }
            .avatar {
                order:2;
            }
        }
    }
    .msgContent {
        flex: 0 0 auto;
        margin-left:10px;
        text-align:left;
        order:2;
        p {
            &:first-child {
                display:flex;
                flex-flow:row nowrap;
                justify-content:space-between;
                align-items:stretch;
                span,time {
                    flex: 0 0 auto;
                }
            }
        }
    }
    .msgWrap {
        text-align:left;
        display: inline-block;
        > div {
            display:flex;
            flex-flow:row nowrap;
            justify-content:space-between;
            align-items:stretch;
        }
    }
</style>