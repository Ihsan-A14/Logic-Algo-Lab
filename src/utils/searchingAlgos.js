// src/utils/searchingAlgos.js

// 1. Linear Search Logic
export const getLinearSearchAnimations = (array, target) => {
  const animations = [];
  for (let i = 0; i < array.length; i++) {
    // Compare
    animations.push(["compare", i]);
    
    if (array[i] === target) {
      // Found
      animations.push(["found", i]);
      return animations;
    }
    
    // Discard
    animations.push(["discard", i]);
  }
  return animations;
};

// 2. Binary Search Logic
export const getBinarySearchAnimations = (array, target) => {
  const animations = [];
  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // Highlight boundaries and mid
    animations.push(["compare", mid, left, right]);

    if (array[mid] === target) {
      // Found
      animations.push(["found", mid]);
      return animations;
    }

    if (array[mid] < target) {
      // Discard Left Half
      animations.push(["discard", left, mid]); 
      left = mid + 1;
    } else {
      // Discard Right Half
      animations.push(["discard", mid, right]);
      right = mid - 1;
    }
  }
  return animations;
};