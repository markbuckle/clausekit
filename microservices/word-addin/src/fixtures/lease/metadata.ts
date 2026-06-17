import type { ContestedClause } from "./types";

/**
 * Curated reference sidecar for the seeded lease — SEPARATE from the prose in
 * ./document.ts. This is NOT an answer key fed to the LLM: it is our curation
 * for review and the pre-wired fallback ladders the step 9 Negotiation
 * Simulator reuses. Each ladder is ordered landlord-favorable → tenant-favorable,
 * with rung[0] echoing the clause's current (off-market) language, so either
 * side can be role-played from its own end of the ladder.
 */
export const contestedClauses: ContestedClause[] = [
  {
    clauseRef: "§5",
    issue:
      "Base Rent escalates 5% compounding annually with no cap — well above market for a five-year " +
      "retail lease, roughly doubling rent over a typical renewal horizon.",
    favoredParty: "landlord",
    fallbackLadder: [
      {
        label: "Landlord opening",
        language:
          "increase by five percent (5%) over the Base Rent payable during the immediately preceding Lease " +
          "Year, compounded annually",
        rationale: "Aggressive fixed escalator that compounds well ahead of typical retail inflation.",
      },
      {
        label: "Market",
        language:
          "increase by three percent (3%) over the Base Rent payable during the immediately preceding Lease Year",
        rationale: "Fixed 3% annual bumps are the prevailing norm for multi-year retail leases.",
      },
      {
        label: "Tenant target",
        language:
          "increase by the lesser of (a) the percentage increase in the Consumer Price Index or (b) two and " +
          "one-half percent (2.5%) over the Base Rent payable during the immediately preceding Lease Year",
        rationale: "CPI-with-a-cap ties rent to actual inflation and shields Tenant in high-inflation years.",
      },
    ],
  },
  {
    clauseRef: "§9",
    issue:
      "Tenant bears full repair AND replacement of the roof, foundation, structure, and HVAC, with Landlord " +
      "carrying no obligation at all — atypical for a single suite in a multi-tenant center.",
    favoredParty: "landlord",
    fallbackLadder: [
      {
        label: "Landlord opening",
        language:
          "including the roof, foundation, exterior and structural walls, and the heating, ventilation, and " +
          "air-conditioning systems serving the Premises, and shall replace any of the foregoing as and when necessary",
        rationale: "Pushes all building-envelope and capital-replacement risk onto a small-suite tenant.",
      },
      {
        label: "Market",
        language:
          "excluding the roof, foundation, and exterior structural walls, which Landlord shall maintain and " +
          "repair; Tenant shall maintain the heating, ventilation, and air-conditioning systems serving the Premises",
        rationale: "Standard split: Landlord keeps the structure/envelope, Tenant handles interior and routine HVAC.",
      },
      {
        label: "Tenant target",
        language:
          "excluding the roof, foundation, exterior structural walls, and the heating, ventilation, and " +
          "air-conditioning systems, all of which Landlord shall maintain, repair, and replace; Tenant shall be " +
          "responsible only for routine HVAC servicing under a maintenance contract",
        rationale: "Caps Tenant to predictable routine servicing and shifts HVAC capital replacement to Landlord.",
      },
    ],
  },
  {
    clauseRef: "§11",
    issue:
      "Consent to assignment or subletting is at Landlord's sole and absolute discretion for any or no reason, " +
      "leaving Tenant no exit, no affiliate transfers, and no path through a sale of the business.",
    favoredParty: "landlord",
    fallbackLadder: [
      {
        label: "Landlord opening",
        language:
          "which consent Landlord may grant or withhold in its sole and absolute discretion for any reason or no reason",
        rationale: "Absolute veto; Tenant cannot transfer even to a qualified successor.",
      },
      {
        label: "Market",
        language: "which consent Landlord shall not unreasonably withhold, condition, or delay",
        rationale: "The reasonableness standard is the prevailing default and preserves Landlord's legitimate interests.",
      },
      {
        label: "Tenant target",
        language:
          "which consent Landlord shall not unreasonably withhold, condition, or delay, and no consent shall be " +
          "required for an assignment to an affiliate or in connection with a merger or sale of substantially all " +
          "of Tenant's assets to a successor meeting Landlord's reasonable net-worth criteria",
        rationale: "Adds permitted-transfer carve-outs for corporate reorganizations Tenant cannot control.",
      },
    ],
  },
  {
    clauseRef: "§15",
    issue:
      "Holdover rent is set at 200% of rent plus consequential damages — punitive versus the 125–150% market " +
      "range, and an inadvertent holdover could expose Tenant to open-ended consequentials.",
    favoredParty: "landlord",
    fallbackLadder: [
      {
        label: "Landlord opening",
        language: "two hundred percent (200%)",
        rationale: "Double rent plus consequentials is a penalty, not holdover compensation.",
      },
      {
        label: "Market",
        language: "one hundred fifty percent (150%)",
        rationale: "150% of the last month's rent is the common holdover premium.",
      },
      {
        label: "Tenant target",
        language: "one hundred twenty-five percent (125%)",
        rationale:
          "125% covers Landlord's real holdover cost; pair with a waiver of consequential damages for an " +
          "inadvertent, short holdover.",
      },
    ],
  },
  {
    clauseRef: "§16",
    issue:
      "Renewal is entirely at Landlord's discretion with Landlord-set rent — an illusory option that gives " +
      "Tenant no enforceable right to stay and no rent protection.",
    favoredParty: "landlord",
    fallbackLadder: [
      {
        label: "Landlord opening",
        language:
          "any such extension shall be granted or denied by Landlord in its sole discretion, and the Base Rent " +
          "for any extension term shall be as determined by Landlord",
        rationale: "Illusory option; Tenant has no enforceable right to renew.",
      },
      {
        label: "Market",
        language:
          "Tenant shall have the option to extend, exercisable by such notice, at a Base Rent equal to the " +
          "then-fair-market rent for comparable space in the Center",
        rationale: "A true tenant option at fair-market rent is the standard renewal construct.",
      },
      {
        label: "Tenant target",
        language:
          "Tenant shall have the option to extend, exercisable by such notice, at a Base Rent equal to the " +
          "lesser of fair-market rent or 103% of the prior year's Base Rent, with fair-market rent determined by " +
          "binding appraisal if the parties disagree",
        rationale: "Caps renewal rent and adds an appraisal backstop so Landlord cannot price Tenant out.",
      },
    ],
  },
  {
    clauseRef: "§17",
    issue:
      "The personal guaranty is unlimited in amount and duration and survives termination — open-ended personal " +
      "exposure for the Guarantor with no cap and no sunset.",
    favoredParty: "landlord",
    fallbackLadder: [
      {
        label: "Landlord opening",
        language: "without limitation as to amount or duration, for the entire Term and any extension thereof",
        rationale: "Open-ended personal liability with no cap and no end date.",
      },
      {
        label: "Market",
        language:
          "limited to obligations accruing during the first twenty-four (24) months of the Term and to a maximum " +
          "of six (6) months' Base Rent",
        rationale: "A guaranty capped in time and amount is typical for a creditworthy small-business tenant.",
      },
      {
        label: "Tenant target",
        language:
          "which guaranty shall terminate upon Tenant's completion of twenty-four (24) months without an uncured " +
          "monetary default and shall in no event exceed three (3) months' Base Rent",
        rationale: "Burn-down guaranty rewards a clean payment history and caps downside to one quarter's rent.",
      },
    ],
  },
];

/** Refs of the contested clauses, in document order. */
export const contestedRefs: string[] = contestedClauses.map((c) => c.clauseRef);

/** Returns the contested-clause metadata for a ref, or undefined. */
export function getContestedClause(ref: string): ContestedClause | undefined {
  return contestedClauses.find((c) => c.clauseRef === ref);
}
