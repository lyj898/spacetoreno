// Build-time settings from PUBLIC_ environment variables (repo variables in CI).

const clean = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

/**
 * GA4 measurement ID, e.g. "G-XXXXXXXXXX". The coordinator creates the property and sets PUBLIC_GA4_ID.
 * Empty means no analytics script is emitted at all.
 */
export const GA4_ID: string = clean(import.meta.env['PUBLIC_GA4_ID']);

if (GA4_ID && !/^G-[A-Z0-9]{6,12}$/.test(GA4_ID)) {
  throw new Error(`PUBLIC_GA4_ID is not a GA4 measurement ID: "${GA4_ID}"`);
}

// FormSubmit's alias for the family inbox (family rule: post to the alias, never the raw address). The user
// confirmed it reaches the inbox on 5 Oct 2026. CI sets the same value as PUBLIC_FORM_ENDPOINT; this default keeps
// local builds identical. CI passes an unset variable as an empty string, hence `||`.
const DEFAULT_FORM_ENDPOINT = 'https://formsubmit.co/1aacc4903352135bb0fa38c3987d3abd';
const rawEndpoint = clean(import.meta.env['PUBLIC_FORM_ENDPOINT']) || DEFAULT_FORM_ENDPOINT;

/** FormSubmit's AJAX endpoint, which answers in JSON. A plain FormSubmit URL (an alias) is converted. */
export const FORM_ENDPOINT: string = rawEndpoint.startsWith('https://formsubmit.co/ajax/')
  ? rawEndpoint
  : rawEndpoint.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');

if (!FORM_ENDPOINT.startsWith('https://formsubmit.co/ajax/')) {
  throw new Error(`Form endpoint is not a FormSubmit URL: "${rawEndpoint}". Check PUBLIC_FORM_ENDPOINT.`);
}
