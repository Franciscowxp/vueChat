import Koa from 'koa';
import koaRouter from 'koa-router';
import koaViews from 'koa-views';
import koaLogger from 'koa-logger';
import koaStatic from 'koa-static';
import koaBody from 'koa-bodyparser';
import { WS } from './assets/modules/wsc';
import ws from 'ws'
import path from 'path';

const app = new Koa();
const router = koaRouter();
const viewConf = koaViews(__dirname + '/assets', {
    map: {
        html: 'nunjucks'
    }
});

const staticConf = koaStatic(__dirname + '/assets/dist');

router.get('/', async(ctx, next) => {
    await ctx.render('index', {
        now: new Date()
    });
});


app
    .use(staticConf)
    .use(viewConf)
    .use(koaLogger())
    .use(koaBody())
    .use(router.routes())
    .use(router.allowedMethods());


const server = app.listen(3000);
class Wsc extends WS {
    constructor(ws) {
        super();
        this.ws = ws;
        this.init();
    }
}
class Wss {
    /*
     * wsc item
     * {
     *     ws: ws,
     *     name: '',
     *     id: ''
     * }
     */
    constructor(app, wsserver) {
        this.index = 1;
        this.wsc = [];
        this.wss = new wsserver({
            server: app
        });
        this.initEvent();
    }
    initEvent() {
        this.wss.on('connection', (ws) => {
            let wsc = new Wsc(ws);
            this.appendClient(wsc);
            this.BindAction(wsc);
            wsc.send({
                action: 'updateUser',
                detail: {id: wsc.id}
            });
            wsc.send({
                action: 'updateUserList',
                detail: this.userList()
            });
        });
    }
    broadcast(data,id) {
        this.wsc.forEach((wsc) => {
            if(wsc.id !== id) {
                wsc.send(data);
            }
        });
    }
    actualUser() {
        let userFilter = this.wsc.filter((item) => {
            return item.name
        });
        return userFilter;
    }
    userList() {
        let user = this.actualUser();
        let userList = user.map((item) => {
            return {
                name: item.name,
                id: item.id,
                avatar: item.avatar
            }
        });
        return userList;
    }
    appendClient(wsc) {
        wsc.name = '';
        wsc.avatar = '';
        wsc.id = this.index++;
        this.wsc.push(wsc);
    }
    BindAction(wsc) {
        wsc.register('updateUser', (data) => {
            wsc.name = data.detail.name;
            wsc.avatar = data.detail.avatar;
            this.broadcast({
                action: 'updateUserList',
                detail: this.userList()
            }, wsc.id);
        });
        wsc.register('exchangeMsg', (data) => {
            this.broadcast({ ...data, name: wsc.name, avatar: wsc.avatar }, wsc.id);
        });
    }
}

new Wss(server,ws.Server);