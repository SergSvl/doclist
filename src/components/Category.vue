<template>
  <div class="flex flex-wrap items-center justify-between -border border-gray-300 transition-all duration-200">
    <div v-if="category.id === 'category#phantom'" class="flex flex-wrap w-full">
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
        <div v-for="(element, index) in category.elems"
          :key="index"
          :data-id="element.id"
          :data-category-id="category.id"
          :data-order="element.order"
          class="w-full"
        >
          <Element :categoryId="category.id" :element="element" :elements="category.elems" />
        </div>
      </div>
    </div>

    <div v-else-if="category.id !== 'category-0'"
      class="flex flex-wrap w-full"
      :data-id="category.id"
      :data-order="category.order"
    >
      <div
        :data-id="category.id"
        :data-order="category.order"
        :draggable="false"
        :class="`${category.id} flex w-full items-center justify-between border border-gray-300 h-12 bg-white transition-all duration-200 bg-sky-100`"
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
            class="mr-0 p-2 -border border-red-300 hover:cursor-pointer"
            :src="removeImage"
            @click="removeHandler"
          />
          <img
            :data-id="category.id"
            class="mr-0 p-4 -border border-red-300 hover:cursor-pointer"
            :src="moveImage"
            :draggable="false"
            @mousedown="(e) => mouseDown(e)"
            @mousemove="(e) => mouseMove(e)"
            @mouseup="(e) => mouseUpOnCategory(e)"
          />
        </div>
      </div>
      <div
        v-if="category.isOpened"
        class="elementsParent flex flex-wrap w-full ml-4 items-center transition-all duration-200"
      >
        <div v-for="(element, index) in category.elems"
          :key="index"
          :data-id="element.id"
          :data-category-id="category.id"
          :data-order="element.order"
          class="w-full"
        >
          <Element :categoryId="category.id" :element="element" :elements="category.elems" />
        </div>
      </div>
    </div>

    <div v-if="category.targetPosition" class="flex flex-wrap w-full h-1.5 bg-blue-500"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Button from '@/components/Button.vue';
import Element from '@/components/Element.vue';
import draggable from '@/mixins/draggable';

export default {
  name: 'AppCategory',
  mixins: [draggable],
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
      domElements: [],
    };
  },

  methods: {
    ...mapActions('documents', ['removeCategory', 'toggleCategory', 'addElementPhantom', 'removePhantomElement', 'swapCategories']),

    setDomElements() {
      if (this.mouseDownElement === null) {
        return;
      }

      const elementBorders = [];
      const elements = document.getElementById('categoriesParent').childNodes;

      // console.log('elements:', elements);
      // console.log('---');

      for (let i = 0; i < elements.length; i++) {
        const height = parseFloat(elements[i].offsetHeight);
        const resultTop = elements[i].offsetTop + 1;
        const resultBottom = elements[i].offsetTop + height - 1;

        // console.log(' element:', i);
        // console.log(' categories[i].title:', this.categories[i].title);
        // console.log(' elements[i].dataset.id:', elements[i].dataset.id);
        // console.log(' elements[i].dataset.order:', elements[i].dataset.order);
        // console.log(' --height:', height);
        // console.log(' --resultTop:', resultTop);
        // console.log(' --resultBottom:', resultBottom);
        // console.log(' --elements[' + i + ']:', elements[i]);
        // console.log(' --elements[' + i + '].dataset:', elements[i].dataset);
        // console.log(' --elements[' + i + '].id:', elements[i].id);
        // console.log(' --elements[' + i + '].dataset.order:', elements[i].dataset.order);
        // console.log(' --elements[' + i + '].dataset.id:', elements[i].dataset.id);
        // // console.log('mouseDownElement.dataset.id:', this.mouseDownElement.dataset.id);
        // console.log('---');

        if (elements[i].dataset.id !== this.mouseDownElement.dataset.id && elements[i].id !== 'target#position') {
          elementBorders.push({
            id: elements[i].dataset.id,
            order: parseFloat(elements[i].dataset.order),
            top: resultTop,
            left: elements[i].offsetLeft,
            bottom: resultBottom,
          });
        }
      }
      // console.log('categories: ', this.categories);
      // console.log('elementBorders:', elementBorders);
      this.domElements = elementBorders;
    },

    removeHandler() {
      this.removeCategory({ id: this.category.id });
    },

    toggleHandler() {
      this.toggleCategory({ id: this.category.id });
    },

    mouseDown(e) {
      const { element, elementId } = this.getClickedElement(e);

      this.startCategoryId = elementId;
      // console.log('mouseDown e.target: ', e.target);
      // console.log('mouseDown element: ', element);
      // console.log('mouseDown element.offsetLeft: ', element.offsetLeft);
      // console.log('mouseDown element.offsetTop: ', element.offsetTop);

      // const element1 = e.target.parentElement;
      // console.log('mouseDown element1: ', element1);
      // const element2 = e.target.parentElement.parentElement;
      // console.log('mouseDown element2: ', element2);
      // console.log('mouseDown element2.offsetLeft: ', element2.offsetLeft);
      // console.log('mouseDown element2.offsetTop: ', element2.offsetTop);

      // console.log('element: ', element);
      // console.log('this.windowCoords down: ', this.windowCoords);
      this.categoryToDrag(e, element);
    },

    setMouseUpElementStyles() {
      if (this.foundElement !== null) {
        console.log('this.foundElement:', this.foundElement);
        console.log('this.windowCoords:', this.windowCoords);
        this.mouseDownElement.style.left = this.foundElement.left + 'px';
        this.mouseDownElement.style.top = this.foundElement.top - 1 + 'px';
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

    move(e) {
      const findEnterElement = this.domElements.filter((elem) => {
        if (elem.top <= e.clientY && e.clientY <= elem.bottom) {
          this.nextFind = true;
          return true;
        } else {
          return false;
        }
      })[0];

      // console.log('findEnterElement 1: ', findEnterElement);

      if (
        this.nextFind &&
        findEnterElement !== undefined &&
        findEnterElement.id !== 'target#position'
      ) {
        this.foundElement = findEnterElement;

        // console.log('findEnterElement.order: ', findEnterElement.order);

        if (this.startOrder !== findEnterElement.order) {
          // console.log('move: ', { start: this.startOrder, found: findEnterElement.order });
          this.swapCategories({
            sourceOrder: this.startOrder,
            destinationOrder: findEnterElement.order,
            categoryId: this.startCategoryId,
          });

          this.startOrder = findEnterElement.order;
          this.destinationOrder = findEnterElement.order;
        }
        this.nextFind = false;
      }
    },
  },
};
</script>
