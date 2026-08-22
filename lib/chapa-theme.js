// Prept brand theme for the Chapa inline checkout.
//
// The Chapa SDK injects its own default stylesheet (Chapa green #7DC400).
// `customizations.styles` is appended AFTER those defaults, so the rules
// below override them. Colors are built on the site's shadcn CSS variables
// (--background, --card, --border, --muted, ...) so the widget automatically
// follows light/dark mode, plus Prept's fixed gold accent (amber-400).
//
// Note: the success popup (#popup-container) and the shield icon (#secure)
// are styled via inline styles by the SDK, so those overrides need !important.

const GOLD = '#fbbf24' // amber-400
const GOLD_LIGHT = '#fcd34d' // amber-300
const GOLD_HOVER = '#fde68a' // amber-200
const INK = '#0a0a0b' // text on gold

export const CHAPA_BRAND_STYLES = `
  /* ── Prept × Chapa branding ─────────────────────────────── */

  #chapa-inline-form,
  #chapa-inline-form *,
  #popup-container,
  #popup-container * {
    font-family: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
  }

  #chapa-inline-form {
    color: var(--foreground);
  }

  /* Shield icon (SDK sets fill inline) */
  #secure path {
    fill: ${GOLD} !important;
  }

  /* Error message */
  .chapa-error {
    color: var(--destructive);
    background: color-mix(in oklab, var(--destructive) 8%, transparent);
    border: 1px solid color-mix(in oklab, var(--destructive) 25%, transparent);
    border-radius: calc(var(--radius, 10px) - 2px);
    padding: 9px 12px;
    font-size: 13px;
    line-height: 1.45;
  }

  /* Loading state */
  .chapa-loading { margin-top: 18px; }
  .chapa-spinner {
    width: 34px;
    height: 34px;
    border-color: color-mix(in oklab, var(--foreground) 12%, transparent);
    border-top-color: ${GOLD};
  }
  .chapa-loading p { font-size: 13px; margin-top: 6px; }
  .chapa-loading p:first-of-type { font-weight: 600; }
  .chapa-loading p:nth-of-type(2) { opacity: 0.65; }

  /* Payment method tiles */
  .chapa-payment-methods-grid { gap: 10px; margin: 18px 0; }
  .chapa-payment-method {
    flex: 1;
    width: auto;
    height: auto;
    padding: 12px 6px;
    background: color-mix(in oklab, var(--muted) 35%, transparent);
    border: 1px solid var(--border);
    border-radius: calc(var(--radius, 10px) + 4px);
    box-shadow: none;
    transition:
      border-color 0.25s ease,
      background 0.25s ease,
      box-shadow 0.25s ease,
      transform 0.25s ease;
  }
  .chapa-payment-method:hover {
    border-color: rgba(251, 191, 36, 0.3);
    background: rgba(251, 191, 36, 0.05);
    transform: translateY(-2px);
  }
  .chapa-payment-icon { width: 34px; height: 34px; margin-bottom: 6px; }
  .chapa-payment-name { color: var(--muted-foreground); font-weight: 500; }
  .chapa-selected {
    background: rgba(251, 191, 36, 0.09);
    border-color: rgba(251, 191, 36, 0.45);
    box-shadow:
      0 0 0 1px rgba(251, 191, 36, 0.35),
      0 8px 24px -12px rgba(251, 191, 36, 0.45);
  }
  .chapa-selected .chapa-payment-name { color: var(--foreground); }

  /* Phone number input */
  .chapa-phone-input-wrapper {
    background: color-mix(in oklab, var(--muted) 25%, transparent);
    border: 1px solid var(--border);
    border-radius: calc(var(--radius, 10px) - 2px);
    padding: 6px 12px;
    transition:
      border-color 0.25s ease,
      box-shadow 0.25s ease;
  }
  .chapa-phone-input-wrapper:hover,
  .chapa-phone-input-wrapper:focus-within {
    border-color: rgba(251, 191, 36, 0.5);
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.12);
  }
  .chapa-phone-prefix {
    background: transparent;
    color: var(--muted-foreground);
    font-weight: 500;
  }
  .chapa-flag-icon { border-radius: 2px; }
  .chapa-phone-input {
    color: var(--foreground);
    background: transparent;
    border-left: 1px solid var(--border);
    font-size: 16px;
  }
  .chapa-phone-input::placeholder {
    color: var(--muted-foreground);
    opacity: 0.55;
  }

  /* Pay button — matches Button variant="gold" */
  .chapa-pay-button {
    height: 46px;
    background: linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD});
    color: ${INK};
    border-radius: calc(var(--radius, 10px) - 2px);
    padding: 12px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.01em;
    transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
  }
  .chapa-pay-button:hover:not(:disabled) {
    background: linear-gradient(135deg, ${GOLD_HOVER}, ${GOLD_LIGHT});
    transform: translateY(-1px);
    box-shadow: 0 12px 36px rgba(251, 191, 36, 0.35);
  }
  .chapa-pay-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* ── Success popup (SDK styles these inline → !important) ── */
  #popup-container {
    z-index: 9999 !important;
    background-color: rgba(0, 0, 0, 0.65) !important;
    backdrop-filter: blur(6px);
  }
  #popup-container > div {
    background-color: var(--card) !important;
    border: 1px solid var(--border) !important;
    border-radius: calc(var(--radius, 10px) + 8px) !important;
    box-shadow: 0 24px 80px -16px rgba(0, 0, 0, 0.6) !important;
    width: 360px !important;
    max-width: 90% !important;
    padding: 32px 28px !important;
  }
  #popup-container > div > p {
    color: var(--foreground) !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    line-height: 1.55;
  }
  #popup-container > div > button {
    background-color: ${GOLD} !important;
    color: ${INK} !important;
    border-radius: calc(var(--radius, 10px) - 2px) !important;
    width: 100% !important;
    margin-top: 22px !important;
    padding: 11px 20px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    transition: filter 0.2s ease;
  }
  #popup-container > div > button:hover {
    background-color: ${GOLD_LIGHT} !important;
  }
`

export function chapaCustomizations({
  buttonText = 'Pay Now',
  successMessage = 'Payment successful! Your session is confirmed.',
} = {}) {
  return {
    buttonText,
    successMessage,
    styles: CHAPA_BRAND_STYLES,
  }
}
