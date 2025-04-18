export function createUndoManager(elementsRef, redrawCallback) {
    let history = [];
  
    function saveState() {
      history.push(JSON.parse(JSON.stringify(elementsRef)));
    }
  
    function undo() {
      if (history.length > 0) {
        const previous = history.pop();
        elementsRef.length = 0;
        elementsRef.push(...previous);
        redrawCallback(elementsRef);
      }
    }
  
    return {
      saveState,
      undo,
    };
  }
  