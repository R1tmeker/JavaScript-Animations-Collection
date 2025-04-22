import { clearCanvas, drawRect, drawLine, drawText } from '../utils/canvasUtils.js';

/**
 * PythagoreanAnimation - Animates the Pythagorean theorem visualization
 */
export default class PythagoreanAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isRunning = false;
    this.animationId = null;
    
    // Animation properties
    this.angle = 45;
    this.targetAngle = 45;
    this.animationProgress = 0;
    this.animationSpeed = 0.02;
    this.showSquares = false;
    this.squaresProgress = 0;
    
    this.colors = {
      a: '#0077ED',
      b: '#FFCC00',
      c: '#FF3B30',
      lines: '#333333',
      text: '#333333'
    };
    
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
   * Set the triangle angle
   * @param {number} angle - Angle in degrees
   */
  setAngle(angle) {
    this.targetAngle = angle;
  }
  
  /**
   * Reset the animation
   */
  reset() {
    this.angle = 45;
    this.targetAngle = 45;
    this.animationProgress = 0;
    this.showSquares = false;
    this.squaresProgress = 0;
  }
  
  /**
   * Calculate triangle dimensions
   * @returns {Object} Triangle dimensions and points
   */
  calculateTriangle() {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    
    // Calculate base size based on canvas dimensions
    const baseSize = Math.min(width, height) * 0.6;
    
    // Calculate triangle points
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Convert angle to radians
    const angleRad = (this.angle * Math.PI) / 180;
    
    // Calculate triangle sides
    const a = baseSize * Math.sin(angleRad);
    const b = baseSize * Math.cos(angleRad);
    const c = baseSize;
    
    // Calculate square areas
    const areaA = a * a;
    const areaB = b * b;
    const areaC = c * c;
    
    // Calculate points for right triangle
    const x1 = centerX - b / 2;
    const y1 = centerY + a / 2;
    const x2 = x1 + b;
    const y2 = y1;
    const x3 = x1;
    const y3 = y1 - a;
    
    return {
      a, b, c,
      areaA, areaB, areaC,
      points: [
        { x: x1, y: y1 }, // bottom left
        { x: x2, y: y2 }, // bottom right
        { x: x3, y: y3 }  // top left
      ]
    };
  }
  
  /**
   * Draw the triangle and squares
   */
  drawTriangleAndSquares() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const textColor = isDarkMode ? '#f7f7f7' : '#333333';
    
    // Calculate triangle
    const triangle = this.calculateTriangle();
    const [p1, p2, p3] = triangle.points;
    
    // Draw triangle
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.lineTo(p3.x, p3.y);
    this.ctx.closePath();
    this.ctx.fillStyle = 'rgba(0, 119, 237, 0.1)';
    this.ctx.fill();
    this.ctx.strokeStyle = this.colors.lines;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    // Draw axis lines
    drawLine(this.ctx, p3.x, p3.y, p3.x, p1.y, this.colors.a, 2, [5, 5]);
    drawLine(this.ctx, p3.x, p3.y, p2.x, p2.y, this.colors.b, 2, [5, 5]);
    
    // Draw dimension labels
    const fontSize = Math.min(triangle.a, triangle.b) * 0.2;
    const fontStyle = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    
    // Draw side labels
    drawText(this.ctx, 'a', p3.x - 20, p1.y - (p1.y - p3.y) / 2, textColor, fontStyle, 'center');
    drawText(this.ctx, 'b', p3.x + (p2.x - p3.x) / 2, p3.y - 15, textColor, fontStyle, 'center');
    drawText(this.ctx, 'c', p1.x + (p2.x - p1.x) / 2, p1.y + 25, textColor, fontStyle, 'center');
    
    // Draw angle
    const angleText = `θ = ${Math.round(this.angle)}°`;
    drawText(this.ctx, angleText, p1.x + 20, p1.y - 20, textColor, fontStyle, 'left');
    
    // Draw the Pythagorean formula
    const formula = 'a² + b² = c²';
    const formulaFontSize = fontSize * 1.2;
    const formulaFont = `bold ${formulaFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    drawText(this.ctx, formula, width / 2, height - 30, textColor, formulaFont, 'center');
    
    // If animation has progressed enough, show the squares
    if (this.squaresProgress > 0) {
      this.drawPythagoreanSquares(triangle, this.squaresProgress);
    }
  }
  
  /**
   * Draw the squares for the Pythagorean theorem
   * @param {Object} triangle - Triangle dimensions
   * @param {number} progress - Animation progress (0-1)
   */
  drawPythagoreanSquares(triangle, progress) {
    const [p1, p2, p3] = triangle.points;
    
    // Draw square on side a (height)
    const aSquareSize = triangle.a * progress;
    
    this.ctx.save();
    this.ctx.translate(p3.x, p3.y);
    this.ctx.rotate(-Math.PI / 2);
    drawRect(
      this.ctx,
      0, 0,
      aSquareSize, aSquareSize,
      `rgba(0, 119, 237, ${0.5 * progress})`,
      this.colors.a,
      2
    );
    
    // Draw a² label if fully visible
    if (progress > 0.9) {
      const fontSize = Math.min(triangle.a, triangle.b) * 0.15;
      const fontStyle = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      this.ctx.rotate(Math.PI / 2);
      drawText(this.ctx, 'a²', aSquareSize / 2, aSquareSize / 2, '#FFFFFF', fontStyle, 'center');
    }
    this.ctx.restore();
    
    // Draw square on side b (base)
    const bSquareSize = triangle.b * progress;
    
    this.ctx.save();
    this.ctx.translate(p3.x, p3.y);
    drawRect(
      this.ctx,
      0, 0,
      bSquareSize, bSquareSize,
      `rgba(255, 204, 0, ${0.5 * progress})`,
      this.colors.b,
      2
    );
    
    // Draw b² label if fully visible
    if (progress > 0.9) {
      const fontSize = Math.min(triangle.a, triangle.b) * 0.15;
      const fontStyle = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      drawText(this.ctx, 'b²', bSquareSize / 2, bSquareSize / 2, '#FFFFFF', fontStyle, 'center');
    }
    this.ctx.restore();
    
    // Draw square on side c (hypotenuse)
    // This is more complex as we need to rotate it to align with the hypotenuse
    const cSquareSize = triangle.c * progress;
    
    this.ctx.save();
    this.ctx.translate(p1.x, p1.y);
    this.ctx.rotate(Math.PI - Math.atan2(p1.y - p3.y, p3.x - p1.x));
    drawRect(
      this.ctx,
      0, 0,
      cSquareSize, cSquareSize,
      `rgba(255, 59, 48, ${0.5 * progress})`,
      this.colors.c,
      2
    );
    
    // Draw c² label if fully visible
    if (progress > 0.9) {
      const fontSize = Math.min(triangle.a, triangle.b) * 0.15;
      const fontStyle = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      this.ctx.rotate(-Math.PI / 4);
      drawText(this.ctx, 'c²', cSquareSize / 2, cSquareSize / 2, '#FFFFFF', fontStyle, 'center');
    }
    this.ctx.restore();
    
    // Write the actual values
    if (progress > 0.95) {
      const width = this.canvas.width / (window.devicePixelRatio || 1);
      const height = this.canvas.height / (window.devicePixelRatio || 1);
      
      const a2 = Math.round(triangle.areaA);
      const b2 = Math.round(triangle.areaB);
      const c2 = Math.round(triangle.areaC);
      
      const fontSize = Math.min(triangle.a, triangle.b) * 0.15;
      const fontStyle = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      
      const equation = `${a2} + ${b2} = ${c2}`;
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const textColor = isDarkMode ? '#f7f7f7' : '#333333';
      
      drawText(this.ctx, equation, width / 2, height - 60, textColor, fontStyle, 'center');
    }
  }
  
  /**
   * Draw a single animation frame
   */
  draw() {
    // Clear canvas
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgColor = isDarkMode ? '#2c2c2e' : '#f7f7f7';
    clearCanvas(this.ctx, bgColor);
    
    // Animate angle change
    if (Math.abs(this.angle - this.targetAngle) > 0.1) {
      this.angle += (this.targetAngle - this.angle) * 0.05;
      this.animationProgress = 0;
      this.showSquares = false;
      this.squaresProgress = 0;
    } else {
      // Once angle is stable, animate showing the squares
      this.animationProgress += this.animationSpeed;
      
      if (this.animationProgress > 1 && !this.showSquares) {
        this.showSquares = true;
      }
      
      if (this.showSquares) {
        this.squaresProgress = Math.min(1, this.squaresProgress + 0.01);
      }
    }
    
    // Draw the visualization
    this.drawTriangleAndSquares();
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