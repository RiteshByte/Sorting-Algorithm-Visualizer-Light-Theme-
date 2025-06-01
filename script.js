document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const algoCards = document.querySelectorAll('.algo-card');
  const selectedAlgoTitle = document.getElementById('selected-algo-title');
  const userInput = document.getElementById('userInput');
  const solveBtn = document.getElementById('solveBtn');
  const randomBtn = document.getElementById('randomBtn');
  const resultArea = document.getElementById('resultArea');
  const stepsContent = document.getElementById('stepsContent');
  const complexityContent = document.getElementById('complexityContent');
  const codeContent = document.getElementById('codeContent');
  const sortedOutput = document.getElementById('sortedOutput');
  const originalArray = document.getElementById('originalArray');
  const timeTaken = document.getElementById('timeTaken');
  const arrayVisualization = document.getElementById('arrayVisualization');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const copyBtn = document.getElementById('copyBtn');
  const newSortBtn = document.getElementById('newSortBtn');
  const aboutLink = document.getElementById('aboutLink');
  const aboutModal = document.getElementById('aboutModal');
  const closeModal = document.querySelector('.close');
  const sortForm = document.getElementById('sortForm');

  // State
  let selectedAlgo = '';
  
  // Algorithm complexity information
  const algoInfo = {
    bubble: {
      name: 'Bubble Sort',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      description: 'A simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
      bestCase: 'O(n) - when the array is already sorted',
      worstCase: 'O(n²) - when the array is sorted in reverse order',
      code: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j+1]) {
        // Swap elements
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
  return arr;
}`
    },
    selection: {
      name: 'Selection Sort',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      description: 'Divides the input list into a sorted and an unsorted region, and repeatedly selects the smallest element from the unsorted region and moves it to the sorted region.',
      bestCase: 'O(n²) - same as worst case',
      worstCase: 'O(n²)',
      code: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    // Find the minimum element in the unsorted part
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    // Swap the found minimum element with the first element
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`
    },
    insertion: {
      name: 'Insertion Sort',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      description: 'Builds the final sorted array one item at a time. It is efficient for small data sets and is often used as part of more sophisticated algorithms.',
      bestCase: 'O(n) - when the array is already sorted',
      worstCase: 'O(n²) - when the array is sorted in reverse order',
      code: `function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    
    // Move elements greater than key to one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}`
    },
    merge: {
      name: 'Merge Sort',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      description: 'A divide and conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.',
      bestCase: 'O(n log n) - same as worst case',
      worstCase: 'O(n log n)',
      code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  // Divide array into halves
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  // Merge sorted halves
  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return [...result, ...left.slice(i), ...right.slice(j)];
}`
    },
    quick: {
      name: 'Quick Sort',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(log n)',
      description: 'A divide and conquer algorithm that picks an element as a pivot and partitions the array around the pivot. It is typically faster in practice than other O(n log n) algorithms.',
      bestCase: 'O(n log n)',
      worstCase: 'O(n²) - when the pivot selection is unbalanced',
      code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  // Choose pivot (last element)
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  
  // Partition array around pivot
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  
  // Recursively sort partitions and combine
  return [...quickSort(left), pivot, ...quickSort(right)];
}`
    }
  };

  // Event Listeners
  algoCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected class from all cards
      algoCards.forEach(c => c.classList.remove('selected'));
      
      // Add selected class to clicked card
      card.classList.add('selected');
      
      // Update selected algorithm
      selectedAlgo = card.dataset.algo;
      selectedAlgoTitle.textContent = algoInfo[selectedAlgo].name;
      
      // Enable solve button
      solveBtn.disabled = false;

      // Focus input
      userInput.focus();
    });
  });

  randomBtn.addEventListener('click', generateRandomNumbers);
  solveBtn.addEventListener('click', function(e) {
    e.preventDefault();
    solve();
  });
  copyBtn.addEventListener('click', copyResults);
  newSortBtn.addEventListener('click', resetForm);

  // Enter key support for form
  sortForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (selectedAlgo) solve();
  });

  // Tab functionality
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and panes
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      // Add active class to clicked button and corresponding pane
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
  
  // Modal functionality
  aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    aboutModal.style.display = 'block';
  });
  
  closeModal.addEventListener('click', () => {
    aboutModal.style.display = 'none';
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
      aboutModal.style.display = 'none';
    }
  });

  // Functions
  function generateRandomNumbers() {
    const count = Math.floor(Math.random() * 6) + 5; // 5-10 numbers
    const numbers = [];
    for (let i = 0; i < count; i++) {
      numbers.push(Math.floor(Math.random() * 100) + 1); // 1-100
    }
    userInput.value = numbers.join(', ');
    userInput.focus();
  }

  function solve() {
    if (!selectedAlgo || !userInput.value.trim()) {
      alert("Please select an algorithm and enter valid numbers.");
      return;
    }

    const input = userInput.value.trim();
    const numbers = input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    
    if (numbers.length === 0) {
      alert("Please enter valid numbers.");
      return;
    }

    // Show result area
    resultArea.classList.remove('hidden');
    
    // Store original array
    originalArray.textContent = numbers.join(', ');
    
    // Start timer
    const startTime = performance.now();
    
    // Run selected algorithm
    let result = [];
    let steps = "";
    
    switch (selectedAlgo) {
      case "bubble":
        [result, steps] = bubbleSort(numbers);
        break;
      case "selection":
        [result, steps] = selectionSort(numbers);
        break;
      case "insertion":
        [result, steps] = insertionSort(numbers);
        break;
      case "merge":
        [result, steps] = mergeSort(numbers);
        break;
      case "quick":
        [result, steps] = quickSort(numbers);
        break;
    }
    
    // End timer
    const endTime = performance.now();
    const elapsed = (endTime - startTime).toFixed(2);
    
    // Update UI
    stepsContent.innerText = steps;
    sortedOutput.innerText = result.join(', ');
    timeTaken.innerText = `${elapsed} ms`;
    
    // Update complexity info
    updateComplexityInfo();
    
    // Update code example
    codeContent.innerText = algoInfo[selectedAlgo].code;
    
    // Visualize the array
    visualizeArray(numbers, result);
    
    // Scroll to result area
    resultArea.scrollIntoView({ behavior: 'smooth' });
  }

  function updateComplexityInfo() {
    const info = algoInfo[selectedAlgo];
    complexityContent.innerHTML = `
      <h3>${info.name} Complexity Analysis</h3>
      <p><strong>Time Complexity:</strong> ${info.timeComplexity}</p>
      <p><strong>Space Complexity:</strong> ${info.spaceComplexity}</p>
      <p><strong>Description:</strong> ${info.description}</p>
      <p><strong>Best Case:</strong> ${info.bestCase}</p>
      <p><strong>Worst Case:</strong> ${info.worstCase}</p>
    `;
  }

  function visualizeArray(original, sorted) {
    // Clear previous visualization
    arrayVisualization.innerHTML = '';
    
    // Find max value for scaling
    const maxValue = Math.max(...original);
    
    // Calculate dynamic width based on available space
    const containerWidth = arrayVisualization.offsetWidth - 32; // Account for padding
    const availableWidth = containerWidth - (original.length - 1) * 8; // Account for gaps
    const barWidth = Math.min(50, Math.max(25, Math.floor(availableWidth / original.length)));
    
    // Create bars for each element
    original.forEach((num, index) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        
        // Set dynamic width
        bar.style.width = `${barWidth}px`;
        bar.style.minWidth = `${barWidth}px`;
        bar.style.maxWidth = `${barWidth}px`;
        
        // Scale height based on value (max height is 100px)
        const height = Math.max(20, (num / maxValue) * 100);
        bar.style.height = `${height}px`;
        
        // Add value label
        const valueLabel = document.createElement('span');
        valueLabel.className = 'value';
        valueLabel.textContent = num;
        bar.appendChild(valueLabel);
        
        arrayVisualization.appendChild(bar);
    });
}

  function copyResults() {
    const textToCopy = `
Algorithm: ${algoInfo[selectedAlgo].name}
Original Array: ${originalArray.textContent}
Sorted Array: ${sortedOutput.textContent}
Steps:
${stepsContent.textContent}
    `.trim();
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert('Results copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }

  function resetForm() {
    // Hide result area
    resultArea.classList.add('hidden');
    
    // Clear input
    userInput.value = '';
    
    // Reset algorithm selection
    algoCards.forEach(c => c.classList.remove('selected'));
    selectedAlgo = '';
    selectedAlgoTitle.textContent = 'Select an algorithm above';
    
    // Disable solve button
    solveBtn.disabled = true;
  }

  // ----------------- Sorting Algorithms with Steps -------------------

  function bubbleSort(arr) {
    let a = [...arr], steps = "", n = a.length;
    steps += `Starting Bubble Sort with array: [${a.join(', ')}]\n\n`;
    
    for (let i = 0; i < n - 1; i++) {
      steps += `Pass ${i+1}:\n`;
      let swapped = false;
      
      for (let j = 0; j < n - i - 1; j++) {
        steps += `  Compare ${a[j]} and ${a[j+1]}: `;
        
        if (a[j] > a[j+1]) {
          steps += `${a[j]} > ${a[j+1]}, swapping\n`;
          [a[j], a[j+1]] = [a[j+1], a[j]];
          swapped = true;
        } else {
          steps += `${a[j]} <= ${a[j+1]}, no swap needed\n`;
        }
        
        steps += `  Current array: [${a.join(', ')}]\n`;
      }
      
      steps += `End of pass ${i+1}: [${a.join(', ')}]\n`;
      steps += `Element ${a[n-i-1]} is now in its final position\n\n`;
      
      // Early termination if no swaps occurred
      if (!swapped) {
        steps += `No swaps in this pass, array is sorted\n\n`;
        break;
      }
    }
    
    steps += `Final sorted array: [${a.join(', ')}]\n`;
    return [a, steps];
  }

  function selectionSort(arr) {
    let a = [...arr], steps = "";
    steps += `Starting Selection Sort with array: [${a.join(', ')}]\n\n`;
    
    for (let i = 0; i < a.length; i++) {
      let minIdx = i;
      steps += `Pass ${i+1}:\n`;
      steps += `  Initially assume minimum is at index ${i} with value ${a[minIdx]}\n`;
      
      for (let j = i + 1; j < a.length; j++) {
        steps += `  Compare ${a[minIdx]} with ${a[j]}: `;
        
        if (a[j] < a[minIdx]) {
          steps += `${a[j]} < ${a[minIdx]}, new minimum found\n`;
          minIdx = j;
        } else {
          steps += `${a[j]} >= ${a[minIdx]}, keep current minimum\n`;
        }
      }
      
      if (minIdx !== i) {
        steps += `  Swap ${a[i]} at index ${i} with ${a[minIdx]} at index ${minIdx}\n`;
        [a[i], a[minIdx]] = [a[minIdx], a[i]];
      } else {
        steps += `  Minimum element ${a[i]} is already at the correct position\n`;
      }
      
      steps += `  Current array: [${a.join(', ')}]\n`;
      steps += `  Element ${a[i]} is now in its final position\n\n`;
    }
    
    steps += `Final sorted array: [${a.join(', ')}]\n`;
    return [a, steps];
  }

  function insertionSort(arr) {
    let a = [...arr], steps = "";
    steps += `Starting Insertion Sort with array: [${a.join(', ')}]\n\n`;
    
    for (let i = 1; i < a.length; i++) {
      let key = a[i], j = i - 1;
      steps += `Pass ${i}:\n`;
      steps += `  Insert element ${key} into the sorted portion of the array\n`;
      steps += `  Current sorted portion: [${a.slice(0, i).join(', ')}], unsorted: [${a.slice(i).join(', ')}]\n`;
      
      while (j >= 0 && a[j] > key) {
        steps += `  ${a[j]} > ${key}, move ${a[j]} one position to the right\n`;
        a[j + 1] = a[j];
        j--;
      }
      
      a[j + 1] = key;
      steps += `  Insert ${key} at position ${j + 1}\n`;
      steps += `  Current array: [${a.join(', ')}]\n\n`;
    }
    
    steps += `Final sorted array: [${a.join(', ')}]\n`;
    return [a, steps];
  }

  function mergeSort(arr) {
    let steps = "";
    steps += `Starting Merge Sort with array: [${arr.join(', ')}]\n\n`;

    function merge(left, right) {
      let result = [], i = 0, j = 0;
      steps += `Merging [${left.join(', ')}] and [${right.join(', ')}]\n`;

      while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
          steps += `  ${left[i]} < ${right[j]}, take ${left[i]} from left array\n`;
          result.push(left[i++]);
        } else {
          steps += `  ${left[i]} >= ${right[j]}, take ${right[j]} from right array\n`;
          result.push(right[j++]);
        }
      }

      while (i < left.length) {
        steps += `  Adding remaining left element ${left[i]}\n`;
        result.push(left[i++]);
      }
      
      while (j < right.length) {
        steps += `  Adding remaining right element ${right[j]}\n`;
        result.push(right[j++]);
      }

      steps += `  Merged result: [${result.join(', ')}]\n\n`;
      return result;
    }

    function sort(array) {
      if (array.length <= 1) {
        steps += `Array [${array.join(', ')}] has ${array.length} element, already sorted\n`;
        return array;
      }
      
      let mid = Math.floor(array.length / 2);
      steps += `Splitting [${array.join(', ')}] into [${array.slice(0, mid).join(', ')}] and [${array.slice(mid).join(', ')}]\n`;
      
      let left = sort(array.slice(0, mid));
      let right = sort(array.slice(mid));
      
      return merge(left, right);
    }

    const result = sort([...arr]);
    steps += `Final sorted array: [${result.join(', ')}]\n`;
    return [result, steps];
  }

  function quickSort(arr) {
    let steps = "";
    steps += `Starting Quick Sort with array: [${arr.join(', ')}]\n\n`;
    let result;

    function sort(array, depth = 0) {
      if (array.length <= 1) {
        steps += `${'  '.repeat(depth)}Array [${array.join(', ')}] has ${array.length} element, already sorted\n`;
        return array;
      }
      
      let pivot = array[array.length - 1];
      let left = [], right = [];

      steps += `${'  '.repeat(depth)}Pivot: ${pivot}, Array: [${array.join(', ')}]\n`;

      for (let i = 0; i < array.length - 1; i++) {
        if (array[i] < pivot) {
          steps += `${'  '.repeat(depth)}${array[i]} < ${pivot}, add to left partition\n`;
          left.push(array[i]);
        } else {
          steps += `${'  '.repeat(depth)}${array[i]} >= ${pivot}, add to right partition\n`;
          right.push(array[i]);
        }
      }

      steps += `${'  '.repeat(depth)}Left partition: [${left.join(', ')}], Right partition: [${right.join(', ')}]\n\n`;

      const sortedLeft = sort(left, depth + 1);
      const sortedRight = sort(right, depth + 1);
      
      const sortedArray = [...sortedLeft, pivot, ...sortedRight];
      steps += `${'  '.repeat(depth)}Combining: [${sortedLeft.join(', ')}] + ${pivot} + [${sortedRight.join(', ')}] = [${sortedArray.join(', ')}]\n`;
      
      return sortedArray;
    }

    result = sort([...arr]);
    steps += `Final sorted array: [${result.join(', ')}]\n`;
    return [result, steps];
  }
});
