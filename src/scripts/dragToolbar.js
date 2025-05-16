// dragToolbar.js
export function setupDraggableToolbar(toolbarId, dragAreaId) {
    const toolbar = document.getElementById(toolbarId);
    const dragArea = document.getElementById(dragAreaId);
  
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
  
    toolbar.style.position = "absolute";
  
    dragArea.addEventListener("mousedown", (e) => {
      isDragging = true;
      const rect = toolbar.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      toolbar.style.opacity = "0.9";
      document.body.style.userSelect = "none";
    });
  
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      toolbar.style.left = `${e.clientX - offsetX}px`;
      toolbar.style.top = `${e.clientY - offsetY}px`;
    });
  
    document.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      toolbar.style.opacity = "1";
      document.body.style.userSelect = "auto";
    });
  }
  