import test from 'node:test';
import assert from 'node:assert/strict';
import { Request, Response } from 'express';
import {
  generateSmartFallback,
  handleChat,
  handleGeneratePlan,
  handleAuditContract,
  EVENT_AI_SYSTEM_PROMPT,
} from '../controllers/gemini.controller';
import geminiRoutes from '../routes/gemini.routes';

interface MockResponsePayload {
  statusCode: number;
  data: Record<string, unknown> | null;
}

function createMockResponse(): { res: Response; payload: MockResponsePayload } {
  const payload: MockResponsePayload = {
    statusCode: 200,
    data: null,
  };

  const res = {
    status(code: number) {
      payload.statusCode = code;
      return res;
    },
    json(body: unknown) {
      payload.data = body as Record<string, unknown>;
      return res;
    },
  } as unknown as Response;

  return { res, payload };
}

function createMockRequest(body: Record<string, unknown>): Request {
  return { body } as unknown as Request;
}

test('controllers/gemini.controller: system prompt is defined and non-empty', () => {
  assert.ok(EVENT_AI_SYSTEM_PROMPT.includes('EventAI Copilot'));
  assert.ok(EVENT_AI_SYSTEM_PROMPT.includes('event-planning assistant'));
});

test('controllers/gemini.controller: generateSmartFallback generates greetings with context snapshot', () => {
  const result = generateSmartFallback('hello', {
    name: 'Sarah & Alex Fall Gala',
    guestCapacity: 200,
    guestsConfirmed: 185,
    cushion: 8500,
  });
  assert.ok(result.reply.includes('Sarah & Alex Fall Gala'));
  assert.ok(result.reply.includes('185'));
  assert.ok(result.reply.includes('$8,500'));
});

test('controllers/gemini.controller: generateSmartFallback provides vendor negotiation for floral inquiries', () => {
  const result = generateSmartFallback('Can we cut floral costs on peonies?');
  assert.ok(result.reply.includes('Sonoma Bloom'));
  assert.ok(result.draft);
  assert.equal(result.draft?.savings, 750);
  assert.ok(result.draft?.subject.includes('Floral Adjustments'));
});

test('controllers/gemini.controller: handleChat validates message requirements', async () => {
  // Test empty message
  const emptyReq = createMockRequest({ message: '   ' });
  const emptyMock = createMockResponse();
  await handleChat(emptyReq, emptyMock.res);
  assert.equal(emptyMock.payload.statusCode, 400);
  assert.equal(emptyMock.payload.data?.error, 'Valid text message is required');

  // Test oversized message
  const largeReq = createMockRequest({ message: 'x'.repeat(3001) });
  const largeMock = createMockResponse();
  await handleChat(largeReq, largeMock.res);
  assert.equal(largeMock.payload.statusCode, 400);
  assert.equal(largeMock.payload.data?.error, 'Message exceeds maximum character length (3000)');

  // Test valid message fallback
  const validReq = createMockRequest({ message: 'Tell me about shuttles' });
  const validMock = createMockResponse();
  await handleChat(validReq, validMock.res);
  assert.equal(validMock.payload.statusCode, 200);
  const reply = validMock.payload.data?.reply as string;
  assert.ok(reply.includes('Shuttle Logistics'));
  assert.ok(validMock.payload.data?.draft);
});

test('controllers/gemini.controller: handleGeneratePlan returns structured blueprint', async () => {
  const planReq = createMockRequest({
    eventType: 'Anniversary',
    title: '<script>Silver Jubilee</script>',
    guestCount: 80,
    location: 'Napa Valley, CA',
    totalBudget: 25000,
    vibe: 'Refined rustic',
  });
  const mock = createMockResponse();

  await handleGeneratePlan(planReq, mock.res);

  assert.ok(mock.payload.data);
  // Asserts sanitized title
  assert.equal(mock.payload.data?.name, 'scriptSilver Jubilee/script');
  assert.ok(Array.isArray(mock.payload.data?.budgetBreakdown));
  assert.ok(Array.isArray(mock.payload.data?.milestones));
  assert.ok(Array.isArray(mock.payload.data?.vendors));
  const vault = mock.payload.data?.creativeVault as Record<string, unknown>;
  assert.ok(vault?.cocktail);
});

test('controllers/gemini.controller: handleAuditContract returns structured findings', async () => {
  const auditReq = createMockRequest({ vendorName: '<b>Sonoma Bloom</b>' });
  const mock = createMockResponse();

  await handleAuditContract(auditReq, mock.res);

  assert.ok(mock.payload.data);
  assert.equal(mock.payload.data?.vendor, 'bSonoma Bloom/b');
  const findings = mock.payload.data?.findings as Array<{ savings?: number }>;
  assert.ok(findings.length > 0);
  assert.equal(findings[1].savings, 350);
});

test('routes/gemini.routes: exports express router with chat, generate-plan, and audit-contract routes', () => {
  assert.ok(geminiRoutes);
  assert.ok(geminiRoutes.stack);
  const routeLayers = geminiRoutes.stack.filter(
    (layer: { route?: { path: string | string[] } }) => Boolean(layer.route)
  );

  const flatPaths = routeLayers.flatMap(
    (layer: { route?: { path: string | string[] } }) =>
      Array.isArray(layer.route?.path) ? (layer.route?.path ?? []) : [layer.route?.path ?? '']
  );

  assert.ok(flatPaths.some((p: string) => p.includes('chat')));
  assert.ok(flatPaths.some((p: string) => p.includes('generate-plan')));
  assert.ok(flatPaths.some((p: string) => p.includes('audit-contract')));
});
