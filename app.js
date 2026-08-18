/**
  Wellness Tracker App - Story 2.2: Ringkasan Nutrisi Harian
  Core JavaScript State & UI Manager
*/

// Initial State (Default Values)
const INITIAL_STATE = {
  targetCalories: 2200,
  foodCalories: 800,
  burnedCalories: 250,
  
  // Macronutrients Logged (grams)
  carbsLogged: 100,
  proteinLogged: 60,
  fatLogged: 30,
  
  // Macronutrient Targets (grams)
  carbsTarget: 275,   // 40% of 2200 kcal budget
  proteinTarget: 110, // 20% of 2200 kcal budget
  fatTarget: 73       // 30% of 2200 kcal budget
};

let state = { ...INITIAL_STATE };

// SVG Circle Constants
const CIRCLE_RADIUS = 110;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // ~691.15

// Core Calculation Utilities (Shared & Testable)
const calculator = {
  calculateRemaining: (target, food, burned) => {
    return target - food + burned;
  },
  
  calculatePercentage: (remaining, target) => {
    if (target <= 0) return 0;
    // Cap at 100%, minimum 0% for visualization purposes
    const pct = (remaining / target) * 100;
    return Math.max(0, Math.min(100, Math.round(pct)));
  },
  
  calculateMacroPercent: (logged, target) => {
    if (target <= 0) return 0;
    const pct = (logged / target) * 100;
    return Math.round(pct);
  }
};

// Main DOM Update Handler (Browser Only)
function updateUI() {
  if (typeof document === 'undefined') return;

  const remaining = calculator.calculateRemaining(state.targetCalories, state.foodCalories, state.burnedCalories);
  const remainingPercent = calculator.calculatePercentage(remaining, state.targetCalories);

  // 1. Update Caloric Values
  const remainingValEl = document.getElementById('remaining-calories-val');
  const pctLabelEl = document.getElementById('calories-percentage-label');
  
  // Format with thousand separator if needed (e.g. 1.650)
  const formattedRemaining = remaining.toLocaleString('id-ID');
  remainingValEl.textContent = formattedRemaining;
  
  // Dynamic labels and color styles for Over-budget or perfect budget
  if (remaining < 0) {
    pctLabelEl.textContent = `${Math.abs(remaining).toLocaleString('id-ID')} kkal lebih`;
    pctLabelEl.style.background = 'rgba(244, 63, 94, 0.15)';
    pctLabelEl.style.borderColor = 'rgba(244, 63, 94, 0.25)';
    pctLabelEl.style.color = '#fda4af'; // Rose light
    
    // Change center big text color to danger rose
    remainingValEl.style.background = 'linear-gradient(135deg, #f43f5e, #fda4af)';
    remainingValEl.style.webkitBackgroundClip = 'text';
  } else {
    pctLabelEl.textContent = `${remainingPercent}% sisa`;
    pctLabelEl.style.background = 'rgba(139, 92, 246, 0.15)';
    pctLabelEl.style.borderColor = 'rgba(139, 92, 246, 0.25)';
    pctLabelEl.style.color = '#c084fc'; // Violet light
    
    // Restore center big text color to white gradient
    remainingValEl.style.background = 'linear-gradient(135deg, #fff 40%, #e2e8f0)';
    remainingValEl.style.webkitBackgroundClip = 'text';
  }

  // 2. Update Formula Section Terms
  document.getElementById('formula-target-val').textContent = state.targetCalories.toLocaleString('id-ID');
  document.getElementById('formula-food-val').textContent = state.foodCalories.toLocaleString('id-ID');
  document.getElementById('formula-burned-val').textContent = state.burnedCalories.toLocaleString('id-ID');
  
  const formulaRemainingEl = document.getElementById('formula-remaining-val');
  formulaRemainingEl.textContent = formattedRemaining;
  if (remaining < 0) {
    formulaRemainingEl.parentElement.classList.add('term-result-danger');
    formulaRemainingEl.style.color = 'var(--color-danger)';
  } else {
    formulaRemainingEl.parentElement.classList.remove('term-result-danger');
    formulaRemainingEl.style.color = '#a5b4fc';
  }

  // 3. Circular SVG Ring Animation Progress
  const progressBar = document.getElementById('calorie-progress-bar');
  if (progressBar) {
    // If over budget, we show empty ring (dashoffset = circumference)
    // Or we show full warning color
    if (remaining < 0) {
      progressBar.style.strokeDashoffset = CIRCLE_CIRCUMFERENCE;
      progressBar.style.stroke = 'var(--color-danger)';
    } else {
      const strokeOffset = CIRCLE_CIRCUMFERENCE - (remainingPercent / 100) * CIRCLE_CIRCUMFERENCE;
      progressBar.style.strokeDashoffset = strokeOffset;
      progressBar.style.stroke = 'url(#progress-grad)'; // Restore linear gradient
    }
  }

  // 4. Update Slider Control inputs & value displays
  document.getElementById('input-target-calories').value = state.targetCalories;
  document.getElementById('display-target-calories').textContent = `${state.targetCalories.toLocaleString('id-ID')} kkal`;

  document.getElementById('input-food-calories').value = state.foodCalories;
  document.getElementById('display-food-calories').textContent = `${state.foodCalories.toLocaleString('id-ID')} kkal`;

  document.getElementById('input-burned-calories').value = state.burnedCalories;
  document.getElementById('display-burned-calories').textContent = `${state.burnedCalories.toLocaleString('id-ID')} kkal`;

  // 5. Update Macronutrients Cards
  const carbsPct = calculator.calculateMacroPercent(state.carbsLogged, state.carbsTarget);
  document.getElementById('carbs-logged').textContent = `${state.carbsLogged}g`;
  document.getElementById('carbs-progress').style.width = `${Math.min(100, carbsPct)}%`;
  document.getElementById('carbs-percent-label').textContent = `${carbsPct}% tercapai`;

  const proteinPct = calculator.calculateMacroPercent(state.proteinLogged, state.proteinTarget);
  document.getElementById('protein-logged').textContent = `${state.proteinLogged}g`;
  document.getElementById('protein-progress').style.width = `${Math.min(100, proteinPct)}%`;
  document.getElementById('protein-percent-label').textContent = `${proteinPct}% tercapai`;

  const fatPct = calculator.calculateMacroPercent(state.fatLogged, state.fatTarget);
  document.getElementById('fat-logged').textContent = `${state.fatLogged}g`;
  document.getElementById('fat-progress').style.width = `${Math.min(100, fatPct)}%`;
  document.getElementById('fat-percent-label').textContent = `${fatPct}% tercapai`;
}

