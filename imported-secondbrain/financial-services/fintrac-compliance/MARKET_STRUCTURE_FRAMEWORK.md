---
id: financial_services__market_structure_framework
title: Financial Services — Market Structure Framework
owner: ML1
status: approved
approved_by: ML1
approved_date: 2026-04-17
version: 1.3
tags: [financial-services, market-structure, practice-area, scope]
created_date: 2026-05-18
last_updated: 2026-05-18
---

# Financial Services — Market Structure Framework

## Purpose

This document defines the canonical five-level structural map of financial
services activity. It establishes where Levine Law operates, where it does
not, and why. All solutions, strategies, and agents in this practice area
inherit their scope boundaries from this framework.

This is a reference document, not a binding policy. It does not constrain
agent behavior directly — it governs scope decisions for strategies and
solutions built on top of it.

---

## The Five-Level Stack

| Level | Function | Risk Type | Who Bears It |
|---|---|---|---|
| 1 | Move money | Operational | The PSP — regulated, not absent |
| 2 | Lend money | Credit | You |
| 3 | Hold money | Liability / insolvency | You (pre-safeguarding); managed (post-safeguarding) |
| 4 | Create money (banking) | Systemic | You + regulator |
| 5 | Define money | Sovereign | State |

**Note on Level 1 risk:** Every registered RPAA PSP bears real operational risk
obligations regardless of whether it holds funds. The RPAA requires a written
operational risk management framework (s. 17), annual Board approval, annual
third-party assessments for all service providers, and independent audits every
three years. Operational risk violations are AMPs up to C$1,000,000 per
violation.

**Note on Level 3 risk:** Before a compliant safeguarding structure is in place,
a fund-holding PSP carries genuine insolvency exposure — end-user funds are
general assets. A properly implemented trust account segregates those funds and
shifts the insolvency exposure to the trust structure, not the PSP's general
creditors. The risk is managed through segregation, not hidden. See the
safeguarding note in the (a)/(b) distinction section below.

---

## RPAA Payment Functions — Statutory Reference

The five payment functions under s. 2 of the *Retail Payment Activities Act*
(enacted by s. 177 of the *Budget Implementation Act, 2021, No. 1*, SC 2021,
c. 23) (exact statutory language):

| # | Payment Function |
|---|---|
| (a) | The provision or maintenance of an account that, in relation to an electronic funds transfer, is held on behalf of one or more end users |
| (b) | The holding of funds on behalf of an end user until they are withdrawn or transferred |
| (c) | The initiation of an electronic funds transfer at the request of an end user |
| (d) | The authorization of an electronic funds transfer or the transmission, reception or facilitation of an instruction in relation to an electronic funds transfer |
| (e) | The provision of clearing or settlement services |

**Note on function (e) — PCSA exclusion:** Entities that are members of a
recognized clearing and settlement system under the *Payment Clearing and
Settlement Act* (PCSA) and subject to Bank of Canada oversight under that
statute are excluded from the RPAA. Payments Canada members operating under
the PCSA framework are excluded. SWIFT operations similarly fall outside RPAA
scope. Any client performing function (e) must determine PCSA membership status
before the RPAA analysis is meaningful.

---

### The "Retail Payment Activity" Limiting Concept

The payment functions table above is necessary but not sufficient for a
registration analysis. The jurisdictional trigger under the RPAA is performing
a *retail payment activity* — defined in the Act as a payment function performed
in relation to an electronic funds transfer. The EFT must be denominated in
fiat currency or involve "funds" as defined. Regulations exclude certain
instruments and activities from the retail payment activity definition.

**Practical implication:** Whether a given instrument (including digital
currencies or tokenized assets) constitutes "funds" for RPAA purposes requires
separate analysis before the payment functions table applies. A client whose
activity involves non-fiat instruments must resolve the "funds" characterization
question as a threshold matter. The Bank of Canada's published case scenarios
address specific business models but do not provide a general rule for novel
instruments.

---

### The (a)/(b) Distinction — Structural Key

Functions (a) and (b) are legally separate and this separation is architecturally
significant.

Function (a) — *providing or maintaining the account* — is an infrastructure
role. The PSP maintains the account as a record or ledger. The account can be
provided without the PSP controlling the funds held in it. The money may sit
with a bank sponsor or other institution while the PSP operates the account
layer above it.

