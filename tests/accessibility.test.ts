import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const MODALS_DIR = path.resolve(process.cwd(), 'src/components/modals');

test('accessibility: all modal components define role="dialog" and aria-modal="true"', () => {
  const modalFiles = fs.readdirSync(MODALS_DIR).filter((f) => f.endsWith('.tsx'));
  assert.equal(modalFiles.length, 14, 'Must verify all 14 modals');

  for (const file of modalFiles) {
    const content = fs.readFileSync(path.join(MODALS_DIR, file), 'utf-8');
    assert.ok(
      content.includes('role="dialog"'),
      `Modal ${file} must have role="dialog"`
    );
    assert.ok(
      content.includes('aria-modal="true"'),
      `Modal ${file} must have aria-modal="true"`
    );
    const hasLabel = content.includes('aria-labelledby=') || content.includes('aria-label=');
    assert.ok(
      hasLabel,
      `Modal ${file} must have aria-labelledby or aria-label for screen reader orientation`
    );
  }
});

test('accessibility: all modal close buttons have aria-label', () => {
  const modalFiles = fs.readdirSync(MODALS_DIR).filter((f) => f.endsWith('.tsx'));

  for (const file of modalFiles) {
    const content = fs.readFileSync(path.join(MODALS_DIR, file), 'utf-8');
    assert.ok(
      content.includes('aria-label="Close dialog"') || content.includes('aria-label="Close search"'),
      `Modal ${file} must provide an accessible aria-label on close controls`
    );
  }
});

test('accessibility: App.tsx provides Skip to Main Content and Escape listener', () => {
  const appContent = fs.readFileSync(path.resolve(process.cwd(), 'src/App.tsx'), 'utf-8');

  // Verify skip link
  assert.ok(
    appContent.includes('href="#main-content"'),
    'App must provide skip link to #main-content'
  );
  assert.ok(
    appContent.includes('Skip to main content'),
    'Skip link text must be descriptive'
  );

  // Verify Escape key handling for WCAG SC 2.1.2
  assert.ok(
    appContent.includes("e.key === 'Escape'"),
    'App must listen to Escape key to dismiss active modals'
  );
});

test('accessibility: all 14 modal components implement Escape key dismissal', () => {
  const modalFiles = fs.readdirSync(MODALS_DIR).filter((f) => f.endsWith('.tsx'));
  assert.equal(modalFiles.length, 14, 'Must verify all 14 modals');

  for (const file of modalFiles) {
    const content = fs.readFileSync(path.join(MODALS_DIR, file), 'utf-8');
    assert.ok(
      content.includes("e.key === 'Escape'"),
      `Modal ${file} must implement Escape key close handler`
    );
  }
});

test('accessibility: App.tsx provides aria-live="polite" and role="status" on live toast notification', () => {
  const appContent = fs.readFileSync(path.resolve(process.cwd(), 'src/App.tsx'), 'utf-8');
  assert.ok(
    appContent.includes('role="status"'),
    'Live toast notification container must have role="status"'
  );
  assert.ok(
    appContent.includes('aria-live="polite"'),
    'Live toast notification container must have aria-live="polite"'
  );
});
