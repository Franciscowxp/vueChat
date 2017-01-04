<template>
    <article class="component-home">
        <aside>
             <header class="sideTitle">
                <h1>ONLINE
                <icon base="common" name="network"></icon>
                </h1>
             </header>
             <ul>
                 <li v-for="(u,i) in onlineUser" :style="{'animation-delay': Math.random() * 10 + 's'}">
                    <icon class-name="avatar" base="avatar" :name="u.avatar"></icon>
                    <span>{{u.name}}</span>
                 </li>
             </ul>
        </aside>
        <section>
            <header class="contentTitle">
                <div>
                    <span>{{getUser.name}}</span>
                    <icon class-name="avatar" base="avatar" :name="getUser.avatar"></icon>
                </div>
                <div>
                </div>
            </header>
            <div>
                <v-dialog></v-dialog>
            </div>
        </section>
        <transition name="fade">
            <login v-if="isLogin"></login>
        </transition>
    </article>
</template>
<script>
    import vDialog from 'components/dialog';
    import icon from 'components/utility/icon';
    import login from 'components/login';
    import { Wsc } from 'modules/wsc';
    import { mapGetters, mapActions } from 'vuex';
    export default {
        data() {
            return {
                onlineUser: []
            };
        },
        computed: {
            ...mapGetters(['getUser']),
            isLogin() {
                return !this.getUser.name;
            }
        },
        components: {
            vDialog,
            icon,
            login
        },
        methods: {
            ...mapActions(['userAct'])
        },
        mounted() {
            let wsclient = new Wsc({ url: 'ws://' + window.location.hostname + ':3000' });
            this.userAct({ws: wsclient});
            wsclient.register('updateUser', (data) => {
                this.userAct({id: data.detail.id});
            });
            wsclient.register('updateUserList', (data) => {
                let id= this.getUser.id;
                this.onlineUser = data.detail.filter((item) => {
                    return item.id !== id;
                });
            });
        }
    }
</script>
<style lang="sass">
    .component-home {
        font-family: 'Lato-Regular';
        display:flex;
        flex-flow:row nowrap;
        justify-content:space-between;
        align-items:stretch;
        .sideTitle {
            text-align:center;
            padding:20px 0;
            background:#16bab8;
            color:white;
            margin-bottom:50px;
            svg {
                width:30px;
                height:30px;
                display:inline-block;
                vertical-align:middle;
            }
        }
        .avatar {
            width:60px;
            height:60px;
            border-radius:50%;
            background:rgba(#dcdcdc,0.5);
        }
        .contentTitle {
            height:70px;
            background:#2d2c36;
            flex:0 0 auto;
            display:flex;
            flex-flow:row nowrap;
            justify-content:flex-end;
            align-items:stretch;
            padding:0 20px;
            position: relative;
            z-index: 2;
            .avatar {
                width:50px;
                height:50px;
                margin-left:10px;
            }
            >div {
                flex:0 0 auto;
                display:flex;
                flex-flow:row nowrap;
                justify-content:space-between;
                align-items:center;
            }
            span {
                display:inline-block;
            }
        }
        >aside {
            flex:0 1 auto;
            width:200px;
            background:#2b2c31;
            box-shadow:2px 0 2px #28292d;
            position: relative;
            z-index: 2;
            ul {
                padding:0 20px;
            }
            li {
                width:60px;
                height:60px;
                border-radius:50px;
                background:rgba(#dcdcdc,0.3);
                display:flex;
                flex-flow:row nowrap;
                justify-content:space-between;
                align-items:stretch;
                margin:auto;
                margin-bottom:20px;
                transition:all 0.2s ease-in-out;
                animation:moving 4s infinite both;
                &:hover {
                    width:160px;
                    animation-play-state:paused;
                    svg {
                        will-change:transform;
                        transform:rotate(45deg);
                    }
                }
            }
            svg {
                transition:all 0.2s ease-in-out;
                flex:0 0 auto;
            }
            span {
                flex:1 1 auto;
                line-height:60px;
                margin-left:10px;
                color:white;
                text-overflow:ellipsis;
                overflow:hidden;
                white-space:nowrap;
                width:calc(100% - 70px);
            }
        }

        >section {
            flex: 1 1 auto;
            background:#28282d;
            display:flex;
            flex-flow:column nowrap;
            justify-content:space-between;
            align-items:stretch;
            position: relative;
            z-index: 1;
            >div {
                flex: 1 1 auto;
                display:flex;
                flex-flow:row nowrap;
                justify-content:space-between;
                align-items:stretch;
                padding: 20px;
                transform-style:preserve-3d;
                perspective:4000px;
                overflow:hidden;
                height:calc(100vh - 70px);
                box-sizing: border-box;
            }
        }
    }
    @keyframes moving {
            0% {
                transform:translateX(0);
            }
            25% {
                transform:translateX(50px);
            }
            50% {
                transform:translateX(0);
            }
            75% {
                transform:translateX(-50px);
            }
            100% {
                transform:translateX(0);
            }
    }
</style>