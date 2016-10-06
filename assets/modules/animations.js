import Vue from 'vue';
import animation from './animaUtil';

Vue.transition('slideupdown', {
    css: false,
    enter: function(el, done) {
        // 元素已被插入 DOM
        // 在动画结束后调用 done
        let height = getComputedStyle(el).height;
        el.style.overflow='hidden';
        el.style.height = '0px';
        let ani = animation({
            dom: el,
            property: {
                height: height
            },
            during:200,
            callbacks: {
                updata(){
                    console.log(this)
                },
                complete() {
                    done();
                    el.style.removeProperty('height');
                }
            }
        })
        ani.start();
    },
    enterCancelled: function(el) {
        // $(el).stop()
    },
    leave: function(el, done) {
        // 与 enter 相同
        let ani = animation({
            dom: el,
            property: {
                height: '0px'
            },
            during:200,
            easing: 'cubic-in-out',
            callbacks: {
                complete() {
                    done();
                    el.style.removeProperty('height');
                }
            }
        })
        ani.start();
    },
    leaveCancelled: function(el) {
        // $(el).stop()
    }
});