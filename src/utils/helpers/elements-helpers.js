export const deleteCardFromBoard = (
  boards,
  boardId,
  { cardId, cardOrder, cardDivided }
) => {
  const filteredBoards = boards.map((board) => {
    if (board.id === boardId) {
      const newBoard = { ...board };
      const newCards = newBoard.cards.filter((card) => card.id !== cardId);
      newBoard.cards = newCards;
      let counter = 1;
      let prevCardOrder = 0;

      if (cardDivided) {
        prevCardOrder = cardOrder - 1;
      }

      const orderedCards = newBoard.cards.map((card) => {
        const newCard = { ...card };

        if (newCard.order === prevCardOrder) {
          newCard.divided = true;
        }
        newCard.order = '' + counter++;
        return newCard;
      });
      newBoard.cards = orderedCards;
      return newBoard;
    } else {
      return board;
    }
  });
  return filteredBoards;
};

export const updateCard = (
  boards,
  boardId,
  cardId,
  {
    cardTitle,
    description,
    task,
    taskId,
    listId,
    checked,
    newTaskListText,
    taskTitle,
    removeTaskId,
    taskListElemText,
    removeListId
  }
) => {
  const updatedBoards = boards.map((board) => {
    if (board.id === boardId) {
      const newBoard = board.cards.map((card) => {
        if (card.id === cardId) {
          if (cardTitle !== undefined) {
            card.title = cardTitle;
          }
          if (description !== undefined) {
            card.description = description;
          }
          if (task !== undefined) {
            card.tasks.push(task);
          }
          if (checked !== undefined) {
            const newTasks = card.tasks.map((task) => {
              if (task.id === taskId) {
                const newList = task.list.map((listElem) => {
                  if (listElem.id === listId) {
                    listElem.checked = checked;
                  }
                  return listElem;
                });
                task.list = newList;
              }
              return task;
            });
            card.tasks = newTasks;
          }
          if (newTaskListText !== undefined) {
            const newTasks = card.tasks.map((task) => {
              if (task.id === taskId) {
                task.list.push({
                  id: `${task.list.length + 1}`,
                  text: newTaskListText,
                  checked: false
                });
              }
              return task;
            });
            card.tasks = newTasks;
          }
          if (taskTitle !== undefined) {
            const newTasks = card.tasks.map((task) => {
              if (task.id === taskId) {
                task.title = taskTitle;
              }
              return task;
            });
            card.tasks = newTasks;
          }
          if (removeTaskId !== undefined) {
            card.tasks = card.tasks.filter((task) =>
              task.id !== removeTaskId
            );
          }
          if (taskListElemText !== undefined) {
            const newTasks = card.tasks.map((task) => {
              if (task.id === taskId) {
                const newList = task.list.map((listElem) => {
                  if (listElem.id === listId) {
                    listElem.text = taskListElemText;
                  }
                  return listElem;
                });
                task.list = newList;
              }
              return task;
            });
            card.tasks = newTasks;
          }
          if (removeListId !== undefined) {
            const newTasks = card.tasks.map((task) => {
              if (task.id === taskId) {
                task.list = task.list.filter((listElem) =>
                  listElem.id !== removeListId
                );
              }
              return task;
            });
            card.tasks = newTasks;
          }
        }
        return card;
      });
      board.cards = newBoard;
    }
    return board;
  });
  return updatedBoards;
};

export const addPhantom = (
  type,
  elements,
  categoryId = '',
  { sourceOrder = null, destinationOrder, title, dividedMyself = false, dividedOnTheLeft = false }
) => {
  let element = {};
  const order = parseFloat(destinationOrder) + 0.1;
  const phantom = {
    order,
    title,
  };
  const targetPosition = {
    id: 'target#position',
    order: parseFloat(destinationOrder) + 0.5,
  };

  // up = sourceOrder > destinationOrder, down - sourceOrder < destinationOrder
  // const order =
  //   sourceOrder < destinationOrder
  //     // ? dividedOnTheLeft
  //     //   ? parseFloat(destinationOrder) + 1.5
  //     ? parseFloat(destinationOrder) + 0.5
  //     // : dividedMyself
  //     //   ? parseFloat(destinationOrder) - 1.5
  //     : parseFloat(destinationOrder) - 0.5;

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
  return [...elements, phantom, targetPosition].sort(sortElements);
};

export const moveElement = ({ elements, elementId, newElementOrder }) => {
  if (!isNaN(newElementOrder)) {
    const changedElements = elements.map((current) => {
      if (current.id === elementId) {
        return { ...current, order: parseFloat(newElementOrder) };
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
  return a.order > b.order ? 1 : -1;
};
