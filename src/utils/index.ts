/**
 * utils/index.ts — Shared utility functions
 */

// ── Currency ─────────────────────────────────────────────────────────────────

export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// ── Date ──────────────────────────────────────────────────────────────────────

export function formatDate(iso: string, locale = 'en-US'): string {
  try {
    return new Date(iso).toLocaleDateString(locale, {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function timeAgo(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ── String ────────────────────────────────────────────────────────────────────

export function maskAccountNumber(accountNumber: string, visible = 4): string {
  const last = accountNumber.slice(-visible);
  return `${'•'.repeat(accountNumber.length - visible)} ${last}`;
}

export function maskPhone(phone: string): string {
  return phone.replace(/(\+?\d{1,3})\d+(\d{4})/, '$1****$2');
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ── Validation ────────────────────────────────────────────────────────────────

export function isValidIBAN(iban: string): boolean {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  if (cleaned.length < 15 || cleaned.length > 34) return false;
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
  const numeric = rearranged.split('').map((c) => (isNaN(Number(c)) ? (c.charCodeAt(0) - 55).toString() : c)).join('');
  let remainder = 0;
  for (const chunk of numeric.match(/.{1,9}/g) ?? []) {
    remainder = Number(String(remainder) + chunk) % 97;
  }
  return remainder === 1;
}

export function isValidAmount(value: string): boolean {
  const n = parseFloat(value);
  return !isNaN(n) && n > 0 && /^\d+(\.\d{1,2})?$/.test(value);
}

// ── Async ─────────────────────────────────────────────────────────────────────

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 500,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 1) throw err;
    await sleep(delay);
    return withRetry(fn, retries - 1, delay * 2);
  }
}
