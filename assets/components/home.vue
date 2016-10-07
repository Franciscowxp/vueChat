<template>
    <article class="component-home">
        <aside>
             <header class="sideTitle">
                <h1>ONLINE 
                <svg>
                     <use xlink:href="/static/images/sprite/common.svg#network"></use>
                 </svg>
                </h1>
             </header>
             <ul>
                 <li v-for="(u,i) in user" :style="{'animation-delay': Math.random() * 10 + 's'}">
                     <svg class="avatar">
                         <use v-bind="{'xlink:href':'/static/images/sprite/avatar.svg#'+ u.avatar }"></use>
                     </svg>
                     <span>{{u.name}}</span>
                 </li>
             </ul>
        </aside>
        <section>
            <header class="contentTitle">
                <div>
                    <span>{{currentUser.name}}</span>
                    <svg class="avatar">
                         <use v-bind="{'xlink:href':'/static/images/sprite/avatar.svg#'+ currentUser.avatar }"></use>
                     </svg>
                </div>
                <div>
                    
                </div>
            </header>
            <div>
                
            </div>
        </section>
    </article>
</template>
<script>
    export default {
        data() {
            return {
                user: [{
                    avatar: 'man-1',
                    name: 'francisco'
                },{
                    avatar: 'woman-1',
                    name: 'francisco'
                },{
                    avatar: 'man-7',
                    name: 'francisco'
                },{
                    avatar: 'woman-4',
                    name: 'francisco'
                },{
                    avatar: 'man-3',
                    name: 'francisco'
                }],
                currentUser: {
                    avatar: 'man-1',
                    name: 'francisco'
                }
            };
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
            >div {
                flex: 1 1 auto;
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