Function (b) — *holding funds* — is where the PSP takes actual custody of
end-user money. The funds are in the PSP's control until withdrawn or
transferred.

A PSP can perform (a) without (b). This is the structural design of most
pass-through and bank-sponsored fintech models: the PSP provides the account
layer; the bank holds the underlying funds. The PSP is Level 1 with no fund
control.

**The moment a PSP holds the balance itself, it has moved into (b) — and that
is where the Level 1 / Level 3 boundary begins.**

The safeguarding obligation under the RPAA attaches to PSPs performing function
(b). A PSP performing only (a), (c), (d), or (e) without holding funds is not
subject to the safeguarding framework (though all other operational risk
requirements apply).

**Co-performance caveat:** A PSP that performs function (a) in a structure where
it also, even transiently, touches the underlying funds faces a factual
question about whether it has crossed into (b). The determination is not purely
structural — it depends on whether the entity exercises actual control over
funds at any point. The account-layer/fund-holding distinction is a question of
fact, not solely of contract or labelling.

**Eligible financial institution requirement:** Where a PSP does perform function
(b), the RPAA safeguarding obligation requires that funds be held at an
*eligible financial institution* as defined in the Retail Payment Activities
Regulations SOR/2023-229. Not every deposit-taking institution qualifies. PSPs
using neobanks, provincial credit unions outside the defined class, or offshore
custodians must verify eligible institution status before their safeguarding
model is compliant.

---

## Level Definitions

### Level 1 — Payment Execution (Flow Layer)

**What it is:** Moving money without controlling it.

Defined by the RPAA payment functions. Level 1 operators perform one or more of:
- **(a)** Provision or maintenance of a payment account — without necessarily
  controlling the funds in it
- **(c)** Initiation of EFTs at the request of an end user
- **(d)** Authorization of EFTs, or transmission, reception, facilitation of
  payment instructions
- **(e)** Clearing or settlement services (subject to PCSA exclusion — see above)

A Level 1 operator may also perform **(b)** (holding funds) — but only
transiently, in the course of executing a payment function. When the holding
becomes structural (an ongoing balance, a stored value product), the operator
has moved into Level 3.

**Note on transient vs. structural holding — inferential position:** The RPAA
does not define "transient" holding or establish a bright-line duration test
distinguishing settlement float from a structural balance. The purposive reading
of the Act — that function (b) and the safeguarding obligation were designed to
protect persistent end-user balances, not settlement transit — supports the
transient/structural distinction. The Bank of Canada's case scenarios support
this interpretation for specific business models. However, the Bank has not
confirmed this as a general principle. Any payment processor that holds funds
during settlement and seeks comfort on whether it is performing function (b)
requires a legal opinion on this question, not a framework assertion.

No balance sheet risk in the fund-holding sense. Operators in this layer move
money but — when the structure is properly designed — do not own it.

Participants:
- Payment processors
- PSPs under the RPAA
- MSBs (money transmission aspect)
- Card programs (program manager layer)
- FX execution (non-principal)

Core legal focus:
- Safeguarding / segregation (RPAA — function (b) only)
- Operational risk framework (RPAA s. 17 — all registered PSPs)
- AML/ATF (PCMLTFA — runs in parallel; see dual-registration note below)
- Agency vs principal characterization
- Account provision vs fund control (the (a)/(b) distinction)

**PCMLTFA/RPAA dual-registration:** A Level 1 PSP performing money transmission
or remittance functions is also a Money Services Business under the PCMLTFA and
must register separately with FINTRAC. These are parallel regulatory regimes
with separate registration obligations, separate compliance frameworks, and
separate enforcement streams. A client approaching LL for RPAA registration
must be assessed for FINTRAC registration simultaneously.

**LL position:** Core practice area. Fully built. Commoditized but
compliance-heavy — clients need a lawyer, not a consultant.

---

### Level 2 — Balance Sheet Lite (Credit Intermediation)

**What it is:** Taking risk on who pays back, but not creating money.

Participants:
- Private lenders
- Factoring / receivables financing
- Merchant cash advance
- Crypto-backed lending
- Trade finance (non-bank)

