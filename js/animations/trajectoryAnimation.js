import { clearCanvas, drawCircle, drawLine } from '../utils/canvasUtils.js';

/**
 * TrajectoryAnimation - Animates a point moving along a trajectory
 */
export default class TrajectoryAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isRunning = false;
    this.animationId = null;
    
    // Animation properties
    this.time = 0;
    this.timeStep = 0.01;
    this.complexity = 5;
    this.pointSize = 8;
    this.trailLength = 100;
    this.pointColor = '#FFCC00';
    this.trailColor = 'rgba(255, 204, 0, 0.2)';
    this.lineColor = 'rgba(0, 119, 237, 0.5)';
    
    // Trail array to store previous positions
    this.trail = [];
    
    this.resize();
  }
  
  /**
   * Handle canvas resize
   */
  resize() {
    // Draw a single frame if not running
    if (!this.isRunning) {
      this.draw();
    }
  }
  
  /**
   * Set the complexity of the trajectory
   * @param {number} complexity - Complexity level (1-10)
   */
  setComplexity(complexity) {
    this.complexity = complexity;
    // Clear trail when complexity changes
    this.trail = [];
  }
  
  /**
   * Reset the animation
   */
  reset() {
    this.time = 0;
    this.trail = [];
    this.setComplexity(5);
  }
  
  /**
   * Calculate a point on the trajectory
   * @param {number} t - Time parameter
   * @returns {Object} Coordinates {x, y}
   */
  calculateTrajectoryPoint(t) {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Adjust the size of the trajectory based on canvas dimensions
    const radiusX = width * 0.35;
    const radiusY = height * 0.35;
    
    // Create a parametric curve based on complexity
    // More complex = more frequency components
    const factor = this.complexity / 5;
    
    // Lissajous curve with complexity factor
    const x = centerX + radiusX * Math.sin(t * factor + Math.sin(t * 0.5));
    const y = centerY + radiusY * Math.sin(t * 2 * factor + Math.cos(t * 0.3));
    
    return { x, y };
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
    
    // Draw trajectory path (for visual reference)
    this.ctx.beginPath();
    
    // Draw complete trajectory path
    for (let t = 0; t < Math.PI * 4; t += 0.1) {
      const { x, y } = this.calculateTrajectoryPoint(t);
      
      if (t === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.strokeStyle = this.lineColor;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    // Calculate current point
    const currentPoint = this.calculateTrajectoryPoint(this.time);
    
    // Add current point to trail
    this.trail.push({ x: currentPoint.x, y: currentPoint.y });
    
    // Limit trail length
    if (this.trail.length > this.trailLength) {
      this.trail.shift();
    }
    
    // Draw trail
    for (let i = 0; i < this.trail.length; i++) {
      const point = this.trail[i];
      const alpha = i / this.trail.length;
      const pointSize = this.pointSize * (alpha * 0.8 + 0.2);
      
      drawCircle(
        this.ctx,
        point.x,
        point.y,
        pointSize,
        `rgba(255, 204, 0, ${alpha * 0.7})`
      );
    }
    
    // Draw current point
    drawCircle(
      this.ctx,
      currentPoint.x,
      currentPoint.y,
      this.pointSize,
      this.pointColor,
      '#FFFFFF',
      2
    );
    
    // Update time parameter
    this.time += this.timeStep * (this.complexity / 5);
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