class Storage {
    constructor({
        dbName,
        objectStore = [],
        version = 1
    }) {
        this.dbName = dbName;
        this.version = version;
        // the objectStore and its some options,like type ,indexes and so on ;
        // [{
        //      objStore: 'people',
        //      objStoreType: {keyPath: 'time'},
        //      indexes:[
        //          {
        //              indexName: 'indexTime',
        //              key: 'time',
        //              option: { unique: true}
        //          }
        //      ]
        // }]
        this.objectStore = objectStore;
    }
    async init() {
        let res = await this.openDB();
        if (res.type === 'error') {
            return res.msg;
        } else {
            this.db = res.db;
        }

    }
    async count(storeName) {
        await this.checkStore(storeName);
        let transaction = this.db.transaction(storeName);
        let store = transaction.objectStore(storeName);
        let res = store.count();
        return this.requestPromise(res);
    }
    async get(storeName, valObj) {
        await this.checkStore(storeName);
        let store = this.db.transaction(storeName).objectStore(storeName);
        let key = Object.keys(valObj)[0];
        let val = Object.values(valObj)[0];
        let res;
        if (store.indexNames.contains(key)) {
            res = store.index(key).get(val);
        } else {
            res = store.get(val);
        }
        return this.requestPromise(res);

    }
    async getAll(storeName) {
        await this.checkStore(storeName);
        let transaction = this.db.transaction(storeName);
        let store = transaction.objectStore(storeName);
        let res = store.getAll();
        return this.requestPromise(res);
    }
    async add(storeName, valObj) {
        await this.checkStore(storeName);
        let transaction = this.db.transaction(storeName, 'readwrite');
        let store = transaction.objectStore(storeName);
        if (Array.isArray(valObj)) {
            valObj.forEach((val) => {
                store.add(val);
            });
        } else {
            store.add(valObj);
        }
        return this.transactionPromise(transaction);
    }
    async put(storeName, filter, newVal) {
        await this.checkStore(storeName);
        let transaction = this.db.transaction(storeName, 'readwrite');
        let store = transaction.objectStore(storeName);
        let key = Object.keys(filter)[0];
        let val = Object.values(filter)[0];
        let res;
        if (store.indexNames.contains(key)) {
            res = store.index(key).get(val);
        } else {
            res = store.get(val);
        }
        res.onsuccess = (e) => {
            let tmp = e.target.result;
            for (let [ikey, ival] of Object.entries(newVal)) {
                tmp[ikey] = ival;
            }
            store.put(tmp);
        }
        return this.transactionPromise(transaction);
    }
    async clear(storeName) {
        await this.checkStore(storeName);
        let transaction = this.db.transaction(storeName, 'readwrite');
        let store = transaction.objectStore(storeName);
        let res = store.clear();
        return this.requestPromise(res);
    }
    async delete(storeName, objVal) {
        await this.checkStore(storeName);
        let transaction = this.db.transaction(storeName, 'readwrite');
        let store = transaction.objectStore(storeName);
        let res = store.delete(objVal);
        return this.requestPromise(res);
    }
    requestPromise(res) {
        return new Promise((resolve, reject) => {
            res.onsuccess = (e) => {
                resolve(e.target.result);
            };
            res.onerror = (e) => {
                reject(e.target.error.message);
            }
        });
    }
    transactionPromise(trans) {
        return new Promise((resolve, reject) => {
            trans.oncomplete = (e) => {
                resolve(e);
            }
            trans.onerror = (e) => {
                reject(e)
            }
        });
    }
    checkStore(name) {
        if (!this.db.objectStoreNames.contains(name)) {
            return Promise.reject('the requested objectStore is not exist');
        } else {
            return Promise.resolve(true);
        }
    }
    openDB() {
        return new Promise((resolve, reject) => {
            const req = window.indexedDB.open(this.dbName, this.version);
            req.onsuccess = (e) => {
                this.db = e.target.result;
                resolve({
                    type: 'success',
                    db: e.target.result
                });
            }
            req.onerror = (e) => {
                reject({
                    type: 'error',
                    msg: e.currentTarget.error.message
                });
            }
            req.onupgradeneeded = (e) => {
                this.db = e.target.result;
                this.objectStore.forEach((val) => {
                    let store = this.db.createObjectStore(val.objStore, val.objStoreType);
                    if (val.indexes.length) {
                        val.indexes.forEach((item) => {
                            store.createIndex(item.indexName, item.key, item.option);
                        })
                    }
                })
                resolve({
                    type: 'upgrade',
                    db: e.target.result
                });
            }
        });
    }
    deleteDB() {
        this.checkDB();
        window.indexedDB.deleteDatabase(this.dbName);
    }
    closeDB() {
        this.checkDB();
        this.db.close();
    }
    checkDB() {
        if (!this.db) return false;
    }
}
export default Storage;