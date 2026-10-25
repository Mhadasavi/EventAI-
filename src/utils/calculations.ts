import { BudgetCategory, CocktailRecipe, Milestone } from '../types';

/**
 * Rebalances budget allocations between two categories while preserving the overall budget cap.
 *
 * @param categories - The current list of budget categories.
 * @param fromCategoryName - The name of the category to deduct surplus from.
 * @param toCategoryName - The name of the category to credit funds to.
 * @param amount - The dollar amount to transfer.
 * @returns An updated list of budget categories with recalculations.
 */
export function rebalanceBudget(
  categories: BudgetCategory[],
  fromCategoryName: string,
  toCategoryName: string,
  amount: number
): BudgetCategory[] {
  if (amount <= 0) return categories;

  return categories.map((cat) => {
    if (cat.name.toLowerCase().includes(fromCategoryName.toLowerCase())) {
      const newAllocated = Math.max(0, cat.allocated - amount);
      return { ...cat, allocated: newAllocated };
    }
    if (cat.name.toLowerCase().includes(toCategoryName.toLowerCase())) {
      const newAllocated = cat.allocated + amount;
      return { ...cat, allocated: newAllocated };
    }
    return cat;
  });
}

/**
 * Calculates committed percentage and remaining safe harbor cushion.
 *
 * @param totalBudget - Total budget cap in dollars.
 * @param committedBudget - Total funds committed/paid in dollars.
 * @returns Calculated percentage allocated and safe harbor dollar cushion.
 */
export function calculatePacing(
  totalBudget: number,
  committedBudget: number
): { percentCommitted: number; safeHarborCushion: number; percentCushion: number } {
  if (totalBudget <= 0) {
    return { percentCommitted: 0, safeHarborCushion: 0, percentCushion: 0 };
  }
  const percentCommitted = Math.round((committedBudget / totalBudget) * 1000) / 10;
  const safeHarborCushion = Math.max(0, totalBudget - committedBudget);
  const percentCushion = Math.round((safeHarborCushion / totalBudget) * 1000) / 10;

  return {
    percentCommitted,
    safeHarborCushion,
    percentCushion,
  };
}

/**
 * Scales a cocktail recipe's ingredient requirements based on guest headcount.
 *
 * @param recipe - The cocktail recipe specification.
 * @param guestCount - The confirmed number of guests.
 * @returns The scaled total cost and ingredient quantities.
 */
export function scaleCocktailBatch(
  recipe: CocktailRecipe,
  guestCount: number
): { totalEstimatedCost: number; scaledIngredients: { name: string; quantity: string }[] } {
  const count = Math.max(1, guestCount);
  const totalEstimatedCost = Math.round(recipe.costPerGuest * count * 100) / 100;

  const scaledIngredients = recipe.ingredients.map((ing) => {
    // 1 standard 750ml bottle provides approx 6 full 4oz drinks
    if (ing.name.toLowerCase().includes('sparkling') || ing.name.toLowerCase().includes('brut') || ing.name.toLowerCase().includes('wine')) {
      const bottles = Math.ceil((count * 4.0) / 25.36); // 25.36 oz per 750ml
      return { name: ing.name, quantity: `${bottles} standard 750ml bottles` };
    }
    if (ing.name.toLowerCase().includes('syrup') || ing.name.toLowerCase().includes('reduction') || ing.name.toLowerCase().includes('nectar')) {
      const gallons = ((count * 0.75) / 128).toFixed(1); // 128 oz per gallon
      return { name: ing.name, quantity: `${gallons} gallons spiced syrup` };
    }
    if (ing.name.toLowerCase().includes('rosemary') || ing.name.toLowerCase().includes('garnish')) {
      return { name: ing.name, quantity: `${Math.round(count * 1.1)} fresh sprigs` };
    }
    return { name: ing.name, quantity: ing.forBatch168 };
  });

  return { totalEstimatedCost, scaledIngredients };
}

/**
 * Evaluates milestone prerequisite rules and determines locked/unlocked states.
 *
 * @param milestones - List of all milestones.
 * @returns Processed list of milestones with updated blocked states.
 */
export function checkMilestoneDependencies(milestones: Milestone[]): {
  verifiedCount: number;
  totalCount: number;
  readinessPercentage: number;
  blockedCount: number;
} {
  const totalCount = milestones.length;
  const verifiedCount = milestones.filter((m) => m.status === 'Completed').length;
  const blockedCount = milestones.filter((m) => m.status === 'Blocked' || !!m.blockedBy).length;
  const readinessPercentage = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  return {
    verifiedCount,
    totalCount,
    readinessPercentage,
    blockedCount,
  };
}
