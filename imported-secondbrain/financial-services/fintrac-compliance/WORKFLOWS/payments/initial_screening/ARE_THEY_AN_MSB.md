---
id: 02_playbooks__financial_services__payments__initial_screening__are_they_an_msb_md
title: Are They An MSB?
owner: ML1
status: draft
created_date: 2026-04-03
last_updated: 2026-04-03
tags: [financial-services, payments, screening, msb, fintrac]
---

# Are They An MSB?

Prepared by `Muggah Money Services`
(`MKT_MUGGAH_MONEY_SERVICES_AGENT`).

## Purpose

Internal first-pass screen for whether an intake likely raises Canadian
money-services or FINTRAC perimeter issues.

This is not a final legal conclusion. It is a routing and risk-discipline tool.

## Operating Posture

- Do not assume the business is outside MSB scope by default.
- Separate MSB issues from PSP and securities issues, but do not ignore overlap.
- Prefer candid routing over premature comfort.

## Core Question

Does the fact pattern suggest that the client is carrying on money-services,
virtual-currency, remittance, foreign-exchange, or other FINTRAC-relevant
activity in or into Canada?

## Automatic Triggers For This Screen

Run this screen if the intake mentions any of the following:

- buying, selling, or exchanging virtual currency
- remittance, payout, transfer, or movement of value
- fiat-to-crypto or crypto-to-fiat conversion
- hosted wallet or intermediary control over customer assets
- cross-border transfers involving Canadian users
- agent, dealer, or intermediary relationships for value transfer
- statements that registration is unnecessary because the business is "just software"

## First-Pass Questions

- Does the business receive, transmit, exchange, or facilitate movement of fiat or virtual currency?
- Are Canadians using the service, or is the service offered into Canada?
- Who controls the transfer flow at each step?
- Does the business ever take possession, custody, or operational control of customer value?
- Is the business acting for another entity, marketplace, issuer, or payment platform?
- Is the model domestic, foreign-MSB, or hybrid?
- Are reporting, AML program, or registration obligations being assumed away?

## Initial Flags

### Likely MSB / FINTRAC Flags

- virtual-currency dealing is part of the operating model
- money transfer or remittance is a core feature
- exchange or conversion functionality is offered
- the business is an intermediary rather than merely a software vendor
- Canadian touchpoints are real, not incidental

### Escalation Flags

- the client insists they are outside scope without a fact-based analysis
- custody and transfer functions are underdescribed
- the model mixes MSB-like activity with securities or PSP functions
- AML/reporting obligations are treated as optional, deferred, or cosmetic

## Output Format

Each note should state:

- `primary_regulatory_lens`: `money_services | overlap | unclear`
- `core_trigger_facts`
- `core_risks`
- `client_risk_rating`
- `touchability`
- `required_overlap_routing`
- `next_ml1_decision`

## Routing Rule

- Route to `Muggah Money Services` whenever MSB, foreign-MSB, virtual-currency,
  remittance, exchange, or AML/reporting issues appear materially live.
- Add `Muggah Securities` if token distribution, custody, marketplace, or
  investment-contract issues are also present.
- Add `Muggah Payment Services` if payment-function, safeguarding, or end-user
  funds issues are also present.

