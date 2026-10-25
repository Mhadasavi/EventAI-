import test from 'node:test';
import assert from 'node:assert/strict';
import { rebalanceBudget, calculatePacing, scaleCocktailBatch, checkMilestoneDependencies } from '../src/utils/calculations';
import { BudgetCategory, CocktailRecipe, Milestone } from '../src/types';

test('rebalanceBudget successfully reallocates surplus without altering total cap', () => {
  const categories: BudgetCategory[] = [
    { name: 'Decor & Florals', allocated: 5500, color: '#ef4444', percentage: 12 },
    { name: 'Printed Stationery', allocated: 2000, color: '#a855f7', percentage: 4 },
  ];

  const initialTotal = categories.reduce((sum, c) => sum + c.allocated, 0);
  const updated = rebalanceBudget(categories, 'Stationery', 'Decor', 700);

  const updatedTotal = updated.reduce((sum, c) => sum + c.allocated, 0);
  assert.equal(updatedTotal, initialTotal, 'Total allocated budget must remain constant after rebalancing');

  const decor = updated.find((c) => c.name.includes('Decor'));
  const stationery = updated.find((c) => c.name.includes('Stationery'));

  assert.equal(decor?.allocated, 6200, 'Decor allocation should increase by exactly $700');
  assert.equal(stationery?.allocated, 1300, 'Stationery allocation should decrease by exactly $700');
});

test('calculatePacing accurately computes percentages and safe harbor cushion', () => {
  const result = calculatePacing(45000, 38420);

  assert.equal(result.percentCommitted, 85.4);
  assert.equal(result.safeHarborCushion, 6580);
  assert.equal(result.percentCushion, 14.6);
});

test('scaleCocktailBatch scales ingredients proportionally by guest count', () => {
  const recipe: CocktailRecipe = {
    name: 'Fig & Rosemary Champagne Sparkle',
    tagline: 'Signature Cocktail',
    costPerGuest: 8.2,
    matchScore: 98,
    description: 'Fig and sparkling wine cocktail',
    ingredients: [
      { name: 'Sonoma Brut Sparkling Wine', perDrink: '4.0 oz', forBatch168: '28 bottles' },
      { name: 'Fresh Rosemary Sprig', perDrink: '1 sprig', forBatch168: '180 sprigs' },
    ],
    instructions: 'Pour and serve.',
  };

  const scale168 = scaleCocktailBatch(recipe, 168);
  assert.equal(scale168.totalEstimatedCost, 1377.6);
  assert.ok(scale168.scaledIngredients.length === 2);

  const scale50 = scaleCocktailBatch(recipe, 50);
  assert.equal(scale50.totalEstimatedCost, 410);
});

test('checkMilestoneDependencies tracks verification and readiness percentage', () => {
  const sampleMilestones: Milestone[] = [
    { id: '1', title: 'Task 1', dueDate: '2025-10-01', relativeDays: 'Due 1', priority: 'High', status: 'Completed', category: 'General' },
    { id: '2', title: 'Task 2', dueDate: '2025-10-02', relativeDays: 'Due 2', priority: 'Medium', status: 'Pending', category: 'General' },
    { id: '3', title: 'Task 3', dueDate: '2025-10-03', relativeDays: 'Due 3', priority: 'High', status: 'Blocked', blockedBy: 'Rule DEP-882', category: 'General' },
  ];

  const stats = checkMilestoneDependencies(sampleMilestones);
  assert.equal(stats.totalCount, 3);
  assert.equal(stats.verifiedCount, 1);
  assert.equal(stats.blockedCount, 1);
  assert.equal(stats.readinessPercentage, 33);
});

test('calculatePacing handles over-budget state and zero total budget safely', () => {
  const overBudget = calculatePacing(40000, 45000);
  assert.equal(overBudget.percentCommitted, 112.5);
  assert.equal(overBudget.safeHarborCushion, 0, 'Safe harbor cushion cannot be negative');
  assert.equal(overBudget.percentCushion, 0);

  const zeroBudget = calculatePacing(0, 0);
  assert.equal(zeroBudget.percentCommitted, 0);
  assert.equal(zeroBudget.safeHarborCushion, 0);
  assert.equal(zeroBudget.percentCushion, 0);
});

test('rebalanceBudget handles zero transfer and non-matching category gracefully', () => {
  const categories: BudgetCategory[] = [
    { name: 'Catering', allocated: 10000, color: '#10b981', percentage: 50 },
    { name: 'Music', allocated: 2000, color: '#6366f1', percentage: 10 },
  ];

  const zeroTransfer = rebalanceBudget(categories, 'Catering', 'Music', 0);
  assert.deepEqual(zeroTransfer, categories, 'Zero transfer should return categories untouched');

  const invalidCat = rebalanceBudget(categories, 'NonExistent', 'Music', 500);
  assert.equal(invalidCat.find((c) => c.name === 'Music')?.allocated, 2500);
});

test('checkMilestoneDependencies handles empty array and 100% completion cleanly', () => {
  const emptyStats = checkMilestoneDependencies([]);
  assert.equal(emptyStats.totalCount, 0);
  assert.equal(emptyStats.readinessPercentage, 0);

  const allCompleted: Milestone[] = [
    { id: '1', title: 'Contract Signed', dueDate: '2025-10-01', relativeDays: 'Done', priority: 'High', status: 'Completed', category: 'General' },
    { id: '2', title: 'Tasting Finalized', dueDate: '2025-10-02', relativeDays: 'Done', priority: 'High', status: 'Completed', category: 'General' },
  ];
  const fullStats = checkMilestoneDependencies(allCompleted);
  assert.equal(fullStats.readinessPercentage, 100);
  assert.equal(fullStats.blockedCount, 0);
});

