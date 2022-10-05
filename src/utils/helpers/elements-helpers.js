export const addPhantom = (
  type,
  elements,
  categoryId = '',
  { sourceOrder, destinationOrder, title, swap = false }
) => {
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
    targetPosition: true
  };

  // console.log('addPhantom: ', { sourceOrder, destinationOrder, order, categoryId, title });

  switch (type) {
    case 'category':
      element = elements.filter(element => element.id === categoryId)[0];
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
      if (element.order === (moveDown ? destinationOrder : (destinationOrder - 1))) {
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

export const moveElement = ({ elements, elementId, newElementOrder }) => {
  // console.log('isNaN(newElementOrder): ', isNaN(newElementOrder));
  if (!isNaN(newElementOrder)) {
    const changedElements = elements.map((current) => {
      // console.log('{ current, elementId }: ', { current, elementId, newElementOrder: parseFloat(newElementOrder) });

      current.targetPosition = false;
      if (current.id === elementId) {
        current.order = parseFloat(newElementOrder);
      }
      return current;
    });
    return changedElements.sort(sortElements);
  }
  return elements;
};

export const reorder = (elements) => {
  let index = 1;
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
