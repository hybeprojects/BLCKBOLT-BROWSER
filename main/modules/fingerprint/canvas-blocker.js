// Canvas Fingerprinting Blocker
// Prevents websites from reading canvas data for fingerprinting

const canvasBlocker = {
  isEnabled: true,

  // Returns a random but valid canvas fingerprint
  // Works by spoofing canvas.toDataURL() with a consistent but randomized pattern
  getSpoofedCanvasData(originalData) {
    // Generate a consistent random pattern based on session
    // This makes fingerprinting ineffective while still being a valid canvas
    const seed = window.__canvasBlockerSeed || Math.random();
    window.__canvasBlockerSeed = seed;

    // Create a modified canvas data by adding noise
    // This is still valid image data but won't match real canvas output
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Random gradient background
      const gradient = ctx.createLinearGradient(0, 0, 280, 60);
      gradient.addColorStop(0, `hsl(${seed * 360}, 50%, 50%)`);
      gradient.addColorStop(1, `hsl(${(seed * 360 + 180) % 360}, 50%, 50%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 280, 60);
      
      // Add noise
      const imageData = ctx.getImageData(0, 0, 280, 60);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.sin(seed * (i + 1)) * 10;
        data[i] += noise;
        data[i + 1] -= noise / 2;
        data[i + 2] += noise / 3;
      }
      ctx.putImageData(imageData, 0, 0);
    }
    
    return canvas.toDataURL();
  },

  // Inject protection script into page context
  injectProtection() {
    if (!this.isEnabled || window.__canvasBlockerInjected) return;
    window.__canvasBlockerInjected = true;

    const script = document.createElement('script');
    script.textContent = `
      (function() {
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        const originalToBlob = HTMLCanvasElement.prototype.toBlob;
        const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

        // Store canvas seed for consistent spoofing per session
        const canvasSeed = Math.random();
        
        // Spoof toDataURL
        HTMLCanvasElement.prototype.toDataURL = function(type, quality) {
          // For canvases with actual content, return spoofed data
          if (this.width > 0 && this.height > 0) {
            // Create a valid but spoofed canvas
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              // Fill with a gradient based on canvas dimensions
              const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
              gradient.addColorStop(0, \`hsl(\${canvasSeed * 360}, 60%, 50%)\`);
              gradient.addColorStop(1, \`hsl(\${(canvasSeed * 360 + 180) % 360}, 60%, 50%)\`);
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, this.width, this.height);
              
              // Add subtle variations
              for (let i = 0; i < Math.min(10, this.width * this.height / 1000); i++) {
                ctx.fillStyle = \`rgba(255, 255, 255, \${0.1 + canvasSeed * 0.3})\`;
                ctx.fillRect(
                  Math.sin(canvasSeed + i) * this.width,
                  Math.cos(canvasSeed + i) * this.height,
                  Math.sin(canvasSeed * (i + 1)) * 50,
                  Math.cos(canvasSeed * (i + 1)) * 50
                );
              }
            }
            
            return canvas.toDataURL(type, quality);
          }
          return originalToDataURL.call(this, type, quality);
        };

        // Spoof toBlob
        HTMLCanvasElement.prototype.toBlob = function(callback, type, quality) {
          // Call the spoofed toDataURL and convert to blob
          const dataUrl = this.toDataURL(type, quality);
          fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => callback(blob))
            .catch(() => {
              // Fallback to original if fetch fails
              originalToBlob.call(this, callback, type, quality);
            });
        };

        // Spoof getImageData (partial - some sites check for this)
        CanvasRenderingContext2D.prototype.getImageData = function(sx, sy, sw, sh) {
          // Return mostly transparent data to prevent fingerprinting
          const imageData = originalGetImageData.call(this, sx, sy, sw, sh);
          // Randomize values based on page seed
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.round(128 + Math.sin(canvasSeed * (i + 1)) * 60);
            data[i + 1] = Math.round(128 + Math.cos(canvasSeed * (i + 1)) * 60);
            data[i + 2] = Math.round(128 + Math.sin(canvasSeed * (i + 2)) * 40);
            data[i + 3] = 255;
          }
          return imageData;
        };

        // Spoof WebGL getParameter
        const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
          if (parameter === WebGLRenderingContext.RENDERER) {
            return 'WebKit WebGL';
          }
          if (parameter === WebGLRenderingContext.VENDOR) {
            return 'WebKit';
          }
          return originalGetParameter.call(this, parameter);
        };
      })();
    `;
    
    document.documentElement.insertBefore(script, document.documentElement.firstChild);
  },

  // Setup protection based on page lifecycle
  setup() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.injectProtection());
    } else {
      this.injectProtection();
    }
  }
};

// Auto-setup if loaded
if (typeof window !== 'undefined') {
  window.canvasBlocker = canvasBlocker;
  
  // Only inject if running in a browser context (not Node.js)
  if (typeof document !== 'undefined') {
    canvasBlocker.setup();
  }
}

module.exports = canvasBlocker;
