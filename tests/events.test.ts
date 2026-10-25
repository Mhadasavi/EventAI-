import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_EVENTS } from '../src/data/mockEvents';

test('validates initial events cover Wedding, Birthday, and Community Gala verticals', () => {
  const eventTypes = INITIAL_EVENTS.map((e) => e.type);

  assert.ok(eventTypes.includes('wedding'), 'Must support Wedding vertical');
  assert.ok(eventTypes.includes('birthday'), 'Must support Milestone Birthday vertical');
  assert.ok(eventTypes.includes('community'), 'Must support Community Event vertical');
});

test('verifies each event has a valid non-empty budget, vendor radar, and creative vault', () => {
  INITIAL_EVENTS.forEach((evt) => {
    assert.ok(evt.totalBudget > 0, `${evt.name} must have a positive total budget`);
    assert.ok(evt.committedBudget <= evt.totalBudget, `${evt.name} committed budget cannot exceed total budget`);
    assert.ok(evt.safeHarborCushion >= 0, `${evt.name} safe harbor cushion must be non-negative`);
    assert.ok(evt.vendors.length >= 1, `${evt.name} must have at least one vendor partner`);
    assert.ok(evt.creativeVault.swatches.length === 4, `${evt.name} must have 4 seasonal color swatches`);
    assert.ok(evt.creativeVault.cocktail.ingredients.length > 0, `${evt.name} must have cocktail specifications`);
  });
});

test('verifies Rule DEP-882 dependency lock exists in default wedding event', () => {
  const wedding = INITIAL_EVENTS.find((e) => e.id === 'elena-marcus-nuptials');
  assert.ok(wedding, 'Elena & Marcus wedding must exist');

  const escortTask = wedding.milestones.find((m) => m.title.includes('Escort Cards'));
  assert.ok(escortTask, 'Task for escort cards must be present');
  assert.equal(escortTask.status, 'Blocked', 'Escort cards task must initially be locked by dependency rule');
  assert.ok(escortTask.blockedBy?.includes('DEP-882'), 'Blocked reason must reference Rule DEP-882');
});