// Bind Simulator Event Listeners
function initializeEvents() {
  if (typeof document === 'undefined') return;

  // Sliders input events
  document.getElementById('input-target-calories').addEventListener('input', (e) => {
    state.targetCalories = parseInt(e.target.value);
    
    // Adjust macro targets proportionally based on new calorie target
    // Carbohydrates: 50% of budget, Protein: 20%, Fat: 30%
    state.carbsTarget = Math.round((state.targetCalories * 0.50) / 4);
    state.proteinTarget = Math.round((state.targetCalories * 0.20) / 4);
    state.fatTarget = Math.round((state.targetCalories * 0.30) / 9);

    updateUI();
  });

  document.getElementById('input-food-calories').addEventListener('input', (e) => {
    state.foodCalories = parseInt(e.target.value);
    updateUI();
  });

  document.getElementById('input-burned-calories').addEventListener('input', (e) => {
    state.burnedCalories = parseInt(e.target.value);
    updateUI();
  });

  // Quick Action Buttons
  document.getElementById('btn-add-rice').addEventListener('click', function() {
    state.foodCalories += parseInt(this.dataset.calories);
    state.carbsLogged += parseFloat(this.dataset.carbs);
    state.proteinLogged += parseFloat(this.dataset.protein);
    state.fatLogged += parseFloat(this.dataset.fat);
    
    triggerTapAnimation(this);
    updateUI();
  });

  document.getElementById('btn-add-chicken').addEventListener('click', function() {
    state.foodCalories += parseInt(this.dataset.calories);
    state.carbsLogged += parseFloat(this.dataset.carbs);
    state.proteinLogged += parseFloat(this.dataset.protein);
    state.fatLogged += parseFloat(this.dataset.fat);

    triggerTapAnimation(this);
    updateUI();
  });

  document.getElementById('btn-add-run').addEventListener('click', function() {
    state.burnedCalories += parseInt(this.dataset.calories);
    
    triggerTapAnimation(this);
    updateUI();
  });

  document.getElementById('btn-add-swim').addEventListener('click', function() {
    state.burnedCalories += parseInt(this.dataset.calories);

    triggerTapAnimation(this);
    updateUI();
  });

  // Reset Button
  document.getElementById('btn-reset-data').addEventListener('click', function() {
    state = { ...INITIAL_STATE };
    
    triggerTapAnimation(this);
    updateUI();
  });
}

function triggerTapAnimation(element) {
  element.style.transform = 'scale(0.95)';
  setTimeout(() => {
    element.style.transform = '';
  }, 100);
  
  // Highlight remaining calories with a pop scale animation
  const remValueEl = document.getElementById('remaining-calories-val');
  if (remValueEl) {
    remValueEl.classList.remove('animate-pop');
    void remValueEl.offsetWidth; // Force reflow
    remValueEl.classList.add('animate-pop');
  }
}

// DOM Ready initialization
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    initializeEvents();
  });
}

// Export for Node.js testing environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculator,
    INITIAL_STATE
  };
}