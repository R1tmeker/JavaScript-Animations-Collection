/**
 * Sets up all canvas elements with proper dimensions
 */
export function setupCanvases() {
  const canvases = document.querySelectorAll('canvas');
  
  canvases.forEach(canvas => {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    
    // Set canvas dimensions to match container size
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Set display size (css pixels)
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    // Set actual size in memory (scaled for HiDPI displays)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Get context and scale all drawing operations by the dpr
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
  });
}

/**
 * Clears a canvas with the specified color
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} color - Background color 
 */
export function clearCanvas(ctx, color = 'rgba(0, 0, 0, 0)') {
  const canvas = ctx.canvas;
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Draws a circle on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} radius - Circle radius
 * @param {string} fillColor - Fill color
 * @param {string} strokeColor - Stroke color
 * @param {number} strokeWidth - Stroke width
 */
export function drawCircle(ctx, x, y, radius, fillColor, strokeColor = null, strokeWidth = 0) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

/**
 * Draws a rectangle on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width - Width
 * @param {number} height - Height
 * @param {string} fillColor - Fill color
 * @param {string} strokeColor - Stroke color
 * @param {number} strokeWidth - Stroke width
 */
export function drawRect(ctx, x, y, width, height, fillColor, strokeColor = null, strokeWidth = 0) {
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, width, height);
  }
  
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.strokeRect(x, y, width, height);
  }
}

/**
 * Draws a line on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x1 - Starting X coordinate
 * @param {number} y1 - Starting Y coordinate
 * @param {number} x2 - Ending X coordinate
 * @param {number} y2 - Ending Y coordinate
 * @param {string} color - Line color
 * @param {number} width - Line width
 * @param {string} dashPattern - Optional dash pattern array
 */
export function drawLine(ctx, x1, y1, x2, y2, color, width = 1, dashPattern = []) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  
  if (dashPattern.length > 0) {
    ctx.setLineDash(dashPattern);
  } else {
    ctx.setLineDash([]);
  }
  
  ctx.stroke();
  ctx.setLineDash([]);
}

/**
 * Draws text on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} text - Text to draw
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} color - Text color
 * @param {string} font - Font
 * @param {string} align - Text alignment
 */
export function drawText(ctx, text, x, y, color = '#000', font = '16px sans-serif', align = 'left') {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}