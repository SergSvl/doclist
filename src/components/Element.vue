<template>
  <div class="flex flex-wrap w-full items-center justify-between -border border-gray-300 transition-all duration-200">
    <div v-if="element.id === 'element#phantom'"
      :class="`${element.id} flex items-center w-full border justify-between border-gray-300 h-9 transition-all duration-200 opacity-30`"
    >
      <div class="flex items-center -border-2">
        <div class="font-normal text-xs pl-4">{{ element.title }}</div>
      </div>
      <div class="flex items-center right-0 -border-2 h-full">
        <img class="mr-2 p-2 -border hover:cursor-pointer" :src="editImage" />
        <img
          class="mr-2 p-2 -border hover:cursor-pointer"
          :src="removeImage"
          @click="removeHandler"
        />
        <img
          :data-id="element.id"
          class="mr-2 p-2 -border hover:cursor-pointer"
          :src="moveImage"
        />
      </div>
    </div>
    <div
      v-else-if="element.id === 'parking-0'"
      :data-id="element.id"
      :data-category-id="categoryId"
      :data-order="element.order"
      :class="`${element.id} w-full -border h-1`"
    >
    </div>
    <div
      v-else-if="element.id !== 'element-0'"
      :data-id="element.id"
      :data-category-id="categoryId"
      :data-order="element.order"
      :class="`${element.id} flex items-center w-full border justify-between border-gray-300 h-9 bg-white transition-all duration-200`"
    >
      <div class="flex items-center -border-2">
        <div class="font-normal text-xs pl-4">{{ element.title }}</div>
      </div>
      <div class="flex items-center right-0 -border-2 h-full">
        <img class="mr-2 p-2 -border hover:cursor-pointer" :src="editImage" />
        <img
          class="mr-0 p-2 -border border-green-300 hover:cursor-pointer"
          :src="removeImage"
          @click="removeHandler"
        />
        <img
          :data-id="element.id"
          class="my-0 p-2 px-4 -border border-red-300 hover:cursor-pointer"
          :src="moveImage"
          :draggable="false"
          @mousedown="(e) => mouseDown(e)"
          @mousemove="(e) => mouseMove(e)"
          @mouseup="(e) => mouseUpOnElement(e)"
        />
      </div>
    </div>

    <div v-if="element.targetPosition" class="flex flex-wrap w-full h-1.5 bg-blue-500"></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import draggable from '@/mixins/draggable';

