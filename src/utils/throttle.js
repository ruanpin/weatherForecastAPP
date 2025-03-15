export default function throttle(fn, delay) {
    let lastCallTime = 0;
    let timeoutId = null; 
  
    return function (...args) {
      const now = Date.now();
  
      if (now - lastCallTime >= delay) {
        lastCallTime = now;
        fn(...args);
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          lastCallTime = Date.now();
          fn(...args);
        }, delay - (now - lastCallTime));
      }
    };
  }