export function setupDrawCanvas(canvas, elements) {
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let currentPath = [];

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);

    function startDrawing(event) {
        drawing = true;
        currentPath = [];
        ctx.beginPath();
        ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    }

    function stopDrawing() {
        drawing = false;
        if (currentPath.length > 0) {
            elements.push({ type: 'line', points: [...currentPath] });
        }
    }

    function draw(event) {
        if (!drawing) return;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';

        const x = event.clientX - canvas.offsetLeft;
        const y = event.clientY - canvas.offsetTop;

        ctx.lineTo(x, y);
        ctx.stroke();
        
        currentPath.push({ x, y });
    }

    return {
        clearCanvas: () => {
            elements.length = 0;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        },
        redraw: () => {
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
    };
}
