import Tween from 'tween.js';
(function() {
    let lastTime = 0;
    let vendors = ['ms', 'moz', 'webkit', 'o'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            let currTime = new Date().getTime();
            let timeToCall = Math.max(0, 16 - (currTime - lastTime));
            let id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/*
 * @param:
 *   dom 进行动画的元素
 *   property 元素需要变化的熟悉
 *   during  动画的时间
 *   delay   动画延迟时间
 *   repeat   动画重复的次数
 *   alternate    动画是否反方向运动
 *   easing    动画运动方式
 *       Linear   线性缓动
 *       Quadratic 二次方缓动
 *       Cubic   三次方缓动
 *       Quartic     四次方缓动
 *       Quintic     五次方缓动
 *       Sinusoidal    正弦曲线缓动
 *       Exponential     指数函数缓动
 *       Circular    环形函数缓动
 *       Elastic     弹性伸缩缓动
 *       Back    返回缓动
 *       Bounce      弹跳伸缩缓动
 *       除了linear以外都有in out 和inout 属性 比如 cubic-in/cubic-out/cubic-in-out
 *   callbacks    动画的一些回调
 *        start()  开始运动时的回调
 *        update()  每次动画运动时的回调
 *        complete()  动画完成的回调
 *        stop()  动画暂定时的回调
 */



function animation({
    dom, property, during = 2000, delay = 0, repeat = 0, alternate = false, easing = Tween.Easing.Linear.None, callbacks = {}
}) {
    // parse the property
    let keys = Object.keys(property);
    let srcPro = getPrimaryProperty(keys);
    let {
        nums: distPro,
        units: unitPro
    } = parseProperty(property);
    let easingMethod = easing;

    ['start', 'update', 'complete', 'stop'].forEach((val) => {
        if (!callbacks.hasOwnProperty(val)) {
            callbacks[val] = () => {};
        }
    });


    // 处理缓动方法
    if (Object.prototype.toString.call(easing) === '[object String]') {
        if (easing === 'linear') {
            easingMethod = Tween.Easing.Linear.None;
        } else {
            let [main, sec, thi] = easing.split('-');
            main = capitalize(main);
            sec = capitalize(sec);
            thi = capitalize(thi);
            easingMethod = Tween.Easing[main];
            if (thi) {
                easingMethod = easingMethod[sec + thi];
            }
            if (sec && !thi) {
                easingMethod = easingMethod[sec];
            }
        }
    }

    function capitalize(str) {
        if (!str) return false;
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

    // 处理带有单位的属性值，如：200px ，把单位与数字分离。200，px
    function parsePropertyValue(value) {
        let num = 0,
            unit = '';
        if (!/^\d*\.?\d*$/.test(value)) {
            let result = /(\d*\.?\d*)(\w+)/i.exec(value)
            num = Number(result[1]);
            unit = result[2];
        } else {
            num = Number(value);
        }
        return {
            num, unit
        }
    }

    //处理整个需要动画的属性
    function parseProperty(property = {}) {
        let nums = {},
            units = {};
        for (let key in property) {
            let value = property[key];
            let parsedValue = parsePropertyValue(value);
            units[key] = parsedValue.unit;
            nums[key] = parsedValue.num;
        }
        return {
            nums, units
        };
    }

    //获取需要动画属性的最初值
    function getPrimaryProperty(keys = []) {
        let rules = getComputedStyle(dom),
            nums = {},
            preset = ['auto'],
            parsedValue;
        keys.forEach((key) => {
            if (isStyleProperty(key)) {//判断是不是css属性还是非css属性
                parsedValue = parsePropertyValue(rules[key]).num;
            } else {
                parsedValue = dom[key];
            }
            if (preset.indexOf(parsedValue) > -1) {
                nums[key] = 0
            } else {
                nums[key] = parsedValue;
            }
        })
        return nums;
    }

    //更新动画元素上的属性
    function updateProperty() {
        for (let key in srcPro) {
            if (isStyleProperty(key)) {
                dom.style[key] = srcPro[key] + unitPro[key];
            } else {
                dom[key] = srcPro[key] + unitPro[key];
            }
        }
    }

    function isStyleProperty(key) {
        let el = document.createElement('div');
        return key in el.style;
    }

    let t = new Tween.Tween(srcPro).to(distPro, during).delay(delay).repeat(repeat).easing(easingMethod);
    if (alternate) {
        t.yoyo(true);
    }
    t.onStart(() => {
        callbacks.start();
    }).onUpdate(() => {
        updateProperty();
        callbacks.update();
    }).onComplete(() => {
        callbacks.complete();
    }).onStop(() => {
        callbacks.stop();
    })

    function animate() {
        requestAnimationFrame(animate);
        Tween.update();
    }

    function start() {
        t.start();
        animate();
    }

    function stop() {
        t.stop();
    }
    return {
        start,
        stop
    }
}

export
default animation;