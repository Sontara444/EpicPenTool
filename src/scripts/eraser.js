export function setupEraseCanvas(canvas, elements, redraw, saveState) {
  const ctx = canvas.getContext("2d");
  const eraserSize = 20; // Size of the eraser
  let isErasing = false;

  function erase(event) {
    if (!isErasing) return;

    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;

    const elementsToRemove = [];

    // Check which elements are within the eraser area
    elements.forEach((element) => {
      if (element.type === "line") {
        for (let i = 0; i < element.points.length - 1; i++) {
          const p1 = element.points[i];
          const p2 = element.points[i + 1];

          if (
            isPointNearLine(
              mouseX,
              mouseY,
              p1.x,
              p1.y,
              p2.x,
              p2.y,
              eraserSize
            )
          ) {
            elementsToRemove.push(element);
            break;
          }
        }
      }
    });

    // Remove detected elements (mutate original array)
    if (elementsToRemove.length > 0) {
      if (saveState) saveState(); // Save before modifying
      elements.splice(
        0,
        elements.length,
        ...elements.filter((el) => !elementsToRemove.includes(el))
      );
      redraw();
    }
  }

  function isPointNearLine(px, py, x1, y1, x2, y2, threshold) {
    const lineLength = Math.hypot(x2 - x1, y2 - y1);
    if (lineLength === 0) return false;
    const distanceToLine =
      Math.abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1) /
      lineLength;
    return distanceToLine < threshold;
  }

  // Clean up old listeners
  canvas.removeEventListener("mousedown", handleMouseDown);
  canvas.removeEventListener("mouseup", handleMouseUp);
  canvas.removeEventListener("mousemove", erase);

  function handleMouseDown(e) {
    isErasing = true;
    erase(e);
  }

  function handleMouseUp() {
    isErasing = false;
  }

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", erase);

  return {
    cleanup() {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", erase);
    },
  };
}
