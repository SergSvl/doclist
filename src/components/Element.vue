<template>
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
    v-else
    :data-id="element.id"
    :data-order="element.order"
    :class="`element-${element.id} flex items-center w-full border justify-between border-gray-300 h-9 bg-white transition-all duration-200`"
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
        @mousedown="(e) => mouseDown(e)"
        @mousemove="(e) => mouseMove(e)"
        @mouseup="(e) => mouseUp(e)"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import editImage from '@/assets/svg/edit.svg';
import removeImage from '@/assets/svg/deleteElement.svg';
import moveImage from '@/assets/svg/move.svg';

export default {
  name: 'AppCategory',
  props: {
    element: {
      type: Object,
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
      phantomData: null,
      foundElement: null,
      domElements: [],
    };
  },

  // created() {
  //   console.log('category: ', this.element.isOpened);
  // },

  mounted() {
    this.setDomElements();
  },

  methods: {
    ...mapActions('documents', ['removeElement', 'addElementPhantom', 'removePhantomElement']),

    setDomElements() {
      // let element = '';
      const elementBorders = [];
      // const elements = document.getElementById('categoriesParent').childNodes;
    },

    removeHandler() {
      this.removeElement({ id: this.element.id });
    },

    mouseDown(e) {
      // console.log('mouseDown: ', e);
      const elementId = e.target.dataset.id;
      const element = document.querySelector(`.element-${elementId}`);
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
      console.log('element: ', element);
      this.setMouseDownElementStyles(e, element);
      const order = element.dataset.order;
      this.addElementPhantom({ categoryId: e.target.dataset.id, order, title: this.element.title, type: 'element' });
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
        this.mouseDownElement.style.top = this.foundElement.top + this.marginTopElement + 'px'; // margin-top compensation
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
      const mouseShiftX = e.screenX - this.globalCoords.x;
      const mouseShiftY = e.screenY - this.globalCoords.y;
      this.mouseDownElement.style.left =
        this.windowCoords.x + mouseShiftX + 'px';
      this.mouseDownElement.style.top =
        this.windowCoords.y + mouseShiftY + 'px';
      this.move(e);
    },

    move(e) {
      // const findEnterElement = domElements.filter((elem) => {
      //   if (elem.top <= e.clientY && e.clientY <= elem.bottom) {
      //     setNextFind(true);
      //     return true;
      //   } else {
      //     return false;
      //   }
      // })[0];
      // if (
      //   nextFind &&
      //   findEnterElement !== undefined &&
      //   findEnterElement.id !== phantomData.id
      // ) {
      //   // it is calculation an absolute position of board here, only here
      //   setFoundElement({
      //     ...findEnterElement,
      //     type: 'board'
      //   });
      //   dispatch(
      //     swapBoards({
      //       sourceOrder: phantomData.order,
      //       destinationOrder: findEnterElement.order
      //     })
      //   );
      //   setNextFind(false);
      // }
    },

    mouseUp(e) {
      this.isMovingStarted = false;
      if (this.mouseDownElement !== null) {
        this.phantomElement(e);
        // setFoundElement(null);
      }
    },

    phantomElement(e) {
      this.setMouseUpElementStyles();
      setTimeout(() => {
        this.removePhantomElement({
          categoryId: '1', // this.phantomData.categoryId,
          fromElementId: e.target.dataset.id,
          toElementOrder: 1, // this.phantomData.order
          type: 'element'
        });
      }, this.effectWait);
    },
  },
};
</script>
