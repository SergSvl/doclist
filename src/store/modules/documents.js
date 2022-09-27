export default {
  namespaced: true,
  state: {
    // categories: [],
    categories: [
      {
        id: '1',
        order: 1,
        elems: [],
        isOpened: true,
      },
      {
        id: '2',
        order: 2,
        elems: [],
        isOpened: false,
      },
      {
        id: '3',
        order: 4,
        elems: [],
        isOpened: false,
      },
    ],

    freeElements: [],
  },

  getters: {
    categories: state => state.categories,
  },

  mutations: {
    setCategories(state, payload) {
      // console.log('setCategories:', payload);
      state.categories = payload;
    },
  },

  actions: {
    setCategories({ commit }, payload) {
      // console.log('Action > setCategories:', payload)
      commit('setCategories', payload);
    },
  },
};
