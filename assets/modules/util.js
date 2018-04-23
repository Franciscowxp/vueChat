const remToPx = (rem) => {
    let px, remBase = document.documentElement.style.getPropertyValue('font-size');
    if (remBase) {
        px = rem * Number.parseFloat(remBase);
    } else {
        px = rem;
    }
    return Number.parseInt(px, 10);
};

const add = (...data) => {
    let lenData = [];
    data.forEach((val) => {
        let tmpVal = '' + val;
        let len = tmpVal.split('.')[1] ? tmpVal.split('.')[1].length : 0;
        lenData.push(len);
    })
    const logn = Math.pow(10, Math.max(...lenData));
    let sum = data.reduce((previous, current, index) => {
        if (index === 1) {
            return multiply(previous, logn) + multiply(current, logn);
        } else {
            return previous + multiply(current, logn);
        }
    });
    return sum / logn;
};

const multiply = (...data) => {
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
        return changeToNum(previous) * changeToNum(current);
    });
    return sum / mulLen;
};

const changeToNum = (string) => {
    return Number(String(string).replace('.', ''));
};

const getCaretPosition = (editableDiv) => {
    let caretPos = 0,
        dom = null,
        sel, range;
    sel = window.getSelection();
    if (sel.rangeCount) {
        range = sel.getRangeAt(0);
        dom = sel.anchorNode;
        caretPos = sel.anchorOffset;
    }
    return {
        position: caretPos,
        dom
    };
};

const setCaretPosition = ({ dom, position }) => {
    let range = document.createRange();
    let sel = window.getSelection();
    range.setStart(dom, position);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
};

export {
    remToPx,
    add,
    multiply,
    getCaretPosition,
    setCaretPosition
};