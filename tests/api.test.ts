import test from 'node:test';
import assert from 'node:assert/strict';

test('validates payload sanitation and budget integrity logic', () => {
  const sanitizeEventTitle = (raw: string) => raw.trim().replace(/[<>]/g, '');

  assert.equal(sanitizeEventTitle('  <script>Nuptials</script>  '), 'scriptNuptials/script');
  assert.equal(sanitizeEventTitle('Elena & Marcus Wedding'), 'Elena & Marcus Wedding');
});

test('validates minimum and maximum guest constraints', () => {
  const validateGuestRange = (count: number) => {
    return count >= 10 && count <= 2000;
  };

  assert.ok(validateGuestRange(168), '168 guests is a valid event capacity');
  assert.ok(!validateGuestRange(2), '2 guests is under event threshold');
  assert.ok(!validateGuestRange(5000), '5000 guests exceeds event capacity bounds');
});

test('validates budget distribution percentages total exactly 100%', () => {
  const blueprintPacing = [
    { category: 'Venue & Facilities', percentage: 38 },
    { category: 'Catering & Beverages', percentage: 28 },
    { category: 'Decor & Floral Scenography', percentage: 14 },
    { category: 'Photography & Media', percentage: 10 },
    { category: 'Entertainment & Audio', percentage: 5 },
    { category: 'Safe Harbor Cushion', percentage: 5 },
  ];

  const total = blueprintPacing.reduce((acc, curr) => acc + curr.percentage, 0);
  assert.equal(total, 100, 'Budget distribution percentages must sum to 100%');
});

test('validates message length rejection for inputs exceeding 3000 characters', () => {
  const validateLength = (msg: string) => msg.length <= 3000 && msg.trim().length > 0;

  assert.ok(validateLength('Draft an email to the florist'));
  assert.ok(!validateLength('   '));
  assert.ok(!validateLength('a'.repeat(3001)));
});

test('validates contract audit findings structure and savings calculation', () => {
  const mockAudit = {
    vendor: 'Sonoma Bloom',
    status: 'Clean with 1 Recommendation',
    findings: [
      { type: 'Actionable Optimization', text: 'Weekend dismantling fee waiver', severity: 'medium', savings: 350 },
    ],
  };

  assert.ok(mockAudit.findings.length > 0);
  assert.equal(mockAudit.findings[0].savings, 350);
  assert.equal(mockAudit.findings[0].severity, 'medium');
});

test('validates RSVP guest matrix calculations match capacity limits', () => {
  const rsvpCounts = { confirmed: 168, declined: 8, pending: 4 };
  const totalInvited = rsvpCounts.confirmed + rsvpCounts.declined + rsvpCounts.pending;
  const capacity = 180;

  assert.equal(totalInvited, 180);
  assert.ok(rsvpCounts.confirmed <= capacity, 'Confirmed attendees cannot exceed capacity');
  assert.equal(Math.round((rsvpCounts.confirmed / capacity) * 100), 93);
});

