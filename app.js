const koa = require('koa');
const router = require('koa-router')();
const logger = require('koa-logger');
const views = require('koa-views');
const static = require('koa-static');
const path = require('path');
const app = new koa();

const viewConf = views(__dirname + '/assets/html', {
    map: {
        html: 'mustache'
    }
})

const staticConf = static(__dirname + '/assets/build');

router.get('/', async(ctx, next) => {
    await ctx.render('index', {
        now: new Date()
    });
});
router.get('/test', async(ctx, next) => {
    ctx.body = 'hello world test page';
});

app
.use(staticConf)
.use(viewConf)
.use(logger())
.use(router.routes())
.use(router.allowedMethods());
app.listen(3000);