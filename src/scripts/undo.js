export function createUndoManager(elementsRef, redrawCallback) {
  let history = [];

  function saveState() {
    const snapshot = JSON.parse(JSON.stringify(elementsRef));
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
