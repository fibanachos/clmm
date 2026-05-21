import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

import { CLMM_SPLASH_FEE_TIER, CLMM_STATIC_FEE_TIER_SPECS } from "./clmm-tier-specs.js";

const PROGRAM_ID = new PublicKey(
  "CLMMmWqTtyNSomqXP3kETJy2SGKPdr31USsm4GfbLyKs",
);
const FEE_AUTHORITY = new PublicKey(
  "HGSGbiM3tMvbX8cxitEgzbQv53M4rFcsE1gn7fvrHrkN",
);
const TREASURY = new PublicKey(
  "Ba59QdKR9fYJ362zFWLmscBF625qsMmFategLzRSRZv2",
);
/** Basis points of swap fees routed to treasury (2000 = 20%). */
const DEFAULT_PROTOCOL_FEE_RATE = 2000;

const FEE_TIERS: { tickSpacing: number; defaultFeeRate: number }[] = [
  ...CLMM_STATIC_FEE_TIER_SPECS,
  CLMM_SPLASH_FEE_TIER,
];

function loadKeypair(path: string): Keypair {
  const secret = JSON.parse(readFileSync(path, "utf8")) as number[];
  return Keypair.fromSecretKey(Uint8Array.from(secret));
}

function loadOrCreateConfigKeypair(path: string): Keypair {
  if (existsSync(path)) {
    console.log(`Using existing config keypair: ${path}`);
    return loadKeypair(path);
  }
  mkdirSync(dirname(path), { recursive: true });
  const kp = Keypair.generate();
  writeFileSync(path, JSON.stringify(Array.from(kp.secretKey)));
  console.log(`Created config keypair: ${path}`);
  console.log(`Config address: ${kp.publicKey.toBase58()}`);
  return kp;
}

function feeTierPda(config: PublicKey, tickSpacing: number): PublicKey {
  const tickSpacingLe = Buffer.alloc(2);
  tickSpacingLe.writeUInt16LE(tickSpacing);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("fee_tier"), config.toBuffer(), tickSpacingLe],
    PROGRAM_ID,
  )[0];
}

async function main() {
  const rpcUrl = process.env.RPC_URL;
  if (!rpcUrl) {
    throw new Error("Set RPC_URL to your Cookie Chain RPC endpoint");
  }

  const upgradeAuthorityPath =
    process.env.UPGRADE_AUTHORITY_KEYPAIR ??
    resolve(ROOT, "keys/local/upgrade-authority-live.json");
  const configKeypairPath =
    process.env.CONFIG_KEYPAIR ??
    resolve(ROOT, "keys/cookie/whirlpools-config-keypair.json");
  const idlPath = resolve(ROOT, "target/idl/whirlpool.json");

  const upgradeAuthority = loadKeypair(upgradeAuthorityPath);
  if (!upgradeAuthority.publicKey.equals(FEE_AUTHORITY)) {
    throw new Error(
      `Upgrade authority mismatch. Expected ${FEE_AUTHORITY.toBase58()}, got ${upgradeAuthority.publicKey.toBase58()}`,
    );
  }

  const configKeypair = loadOrCreateConfigKeypair(configKeypairPath);
  const connection = new anchor.web3.Connection(rpcUrl, "confirmed");
  const wallet = new anchor.Wallet(upgradeAuthority);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);

  const idl = JSON.parse(readFileSync(idlPath, "utf8"));
  const program = new anchor.Program(idl, provider);

  const configInfo = await connection.getAccountInfo(configKeypair.publicKey);
  if (!configInfo) {
    console.log("Sending initialize_config...");
    await program.methods
      .initializeConfig(
        FEE_AUTHORITY,
        TREASURY,
        FEE_AUTHORITY,
        DEFAULT_PROTOCOL_FEE_RATE,
      )
      .accounts({
        config: configKeypair.publicKey,
        funder: upgradeAuthority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([configKeypair])
      .rpc();
    console.log("initialize_config done");
  } else {
    console.log("Config already exists, skipping initialize_config");
    const config = await program.account.whirlpoolsConfig.fetch(
      configKeypair.publicKey,
    );
    if (config.defaultProtocolFeeRate !== DEFAULT_PROTOCOL_FEE_RATE) {
      console.log(
        `Updating default_protocol_fee_rate: ${config.defaultProtocolFeeRate} -> ${DEFAULT_PROTOCOL_FEE_RATE}`,
      );
      await program.methods
        .setDefaultProtocolFeeRate(DEFAULT_PROTOCOL_FEE_RATE)
        .accounts({
          whirlpoolsConfig: configKeypair.publicKey,
          feeAuthority: FEE_AUTHORITY,
        })
        .rpc();
      console.log("set_default_protocol_fee_rate done");
    }
  }

  for (const tier of FEE_TIERS) {
    const feeTier = feeTierPda(configKeypair.publicKey, tier.tickSpacing);
    const feeTierInfo = await connection.getAccountInfo(feeTier);
    if (feeTierInfo) {
      console.log(
        `Fee tier tickSpacing=${tier.tickSpacing} already exists: ${feeTier.toBase58()}`,
      );
      continue;
    }
    console.log(
      `Sending initialize_fee_tier tickSpacing=${tier.tickSpacing} defaultFeeRate=${tier.defaultFeeRate}...`,
    );
    await program.methods
      .initializeFeeTier(tier.tickSpacing, tier.defaultFeeRate)
      .accounts({
        config: configKeypair.publicKey,
        feeTier,
        funder: upgradeAuthority.publicKey,
        feeAuthority: FEE_AUTHORITY,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log(`Fee tier created: ${feeTier.toBase58()}`);
  }

  console.log("\n=== Cookieora Whirlpool deployment ===");
  console.log(`programId:      ${PROGRAM_ID.toBase58()}`);
  console.log(`configAddress:  ${configKeypair.publicKey.toBase58()}`);
  console.log(`feeAuthority:   ${FEE_AUTHORITY.toBase58()}`);
  console.log(`treasury:       ${TREASURY.toBase58()}`);
  console.log("\nFrontend:");
  console.log(
    `WhirlpoolDeployment.custom("${PROGRAM_ID.toBase58()}", "${configKeypair.publicKey.toBase58()}")`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
