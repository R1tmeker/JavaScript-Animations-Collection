import { clearCanvas, drawCircle } from '../utils/canvasUtils.js';

/**
 * PhysicsAnimation - Animates a physical process (bouncing ball with gravity)
 */
export default class PhysicsAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isRunning = false;
    this.animationId = null;
    
    // Physics properties
    this.balls = [];
    this.gravity = 9.8;
    this.bounceCoefficient = 0.8;
    this.friction = 0.99;
    this.lastTimestamp = 0;
    
    this.resize();
    this.createBalls();
  }
  
  /**
   * Create the balls for animation
   */
  createBalls() {
    this.balls = [];
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    
    // Create multiple balls with different properties
    const colors = ['#0077ED', '#FFCC00', '#FF3B30', '#34C759', '#5E5CE6'];
    
    for (let i = 0; i < 5; i++) {
      this.balls.push({
        x: width * (0.2 + 0.6 * Math.random()),
        y: height * 0.2 * Math.random(),
        radius: 10 + Math.random() * 20,
        velocityX: -5 + Math.random() * 10,
        velocityY: 0,
        color: colors[i],
        mass: 1 + Math.random() * 2
      });
    }
  }
  
  /**
   * Handle canvas resize
   */
  resize() {
    // Create new balls adjusted to the new size
    this.createBalls();
    
    // Draw a single frame if not running
    if (!this.isRunning) {
      this.draw();
    }
  }
  
  /**
   * Set the gravity value
   * @param {number} gravity - Gravity value
   */
  setGravity(gravity) {
    this.gravity = gravity;
  }
  
  /**
   * Set the bounce coefficient
   * @param {number} bounce - Bounce coefficient (0-1)
   */
  setBounce(bounce) {
    this.bounceCoefficient = bounce;
  }
  
  /**
   * Reset the animation
   */
  reset() {
    this.createBalls();
    this.gravity = 9.8;
    this.bounceCoefficient = 0.8;
  }
  
  /**
   * Update physics for each ball
   * @param {number} deltaTime - Time since last frame in seconds
   */
  updatePhysics(deltaTime) {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    
    // Cap deltaTime to avoid large jumps
    const dt = Math.min(deltaTime, 0.05);
    
    // Update each ball
    this.balls.forEach(ball => {
      // Apply gravity
      ball.velocityY += this.gravity * ball.mass * dt;
      
      // Update position
      ball.x += ball.velocityX * dt;
      ball.y += ball.velocityY * dt;
      
      // Apply friction (air resistance)
      ball.velocityX *= this.friction;
      
      // Handle collisions with walls
      if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.velocityX = -ball.velocityX * this.bounceCoefficient;
      } else if (ball.x + ball.radius > width) {
        ball.x = width - ball.radius;
        ball.velocityX = -ball.velocityX * this.bounceCoefficient;
      }
      
      // Handle collision with floor
      if (ball.y + ball.radius > height) {
        ball.y = height - ball.radius;
        
        // Only bounce if velocity is significant
        if (Math.abs(ball.velocityY) > 0.1) {
          ball.velocityY = -ball.velocityY * this.bounceCoefficient;
        } else {
          ball.velocityY = 0;
        }
        
        // Apply horizontal friction when on ground
        ball.velocityX *= 0.95;
      }
      
      // Handle collision with ceiling
      if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.velocityY = -ball.velocityY * this.bounceCoefficient;
      }
    });
    
    // Check for collisions between balls
    for (let i = 0; i < this.balls.length; i++) {
      for (let j = i + 1; j < this.balls.length; j++) {
        const ball1 = this.balls[i];
        const ball2 = this.balls[j];
        
        // Calculate distance between balls
        const dx = ball2.x - ball1.x;
        const dy = ball2.y - ball1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if balls are colliding
        const minDistance = ball1.radius + ball2.radius;
        
        if (distance < minDistance) {
          // Calculate collision normal
          const nx = dx / distance;
          const ny = dy / distance;
          
          // Calculate relative velocity
          const relativeVelocityX = ball2.velocityX - ball1.velocityX;
          const relativeVelocityY = ball2.velocityY - ball1.velocityY;
          
          // Calculate relative velocity along normal
          const relativeVelocityDotNormal = relativeVelocityX * nx + relativeVelocityY * ny;
          
          // Do not resolve collision if balls are moving away from each other
          if (relativeVelocityDotNormal > 0) continue;
          
          // Calculate impulse
          const restitution = this.bounceCoefficient;
          const impulse = -(1 + restitution) * relativeVelocityDotNormal;
          const impulseMagnitude = impulse / (1 / ball1.mass + 1 / ball2.mass);
          
          // Apply impulse
          ball1.velocityX -= impulseMagnitude * nx / ball1.mass;
          ball1.velocityY -= impulseMagnitude * ny / ball1.mass;
          ball2.velocityX += impulseMagnitude * nx / ball2.mass;
          ball2.velocityY += impulseMagnitude * ny / ball2.mass;
          
          // Separate balls to prevent sticking
          const overlap = minDistance - distance;
          const separationX = overlap * nx * 0.5;
          const separationY = overlap * ny * 0.5;
          
          ball1.x -= separationX;
          ball1.y -= separationY;
          ball2.x += separationX;
          ball2.y += separationY;
        }
      }
    }
  }
  
  /**
   * Draw a single animation frame
   * @param {number} timestamp - Current timestamp
   */
  draw(timestamp = 0) {
    // Calculate delta time
    const deltaTime = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;
    
    // Update physics
    if (this.isRunning && deltaTime > 0) {
      this.updatePhysics(deltaTime);
    }
    
    // Clear canvas
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgColor = isDarkMode ? '#2c2c2e' : '#f7f7f7';
    clearCanvas(this.ctx, bgColor);
    
    // Draw each ball
    this.balls.forEach(ball => {
      // Draw a shadow
      drawCircle(
        this.ctx,
        ball.x,
        ball.y + ball.radius * 0.8,
        ball.radius * 0.8,
        'rgba(0, 0, 0, 0.1)'
      );
      
      // Draw the ball with a gradient
      const gradient = this.ctx.createRadialGradient(
        ball.x - ball.radius * 0.3,
        ball.y - ball.radius * 0.3,
        ball.radius * 0.1,
        ball.x,
        ball.y,
        ball.radius
      );
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(1, ball.color);
      
      drawCircle(
        this.ctx,
        ball.x,
        ball.y,
        ball.radius,
        gradient
      );
    });
  }
  
  /**
   * Animation loop
   * @param {number} timestamp - Current timestamp
   */
  animate(timestamp) {
    if (!this.isRunning) return;
    
    this.draw(timestamp);
    this.animationId = requestAnimationFrame((ts) => this.animate(ts));
  }
  
  /**
   * Start the animation
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.animate(this.lastTimestamp);
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