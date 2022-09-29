<template>
  <div
    :data-id="category.id"
    :data-order="category.order"
    class="flex flex-wrap items-center justify-between -border border-gray-300 transition-all duration-200"
  >
    <div v-if="category.id === 'category#phantom'" class="flex flex-wrap w-full"
      :data-id="category.id"
      :data-order="category.order"
    >
      <div class="flex w-full items-center justify-between border border-gray-300 h-12 transition-all duration-200 opacity-30">
        <div class="flex items-center">
          <Button
            class="mx-4"
            type="toggler"
            :state="!category.isOpened ? 'closed' : ''"
            :clickHandler="toggleHandler"
          />
          <div class="font-medium">{{ category.title }}</div>
        </div>
        <div class="flex items-center right-0 -border-2 h-full">
          <img class="mr-2 p-2 -border hover:cursor-pointer" :src="editImage" />
          <img class="mr-2 p-2 -border hover:cursor-pointer" :src="removeImage" />
          <img class="mr-2 p-2 -border hover:cursor-pointer" :src="moveImage" />
        </div>
      </div>
      <div
        v-if="category.isOpened"
        class="flex flex-wrap w-full ml-4 items-center transition-all duration-200 opacity-30"
      >
        <template v-for="(element, index) in category.elems">
          <Element :key="index" :element="element" />
        </template>
      </div>
    </div>

    <div v-else class="flex flex-wrap w-full"
      :data-id="category.id"
      :data-order="category.order"
    >
      <div
        :data-id="category.id"
        :data-order="category.order"
        :class="`category-${category.id} flex w-full items-center justify-between border border-gray-300 h-12 bg-white transition-all duration-200`"
      >
        <div class="flex items-center -border-2">
          <Button
            class="mx-4"
            type="toggler"
            :state="!category.isOpened ? 'closed' : ''"
            :clickHandler="toggleHandler"
          />
          <div class="font-medium">{{ category.title }}</div>
        </div>
        <div class="flex items-center right-0 -border-2 h-full">
          <img class="mr-2 p-2 -border hover:cursor-pointer" :src="editImage" />
          <img
            class="mr-2 p-2 -border hover:cursor-pointer"
            :src="removeImage"
            @click="removeHandler"
          />
          <img
            :data-id="category.id"
            class="mr-2 p-2 -border hover:cursor-pointer"
            :src="moveImage"
            @mousedown="(e) => mouseDown(e)"
            @mousemove="(e) => mouseMove(e)"
            @mouseup="(e) => mouseUp(e)"
          />
        </div>
      </div>
      <div
        v-if="category.isOpened"
        class="flex flex-wrap w-full ml-4 items-center transition-all duration-200"
      >
        <template v-for="(element, index) in category.elems">
          <Element :key="index" :element="element" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Button from '@/components/Button.vue';
import editImage from '@/assets/svg/edit.svg';
import removeImage from '@/assets/svg/deleteCategory.svg';
import moveImage from '@/assets/svg/move.svg';
import Element from '@/components/Element.vue';

export default {
  name: 'AppCategory',
  props: {
    category: {
      type: Object,
      default: null,
    },
    categories: {
      type: Array,
      default: null,
    },
  },
  components: {
    Button,
    Element,
  },

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

  created() {},

  mounted() {
    this.setDomElements();
  },

  watch: {
    categories() { this.setDomElements(); },
    mouseDownElement() { this.setDomElements(); }
  },

  methods: {
    ...mapActions('documents', ['removeCategory', 'toggleCategory', 'addElementPhantom', 'removePhantomElement']),

    setDomElements() {
      if (this.mouseDownElement === null) {
        return;
      }

      let element = '';
      const elementBorders = [];
      const elements = document.getElementById('categoriesParent').childNodes;

      if (elements[0].firstElementChild === null) {
        element = elements[0];
      } else {
        element = elements[0].firstElementChild;
      }

      // console.log('elements:', elements);
      // console.log('element:', element);
      // console.log('---');

      const categoryHeight = parseFloat(getComputedStyle(element).height);
      const margins =
        parseFloat(getComputedStyle(element).marginTop) +
        parseFloat(getComputedStyle(element).marginBottom);

      // console.log('categoryHeight:', categoryHeight);
      // console.log('margins:', margins);
      // console.log('elements.length:', elements.length);
      // console.log('---');

      for (let i = 0; i < elements.length; i++) {
        const height =
          elements[i].offsetHeight === 0
            ? categoryHeight
            : elements[i].offsetHeight - margins;
        const resultTop =
          elements[i].id === ''
            ? elements[i].offsetTop // - marginTopElement
            : elements[i].offsetTop;
        const resultBottom =
          elements[i].id === ''
            ? elements[i].offsetTop + height // + marginTopElement
            : elements[i].offsetTop + height;

        // const heightCategory = parseFloat(getComputedStyle(bottomButtonPanel).height);

        // console.log(' --height:', height);
        // console.log(' --resultTop:', resultTop);
        // console.log(' --resultBottom:', resultBottom);
        console.log(' --elements[' + i + ']:', elements[i]);
        console.log(' --elements[' + i + '].id:', elements[i].id);
        console.log(' --elements[' + i + ']:', elements[i]);
        console.log(
          'mouseDownElement.dataset.id:',
          this.mouseDownElement.dataset.id
        );
        console.log('---');
        // console.log('mouseDownElement:', this.mouseDownElement);
        // console.log('---');

        if (elements[i].id !== this.mouseDownElement.dataset.id) {
          elementBorders.push({
            id: elements[i].id ? elements[i].id : this.phantomId,
            order: parseFloat(elements[i].dataset.order),
            top: resultTop,
            // left: elements[i].offsetLeft,
            bottom: resultBottom, // - this.bottomButtonPanelHeight,
            elems: [], // this.getCardElements(elements[i].id)
          });
        }

        if (!elements[i].id) {
          if (elements[i].dataset.order !== undefined) {
            this.phantomData = {
              id: this.phantomId,
              top: resultTop,
              left: elements[i].offsetLeft,
              order: parseFloat(elements[i].dataset.order),
              type: 'category'
            };
          }
        }
      }
      console.log('elementBorders:', elementBorders);
      this.domElements = elementBorders;
    },

    removeHandler() {
      this.removeCategory({ id: this.category.id });
    },

    toggleHandler() {
      console.log('category: ', this.category);
      console.log('toggleHandler: ', this.category.isOpened);
      this.toggleCategory({ id: this.category.id });
    },

    mouseDown(e) {
      // console.log('mouseDown: ', e);
      const elementId = e.target.dataset.id;
      const element = document.querySelector(`.category-${elementId}`);
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
      console.log('mouseDown element: ', element);
      this.setMouseDownElementStyles(e, element);
      const order = element.dataset.order;
      this.addElementPhantom({ categoryId: e.target.dataset.id, order, title: this.category.title, type: 'category' });
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
      if (element.nextElementSibling !== null) {
        console.log('element.nextElementSibling: ', element.nextElementSibling);
        element.nextSibling.style.display = 'none'; // если у категории раскрыты эл-ты
      }
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
        if (this.mouseDownElement.nextElementSibling !== null) {
          this.mouseDownElement.nextElementSibling.style.display = '';
        }
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
          categoryId: this.phantomData.categoryId,
          fromElementId: e.target.dataset.id,
          toElementOrder: this.phantomData.order,
          type: 'category'
        });
      }, this.effectWait);
    },

  },
};
</script>
