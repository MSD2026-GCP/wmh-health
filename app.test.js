/**
  Automated Unit Tests for Wellness Tracker - Story 2.2
  DoD Quality Assurance Gate - Calorie Formula Calculator Checks
*/

const assert = require('assert');
const { calculator, INITIAL_STATE } = require('./app.js');

// Test Suite Runner Helper
const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

// ----------------------------------------------------
// 1. Tests for calculateRemaining()
// Formula: [Target] - [Food] + [Burned] = [Remaining]
// ----------------------------------------------------
test('calculateRemaining: Should correctly calculate normal remaining calories', () => {
  const result = calculator.calculateRemaining(2200, 800, 250);
  assert.strictEqual(result, 1650, '2200 - 800 + 250 should be 1650');
});

test('calculateRemaining: Should handle zero food and exercise cases', () => {
  const result = calculator.calculateRemaining(2000, 0, 0);
  assert.strictEqual(result, 2000, '2000 - 0 + 0 should be 2000');
});

test('calculateRemaining: Should calculate negative remaining calories when over-budget', () => {
  const result = calculator.calculateRemaining(1500, 2000, 100);
  assert.strictEqual(result, -400, '1500 - 2000 + 100 should be -400');
});


// ----------------------------------------------------
// 2. Tests for calculatePercentage()
// ----------------------------------------------------
test('calculatePercentage: Should calculate remaining percentage correctly', () => {
  const result = calculator.calculatePercentage(1650, 2200);
  assert.strictEqual(result, 75, '1650 is 75% of 2200');
});

test('calculatePercentage: Should cap percentage at 100% when remaining is larger than target', () => {
  const result = calculator.calculatePercentage(2500, 2000);
  assert.strictEqual(result, 100, 'Percentage should not exceed 100%');
});

test('calculatePercentage: Should floor percentage at 0% when remaining is negative', () => {
  const result = calculator.calculatePercentage(-100, 2000);
  assert.strictEqual(result, 0, 'Percentage should not go below 0%');
});

test('calculatePercentage: Should return 0% if target is zero or negative', () => {
  const result = calculator.calculatePercentage(500, 0);
  assert.strictEqual(result, 0, 'Should return 0 when target is 0 to avoid division by zero');
});


// ----------------------------------------------------
// 3. Tests for calculateMacroPercent()
// ----------------------------------------------------
test('calculateMacroPercent: Should compute carbohydrate macro percentage correctly', () => {
  const result = calculator.calculateMacroPercent(100, 275);
  assert.strictEqual(result, 36, '100g of 275g is 36%');
});

test('calculateMacroPercent: Should compute protein macro percentage correctly', () => {
  const result = calculator.calculateMacroPercent(60, 110);
  assert.strictEqual(result, 55, '60g of 110g is 55%');
});

test('calculateMacroPercent: Should compute fat macro percentage correctly', () => {
  const result = calculator.calculateMacroPercent(30, 73);
  assert.strictEqual(result, 41, '30g of 73g is 41%');
});

test('calculateMacroPercent: Should return 0% if macro target is zero', () => {
  const result = calculator.calculateMacroPercent(50, 0);
  assert.strictEqual(result, 0, 'Should return 0 when target is 0');
});


// ----------------------------------------------------
// 4. Test state integration with default INITIAL_STATE
// ----------------------------------------------------
test('Integration: Should verify default INITIAL_STATE matches requirements', () => {
  const remaining = calculator.calculateRemaining(
    INITIAL_STATE.targetCalories,
    INITIAL_STATE.foodCalories,
    INITIAL_STATE.burnedCalories
  );
  assert.strictEqual(remaining, 1650, 'Default state should calculate to 1650 remaining calories');
  
  const percentage = calculator.calculatePercentage(remaining, INITIAL_STATE.targetCalories);
  assert.strictEqual(percentage, 75, 'Default state should have 75% remaining budget');
});


// ----------------------------------------------------
// RUNNER & REPORTING
// ----------------------------------------------------
let passed = 0;
let failed = 0;

console.log('\n=============================================================');
console.log('  WELLNESS TRACKER UNIT TESTS - STORY 2.2 CALCULATOR CHECKS ');
console.log('=============================================================\n');

for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`  ✅ PASSED: ${name}`);
    passed++;
  } catch (error) {
    console.error(`  ❌ FAILED: ${name}`);
    console.error(`     Error: ${error.message}\n`);
    failed++;
  }
}

console.log('\n=============================================================');
console.log('                       TEST SUMMARY                          ');
console.log('=============================================================');
console.log(`  Total Tests : ${tests.length}`);
console.log(`  Passed      : \x1b[32m${passed}\x1b[0m`);
console.log(`  Failed      : \x1b[31m${failed}\x1b[0m`);
console.log('=============================================================\n');

// Set exit code for CI/CD pipeline automation
if (failed > 0) {
  console.log(' 🚨 Some tests failed. Code coverage criteria not met.\n');
  process.exit(1);
} else {
  console.log(' 🎉 All tests passed successfully with 100% logic accuracy!\n');
  process.exit(0);
}