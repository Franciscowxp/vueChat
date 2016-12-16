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
 */
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