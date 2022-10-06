import { setLSData } from '@/utils/helpers/local-storage-helpers';
import { addPhantom, moveElement, reorder, addMovinglement } from '@/utils/helpers/elements-helpers';
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
            title: 'Паспорт 1',
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
        elems: [
          {
            id: 'element-0',
            order: 0,
            targetPosition: false,
          },
        ],
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
            title: 'Паспорт 2',
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
    freeElements: [
      {
        id: 'parking-0',
        order: 0,
        targetPosition: false,
      },
    ],
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
      const order = state.freeElements.length;
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
      if (!freeElements.length) {
        freeElements.push({
          id: 'parking-0',
          order: 0,
          targetPosition: false,
        });
      }
      state.freeElements = freeElements;
      setLSData(LOCAL_STORAGE_KEYS.freeElements, freeElements);
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
            if (categoryId === 'parking') {
              state.freeElements = addPhantom(
                type,
                state.freeElements,
                categoryId,
                {
                  sourceOrder,
                  destinationOrder,
                  title
                }
              );
            } else {
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
            }
            break;
          default:
        }
        state.isPhantomCreated = true;
      }
    },
    removePhantomElement(state, { fromCategoryId, toCategoryId, fromElementId, fromElementOrder, toElementOrder, type }) {
      console.log('removePhantomElement: ', { fromCategoryId, toCategoryId, fromElementId, fromElementOrder, toElementOrder, type });
      let swappedCategories;
      let filteredCategories;
      let movingElement = null;

      switch (type) {
        case 'category':
          filteredCategories = state.categories.filter(category => category.id !== 'category#phantom');
          swappedCategories = moveElement({
            elements: filteredCategories,
            elementId: fromElementId,
            oldElementOrder: fromElementOrder,
            newElementOrder: toElementOrder
          });
          // console.log('moveElement: ', swappedCategories);
          state.categories = reorder(swappedCategories);
          break;
        case 'element':
          /**
           * 1) Перемещение внутри категории
           * 2) Перемещение между катерогий
           * 3) Перемещение между категорией и парковкой
          */
          if (fromCategoryId === 'parking') {
            // const filteredElements = state.freeElements.filter(element => element.id !== 'element#phantom');
            state.freeElements = state.freeElements.filter((element) => {
              if (element.id === fromElementId) {
                movingElement = element;
                return false;
              };
              return element.id !== 'element#phantom';
            });
            state.freeElements = reorder(state.freeElements);

            if (toCategoryId === 'parking') {
              state.freeElements = addMovinglement({ elements: state.freeElements, movingElement, fromElementId, oldElementOrder: fromElementOrder, newElementOrder: toElementOrder });
            } else {
              state.categories = state.categories.map((category) => {
                if (category.id === toCategoryId) {
                  category.elems = addMovinglement({ elements: category.elems, movingElement, fromElementId, oldElementOrder: fromElementOrder, newElementOrder: toElementOrder });
                }
                return category;
              });
            }
          } else {
            // 1) Проверка, где перемещаем: внутри категории или нет?
            if (fromCategoryId === toCategoryId) {
              // действуем по упрощенной схеме - без копирования эл-та
              state.categories = state.categories.map((category) => {
                if (category.id === fromCategoryId) {
                  category.elems = category.elems.filter((element) => element.id !== 'element#phantom');
                  const swappedElements = moveElement({
                    elements: category.elems,
                    elementId: fromElementId,
                    oldElementOrder: fromElementOrder,
                    newElementOrder: toElementOrder
                  });
                  category.elems = reorder(swappedElements);
                }
                return category;
              });
            } else {
              // Здесь нужно сделать тоже самое, но с промежуточным копированием перемещаемого эл-та
              // 1) Копируем эл-т, потом его удаляем из стартовой категории, попутно удаляем фантом
              state.categories = state.categories.map((category) => {
                if (category.id === fromCategoryId) {
                  category.elems = category.elems.filter((element) => {
                    if (element.id === fromElementId) {
                      movingElement = element;
                      return false;
                    };
                    return element.id !== 'element#phantom';
                  });
                  category.elems = reorder(category.elems);
                }
                return category;
              });

              // 2) Проверка - куда переносим эл-т: в другую категорию или в парковку?
              if (toCategoryId === 'parking') {
                state.freeElements = addMovinglement({ elements: state.freeElements, movingElement, fromElementId, oldElementOrder: fromElementOrder, newElementOrder: toElementOrder });
                // state.freeElements = [...state.freeElements, movingElement];
                // const swappedElements = moveElement({
                //   elements: state.freeElements,
                //   elementId: fromElementId,
                //   oldElementOrder: fromElementOrder, // здесь эта пара параметров тоже должна работать
                //   newElementOrder: toElementOrder
                // });
                // state.freeElements = reorder(swappedElements);
              } else {
                state.categories = state.categories.map((category) => {
                  if (category.id === toCategoryId) {
                    category.elems = addMovinglement({ elements: category.elems, movingElement, fromElementId, oldElementOrder: fromElementOrder, newElementOrder: toElementOrder });
                    // category.elems = [...category.elems, movingElement];
                    // const swappedElements = moveElement({
                    //   elements: category.elems,
                    //   elementId: fromElementId,
                    //   oldElementOrder: fromElementOrder,
                    //   newElementOrder: toElementOrder
                    // });
                    // category.elems = reorder(swappedElements);
                  }
                  return category;
                });
              }
            }
          }
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
    swapElements(state, { sourceOrder, destinationOrder, fromCategoryId, toCategoryId }) {
      console.log('swapElements: ', { sourceOrder, destinationOrder, fromCategoryId, toCategoryId });

      if (fromCategoryId === toCategoryId) {
        if (toCategoryId === 'parking') {
          // внутри парковки
          state.freeElements = state.freeElements.map((element) => {
            if (element.order === destinationOrder) {
              element.targetPosition = true;
            }
            return element;
          });

          state.freeElements = addPhantom(
            'element',
            state.freeElements,
            null,
            {
              sourceOrder,
              destinationOrder,
              title: '',
              swap: true
            }
          );
        } else {
          // внутри категории
          state.categories = state.categories.map((category) => {
            if (category.id === fromCategoryId) {
              category.elems = category.elems.map((element) => {
                element.targetPosition = false;
                return element;
              });
            }
            return category;
          });

          state.categories = state.categories.map((category) => {
            if (category.id === toCategoryId) {
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
        }
      } else {
        // между категориями
        if (fromCategoryId === 'parking') {
          // из парковки в категорию

        } else {
          // из категории в парковку

        }
      }

      // if (toCategoryId === 'parking') {
      //   state.freeElements = state.freeElements.map((element) => {
      //     if (element.order === destinationOrder) {
      //       element.targetPosition = true;
      //     }
      //     return element;
      //   });
      // } else {
      //   state.categories = state.categories.map((category) => {
      //     if (category.id === toCategoryId) {
      //       category.elems = addPhantom(
      //         'element',
      //         category.elems,
      //         null,
      //         {
      //           sourceOrder,
      //           destinationOrder,
      //           title: '',
      //           swap: true
      //         }
      //       );
      //     }
      //     return category;
      //   });
      // }
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
