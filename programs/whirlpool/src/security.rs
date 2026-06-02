use solana_security_txt::security_txt;

#[cfg(feature = "whirlpool-entrypoint")]
security_txt! {
    name: "CookieBox Whirlpool program",
    project_url: "https://cookiebox.app",
    contacts: "email:team@cookiebox.app",
    policy: "https://cookiebox.app",
    source_code: "https://github.com/cookiebox/clmm"
}
