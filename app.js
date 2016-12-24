import Koa from 'koa';
import koaRouter from 'koa-router';
import koaViews from 'koa-views';
import koaLogger from 'koa-logger';
import koaStatic from 'koa-static';
import koaBody from 'koa-bodyparser';
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
        this.actionList();
        this.initEvent();
    }
    initEvent() {
        this.wss.on('connection', (ws) => {
            this.appendClient(ws);
            this.BindAction(ws);
            ws.send(this.msgMaker({
                action: 'updateUser',
                detail: {id: ws.id}
            }))
            ws.send(this.msgMaker({
                action: 'updateUserList',
                detail: this.userList()
            }))
        });
    }
    msgMaker(data = {}) {
        return JSON.stringify(data);
    }
    broadcast(data,id) {
        this.wsc.forEach((ws) => {
            if(ws.id !== id) {
                ws.send(data);
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
    appendClient(ws) {
        ws.name = '';
        ws.avatar = '';
        ws.id = this.index++;
        this.wsc.push(ws);
    }
    BindAction(ws) {
        ws.on('message', (data) => {
            let parsedData = JSON.parse(data);
            this.actions[parsedData.action](parsedData.detail,ws);
        });
        ws.on('error', () => {

        });
        ws.on('close', () => {

        });
    }
    actionList() {
        this.actions = {
            updateUser: (data,ws) => {
                ws.name = data.name;
                ws.avatar = data.avatar;
                this.broadcast(this.msgMaker({
                    action: 'updateUserList',
                    detail: this.userList()
                }), ws.id);
            }
        }
    }
}

new Wss(server,ws.Server);