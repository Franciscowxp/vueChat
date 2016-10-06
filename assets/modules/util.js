const Util = {
    remToPx(rem) {
        let px, remBase = document.documentElement.style.getPropertyValue('font-size');
        if (remBase) {
            px = rem * Number.parseFloat(remBase);
        } else {
            px = rem;
        }
        return Number.parseInt(px, 10);
    },
    add(data) {
        let lenData = [];
        data.forEach((val) => {
            let tmpVal = '' + val;
            let len = tmpVal.split('.')[1] ? tmpVal.split('.')[1].length : 0;
            lenData.push(len);
        })
        const logn = Math.pow(10, Math.max(...lenData));
        let sum = data.reduce((previous, current, index) => {
            if (index === 1) {
                return this.multiply(previous, logn) + this.multiply(current, logn);
            } else {
                return previous + this.multiply(current, logn);
            }
        });
        return sum / logn;
    },
    multiply(...data) {
        let lenData = [];
        data.forEach((val) => {
            let tmpVal = '' + val;
            let len = tmpVal.split('.')[1] ? tmpVal.split('.')[1].length : 0;
            lenData.push(len);
        });
        let sumLen = lenData.reduce((previous, current) => {
            return previous + current;
        });
        let mulLen = Math.pow(10, sumLen);
        let sum = data.reduce((previous, current, index) => {
            return this.changeToNum(previous) * this.changeToNum(current);
        });
        return sum / mulLen;

    },
    changeToNum(string) {
        return Number(String(string).replace('.', ''));
    },
    addCurrency(data) {
        let tmp = /(.*?)\d+/.exec(data[0]);
        let currency = tmp ? tmp[1] : '';
        let tmpArray = [];
        let num;
        data.forEach((val) => {
            if (currency) {
                num = /.*?(\d*\.?\d+)/.exec(val)[1];
            } else {
                num = val;
            }
            tmpArray.push(num);
        });
        return currency + this.add(tmpArray);
    },
    sumProductPrice(data, key, quantity) {
        let tmpNum = [];
        let tmpLen = [];
        let tmp = /(.*?)\d+/.exec(data[0][key]);
        let currency = tmp ? tmp[1] : '';
        let sum;
        data.forEach((val) => {
            let price = /.*?(\d*\.?\d+)/.exec(val[key])[1];
            let len = price.split('.')[1] ? price.split('.')[1].length : 0;
            let quan = val[quantity];
            tmpNum.push({
                price: +price,
                quan: +quan
            });
            tmpLen.push(+len);
        })
        const logn = Math.pow(10, Math.max(...tmpLen));
        if (tmpNum.length > 1) {
            sum = tmpNum.reduce((previous, current, index) => {
                if (index === 1) {
                    return this.multiply(previous.price , logn) * previous.quan + this.multiply(current.price , logn) * current.quan;
                } else {
                    return previous + this.multiply(current.price , logn) * current.quan;
                }
            });
        } else {
            sum = this.multiply(tmpNum[0].price , logn) * tmpNum[0].quan;
        }
        return currency + (sum / logn);
    }
}
export
default Util;