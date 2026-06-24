---
id: 02_playbooks__financial_services__solutions__suspicious_transaction_triage__solution_scope_md
title: Solution Scope: Suspicious Transaction Triage
owner: ML1
status: draft
created_date: 2026-03-23
last_updated: 2026-03-23
tags: [financial-services, payments, aml, str, triage, fintrac]
---

# Solution Scope: Suspicious Transaction Triage

## Purpose

A structured triage and advisory engagement for clients who have identified
a potentially suspicious transaction or pattern and need legal guidance on
how to characterize, assess, and respond to it.

This is the entry-level FINTRAC/STR solution — it produces a triage assessment
and internal playbook for the specific situation. It does not include filing.
Clients requiring an STR to be prepared and filed proceed to STR_FILING.

---

## Included

- Fact intake and characterization of the suspicious transaction or pattern
- Legal analysis of STR obligation (whether reporting is required under PCMLTFA)
- Assessment of timing, threshold, and jurisdiction triggers
- Identification of any ancillary reporting obligations (LVTR, EFTR, etc.)
- Internal triage memorandum documenting analysis and recommended path
- Decision tree / playbook for handling the specific pattern going forward
- Referral recommendation where STR filing is warranted (→ STR_FILING)

## Excluded

- Preparation or submission of any FINTRAC report (separate solution: STR_FILING)
- Compliance program review or AML policy drafting
- Ongoing transaction monitoring
- Regulatory examination support (separate solution: FINTRAC_RESPONSE)

## Escalation Triggers

- Analysis indicates an STR obligation exists → refer to STR_FILING
- Pattern indicates systemic compliance failure → refer to AML_HEALTH_CHECK or
  PCMLTFA_EFFECTIVENESS_REVIEW
- Active or imminent FINTRAC examination → refer to FINTRAC_RESPONSE
- Proceeds of crime or terrorist financing risk beyond advisory scope →
  escalate to ML1 for decision on referral or withdrawal

## Execution Playbook Reference

- TBD
