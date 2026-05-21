import { createKeyPairSignerFromBytes } from "@solana/kit";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const UPGRADE_AUTHORITY_KEYPAIR_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../../keys/local/upgrade-authority-live.json",
);

function loadUpgradeAuthorityKeypair(): number[] {
  return JSON.parse(readFileSync(UPGRADE_AUTHORITY_KEYPAIR_PATH, "utf8"));
}

export const UPGRADE_AUTHORITY_SIGNER = await createKeyPairSignerFromBytes(
  new Uint8Array(loadUpgradeAuthorityKeypair()),
);

/** @deprecated Use UPGRADE_AUTHORITY_SIGNER */
export const LOCALNET_ADMIN_KEYPAIR_0 = UPGRADE_AUTHORITY_SIGNER;

/** @deprecated Use UPGRADE_AUTHORITY_SIGNER */
export const LOCALNET_ADMIN_KEYPAIR_1 = UPGRADE_AUTHORITY_SIGNER;
