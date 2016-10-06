import Vue from 'vue';
import Vuex from 'vuex';
import mutations from 'store/mutations';

Vue.use(Vuex);

const state = {
    cartNum: 0
}

export
default new Vuex.Store({
    state, mutations
});