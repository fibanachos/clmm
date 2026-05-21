/**
 * Cookieora CLMM fee tier specs — shared with cookieora/scripts/createClmmFeeTiers.ts
 */
export const CLMM_STATIC_FEE_TIER_SPECS = [
  { label: "0.1%", tickSpacing: 8, defaultFeeRate: 1000 },
  { label: "0.25%", tickSpacing: 2, defaultFeeRate: 2500 },
  { label: "0.3%", tickSpacing: 64, defaultFeeRate: 3000 },
  { label: "1%", tickSpacing: 128, defaultFeeRate: 10000 },
  { label: "2%", tickSpacing: 256, defaultFeeRate: 20000 },
  { label: "4%", tickSpacing: 96, defaultFeeRate: 40000 },
] as const;

/** Legacy splash tier — kept for backward compatibility, not in Cookieora UI allowlist. */
export const CLMM_SPLASH_FEE_TIER = {
  tickSpacing: 32896,
  defaultFeeRate: 1000,
} as const;
