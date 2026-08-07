export function createUndoManager(elementsRef, redrawCallback) {
  let history = [];

  function saveState() {
    const snapshot = elementsRef.map(el => {
      // Shallow copy the object
      const cloned = { ...el };
      // Deep copy the points array if it exists
      if (cloned.points) cloned.points = [...cloned.points];
      return cloned;
    });
    history.push(snapshot);
  }

  function undo() {
    if (history.length > 1) {
      history.pop(); // Remove current state
      const previous = history[history.length - 1];
      elementsRef.length = 0;
      elementsRef.push(...previous);
      redrawCallback();
    }
  }

  return {
    saveState,
    undo,
  };
}
