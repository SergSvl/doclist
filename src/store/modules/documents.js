import { setLSData } from '@/utils/helpers/local-storage-helpers';
import { addPhantom, moveElement, reorder } from '@/utils/helpers/elements-helpers';
import { LOCAL_STORAGE_KEYS } from '@/utils/local-storage-keys';

export default {
  namespaced: true,
  state: {
    // categories: [],
    filteredCategories: [],
    isFiltration: false,
    categories: [
      {
        id: 'category-0',
        order: 0,
        targetPosition: false,
      },
      {
        id: 'category-1',
        order: 1,
        title: 'Обязательные для всех',
        elems: [
          {
            id: 'element-0',
            order: 0,
            targetPosition: false,
          },
          {
            id: 'element-1',
            order: 1,
            title: 'Паспорт',
            targetPosition: false,
          },
          {
            id: 'element-2',
            order: 2,
            title: 'Трудовая',
            targetPosition: false,
          },
        ],
        isOpened: true,
        targetPosition: false,
      },
      {
        id: 'category-2',
        order: 2,
        title: 'Обязательные для трудоустройства',
        elems: [],
        isOpened: false,
        targetPosition: false,
      },
      {
        id: 'category-3',
        order: 3,
        title: 'Специальные',
        elems: [
          {
            id: 'element-0',
            order: 0,
            targetPosition: false,
          },
          {
            id: 'element-11',
            order: 1,
            title: 'Паспорт',
            targetPosition: false,
          },
          {
            id: 'element-22',
            order: 2,
            title: 'Страховое свидетельство',
            targetPosition: false,
          },
        ],
        isOpened: false,
        targetPosition: false,
      },
    ],
    freeElements: [],
    isPhantomCreated: false,
  },

  getters: {
    categories: state => state.categories,
    freeElements: state => state.freeElements,
    filteredCategories: state => state.filteredCategories,
    isFiltration: state => state.isFiltration,
  },

  mutations: {
    setCategories(state, payload) {
      state.categories = payload;
      setLSData(LOCAL_STORAGE_KEYS.categories, payload);
    },
    setFreeElements(state, payload) {
      state.freeElements = payload;
      setLSData(LOCAL_STORAGE_KEYS.freeElements, payload);
    },
    addCategory(state, { title }) {
      const order = state.categories.length + 1;
      state.categories.push({
        id: `category-${Date.now()}`,
        order,
        title: `${title} №${order}`,
        elems: [
          {
            id: 'element-0',
            order: 0,
            targetPosition: false,
          },
        ],
        isOpened: false,
      });
      setLSData(LOCAL_STORAGE_KEYS.categories, state.categories);
    },
    removeCategory(state, { id }) {
      // console.log('removeCategory: ', id);
      const categories = state.categories.filter(category => category.id !== id);
      state.categories = categories;
      setLSData(LOCAL_STORAGE_KEYS.categories, state.categories);
    },
    addElement(state, { title }) {
      const order = state.freeElements.length + 1;
      state.freeElements.push({
        id: `element-${Date.now()}`,
        order,
        title: `${title} №${order}`,
        targetPosition: false,
      });
      setLSData(LOCAL_STORAGE_KEYS.freeElements, state.freeElements);
    },
    removeElement(state, { id }) {
      const freeElements = state.freeElements.filter(element => element.id !== id);
      state.freeElements = freeElements;
      setLSData(LOCAL_STORAGE_KEYS.freeElements, state.freeElements);
    },
    filterCategories(state, { text }) {
      state.isFiltration = true;
      const categoriesJSON = JSON.stringify(state.categories);
      const categories = JSON.parse(categoriesJSON);
      const categoriesWithFilteredElems = categories.map(category => {
        const elems = category.elems.filter(elem => elem.title.indexOf(text) !== -1);
        category.elems = elems;
        return category;
      });
      const filteredCategories = categoriesWithFilteredElems.filter(category => category.title.indexOf(text) !== -1 || category.elems.length);
      state.filteredCategories = filteredCategories;
    },
    resetFiltration(state) {
      state.isFiltration = false;
    },
    toggleCategory(state, { id }) {
      const categories = state.categories.map(category => {
        if (category.id === id) {
          category.isOpened = !category.isOpened;
        }
        return category;
      });
      state.categories = categories;
      setLSData(LOCAL_STORAGE_KEYS.categories, state.categories);
      const filteredCategories = state.filteredCategories.map(category => {
        if (category.id === id) {
          category.isOpened = !category.isOpened;
        }
        return category;
      });
      state.filteredCategories = filteredCategories;
    },
    addElementPhantom(state, { categoryId = null, sourceOrder, destinationOrder, title, type }) {
      if (!state.isPhantomCreated) {
        // console.log('addElementPhantom: ', { categoryId, sourceOrder, destinationOrder, title, type });

        switch (type) {
          case 'category':
            state.categories = addPhantom(
              type,
              state.categories,
              categoryId,
              {
                sourceOrder,
                destinationOrder,
                title
              }
            );
            break;
          case 'element':
            state.categories = state.categories.map((category) => {
              if (category.id === categoryId) {
                category.elems = addPhantom(
                  type,
                  category.elems,
                  null,
                  {
                    sourceOrder,
                    destinationOrder,
                    title
                  }
                );
              }
              return category;
            });
            break;
          default:
        }
        state.isPhantomCreated = true;
      }
    },
    removePhantomElement(state, { categoryId, fromElementId, toElementOrder, type }) {
      console.log('removePhantomElement: ', { categoryId, fromElementId, toElementOrder, type });
      let swappedCategories;
      let filteredCategories;

      switch (type) {
        case 'category':
          filteredCategories = state.categories.filter(category => category.id !== 'category#phantom');
          swappedCategories = moveElement({
            elements: filteredCategories,
            elementId: fromElementId,
            newElementOrder: toElementOrder
          });
          console.log('moveElement: ', swappedCategories);
          state.categories = reorder(swappedCategories);
          break;
        case 'element':
          state.categories = state.categories.map((category) => {
            if (category.id === categoryId) {
              const filteredElements = category.elems.filter(element => element.id !== 'element#phantom');
              const swappedElements = moveElement({
                elements: filteredElements,
                elementId: fromElementId,
                newElementOrder: toElementOrder
              });
              category.elems = reorder(swappedElements);
            }
            return category;
          });
          break;
        default:
      }
      setLSData(LOCAL_STORAGE_KEYS.categories, state.categories);
      state.isPhantomCreated = false;
    },
    swapCategories(state, { sourceOrder, destinationOrder, categoryId }) {
      console.log('swapCategories: ', { sourceOrder, destinationOrder, categoryId });

      state.categories = state.categories.filter((category) => category.id !== 'target#position');
      state.categories = addPhantom(
        'category',
        state.categories,
        categoryId,
        {
          sourceOrder,
          destinationOrder,
          title: '',
          swap: true
        }
      );
    },
    swapElements(state, { sourceOrder, destinationOrder, categoryId }) {
      // console.log('swapElements: ', { sourceOrder, destinationOrder, categoryId });

      state.categories = state.categories.map((category) => {
        if (category.id === categoryId) {
          category.elems = addPhantom(
            'element',
            category.elems,
            null,
            {
              sourceOrder,
              destinationOrder,
              title: '',
              swap: true
            }
          );
        }
        return category;
      });
    },
  },

  actions: {
    setCategories({ commit }, payload) {
      commit('setCategories', payload);
    },
    setFreeElements({ commit }, payload) {
      commit('setFreeElements', payload);
    },
    addCategory({ commit }, payload) {
      commit('addCategory', payload);
    },
    removeCategory({ commit }, payload) {
      commit('removeCategory', payload);
    },
    addElement({ commit }, payload) {
      commit('addElement', payload);
    },
    removeElement({ commit }, payload) {
      commit('removeElement', payload);
    },
    filterCategories({ commit }, payload) {
      commit('filterCategories', payload);
    },
    resetFiltration({ commit }) {
      commit('resetFiltration');
    },
    toggleCategory({ commit }, payload) {
      commit('toggleCategory', payload);
    },
    addElementPhantom({ commit }, payload) {
      commit('addElementPhantom', payload);
    },
    removePhantomElement({ commit }, payload) {
      commit('removePhantomElement', payload);
    },
    swapCategories({ commit }, payload) {
      commit('swapCategories', payload);
    },
    swapElements({ commit }, payload) {
      commit('swapElements', payload);
    },
  },
};
