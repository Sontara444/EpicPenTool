export function setupEraseCanvas(canvas, elements) {
    const ctx = canvas.getContext('2d');

    canvas.addEventListener('click', eraseElement);

    function eraseElement(event) {
        const mouseX = event.clientX - canvas.offsetLeft;
        const mouseY = event.clientY - canvas.offsetTop;

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.type === 'line') {
                // Check if mouse is close enough to the line to erase
                for (const point of element.points) {
                    const distance = Math.sqrt(
                        Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2)
                    );
                    if (distance < 10) { // Threshold for erasing
                        elements.splice(i, 1); // Remove the element
                        return; // Only remove one element at a time
                    }
                }
            }
        }

        // Redraw after erasing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        elements.forEach(element => {
            if (element.type === 'line') {
                ctx.beginPath();
                element.points.forEach((point, index) => {
                    if (index === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                });
                ctx.stroke();
            }
        });
    }

    return {
        clearCanvas: () => {
            elements = [];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };
}