Core legal focus:
- Credit risk allocation
- Security / collateral
- Priority (PPSA)
- True sale vs secured loan characterization

Key distinction from Level 1: you now care about repayment, not just movement.

**LL position:** In scope. Legal value is real — structure and enforcement
questions are genuinely complex. Solutions not yet built in this playbook.
Content exists in Funnel 2 (P6 pillar) but has not been formalized as
practice area solutions.

---

### Level 3 — Client Fund Holding

**What it is:** Holding of client funds as an ongoing structural obligation —
not transiently in the course of a payment, but as a product feature or
core business model.

This is RPAA function (b) in its structural form: the PSP holds funds on
behalf of end users not merely to move them, but as a persistent balance
or stored value. The holding itself is the product.

Participants:
- Wallets / stored value accounts
- Prepaid programs
- Stored value models operating under RPAA function (b)
- Trust companies (holding client funds under trust arrangements)
- Credit unions (in their fund-holding capacity, outside deposit-taking functions)
- Fiat-backed stablecoins (open legal questions — see below)

**Note on "EMI-style models":** Electronic money institutions (EMIs) are a
regulatory category created by EU law (EMD2) and UK regulations. Canada has
no EMI category. The RPAA does not recognize e-money as a distinct legal
concept. What would be an EMI in the UK or EU is, in Canada, a PSP performing
function (b). This is noted for comparative reference only — "EMI" has no legal
status under Canadian law and should not be used in regulatory submissions or
client-facing materials.

**Note on fiat-backed stablecoins:** Stablecoin issuers holding fiat reserves
present open legal questions under the RPAA. Whether the issuer performs
function (b) with respect to the fiat reserve — and whether the stablecoin
token itself constitutes "funds" for RPAA purposes — are unresolved as a
matter of general regulatory guidance. The Bank of Canada's case scenarios
address specific crypto-adjacent fact patterns but have not resolved the
stablecoin issuer question at the level of a general principle. A stablecoin
issuer requires a full legal opinion on classification, not a framework
characterization.

Core legal tension (Canada specifically):
- Is this a deposit substitute?
- Are you creating a monetary liability?
- Canada actively suppresses this layer — the Bank Act resists recognizing
  non-bank monetary liabilities.

Core legal focus:
- Custody vs deposit characterization
- Trust vs beneficial ownership
- Insolvency treatment
- Safeguarding (RPAA s. 20 — obligation is ongoing and continuous, not
  event-triggered; see FOP-002)
- Bank Act s. 413 boundary (at the Level 3/Level 4 margin)

**LL position:** Highest strategic value in the stack. Regulatory friction
is high — which is exactly where legal advisory is most valuable. No
solutions currently built. The characterization analysis (especially the
Canada-specific Bank Act constraint) is the core intellectual product at
this layer.

---

### Level 4 — Regulated Lending + Deposit-Taking (Banking Core)

**What it is:** Full balance sheet intermediation.

Participants:
- Banks
- Credit unions
- Deposit-taking institutions

Core functions: take deposits, make loans, create money via lending.

Legal regime: prudential regulation (OSFI), capital requirements, liquidity
coverage, deposit insurance (CDIC).

**The statutory line:** Bank Act s. 413 prohibits any person from carrying on
a business of accepting deposits payable on demand or after notice, or for a
fixed period, unless they are a bank, authorized foreign bank, or a federally
or provincially regulated deposit-taking institution. Violation of s. 413 is a
criminal offence under Bank Act s. 506. This is a hard statutory prohibition,
not a regulatory posture.

**LL position:** Advisory wall — soft only for the purposes of legal engagement.
A charter is required to operate at Level 4, and no amount of legal advisory
confers one. LL can advise clients navigating toward Level 4 — readiness work,
structural preparation, and the boundary questions that arise between Level 3
and Level 4. The gate is regulatory, not legal, so the conversation is
permissible. But operating on the wrong side of Bank Act s. 413 is a criminal
matter, not an administrative one. Clients must be clear on the distinction
between advising toward Level 4 and operating at it.

---

### Level 5 — Monetary Sovereign / Infrastructure Layer

**What it is:** Control of the system itself. A categorically different
universe from Levels 1–4.

Participants:
- Central banks (Bank of Canada)
- Payment clearing and settlement systems

