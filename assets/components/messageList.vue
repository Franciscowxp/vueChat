<template>
        <section class="components-messageList">
            <scroll ref="scroll">
                <transition-group name="flipIn" tag="div">
                    <div v-for="item in listData" class="msgItem" :class="[item.owner === getUser.name ? 'owner': '']" :key="item">
                        <p>{{item.detail}}</p>
                    </div>
                </transition-group>
            </scroll>
        </section>
</template>
<script>
    import {mapGetters} from 'vuex';
    import scroll from 'components/scroll';
    export default {
        data() {
            return {};
        },
        computed: {
            ...mapGetters(['getUser'])
        },
        components: {
            scroll
        },
        props: {
            listData: {
                required: true,
                type:Array
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
        p {
            color:white;
            padding: 10px 10px;
            background: #00aeef;
            border-radius: 10px;
            display: inline-block;
        }
        &.owner {
            text-align: right;
            p {
                
            }
        }
    }
</style>