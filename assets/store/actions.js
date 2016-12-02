const actions = {
    userAct({commit}, obj){
        commit('USER', obj);
    },
    draftAct({commit}, val){
        commit('DRAFT', val);
    },
    caretAct({commit}, obj) {
        commit('CARET', obj);
    }
};

export default actions;