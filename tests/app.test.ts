import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('src/App.tsx: uses unified modal manager and defines ActiveModal type', () => {
  const appFile = fs.readFileSync(path.resolve(process.cwd(), 'src/App.tsx'), 'utf-8');

  // Verify ActiveModal type definition exists and contains expected modal keys
  assert.ok(appFile.includes('type ActiveModal ='), 'ActiveModal type definition must exist');
  assert.ok(appFile.includes("'expense'"), "ActiveModal must contain 'expense'");
  assert.ok(appFile.includes("'milestone'"), "ActiveModal must contain 'milestone'");
  assert.ok(appFile.includes("'ledger'"), "ActiveModal must contain 'ledger'");
  assert.ok(appFile.includes("'newEvent'"), "ActiveModal must contain 'newEvent'");

  // Verify activeModal state hook
  assert.ok(
    appFile.includes('const [activeModal, setActiveModal] = useState<ActiveModal>(null);'),
    'activeModal state hook must use ActiveModal union'
  );

  // Verify all 14 previous separate boolean states are eliminated
  const eliminatedBooleans = [
    'isLogExpenseOpen',
    'isAddMilestoneOpen',
    'isFullLedgerOpen',
    'isContractAuditOpen',
    'isNewEventOpen',
    'isSearchOpen',
    'isCocktailModalOpen',
    'isRsvpOpen',
    'isAiSavingsOpen',
    'isDependencyGraphOpen',
    'isQuoteComparisonOpen',
    'isCreativeVaultOpen',
    'isCoPlannerOpen',
  ];

  for (const boolName of eliminatedBooleans) {
    assert.ok(
      !appFile.includes(`const [${boolName}`),
      `Previous modal state boolean ${boolName} must be eliminated`
    );
  }
});
