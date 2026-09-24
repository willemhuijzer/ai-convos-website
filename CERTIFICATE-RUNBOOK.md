# Fixing HTTPS for `ai-convos.nl`

This runbook records the certificate diagnosis made on 24 September 2026 and the steps needed to restore HTTPS for the AI Convos website.

## Summary

The site is served by GitHub Pages over HTTP, but `https://ai-convos.nl` presents GitHub's generic `*.github.io` certificate instead of a certificate containing `ai-convos.nl`.

Two changes are required:

1. Correct the `www.ai-convos.nl` DNS record at STRATO.
2. Let GitHub Pages provision the custom-domain certificate, then enable **Enforce HTTPS**.

These changes require access to the STRATO account that manages the domain and GitHub repository admin access. Repository write access alone is not sufficient to manage GitHub Pages settings.

## Observed state

### GitHub Pages

The GitHub Pages API reported:

```text
Repository:       willemhuijzer/ai-convos-website
Publishing source: main, repository root
Custom domain:    ai-convos.nl
Build status:     built
HTTPS enforced:   false
```

The repository's `CNAME` file correctly contains:

```text
ai-convos.nl
```

### Public DNS

The authoritative nameservers are STRATO nameservers:

```text
docks01.rzone.de
shades16.rzone.de
```

The relevant records resolved as follows:

```text
ai-convos.nl.       A       185.199.108.153
www.ai-convos.nl.   CNAME   ai-convos.nl.
```

The apex A record points to a valid GitHub Pages address. However, the `www` CNAME points back to the apex. GitHub warns that pointing a custom subdomain to the apex can prevent HTTPS provisioning. For a GitHub Pages project owned by `willemhuijzer`, `www` should point directly to `willemhuijzer.github.io`.

### TLS

A TLS handshake with `ai-convos.nl` returned a certificate with:

```text
Subject: CN=*.github.io
```

Because `ai-convos.nl` is not covered by that certificate, browsers report `ERR_CERT_COMMON_NAME_INVALID` and command-line clients report that no certificate subject name matches the host.

## Fix

### 1. Correct DNS at STRATO

Sign in to the STRATO customer account that owns `ai-convos.nl`.

1. Open **Domains → Domainverwaltung**.
2. Find `ai-convos.nl` and select the cogwheel.
3. Open the **DNS** tab.
4. Keep the existing apex A record:

   ```text
   185.199.108.153
   ```

5. If the STRATO plan supports multiple apex A records, add GitHub's other Pages addresses for redundancy:

   ```text
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

   One valid GitHub Pages A record is sufficient to route the domain, so the additional addresses are recommended hardening rather than the primary certificate fix.

6. Expand the domain's subdomains and select `www.ai-convos.nl`. Create it first if it does not appear as a separately managed subdomain.
7. Open the subdomain's DNS or CNAME settings.
8. Change the CNAME target from:

   ```text
   ai-convos.nl.
   ```

   to:

   ```text
   willemhuijzer.github.io.
   ```

   If STRATO's form does not accept the trailing dot, enter `willemhuijzer.github.io`.

9. Save the DNS changes.

Do not change the nameservers, DNSSEC settings, or mail records. DNS changes may take up to 24 hours to propagate, although they commonly appear sooner.

Official references:

- [GitHub: Managing a custom domain for a GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [STRATO: Managing DNS records](https://www.strato-hosting.co.uk/faq/domain/which-dns-records-are-available-and-how-can-i-manage-them/)

### 2. Verify DNS propagation

Run:

```bash
dig ai-convos.nl A +noall +answer
dig www.ai-convos.nl CNAME +noall +answer
```

The important result is:

```text
www.ai-convos.nl.   CNAME   willemhuijzer.github.io.
```

The apex query should return only GitHub Pages IP addresses. It must not contain an address belonging to another host.

### 3. Restart GitHub's certificate provisioning

After the corrected DNS records are publicly visible:

1. Sign in to GitHub with an owner or administrator account for `willemhuijzer/ai-convos-website`.
2. Open **Settings → Pages**.
3. Confirm the custom domain is `ai-convos.nl`.
4. Wait for GitHub's DNS check to complete.
5. If certificate provisioning remains stuck, remove the custom domain, enter `ai-convos.nl` again, and save. GitHub documents this as the way to restart certificate provisioning after fixing DNS.
6. Wait until GitHub reports that the certificate is available. This can take up to 24 hours.
7. Select **Enforce HTTPS**.

The account used during the diagnosis had repository write access but not repository administration or **Manage GitHub Pages settings** permission. GitHub returns `404 Not Found` from the Pages health and update endpoints in that situation. An owner/admin must perform this part or grant the required permission.

Official reference:

- [GitHub: Securing a GitHub Pages site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

## Final verification

Verify the certificate and redirects after GitHub finishes provisioning:

```bash
curl -I https://ai-convos.nl/
curl -I https://www.ai-convos.nl/
openssl s_client -connect ai-convos.nl:443 -servername ai-convos.nl </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -ext subjectAltName
```

Expected results:

- Both URLs complete without a certificate error.
- One hostname redirects to the other consistently.
- The certificate's Subject Alternative Name list includes `ai-convos.nl` and normally `www.ai-convos.nl`.
- GitHub Pages shows **Enforce HTTPS** enabled.

## If provisioning still fails

Check these in order:

1. Remove any additional apex `A`, `AAAA`, `ALIAS`, or `ANAME` records that do not point to GitHub Pages.
2. Confirm `www` is a direct CNAME to `willemhuijzer.github.io`, not to the apex domain.
3. Check for CAA records. If any exist, at least one must permit `letsencrypt.org`.
4. Remove and re-add the custom domain in GitHub Pages settings once more after DNS has fully propagated.
5. Allow up to 24 hours for certificate issuance before escalating to GitHub Support.

