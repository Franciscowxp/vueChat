const mutations = {
    USER(state, obj) {
        for(let [key,val] of Object.entries(obj)) {
            state.user[key] = val;
        }
    },
    CARET(state, obj) {
        for(let [key,val] of Object.entries(obj)) {
            state.caret[key] = val;
        }
    }
};

export default mutations;


