import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { readFileSync } from "fs";
import { resolve } from "path";
import type { WhirlpoolContext } from "../../src";

const UPGRADE_AUTHORITY_KEYPAIR_PATH = resolve(
  __dirname,
  "../../../../keys/local/upgrade-authority-live.json",
);

function loadUpgradeAuthorityKeypair(): Keypair {
  const secretKey = JSON.parse(
    readFileSync(UPGRADE_AUTHORITY_KEYPAIR_PATH, "utf8"),
  ) as number[];
  return Keypair.fromSecretKey(Buffer.from(secretKey));
}

const UPGRADE_AUTHORITY_KEYPAIR = loadUpgradeAuthorityKeypair();

export async function getLocalnetAdminKeypair0(
  ctx: WhirlpoolContext,
): Promise<Keypair> {
  await fundKeypairIfNeeded(ctx, UPGRADE_AUTHORITY_KEYPAIR);
  return UPGRADE_AUTHORITY_KEYPAIR;
}

export async function getLocalnetAdminKeypair1(
  ctx: WhirlpoolContext,
): Promise<Keypair> {
  await fundKeypairIfNeeded(ctx, UPGRADE_AUTHORITY_KEYPAIR);
  return UPGRADE_AUTHORITY_KEYPAIR;
}

async function fundKeypairIfNeeded(
  ctx: WhirlpoolContext,
  keypair: Keypair,
  amount: number = 10000 * LAMPORTS_PER_SOL,
): Promise<void> {
  const accountInfo = await ctx.connection.getAccountInfo(keypair.publicKey);
  if (!accountInfo) {
    const signature = await ctx.connection.requestAirdrop(
      keypair.publicKey,
      amount,
    );
    await ctx.connection.confirmTransaction(
      {
        signature,
        ...(await ctx.connection.getLatestBlockhash("finalized")),
      },
      "finalized",
    );
  }
}