Core powers: issue base money, final settlement, system stability.

**LL position:** No role. No wall is needed — there is no door. The answer
to "can a client operate here" is 100% political, not legal. Sovereign
discretion governs. LL has nothing to say at Level 5 and should not
represent otherwise.

---

## LL Operating Map

| Level | LL Position | Playbook Status |
|---|---|---|
| 1 — Payment Execution | Core practice area | Fully built (PAYMENTS) |
| 2 — Credit Intermediation | In scope | Not yet built — gap |
| 3 — Client Fund Holding | In scope — highest strategic value | Not yet built — gap |
| 4 — Regulated Deposit-Taking | Advisory only; Bank Act s. 413 hard line | No solutions; correctly limited |
| 5 — Monetary Sovereign | Out of scope entirely | Correctly absent |

---

## Jurisdictional Scope — Extraterritorial Application

The RPAA applies to PSPs that perform retail payment activities in relation to
Canadian end-users, regardless of where the PSP is incorporated or maintains
a place of business. A foreign entity — US, UK, EU — with no Canadian
establishment but serving Canadian businesses or consumers is potentially
required to register.

This is one of the most commercially significant features of the Act for
cross-border payment operators. Any client with a multi-jurisdictional payment
business must include geographic nexus analysis as a first step in RPAA scope
assessment. LL's Payments solutions must address this; the current Level 1
build should be reviewed to confirm the extraterritorial scope is addressed.

---

## Enforcement — AMP Exposure

The RPAA's administrative monetary penalty regime establishes consequence tiers
that every payments client must understand. Classification errors are not just
regulatory — they carry material economic stakes.

| Violation Category | AMP Maximum |
|---|---|
| Very serious (safeguarding failures, operating without registration) | C$10,000,000 per violation |
| Serious (operational risk framework failures) | C$1,000,000 per violation |
| Minor | C$10,000 per violation |

Each continuing day of a violation may constitute a separate violation. A PSP
operating without registration since the November 2024 deadline and still
unregistered as of April 2026 has been accumulating potential AMP exposure
for approximately 17 months. Accepting a compliance agreement reduces the AMP
by 50% — understanding that option is structurally important to regulatory
strategy advice.

**Registration timing risk — current:** The November 1, 2024 registration
deadline has passed. A PSP performing retail payment activities without
registration is in violation of the Act. Upon a Bank of Canada compliance order,
the PSP has 60 days to cease operations. Any client approaching LL for RPAA
compliance work must have their registration status assessed immediately.
This is not a background consideration — it determines whether the client can
continue to operate while the application is processed.

---

## Scope Inheritance

Solutions and strategies built in this practice area must identify which
level(s) they serve. A solution that spans levels must make the
characterization question explicit — the answer often determines the
entire regulatory path.

Agents operating in this practice area must refuse to advise on Level 5
matters and must flag Level 4 matters as boundary cases requiring ML1
judgment before proceeding.

---

## Open Build Priorities

1. **Level 2 solutions** — private lending, factoring, PPSA, crypto-backed
   lending
2. **Level 3 framework** — characterization analysis, Bank Act constraints,
   stablecoin positioning, Canada-specific client fund holding doctrine
3. **Extraterritorial scope** — update Level 1 solutions to address geographic
   nexus analysis explicitly

---

## First Order Principles

Foundational interpretive positions that govern how this practice area
approaches ambiguous characterization questions.

Throughout these principles, three confidence levels are used:
- **Settled by statute** — the statute resolves the question directly
- **Supported by supervisory policy** — the Bank of Canada has articulated a
  position; not statute, but carries Vavilov deference in judicial review
- **Firm's inferential position** — defensible on purposive reading of the Act;
  not yet confirmed by the Bank as a general principle

---

### FOP-001 — The Technology Provider Ambiguity

**Principle:**
A software vendor, ledger provider, or white-label infrastructure operator
that "maintains" account records for another entity is sitting in ambiguous
territory under the RPAA.

**Analysis:**
The Act as written would arguably capture such an operator under payment
function (a) — provision or maintenance of an account held on behalf of end
users. The account records are being maintained; end users are the ultimate
beneficiaries.

