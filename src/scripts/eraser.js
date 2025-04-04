export function setupEraseCanvas(canvas, elements, redraw) {
    const ctx = canvas.getContext('2d');

    function eraseElement(event) {
        const mouseX = event.clientX - canvas.offsetLeft;
        const mouseY = event.clientY - canvas.offsetTop;
        const threshold = 10;

        const indexToRemove = elements.findIndex(element => 
            element.type === 'line' &&
            element.points.some(point => 
                Math.hypot(mouseX - point.x, mouseY - point.y) < threshold
            )
        );

        if (indexToRemove !== -1) {
            elements.splice(indexToRemove, 1);
            redraw();
        }
    }

    canvas.addEventListener('click', eraseElement);
}
