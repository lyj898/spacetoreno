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

// The family's inbox. Used only until PUBLIC_FORM_ENDPOINT carries FormSubmit's alias for it (family rule:
// post to the alias, not the raw address). CI passes an unset variable as an empty string, hence `||`.
const DEFAULT_FORM_ENDPOINT = 'https://formsubmit.co/ajax/lyj898@gmail.com';
const rawEndpoint = clean(import.meta.env['PUBLIC_FORM_ENDPOINT']) || DEFAULT_FORM_ENDPOINT;

/** FormSubmit's AJAX endpoint, which answers in JSON. A plain FormSubmit URL (an alias) is converted. */
export const FORM_ENDPOINT: string = rawEndpoint.startsWith('https://formsubmit.co/ajax/')
  ? rawEndpoint
  : rawEndpoint.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');

if (!FORM_ENDPOINT.startsWith('https://formsubmit.co/ajax/')) {
  throw new Error(`Form endpoint is not a FormSubmit URL: "${rawEndpoint}". Check PUBLIC_FORM_ENDPOINT.`);
}
