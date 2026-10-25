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
