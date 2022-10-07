import editImage from '@/assets/svg/edit.svg';
import removeImage from '@/assets/svg/deleteElement.svg';
import moveImage from '@/assets/svg/move.svg';

export default {
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
      foundElement: null,
      elementPosition: [],
      nextFind: false,
    };
  },

  mounted() {
    this.setDomElements();
  },

  watch: {
    categories() { setTimeout(() => { this.setDomElements(); }, 0); },
    elements() { setTimeout(() => { this.setDomElements(); }, 0); },
    mouseDownElement() { setTimeout(() => { this.setDomElements(); }, 0); }
  },

  methods: {
    mouseDownElementStyles(e, element) {
      this.setMouseDownElementStyles(e, element);
    },

    mouseDownCategoryStyles(e, element) {
      this.setMouseDownElementStyles(e, element);
      if (element.nextElementSibling !== null) {
        element.nextSibling.style.display = 'none'; // если у категории раскрыты эл-ты
      }
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

    getClickedElement(e) {
      // console.log('mouseDown: ', e);
      const elementId = e.target.dataset.id;
      const element = document.querySelector(`.${elementId}`);
      this.mouseDownElement = element;
      this.globalCoords = {
        x: e.screenX,
        y: e.screenY,
      };
      this.windowCoords = {
        x: element.offsetLeft,
        y: element.offsetTop,
      };
      return { element, elementId };
    },

    elementToDrag(e, element) {
      this.mouseDownElementStyles(e, element);
      const order = element.dataset.order;
      this.startOrder = order;
      this.addElementPhantom({ categoryId: element.dataset.categoryId, sourceOrder: order, destinationOrder: order, title: this.element.title, type: 'element' });
    },

    categoryToDrag(e, element) {
      this.mouseDownCategoryStyles(e, element);
      const order = element.dataset.order;
      this.startOrder = order;
      this.addElementPhantom({ categoryId: e.target.dataset.id, sourceOrder: order, destinationOrder: order, title: this.category.title, type: 'category' });
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

    mouseUpOnCategory(e) {
      this.isMovingStarted = false;
      if (this.mouseDownElement !== null) {
        this.removeCategoryPhantom(e);
      }
    },

    mouseUpOnElement(e) {
      this.isMovingStarted = false;
      if (this.mouseDownElement !== null) {
        this.removeElementPhantom(e);
      }
    },

    removeCategoryPhantom(e) {
      this.removePhantom(e, null, this.startOrder, 'category');
    },

    removeElementPhantom(e) {
      this.removePhantom(e, this.foundElement.categoryId, this.mouseDownElement.dataset.order, 'element');
    },

    removePhantom(e, toCategoryId, fromElementOrder, type) {
      this.setMouseUpElementStyles();
      setTimeout(() => {
        this.removePhantomElement({
          fromCategoryId: this.startCategoryId,
          toCategoryId,
          fromElementId: e.target.dataset.id,
          fromElementOrder,
          toElementOrder: this.destinationOrder,
          type
        });
        this.destinationOrder = undefined;
        this.foundElement = null;
      }, this.effectWait);
    },

  }
};
