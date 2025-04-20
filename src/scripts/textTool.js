export function setupTextTool(canvas, elements, redraw, undoManager, getColor) {
    const textBtn = document.getElementById("textBtn");
    let isTextMode = false;
  
    textBtn.addEventListener("click", () => {
      isTextMode = !isTextMode;
      toggleTextButton(isTextMode);
    });
  
    function toggleTextButton(active) {
      textBtn.classList.toggle("active", active);
    }
  
    canvas.addEventListener("click", (e) => {
      if (!isTextMode) return;
  
      const input = document.createElement("input");
      input.type = "text";
      input.className = "text-input";
      input.style.left = `${e.clientX}px`;
      input.style.top = `${e.clientY}px`;
      input.style.color = getColor();
  
      document.body.appendChild(input);
      input.focus();
  
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          const text = input.value.trim();
          if (text !== "") {
            const x = parseInt(input.style.left);
            const y = parseInt(input.style.top);
            elements.push({ type: "text", x, y, text, color: getColor() });
            undoManager.saveState();
            redraw();
          }
          document.body.removeChild(input);
        }
      });
  
      input.addEventListener("blur", () => {
        if (document.body.contains(input)) {
          document.body.removeChild(input);
        }
      });
    });
  }
  