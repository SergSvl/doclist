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
          @mouseup="(e) => mouseUp(e)"
        />
      </div>
    </div>

    <div v-if="element.targetPosition" class="flex flex-wrap w-full h-1.5 bg-blue-500"></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import editImage from '@/assets/svg/edit.svg';
import removeImage from '@/assets/svg/deleteElement.svg';
import moveImage from '@/assets/svg/move.svg';
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
      editImage,
      removeImage,
      moveImage,
      effectWait: 300,
      phantomId: 'phantom',
      globalCoords: { x: null, y: null },
      windowCoords: { x: null, y: null },
      mouseDownElement: null,
      isMovingStarted: false,
      startOrder: null,
      destinationOrder: undefined,
      startCategoryId: null,
      domElements: [],
      foundElement: null,
      elementPosition: [],
      nextFind: false,
      // stepOfCheck: 5,
      // step: 0,
    };
  },

  mounted() {
    this.setDomElements();
  },

  watch: {
    elements() { setTimeout(() => { this.setDomElements(); }, 0); },
    mouseDownElement() { setTimeout(() => { this.setDomElements(); }, 0); }
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
      // console.log('mouseDown: ', e);
      const elementId = e.target.dataset.id;
      const element = document.querySelector(`.${elementId}`);
      this.startCategoryId = element.dataset.categoryId;
      this.foundElement = {
        categoryId: element.dataset.categoryId,
      };
      this.mouseDownElement = element;
      this.globalCoords = {
        x: e.screenX,
        y: e.screenY,
      };
      this.windowCoords = {
        x: element.offsetLeft,
        y: element.offsetTop,
      };

      this.elementToDrag(e, element);
    },

    elementToDrag(e, element) {
      // console.log('elementToDrag: ', element);
      this.setMouseDownElementStyles(e, element);
      const order = element.dataset.order;
      // console.log('elementToDrag order: ', order);
      this.startOrder = order;
      this.addElementPhantom({ categoryId: element.dataset.categoryId, sourceOrder: order, destinationOrder: order, title: this.element.title, type: 'element' });
    },

    setMouseDownElementStyles(e, element) {
      const width = element.clientWidth + 'px';
      element.style.width = width;
      element.style.transitionProperty = 'none';
      element.style.boxShadow = '2px 2px 10px rgba(52, 137, 255, 0.9)';
      element.style.zIndex = '20';
      element.style.left = element.offsetLeft + 'px';
      element.style.top = element.offsetTop + 'px';
      element.style.marginTop = '0px';
      element.style.position = 'absolute';
    },

    setMouseMoveStyles() {
      this.mouseDownElement.style.marginTop = '0px';
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

    mouseMove(e) {
      if (this.mouseDownElement !== null) {
        if (!this.isMovingStarted) {
          this.setMouseMoveStyles();
          this.isMovingStarted = true;
        }
        this.moveElement(e);
      }
    },

    moveElement(e) {
      // if (this.step < this.stepOfCheck) {
      // this.step++;

      const mouseShiftX = e.screenX - this.globalCoords.x;
      const mouseShiftY = e.screenY - this.globalCoords.y;

      // console.log('screenX, screenY: ', { screenX: e.screenX, screenY: e.screenY });
      // console.log('x, y: ', { x: this.globalCoords.x, y: this.globalCoords.y });
      // console.log('mouseShiftX, mouseShiftY: ', { mouseShiftX, mouseShiftY });

      this.mouseDownElement.style.left =
      this.windowCoords.x + mouseShiftX + 'px';
      this.mouseDownElement.style.top =
      this.windowCoords.y + mouseShiftY + 'px';
      // console.log('windowCoordsX, windowCoordsY: ', { windowCoordsX: this.windowCoords.x, windowCoordsY: this.windowCoords.y });
      // console.log('left, top: ', { left: this.mouseDownElement.style.left, top: this.mouseDownElement.style.top });
      // }

      this.move(e);
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

    mouseUp(e) {
      this.isMovingStarted = false;
      if (this.mouseDownElement !== null) {
        this.phantomElement(e);
      }
    },

    phantomElement(e) {
      this.setMouseUpElementStyles();
      setTimeout(() => {
        this.removePhantomElement({
          fromCategoryId: this.startCategoryId,
          toCategoryId: this.foundElement.categoryId,
          fromElementId: e.target.dataset.id,
          fromElementOrder: this.mouseDownElement.dataset.order,
          toElementOrder: this.destinationOrder,
          type: 'element'
        });
        this.destinationOrder = undefined;
        this.foundElement = null;
      }, this.effectWait);
    },
  },
};
</script>
