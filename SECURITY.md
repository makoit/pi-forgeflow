# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.x     | ✅         |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Report vulnerabilities by emailing the maintainer directly or using [GitHub's private security advisory](https://github.com/makoit/pi-forgeflow/security/advisories/new) feature.

Include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested mitigations

You can expect an acknowledgement within 48 hours and a resolution timeline within 14 days for confirmed issues.

## Security Principles

This package follows these security principles:

- No install scripts or postinstall hooks
- No telemetry or network calls at install or runtime
- No credential handling
- Extension code is clearly separated from static skills and prompts
- All publishable contents are declared in an explicit `files` allowlist in `package.json`
