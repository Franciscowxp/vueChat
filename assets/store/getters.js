const getters = {
    getUser(state) {
        return state.user;
    },
    getDraft(state) {
        return state.draft;
    },
    getCaret(state) {
        return state.caret;
    }
};

export default getters;