import { clearCanvas, drawCircle } from '../utils/canvasUtils.js';

/**
 * CircleAnimation - Animates a circle moving across the screen
 */
export default class CircleAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isRunning = false;
    this.animationId = null;
    
    // Animation properties
    this.x = 0;
    this.y = 0;
    this.radius = 30;
    this.speedX = 3;
    this.speedY = 2;
    this.baseSpeed = 3;
    this.speedFactor = 1;
    this.color = '#0077ED';
    
    this.resize();
  }
  
  /**
   * Handle canvas resize
   */
  resize() {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    
    // Reset position to center
    this.x = width / 2;
    this.y = height / 2;
    
    // Adjust radius based on canvas size
    this.radius = Math.min(width, height) * 0.05;
    
    // Draw a single frame if not running
    if (!this.isRunning) {
      this.draw();
    }
  }
  
  /**
   * Set the animation speed
   * @param {number} speed - Animation speed (1-10)
   */
  setSpeed(speed) {
    this.speedFactor = speed / 5;
    this.speedX = this.baseSpeed * (this.speedFactor + Math.random() * 0.2);
    this.speedY = this.baseSpeed * (this.speedFactor + Math.random() * 0.2);
  }
  
  /**
   * Reset the animation
   */
  reset() {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    
    this.x = width / 2;
    this.y = height / 2;
    this.speedFactor = 1;
    this.speedX = this.baseSpeed;
    this.speedY = this.baseSpeed;
    
    // Generate a random hue for the circle
    const hue = Math.floor(Math.random() * 360);
    this.color = `hsl(${hue}, 80%, 50%)`;
  }
  
  /**
   * Draw a single animation frame
   */
  draw() {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    
    // Clear canvas
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgColor = isDarkMode ? '#2c2c2e' : '#f7f7f7';
    clearCanvas(this.ctx, bgColor);
    
    // Draw the circle
    drawCircle(
      this.ctx, 
      this.x, 
      this.y, 
      this.radius, 
      this.color, 
      '#ffffff', 
      2
    );
    
    // Detect wall collisions and bounce
    if (this.x - this.radius <= 0 || this.x + this.radius >= width) {
      this.speedX = -this.speedX;
      // Slightly change color on bounce
      const hue = Math.floor(Math.random() * 360);
      this.color = `hsl(${hue}, 80%, 50%)`;
    }
    
    if (this.y - this.radius <= 0 || this.y + this.radius >= height) {
      this.speedY = -this.speedY;
      // Slightly change color on bounce
      const hue = Math.floor(Math.random() * 360);
      this.color = `hsl(${hue}, 80%, 50%)`;
    }
    
    // Update position
    this.x += this.speedX * this.speedFactor;
    this.y += this.speedY * this.speedFactor;
    
    // Keep within bounds
    this.x = Math.max(this.radius, Math.min(width - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(height - this.radius, this.y));
  }
  
  /**
   * Animation loop
   */
  animate() {
    if (!this.isRunning) return;
    
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  /**
   * Start the animation
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.animate();
  }
  
  /**
   * Stop the animation
   */
  stop() {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}