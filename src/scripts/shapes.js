// // scripts/shapes.js
// let currentShape = "rectangle";
// let isDrawing = false;
// let startX, startY, ctx, canvas;
// let elements, redraw, undoManager, shapeColor, shapeThickness;

// export function setupShapesTool(canvasEl, allElements, onRedraw, undo, thickness, color) {
//   canvas = canvasEl;
//   ctx = canvas.getContext("2d");
//   elements = allElements;
//   redraw = onRedraw;
//   undoManager = undo;
//   shapeColor = color;
//   shapeThickness = thickness;

//   canvas.addEventListener("mousedown", handleMouseDown);
//   canvas.addEventListener("mouseup", handleMouseUp);
// }

// export function setShapeType(shape) {
//   currentShape = shape;
// }

// function handleMouseDown(e) {
//   if (!window.activeTool || window.activeTool !== "shapes") return;
//   const rect = canvas.getBoundingClientRect();
//   startX = e.clientX - rect.left;
//   startY = e.clientY - rect.top;
//   isDrawing = true;
// }

// function handleMouseUp(e) {
//   if (!isDrawing || window.activeTool !== "shapes") return;
//   const rect = canvas.getBoundingClientRect();
//   const endX = e.clientX - rect.left;
//   const endY = e.clientY - rect.top;

//   undoManager.saveState();

//   const shape = {
//     tool: "shapes",
//     type: currentShape,
//     x1: startX,
//     y1: startY,
//     x2: endX,
//     y2: endY,
//     color: shapeColor,
//     thickness: shapeThickness
//   };

//   elements.push(shape);
//   redraw();
//   isDrawing = false;
// }

// export function drawShape(ctx, shape) {
//   ctx.strokeStyle = shape.color;
//   ctx.lineWidth = shape.thickness;
//   ctx.beginPath();
//   const { x1, y1, x2, y2, type } = shape;

//   switch (type) {
//     case "rectangle":
//       ctx.rect(x1, y1, x2 - x1, y2 - y1);
//       break;
//     case "circle":
//       const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
//       ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
//       break;
//     case "triangle":
//       ctx.moveTo(x1, y1);
//       ctx.lineTo(x2, y2);
//       ctx.lineTo(2 * x1 - x2, y2);
//       ctx.closePath();
//       break;
//   }

//   ctx.stroke();
// }
