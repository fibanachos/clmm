use solana_security_txt::security_txt;

#[cfg(feature = "whirlpool-entrypoint")]
security_txt! {
    name: "Cookieora Whirlpool program",
    project_url: "https://cookieora.com",
    contacts: "email:team@cookieora.com",
    policy: "https://cookieora.com",
    source_code: "https://github.com/cookieora/clmm"
}
