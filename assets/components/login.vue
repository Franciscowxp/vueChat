<template>
    <div class="component-login">
        <canvas class="component-login-wave"></canvas>
        <div class="component-login-box">
            <p> choose a avatar</p>
            <ul>
                <li v-for="c in charator" @click="chooseAvatar(c)">
                    <icon class-name="avatar" base="avatar" :name="c.avatar"  :class="[ c.active ? 'active': '']" ></icon>
                </li>
            </ul>
            <div>
                <input type="text" @focus="focusState($event)" @blur="blurState($event)" v-model="userName">
                <span :class="[spanActive ? 'active' : '']">your name:</span>
            </div>
            <button @click="starChat" :class="btnClass">start</button>
        </div>
    </div>
</template>
<script>
    import Bubble from 'modules/bubble';
    import avatar from 'data/avatar';
    import icon from 'components/utility/icon';
    import { mapActions, mapGetters } from 'vuex';
    import Notify from 'modules/notify';
    export default {
        data() {
            return {
                avatar,
                spanActive: false,
                choosedAvatar: {},
                userName: '',
                loading: false
            };
        },
        computed: {
            ...mapGetters(['getUser']),
            charator() {
                let array = [];
                for(let i = 0; i < 4 ;i++) {
                    let index = Math.floor(Math.random() * this.avatar.length);
                    array.push(this.avatar.splice(index,1)[0]);
                }
                return array;
            },
            btnClass() {
                if(this.userName && this.choosedAvatar.avatar) {
                    let isLoad = false;
                    if(this.loading) {
                        isLoad = true;
                    }
                    return {
                        noAllow: false,
                        loading: isLoad
                    };
                } else {
                    return {
                        noAllow: true,
                        loading: false
                    };
                }
            }
        },
        components: {
            icon
        },
        methods: {
            ...mapActions(['userAct']),
            focusState(event) {
                let target = event.target;
                this.spanActive = true;

            },
            blurState(event) {
                let target = event.target;
                if(target.value) {
                    this.spanActive = true;
                } else {
                    this.spanActive = false;
                }
            },
            chooseAvatar(avatar,index) {
                this.choosedAvatar.active = false;
                avatar.active = true;
                this.choosedAvatar = avatar;
            },
            starChat() {
                this.loading = true;
                let data = {
                    action: 'updateUser',
                    detail: {   name: this.userName,
                                avatar: this.choosedAvatar.avatar
                            }
                };
                this.getUser.ws.send(data);
                setTimeout(() => {
                    this.userAct(data.detail);
                    Notify.getPermission();
                }, 500);
            }
        },
        mounted() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const canvas = this.$el.querySelector('.component-login-wave');
            canvas.height = height;
            canvas.width = width;
            new Bubble(canvas);
        }
    }
</script>
<style lang="sass">
    .component-login {
        position: fixed;
        left:0;
        top:0;
        width:100vw;
        height:100vh;
        z-index: 10;
        background:rgba(0,0,0,.5);
        display:flex;
        flex-flow:row nowrap;
        justify-content:center;
        align-items:center;
    }
    .component-login-wave {
        position:absolute;
    }
    .component-login-box {
        position: relative;
        z-index: 1;
        text-align:center;
        p {
            margin-bottom:20px;
            text-align:left;
        }
        svg {
            transition:all 0.2s ease;
            &:hover,&.active {
                box-shadow:0 0 0 2px teal,0 0 0 4px lighten(teal,10%);
            }
        }
        ul {
            display:flex;
            flex-flow:row nowrap;
            justify-content:space-between;
            align-items:stretch;
            margin-bottom:20px;
        }
        li {
            flex: 0 0 auto;
            cursor: pointer;
        }
        >div {
            margin:5px auto;
            position: relative;
        }
        span {
            position: absolute;
            font-size:14px;
            left:0;
            bottom:10px;
            transition:all 0.2s ease;
            padding-left:5px;
            &.active {
                transform:translateY(-120%);
            }
        }
        input {
            padding:5px 5px 0 5px;
            width:100%;
            height:40px;
            border:none;
            background:none;
            border-bottom:2px solid #dcdcdc;
            transition:all 0.2s ease;
            box-sizing:border-box;
            &:focus {
                border-color:teal;
            }
        }
        button {
            display:inline-block;
            padding:5px;
            border:none;
            font-size:16px;
            text-align:center;
            border-radius:50px;
            background:#EE6383;
            color:white;
            height:40px;
            box-sizing:border-box;
            line-height:40px;
            width:100%;
            cursor: pointer;
            margin-top:20px;
            text-transform:uppercase;
            transition:all 0.2s ease;
            position: relative;
            &.noAllow {
                background:#dcdcdc;
                pointer-events:none;
            }
            &.loading {
                width:40px;
                font-size:0;
                &:after {
                    content:'';
                    position: absolute;
                    left:0;
                    right:0;
                    top:0;
                    bottom:0;
                    margin:auto;
                    width:80%;
                    height:80%;
                    border-top:2px solid white;
                    border-radius:50%;
                    will-change:transform;
                    animation: spin 0.5s 0.2s linear infinite ;
                }
            }

        }
        flex: 0 0 auto;
        width:20vw;
        box-sizing:border-box;
        padding:20px;
        background:white;
        border-radius:4px;
    }
    @keyframes spin {
        from {
            transform:rotate(0deg);
        }
        to {
            transform:rotate(360deg);
        }
    }
</style>