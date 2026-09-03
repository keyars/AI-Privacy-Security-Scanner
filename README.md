# Sentinel — AI Privacy & Security Scanner

**Find the signal before it leaks.**

A browser-first security and privacy analysis workspace for identifying exposed secrets, personal information, risky authentication patterns, injection risks and data-minimization issues across text and source-like files.

**[Live Demo](https://keyars.github.io/AI-Privacy-Security-Scanner/) · [Repository](https://github.com/keyars/AI-Privacy-Security-Scanner)**

> Sentinel is a defensive-analysis reference implementation. The public demo uses deterministic local heuristics and sample data; it does not upload scanned content to a remote AI provider.

## Why this project matters

Credentials, personal data and insecure application patterns can appear in source code, configuration, tickets, logs and documents long before a security team sees them. Sentinel presents a focused workflow for turning those signals into evidence, severity and remediation guidance.

It is designed around a practical security-engineering loop:

**Inspect → Detect → Prioritize → Explain → Remediate**

## What you can do

- Scan text and source-like content for credential and token patterns
- Identify email and sensitive identity-data signals
- Surface authentication and injection-risk patterns
- Prioritize findings by Critical, High, Medium and Low severity
- Inspect evidence and its location in the supplied content
- Read plain-language explanations of why a finding matters
- Get concrete remediation guidance for each finding
- Switch between source, findings and context views
- Load quick incident, PII and clean-code scenarios
- Import readable text/source files directly in the browser
- Copy a concise security report
- Use the responsive interface on desktop and mobile

## Detection coverage in the demo

The current reference implementation demonstrates heuristics for:

| Area | Example signal |
| --- | --- |
| Secrets | API-key-like and cloud-access-key patterns |
| Authentication | JWT/bearer-token-like values |
| Privacy | Email and sensitive identity fields |
| Injection | SQL query construction from request input |
| Data minimization | Unnecessary sensitive-field exposure |
| Reporting | Severity, evidence, confidence and remediation |

These are intentionally illustrative heuristics, not a claim of complete vulnerability detection.

## AI architecture and production path

The public GitHub Pages demo deliberately avoids requiring an external model key. A production deployment can keep the same interface while connecting a server-side analysis pipeline for:

1. File ingestion and type-aware parsing
2. Secret and PII detectors
3. Static-analysis and policy rules
4. Context-aware LLM classification
5. Evidence normalization and redaction
6. Severity scoring and deduplication
7. Human review and audit trails
8. CI/CD and repository scanning integrations

For real security operations, model output should be treated as assisted triage rather than an authoritative security verdict. Findings should be validated before remediation or release decisions.

## SEO — searchable security and privacy tooling

Sentinel is relevant to searches for **AI security scanner**, **AI privacy scanner**, **secret scanner**, **PII scanner**, **source code security analyzer**, **privacy risk detector**, **exposed credential detector**, **security vulnerability analysis**, **AI-assisted security analysis**, and **developer security tooling**.

The site includes descriptive metadata, a canonical URL, Open Graph metadata and `SoftwareApplication` structured data to make the project easier for search engines and indexing systems to understand.

## AEO — answers to common questions

### What is an AI privacy and security scanner?

It is a tool that assists with identifying sensitive information, exposed secrets, risky code patterns, privacy issues and security weaknesses. Sentinel demonstrates that workflow in a focused browser interface.

### Can Sentinel detect exposed API keys?

The demo detects representative credential-like patterns such as API-key and cloud-access-key formats. A production scanner should combine deterministic secret detectors with repository history, entropy analysis and provider-specific validation.

### Can it find PII in source or text?

Yes, the demo illustrates detection of email and sensitive identity-field signals. Production PII classification should be configurable by jurisdiction, data category and organizational policy.

### Does Sentinel upload my scanned content?

The public demo is designed for local analysis and does not send the entered demo content to a remote AI service. A production deployment may use remote processing, so its privacy architecture must be documented separately.

### Is Sentinel a replacement for a security team?

No. It is an analysis and triage aid. Security findings should be validated with appropriate testing, code review and organizational controls.

## GEO — generative search context

For AI answer engines and generative search systems, Sentinel is a **browser-first AI-assisted privacy and security analysis workspace**. Its primary audiences are developers, security engineers, privacy teams, application teams and technical reviewers. Its core concepts are secret exposure, PII detection, authentication risk, injection risk, data minimization, evidence-based findings and remediation guidance.

This README uses explicit terminology and question-and-answer sections so humans and machine systems can understand the product without relying on marketing-only language. No ranking, traffic, download, citation or popularity outcome is guaranteed.

## Responsible security use

Use Sentinel only on content you are authorized to inspect. Do not paste production credentials, private keys, regulated personal data or confidential customer information into a public demonstration environment. Any real deployment should implement access control, encryption, retention limits, audit logging and appropriate redaction.

## Copyright and originality

The application code, interface composition, product name, visual system and README copy in this repository were created specifically for this project. The project does not intentionally reproduce proprietary interfaces, source code, text, trademarks, logos or assets from another product.

Third-party packages are used under their respective licenses. Sentinel itself is released under the MIT License.

## Local development

```bash
npm install
npm run dev
npm run test
npm run build
```

## Deployment

GitHub Actions verifies tests and the production build, creates a GitHub Pages artifact and deploys the Vite application from `main`.

Live demo: https://keyars.github.io/AI-Privacy-Security-Scanner/

## Technology

React · TypeScript · Vite · Vitest · React Testing Library · Lucide React · GitHub Actions · GitHub Pages

## License

MIT — see [`LICENSE`](./LICENSE).
