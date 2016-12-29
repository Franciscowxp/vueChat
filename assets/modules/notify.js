const Notify =  {
    getPermission() {
        if (!window.Notification) {
            alert('不支持桌面通知');
            return false;
        }
        Notification.requestPermission((status) => {
            new Notification('请求权限已经成功', {
                body: '现在可以方便接受消息通知了'
            });
        });
    },
    send(title, msg) {
        if (!document.hidden) return false;
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: msg
            });
        } else {
            this.getPermission();
        }
    }
}
export default Notify;