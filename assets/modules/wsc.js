/**
 * the data pattern
 * {
 *     type: text | image | json,
 *     format: text | binary,
 *     detail: string | binary,
 *     timestamp: string,
 *     owner: string ,
 *     reciever: string,
 *     action: string
 * }
 * there are the actions below,
 *  updateUser
 *  updateUserList
 *  postMsg
 *  receiveMsg
 *  postFile
 *  receiveFile
 */

var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

class WS {
    constructor(ws){
        this.ws = ws;
        this.callback = [];
        this.msgHandlers = [];
        this.event('message', (res) => {
            let data = JSON.parse(res.data);
            if(/callback/.test(data.action)) {
                this.dealCallback(data);
            } else {
                this.dealMsgHandlers(data);
            }
        })
    }
    register() {
        this.msgHandlers.push({
            action,
            func
        });
    }
    dealMsgHandlers(data) {
        for (let { action, func } of this.msgHandlers) {
            if (data.action === action) {
                func(data);
                return false;
            }
        }
    }
    dealCallback(data) {
        for (let [index, value] of this.callback.entries()) {
            if (value.action === action) {
                func(data);
                this.callback.splice(index,1);
                return false;
            }
        }
    }
    send(data){
        let unique = 'callback' + ID()
        let newData = {...data, callbackAction: unique};
        return new Promise((resolve,reject) => {
            this.send(data);
            this.once({ action: unique, func: () => { resolve }});
        });
    }
    event(type,func) {
        if(this.ws.on) {
            this.ws.on(type, (res) => {
                func(res);
            })
        }
        if(this.ws.addEventListener) {
            this.ws.addEventListener(type, (res) => {
                func(res);
            })
        }
    }
    once(callback) {
        this.callback.push(callback);
    }

}

class Wsc {
    constructor({
        url,
        open = () => {},
        error = () => {},
        close = () => {}
    }) {
        this.ws = new WebSocket(url);
        this.msgHandlers = [];
        this.message();
    }
    register(action, func) {
        this.msgHandlers.push({
            action,
            func
        })
    }
    send(data) {
        this.ws.send(data);
    }
    message() {
        this.ws.addEventListener('message', (resp) => {
            console.log(resp)
            let data = JSON.parse(resp.data);
            for (let {
                    action,
                    func
                }
                of this.msgHandlers) {
                if (data.action === action) {
                    func(data);
                    return false;
                }
            }
        });
    }

}

export default Wsc;