However, the PSP definition contains a carve-out: a person or entity is only
a PSP if it performs payment functions "as a service or business activity that
is not incidental to another service or business activity." A pure technology
provider whose core product is infrastructure — not payments — may fall outside
the PSP definition on this basis.

**The definitional consequence is absolute:** A technology provider that
qualifies for the incidental carve-out is not a PSP at all under the Act — it
is entirely outside the statute, not merely exempt from specific obligations.
There is no registration obligation. There are no operational risk or
safeguarding requirements. The carve-out operates at the jurisdictional
definition level, not the exemption level.

**Why it matters:**
The carve-out is unlitigated. The Bank of Canada has not issued guidance
specifically addressing where the technology provider line falls. The online
marketplaces supervisory policy (December 19, 2025) is the closest published
guidance on intermediary/infrastructure roles, but it targets marketplace
platforms, not pure ledger or white-label operators.

**Implication for practice:**
Any client operating as a white-label payment infrastructure provider,
ledger-as-a-service, or technology intermediary for a licensed PSP must
analyze both sides of this principle before concluding they are out of scope.
Assuming the incidental carve-out applies without that analysis is a
compliance risk. Assuming the Act captures them without testing the carve-out
is an over-registration risk.

**Confidence level:** Firm's inferential position. Bank of Canada interpretive
guidance pending on the technology provider variant.

---

### FOP-002 — Account Provision/Maintenance Does Not Trigger Safeguarding

**Principle:**
Neither the provision nor the maintenance of a payment account — function (a)
alone — triggers the safeguarding obligation under the RPAA.

**Analysis:**
The safeguarding obligation attaches to PSPs that perform payment function (b):
holding funds on behalf of an end user until they are withdrawn or transferred.
A PSP that provisions or maintains a payment account without holding the
underlying funds is performing function (a) only. The safeguarding framework —
trust account, insurance/guarantee, or prescribed method — does not apply to
that operator.

The account and the funds in it are legally separable. The entity that
maintains the account record is not necessarily the entity that holds the
money. In a bank-sponsored or pass-through model, the sponsoring bank holds
the funds; the PSP maintains the account layer. Only the entity that holds the
funds is subject to the safeguarding obligation.

**Why it matters:**
Mischaracterizing an account-layer operator as a fund-holder exposes the
client to over-compliance costs and misdirected regulatory posture. Conversely,
a client that holds funds but characterizes its activity as mere account
maintenance to avoid the safeguarding regime is in violation — safeguarding
failures are "very serious" AMPs up to C$10,000,000 per violation.

**Implication for practice:**
The first question in any RPAA safeguarding analysis is: does this client
actually hold end-user funds, or does it provide/maintain the account while
funds sit elsewhere? The answer determines whether the safeguarding framework
applies at all. Note also the co-performance caveat above — the
account-layer/fund-holding distinction is a question of fact in structures
where the PSP's account infrastructure is architecturally intertwined with
fund management.

**Statutory basis:**
- *RPAA* s. 2, payment function (b): "the holding of funds on behalf of an end
  user until they are withdrawn or transferred"
- *RPAA* s. 20(1): "If a payment service provider performs a retail payment
  activity that is the holding of end-user funds until they are withdrawn by
  the end user or transferred to another individual or entity, the payment
  service provider must maintain the end-user funds in accordance with
  [a permitted safeguarding model]."

Section 20(1) uses language that mirrors function (b) verbatim. The
safeguarding obligation attaches to that fact pattern.

**The obligation is continuous, not event-triggered:** Section 20(1) imposes
an ongoing maintenance obligation — not a one-time compliance act at
establishment. A PSP that implements a trust account on day one but later
allows co-mingling, or fails to maintain adequate documentation, has breached
s. 20(1) regardless of initial compliance. Board approval, annual review,
and ongoing operational controls are required throughout the life of the
safeguarding arrangement.

**Confidence level:** Settled by statute. RPAA s. 2 (payment function (b))
read with s. 20(1).

---

### FOP-003 — Supervisory Policy as Interpretive Instrument for the Incidental Carve-Out

**Principle:**
The Bank of Canada's supervisory policy guidance can and should be used to
interpret the statutory "incidental to another service or business activity"
carve-out in the RPAA PSP definition. That policy carries significant legal
weight in a regulatory challenge — not merely as enforcement posture.

