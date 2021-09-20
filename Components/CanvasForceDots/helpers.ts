import { useRef, useEffect } from "react";

export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomFloatFromInterval(min, max) {
  return Math.random() * (max - min) + min;
}

export function getSpiralPositions({
  pointRadius = 5,
  n = 100,
  angleDiff = 2,
  distance = 1.6,
  minDotRadius = 3,
  maxDotRadius = 3,
  centerX = 0,
  centerY = 0
} = {}) {
  let angle = 0;
  return new Array(n).fill(0).map((_, i) => {
    const radius = Math.sqrt(i + 0.3) * pointRadius * distance;
    angle += Math.asin(1 / radius) * pointRadius * angleDiff;
    angle = angle % (Math.PI * 2);
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      angle,
      radius: randomIntFromInterval(minDotRadius, maxDotRadius)
    };
  });
}

export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
