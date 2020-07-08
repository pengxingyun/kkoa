const http = require('http');

class Kkoa {
    constructor() {
        this.middlewares = [];
    }
    use(fn) {
        this.middlewares.push(fn);
        return this; // 支持链式调用
    }
    callback() {
        let fn = this.compose(this.middlewares);
        const handleRequest = ((req, res) => {
            // 混合req res到ctx
            let ctx = this.createContext(req, res);
            return this.handleRequest(ctx, fn);
        })
        return handleRequest;
    }
    handleRequest(ctx, fnMiddleware) {
        const handleResponse = () => this.respond(ctx);
        return fnMiddleware(ctx).then(handleResponse);
    }
    /**
     * engine server
     * @param  {...any} args 
     */
    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args);
    }
    /**
     * mixin req and res for ctx
     * @param {*} req 
     * @param {*} res 
     */
    createContext(req, res) {
        let ctx = Object.create(null);
        ctx.request = Object.create(req);
        ctx.response = Object.create(res);

        ctx.req = req;
        ctx.res = res;

        return ctx;
    }
    compose(middlewares) {
        return function(ctx) {
            return dispatch(0);
            function dispatch(i) {
                if(!middlewares[i]) return;
                let fn = middlewares[i];
                if(!fn) return Promise.resolve()
                try {
                    return Promise.resolve(fn(ctx, function next() {return dispatch(i + 1)}));
                } catch(err) {
                    return Promise.reject(err);
                }
            }
        }
    }
    /**
     * 简单输出ctx.body
     * @param {*} ctx 
     */
    respond(ctx) {
        const res = ctx.res;
        res.end(ctx.body);
    }
}

module.exports = Kkoa;