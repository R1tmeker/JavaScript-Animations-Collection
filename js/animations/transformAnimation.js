import { clearCanvas, drawCircle } from '../utils/canvasUtils.js';

/**
 * TransformAnimation - Animates shape transformations with color changes
 */
export default class TransformAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isRunning = false;
    this.animationId = null;
    
    // Animation properties
    this.time = 0;
    this.speed = 1;
    this.numPoints = 6;
    this.baseRadius = 100;
    this.colorTransitionSpeed = 0.01;
    this.currentColorIndex = 0;
    
    // Color palette for transitions
    this.colors = [
      '#0077ED', // blue
      '#FFCC00', // yellow
      '#FF3B30', // red
      '#34C759', // green
      '#5E5CE6', // purple
      '#FF9500'  // orange
    ];
    
    this.resize();
  }
  
  /**
   * Handle canvas resize
   */
  resize() {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    
    // Adjust base radius based on canvas size
    this.baseRadius = width * 0.2;
    
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
    this.speed = speed / 5;
  }
  
  /**
   * Reset the animation
   */
  reset() {
    this.time = 0;
    this.numPoints = 6;
    this.speed = 1;
  }
  
  /**
   * Calculate a point on the morphing shape
   * @param {number} angle - Angle in radians
   * @param {number} time - Current time
   * @returns {Object} Coordinates {x, y}
   */
  calculateShapePoint(angle, time) {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create a morphing shape by adding sine waves of different frequencies
    let radius = this.baseRadius;
    
    // Add first wave (basic shape)
    radius += Math.sin(angle * this.numPoints + time) * (this.baseRadius * 0.2);
    
    // Add second wave (variation)
    radius += Math.sin(angle * (this.numPoints / 2) + time * 1.5) * (this.baseRadius * 0.1);
    
    // Add third wave (fine detail)
    radius += Math.cos(angle * (this.numPoints * 2) + time * 0.7) * (this.baseRadius * 0.05);
    
    // Calculate point position
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    return { x, y, radius: radius * 0.05 };
  }
  
  /**
   * Interpolate between colors
   * @param {string} color1 - First color (hex)
   * @param {string} color2 - Second color (hex)
   * @param {number} factor - Interpolation factor (0-1)
   * @returns {string} Interpolated color
   */
  interpolateColors(color1, color2, factor) {
    // Convert hex to RGB
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);
    
    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);
    
    // Interpolate
    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
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
    
    // Get the current and next colors for interpolation
    const currentColor = this.colors[Math.floor(this.currentColorIndex) % this.colors.length];
    const nextColor = this.colors[(Math.floor(this.currentColorIndex) + 1) % this.colors.length];
    const colorFactor = this.currentColorIndex % 1;
    
    // Interpolate between colors
    const color = this.interpolateColors(currentColor, nextColor, colorFactor);
    
    // Create shadow for the shape
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 20;
    
    // Calculate points and draw shape
    const numSegments = 100;
    const angleStep = (2 * Math.PI) / numSegments;
    
    // First pass: draw the shape
    this.ctx.beginPath();
    
    for (let i = 0; i <= numSegments; i++) {
      const angle = i * angleStep;
      const { x, y } = this.calculateShapePoint(angle, this.time);
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
    
    // Remove shadow for the points
    this.ctx.shadowBlur = 0;
    
    // Second pass: draw points along the shape
    for (let i = 0; i < numSegments; i += 5) {
      const angle = i * angleStep;
      const { x, y, radius } = this.calculateShapePoint(angle, this.time);
      
      // Draw point
      drawCircle(
        this.ctx,
        x, y,
        radius,
        '#FFFFFF',
        color,
        2
      );
    }
    
    // Update time and colors
    this.time += 0.02 * this.speed;
    this.currentColorIndex = (this.currentColorIndex + this.colorTransitionSpeed * this.speed) % this.colors.length;
    
    // Gradually change the number of points for more variation
    this.numPoints = 3 + Math.floor(2.5 + 2.5 * Math.sin(this.time * 0.1));
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