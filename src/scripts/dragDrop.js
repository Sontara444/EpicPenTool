export function setupDragAndDrop(canvas, elements, redraw, undoManager) {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if drawing is disabled (e.g. cursor mode)
    if (canvas.classList.contains('disabled')) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            if (undoManager?.saveState) undoManager.saveState();
            
            // Get drop coordinates relative to canvas
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Center the image around the drop coordinates, and scale it if it's too large
            let width = img.width;
            let height = img.height;
            const MAX_WIDTH = 400;
            const MAX_HEIGHT = 400;

            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
              const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
              width = width * ratio;
              height = height * ratio;
            }

            const drawX = x - width / 2;
            const drawY = y - height / 2;

            elements.push({
              type: 'image',
              img: img,
              x: drawX,
              y: drawY,
              width: width,
              height: height
            });

            redraw();
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  };

  document.addEventListener('dragover', handleDragOver);
  document.addEventListener('drop', handleDrop);

  return {
    cleanup() {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    }
  };
}
