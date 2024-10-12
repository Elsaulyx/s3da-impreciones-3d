const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Ajustar tamaño del canvas a la ventana
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const colors = ['#B58d08', '#007a80', '#769aa5']; // Colores de las partículas
let mouse = {
    x: null,
    y: null,
    radius: 100 // Radio de detección para agrandar partículas
};

// Escuchar movimiento del mouse
window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Partícula individual
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.originalSize = size; // Guardamos el tamaño original
        this.color = color;
    }
    
    // Dibujar partícula
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Actualizar posición de la partícula y detectar el mouse
    update() {
        // Verificar bordes
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.directionY = -this.directionY;
        }

        // Detectar si el mouse está cerca para agrandar la partícula
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            // Si el mouse está cerca, agrandar partícula (máximo tamaño 20px)
            this.size = Math.min(this.originalSize * 3, 80);
        } else {
            // Si no, restaurar tamaño original
            this.size = this.originalSize;
        }

        // Mover partícula
        this.x += this.directionX;
        this.y += this.directionY;

        // Dibujar nuevamente
        this.draw();
    }
}

// Crear partículas
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 3000; // Aumentar densidad de partículas

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 10) + 5;
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let directionX = (Math.random() * 2) - 1; // Dirección horizontal
        let directionY = (Math.random() * 2) - 1; // Dirección vertical
        let color = colors[Math.floor(Math.random() * colors.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Animar partículas
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach(particle => {
        particle.update();
    });
}

// Ajustar tamaño del canvas cuando se redimensiona la ventana
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init(); // Regenerar partículas
});

// Inicializar y animar partículas
init();
animate();
