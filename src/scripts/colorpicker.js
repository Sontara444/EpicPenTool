export function setupColorPicker(colorPickerElement, onColorSelect) {
  // Handle color input picker
  colorPickerElement.addEventListener("input", (event) => {
    onColorSelect(event.target.value);
  });

  // Handle preset color boxes
  const colorBoxes = document.querySelectorAll(".color-box");
  colorBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      const color = box.style.backgroundColor;
      onColorSelect(color);

      // Sync color input to match box
      colorPickerElement.value = rgbToHex(color);
    });
  });

  // Helper to convert "rgb(r,g,b)" → "#rrggbb"
  function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g);
    return (
      "#" +
      result
        .map((x) => {
          const hex = parseInt(x).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }
}
