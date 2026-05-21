use anchor_lang::prelude::*;

pub mod whirlpool_nft_update_auth {
    use super::*;
    pub static ID: Pubkey = solana_program::pubkey!("Ba59QdKR9fYJ362zFWLmscBF625qsMmFategLzRSRZv2");
}

pub const POSITION_NFT_METADATA_URI: &str =
    "https://www.cookieora.com/assets/json/clmm_position_nft.json";

// Based on Metaplex TokenMetadata
//
// METADATA_NAME   : max  32 bytes
// METADATA_SYMBOL : max  10 bytes
// METADATA_URI    : max 200 bytes
pub const WP_METADATA_NAME: &str = "Cookieora CLMM Position NFT";
pub const WP_METADATA_SYMBOL: &str = "CPN";
pub const WP_METADATA_URI: &str = POSITION_NFT_METADATA_URI;

pub const WPB_METADATA_NAME_PREFIX: &str = "Cookieora Position Bundle";
pub const WPB_METADATA_SYMBOL: &str = "CPB";
pub const WPB_METADATA_URI: &str = POSITION_NFT_METADATA_URI;

// Based on Token-2022 TokenMetadata extension
//
// There is no clear upper limit on the length of name, symbol, and uri,
// but it is safe for wallet apps to limit the uri to 128 bytes.
//
// see also: TokenMetadata struct
// https://github.com/solana-labs/solana-program-library/blob/cd6ce4b7709d2420bca60b4656bbd3d15d2e1485/token-metadata/interface/src/state.rs#L25
pub const WP_2022_METADATA_NAME_PREFIX: &str = "Cookieora CLMM Position NFT";
pub const WP_2022_METADATA_SYMBOL: &str = "CPN";
pub const WP_2022_METADATA_URI: &str = POSITION_NFT_METADATA_URI;
