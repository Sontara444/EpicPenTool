export async function setupDraggableToolbar(toolbarId) {
    const toolbar = document.getElementById(toolbarId);
  
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
  
    toolbar.style.position = "absolute";
  
    const savedPos = await window.electronAPI.storeGet('toolbarPosition');
    if (savedPos) {
      toolbar.style.left = savedPos.x;
      toolbar.style.top = savedPos.y;
    }
  
    toolbar.addEventListener("mousedown", (e) => {
      // Exclude interactive elements from triggering drag
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.thickness-selector') || e.target.closest('.color-picker-box')) {
        return;
      }
      
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
      window.electronAPI.storeSet('toolbarPosition', {
        x: toolbar.style.left,
        y: toolbar.style.top
      });
    });
  }
  