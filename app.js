import Koa from 'koa';
import koaRouter from 'koa-router';
import koaViews from 'koa-views';
import koaLogger from 'koa-logger';
import koaStatic from 'koa-static';
import koaBody from 'koa-bodyparser';
import ws from 'ws'
import path from 'path';

const app = new Koa();
const wss = new ws.Server({
    server: app
});
const wsc = [];
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
app.listen(3000);