**The statutory carve-out:**
Under s. 2 of the RPAA, a person or entity is only a PSP if it performs
payment functions "as a service or business activity that is not incidental
to another service or business activity." This carve-out is undefined in
the statute.

**The interpretive instrument:**
The Bank of Canada's *Supervisory Policy for Online Marketplaces* (December
19, 2025) provides the most developed Bank articulation of when payment
functions are — and are not — incidental. The policy is not statute and does
not bind a court.

**Vavilov deference — why the policy weight is higher than "enforcement posture":**
Under the *Canada (Minister of Citizenship and Immigration) v. Vavilov*, 2019
SCC 65 framework, where the Bank of Canada interprets its own enabling statute
in the course of its supervisory function, a court on judicial review applies a
reasonableness standard rather than correctness. The Bank's interpretation of
"incidental" as expressed in its supervisory policy would receive significant
deference if a PSP sought judicial review of a registration decision applying
that interpretation. A client whose business model conflicts with the Bank's
published "incidental" analysis should understand that challenging the Bank's
interpretation in court is an uphill fight, not merely an available option.

**What the policy establishes:**

Payment functions are incidental ONLY when all three conditions are met:
*(Source: Bank of Canada Supervisory Policy for Online Marketplaces,
December 19, 2025)*
1. The entity has structured its activities such that it does not take custody
   of end-user funds
2. Its involvement in the payment process is limited to what is strictly
   necessary to support its core (non-payment) service
3. Proceeds owed to end users are held exclusively by third-party PSPs

Payment functions are NOT incidental merely because:
*(Source: same policy)*
- The entity's primary business is non-payment in nature
- The entity engages third-party PSPs to handle other parts of the payment
  process
- The entity's payment involvement serves operational purposes (fraud
  management, conflict resolution, fee collection)

**The Bank's test:**
*(Source: same policy)*
"A marketplace is a PSP if it performs a payment function as a distinct
service that does not exclusively support a non-payment business activity."

The determinative question is whether the entity provides a service that,
"without [its] participation, the third-party seller [or end user] would
obtain from a PSP." If yes — not incidental.

**The three-part test is a safe harbor, not a statutory formula:**
The policy's three conditions represent the Bank's current operational
articulation of "incidental." They are drawn from supervisory policy, not
statute. The Bank retains the ability to apply a holistic assessment on
novel fact patterns, and a court applying Vavilov would assess whether the
Bank's application of the test to a specific fact pattern was reasonable —
not whether the three-part articulation is the only permissible framework.
Meeting all three conditions is the current defensible path. It is not a
guarantee.

**Implication for practice:**
The incidental carve-out is narrower than the statute reads in isolation.
Business-purpose justifications do not convert payment functions into
incidental activities if the entity is directly involved in fund flow.
The policy provides the operational test: structure the activity so that
funds never touch an account the entity owns or controls, and limit
payment-process involvement to the minimum necessary to support the core
service.

**Confidence level:** Supported by supervisory policy (Bank of Canada,
December 19, 2025). Not statute; not binding on courts. Carries Vavilov
deference in regulatory challenge or judicial review.

---

### FOP-004 — Registration Timing Risk for Late Applicants

**Principle:**
A PSP that began performing retail payment activities before November 1, 2024
without registering with the Bank of Canada is in ongoing violation of the
RPAA. Every new matter intake involving a Level 1 operator requires immediate
registration status assessment.

**Analysis:**
The RPAA's initial registration window closed November 1, 2024. PSPs performing
retail payment activities after that date without registration are in violation.
The Bank of Canada may issue a compliance order requiring the PSP to cease
operations within 60 days of the order. During the application processing
period, an unregistered PSP faces continuing AMP exposure (very serious tier,
up to C$10,000,000 per violation per day).

The 50% AMP reduction available upon accepting a compliance agreement is a
strategically significant option that should be assessed early in any matter
involving an unregistered PSP.

**Implication for practice:**
Registration status is a threshold question — it determines whether the client
can legally continue to operate while their matter proceeds. It must be
confirmed at intake, before any other compliance work begins. LL's payments
intake checklist must include RPAA registration status as a mandatory field.

**Confidence level:** Settled by statute. RPAA registration provisions and
AMP regime.
