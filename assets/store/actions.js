const actions = {
    userAct({commit}, obj){
        commit('USER', obj);
    },
    caretAct({commit}, obj) {
        commit('CARET', obj);
    }
};

export default actions;