export default {
  name: 'AppElement',
  mixins: [draggable],
  props: {
    categoryId: {
      type: String,
      default: '',
    },
    element: {
      type: Object,
      default: null,
    },
    elements: {
      type: Array,
      default: null,
    },
  },
  components: {},

  data() {
    return {
      domElements: [],
      // stepOfCheck: 5,
      // step: 0,
    };
  },

  methods: {
    ...mapActions('documents', ['removeElement', 'addElementPhantom', 'removePhantomElement', 'swapElements']),

    setDomElements() {
      if (this.mouseDownElement === null) {
        return;
      }

      const elementBorders = [];
      // const categoryElements = document.getElementById('categoriesParent').childNodes;
      // console.log('categoryElements:', categoryElements);
      const categoryElements = document.querySelectorAll('.elementsParent');

      for (let k = 0; k < categoryElements.length; k++) {
        const elements = categoryElements[k].childNodes;
        // console.log('elements:', elements);

        for (let i = 0; i < elements.length; i++) {
          const height = parseFloat(elements[i].offsetHeight);
          const resultTop = elements[i].offsetTop;
          const resultBottom = elements[i].offsetTop + height;
          // const resultTop = elements[i].offsetTop + 1;
          // const resultBottom = elements[i].offsetTop + height - 1;

          // console.log(' categoryElements[' + k + ']');
          // console.log(' elements[' + i + ']:', elements[i]);
          // console.log(' elements[' + i + '].dataset.id:', elements[i].dataset.id);
          // console.log(' elements[' + i + '].title:', this.elements[i].title);
          // console.log(' elements[' + i + '].dataset:', elements[i].dataset);
          // console.log(' height:', height);
          // console.log(' resultTop:', resultTop);
          // console.log(' resultBottom:', resultBottom);
          // // console.log('mouseDownElement.dataset.id:', this.mouseDownElement.dataset.id);
          // console.log('---');

          if (elements[i].dataset.id !== this.mouseDownElement.dataset.id && elements[i].id !== 'target#position' && elements[i].dataset.id !== 'element-0') {
            elementBorders.push({
              id: elements[i].dataset.id,
              categoryId: elements[i].dataset.categoryId,
              order: parseFloat(elements[i].dataset.order),
              top: resultTop,
              left: elements[i].offsetLeft,
              bottom: resultBottom,
            });
          }
        }
      }
      // console.log('categories: ', this.categories);
      console.log('elementBorders:', elementBorders);
      this.domElements = elementBorders;
    },

    removeHandler() {
      this.removeElement({ id: this.element.id });
    },

    mouseDown(e) {
      const { element } = this.getClickedElement(e);

      this.startCategoryId = element.dataset.categoryId;
      this.foundElement = {
        categoryId: element.dataset.categoryId,
      };
      this.destinationOrder = element.dataset.order;

      this.elementToDrag(e, element);
    },

    setMouseUpElementStyles() {
      if (this.foundElement !== null) {
        this.mouseDownElement.style.left = this.foundElement.left + 'px';
        this.mouseDownElement.style.top = this.foundElement.top + 'px';
      } else {
        this.mouseDownElement.style.left = this.windowCoords.x + 'px';
        this.mouseDownElement.style.top = this.windowCoords.y + 'px';
      }

      this.mouseDownElement.style.transitionProperty = 'left, top, box-shadow';
      this.mouseDownElement.style.transitionDuration = this.effectWait + 'ms';
      this.mouseDownElement.style.transitionTimingFunction = 'linear';

      setTimeout(() => {
        this.mouseDownElement.style.boxShadow = '0px 0px 0px gray';
        this.mouseDownElement.style.transitionProperty = 'none';
        this.mouseDownElement.style.left = '0px';
        this.mouseDownElement.style.top = '0px';
        this.mouseDownElement.style.width = '';
        this.mouseDownElement.style.position = '';
      }, this.effectWait);

      setTimeout(() => {
        this.mouseDownElement.style.zIndex = '';
        this.mouseDownElement = null;
      }, this.effectWait * 2);
    },

    move(e) {
      // if (this.step < this.stepOfCheck) {
      //   this.step++;
      //   return;
      // }

      const findEnterElement = this.domElements.filter((elem) => {
        if (elem.top <= e.clientY && e.clientY <= elem.bottom) {
          this.nextFind = true;
          return true;
        } else {
          return false;
        }
      })[0];

      // if (findEnterElement !== undefined) {
      //   console.log('findEnterElement.id: ', findEnterElement.id);
      //   console.log('findEnterElement.categoryId: ', findEnterElement.categoryId);
      //   console.log('findEnterElement.order: ', findEnterElement.order);
      //   console.log('findEnterElement.top: ', findEnterElement.top);
      //   console.log('findEnterElement.bottom: ', findEnterElement.bottom);
      // }

      if (
        this.nextFind &&
        findEnterElement !== undefined &&
        findEnterElement.id !== 'target#position'
      ) {
        this.foundElement = findEnterElement;

        // console.log('findEnterElement.order: ', findEnterElement.order);

        // if (this.startOrder !== findEnterElement.order && this.startCategoryId !== findEnterElement.categoryId) {
        if (this.startOrder !== findEnterElement.order) {
          // console.log('move: ', { start: this.startOrder, found: findEnterElement.order });
          this.swapElements({
            sourceOrder: this.startOrder,
            destinationOrder: findEnterElement.order,
            fromCategoryId: this.startCategoryId,
            toCategoryId: findEnterElement.categoryId,
          });

          this.startOrder = findEnterElement.order;
          this.destinationOrder = findEnterElement.order;
        }
        this.nextFind = false;
        // this.step = 0;
      }
    },
  },
};
</script>
