export function setupColorPicker(colorPickerElement, onColorSelect) {
    colorPickerElement.addEventListener("input", (event) => {
      onColorSelect(event.target.value);
    });
  }
  