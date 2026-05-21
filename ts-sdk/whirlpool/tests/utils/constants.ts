import { address, type Address } from "@solana/kit";

export const WHIRLPOOL_PROGRAM_ID = address(
  "CLMMmWqTtyNSomqXP3kETJy2SGKPdr31USsm4GfbLyKs",
);

export const TREASURY = address(
  "Ba59QdKR9fYJ362zFWLmscBF625qsMmFategLzRSRZv2",
);

export const METADATA_UPDATE_AUTHORITY: Address = TREASURY;

export const POSITION_NFT_NAME = "Cookieora CLMM Position NFT";
export const POSITION_NFT_SYMBOL = "CPN";

export const POSITION_NFT_METADATA_URI =
  "https://www.cookieora.com/assets/json/clmm_position_nft.json";

export const POSITION_NFT_URI = POSITION_NFT_METADATA_URI;
