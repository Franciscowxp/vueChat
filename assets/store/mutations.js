const mutations = {
    USER(state, obj) {
        state.user = obj;
    },
    CARET(state, obj) {
        for(let [key,val] of Object.entries(obj)) {
            state.caret[key] = val;
        }
    }
};

export default mutations;


