export const addPhantom = (
  type,
  elements,
  categoryId = '',
  { sourceOrder, destinationOrder, title, swap = false }
) => {
  // console.log('addPhantom: ', { type, categoryId, sourceOrder, destinationOrder, title, swap });

  let element = {};
  let order = 0.0;
  const moveDown = sourceOrder <= destinationOrder;

  sourceOrder = parseFloat(sourceOrder);
  destinationOrder = parseFloat(destinationOrder);

  // up = sourceOrder > destinationOrder, down - sourceOrder <= destinationOrder
  if (moveDown) {
    order = parseFloat(destinationOrder) + 0.5;
  } else {
    order = parseFloat(destinationOrder) - 0.5;
  }

  const phantom = {
    order: sourceOrder,
    title,
    targetPosition: true,
  };

  // console.log('addPhantom: ', { sourceOrder, destinationOrder, order, categoryId, title });

  switch (type) {
    case 'category':
      element = elements.filter((element) => element.id === categoryId)[0];
      phantom.id = 'category#phantom';
      phantom.elems = element.elems;
      phantom.isOpened = element.isOpened;
      break;
    case 'element':
      phantom.id = 'element#phantom';
      break;
    default:
  }

  if (swap) {
    const newElements = elements.map((element) => {
      if (
        element.order === (moveDown ? destinationOrder : destinationOrder - 1)
      ) {
        element.targetPosition = true;
      } else {
        element.targetPosition = false;
      }
      return element;
    });
    return newElements;
  } else {
    const newElements = elements.map((element) => {
      if (element.order === sourceOrder) {
        element.order = parseFloat(destinationOrder) - 0.5;
      }
      element.targetPosition = false;
      return element;
    });
    return [...newElements, phantom].sort(sortElements);
  }
};

export const addMovingElement = ({
  elements,
  movingElement,
  fromElementId,
  oldElementOrder,
  newElementOrder,
}) => {
  return reorder(
    moveElement({
      elements: [...elements, movingElement],
      elementId: fromElementId,
      oldElementOrder,
      newElementOrder,
    })
  );
};

export const moveElement = ({
  elements,
  elementId,
  oldElementOrder,
  newElementOrder,
}) => {
  oldElementOrder = parseFloat(oldElementOrder);
  newElementOrder = parseFloat(newElementOrder);
  let order = 0;
  // let count = 1;
  // console.log('isNaN(newElementOrder): ', isNaN(newElementOrder));
  console.log('fromElementId:', elementId);
  console.log('oldElementOrder:', oldElementOrder);
  console.log('newElementOrder:', newElementOrder);

  if (!isNaN(newElementOrder)) {
    // up = oldElementOrder > newElementOrder, down - oldElementOrder <= newElementOrder
    const moveDown = oldElementOrder <= newElementOrder;
    if (moveDown) {
      order = newElementOrder + 0.5;
    } else {
      order = newElementOrder - 0.5;
    }

    const changedElements = elements.map((current) => {
      // console.log('count:', count);
      // console.log('current:', current);
      // console.log('order:', order);
      // count++;

      current.targetPosition = false;
      if (current.id === elementId) {
        current.order = order;
      }
      return current;
    });
    // console.log('changedElements:', changedElements);
    return changedElements.sort(sortElements);
  }
  return elements;
};

export const reorder = (elements) => {
  let index = 0;
  const reorderedElements = elements.map((element) => {
    element.order = index++;
    return element;
  });
  return reorderedElements;
};

export const sortElements = (a, b) => {
  // console.log('sortElements: ', { a: a.order, b: b.order });
  return a.order > b.order ? 1 : -1;
};

export const fromCategoryOffPosition = (categories, fromCategoryId) => {
  categories = categories.map((category) => {
    if (category.id === fromCategoryId) {
      category.elems = category.elems.map((element) => {
        element.targetPosition = false;
        return element;
      });
    }
    return category;
  });
  return categories;
};

export const addPhantomToCategory = (categories, toCategoryId, sourceOrder, destinationOrder) => {
  categories = categories.map((category) => {
    if (category.id === toCategoryId) {
      category.elems = addPhantom('element', category.elems, null, {
        sourceOrder,
        destinationOrder,
        title: '',
        swap: true,
      });
    }
    return category;
  });
  return categories;
};
