// src/utils/sortingAlgos.js

export const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// --- 1. BUBBLE SORT ---
export const getBubbleSortAnimations = (array) => {
  const animations = [];
  const aux = array.slice();
  for (let i = 0; i < aux.length - 1; i++) {
    for (let j = 0; j < aux.length - i - 1; j++) {
      animations.push(["compare", j, j + 1]);
      animations.push(["revert", j, j + 1]);
      if (aux[j] > aux[j + 1]) {
        animations.push(["swap", j, aux[j + 1], j + 1, aux[j]]);
        [aux[j], aux[j + 1]] = [aux[j + 1], aux[j]];
      }
    }
  }
  return animations;
};

// --- 2. INSERTION SORT ---
export const getInsertionSortAnimations = (array) => {
  const animations = [];
  const aux = array.slice();
  for (let i = 1; i < aux.length; i++) {
    let j = i;
    while (j > 0 && aux[j] < aux[j - 1]) {
      animations.push(["compare", j, j - 1]);
      animations.push(["revert", j, j - 1]);
      animations.push(["swap", j, aux[j - 1], j - 1, aux[j]]);
      [aux[j], aux[j - 1]] = [aux[j - 1], aux[j]];
      j--;
    }
  }
  return animations;
};

// --- 3. MERGE SORT ---
export const getMergeSortAnimations = (array) => {
  const animations = [];
  if (array.length <= 1) return array;
  const aux = array.slice();
  mergeSortHelper(array.slice(), 0, array.length - 1, aux, animations);
  return animations;
};

function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    animations.push(["compare", i, j]);
    animations.push(["revert", i, j]);
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      animations.push(["overwrite", k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      animations.push(["overwrite", k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  while (i <= middleIdx) {
    animations.push(["compare", i, i]);
    animations.push(["revert", i, i]);
    animations.push(["overwrite", k, auxiliaryArray[i]]);
    mainArray[k++] = auxiliaryArray[i++];
  }
  while (j <= endIdx) {
    animations.push(["compare", j, j]);
    animations.push(["revert", j, j]);
    animations.push(["overwrite", k, auxiliaryArray[j]]);
    mainArray[k++] = auxiliaryArray[j++];
  }
}

// --- 4. QUICK SORT ---
export const getQuickSortAnimations = (array) => {
  const animations = [];
  const aux = array.slice();
  quickSortHelper(aux, 0, aux.length - 1, animations);
  return animations;
};

function quickSortHelper(aux, startIdx, endIdx, animations) {
  if (startIdx >= endIdx) return;
  const pivotIdx = startIdx;
  let leftIdx = startIdx + 1;
  let rightIdx = endIdx;

  while (rightIdx >= leftIdx) {
    animations.push(["compare", leftIdx, rightIdx]);
    animations.push(["revert", leftIdx, rightIdx]);
    
    if (aux[leftIdx] > aux[pivotIdx] && aux[rightIdx] < aux[pivotIdx]) {
      animations.push(["swap", leftIdx, aux[rightIdx], rightIdx, aux[leftIdx]]);
      [aux[leftIdx], aux[rightIdx]] = [aux[rightIdx], aux[leftIdx]];
    }
    if (aux[leftIdx] <= aux[pivotIdx]) leftIdx++;
    if (aux[rightIdx] >= aux[pivotIdx]) rightIdx--;
  }
  
  animations.push(["swap", pivotIdx, aux[rightIdx], rightIdx, aux[pivotIdx]]);
  [aux[pivotIdx], aux[rightIdx]] = [aux[rightIdx], aux[pivotIdx]];

  quickSortHelper(aux, startIdx, rightIdx - 1, animations);
  quickSortHelper(aux, rightIdx + 1, endIdx, animations);
}

// --- 5. BOGO SORT (The Chaos Algorithm) ---
export const getBogoSortAnimations = (array) => {
  const animations = [];
  const aux = array.slice();
  // Safety limit because Bogo sort can literally take forever
  let attempts = 0;
  while (!isSorted(aux) && attempts < 500) {
    // Shuffle
    for (let i = aux.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        animations.push(["compare", i, j]);
        animations.push(["revert", i, j]);
        animations.push(["swap", i, aux[j], j, aux[i]]);
        [aux[i], aux[j]] = [aux[j], aux[i]];
    }
    attempts++;
  }
  return animations;
};

const isSorted = (arr) => {
    for(let i=0; i<arr.length-1; i++) {
        if(arr[i] > arr[i+1]) return false;
    }
    return true;
}