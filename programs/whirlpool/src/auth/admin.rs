use anchor_lang::prelude::*;
use solana_program::pubkey;

// Cookieora upgrade authority (keys/local/upgrade-authority-live.json)
pub const ADMINS: [Pubkey; 1] = [pubkey!(
    "HGSGbiM3tMvbX8cxitEgzbQv53M4rFcsE1gn7fvrHrkN"
)];

pub fn is_admin_key(maybe_admin: &Pubkey) -> bool {
    ADMINS.iter().any(|admin| maybe_admin.eq(admin))
}
