import type { LeaseClause } from "./types";

// The seeded demo document: a long-form commercial lease authored as clause-addressable data. This is the genuine input the LLM reasons over, with no answer key. Six clauses carry deliberately off-market, landlord-favorable language (see ./metadata.ts): §5, §9, §11, §15, §16, §17.

export const LEASE_TITLE = "COMMERCIAL LEASE AGREEMENT";

export const leaseRecitals =
  "This Commercial Lease Agreement (this “Lease”) is entered into as of March 1, 2026 " +
  "(the “Effective Date”) by and between Meridian Harbor Properties, LLC, a Delaware limited " +
  "liability company (“Landlord”), and Northwind Apothecary, Inc., a Washington corporation " +
  "(“Tenant”). Landlord is the owner of the retail center commonly known as Harbor Point Commons " +
  "located at 1200 Wharfside Avenue, Seattle, Washington (the “Center”), and Tenant desires to " +
  "lease certain premises therein. In consideration of the mutual covenants below, the parties agree as follows.";

export const leaseClauses: LeaseClause[] = [
  {
    ref: "§1",
    heading: "Premises",
    text:
      "Landlord leases to Tenant, and Tenant leases from Landlord, those certain premises consisting of " +
      "approximately 3,200 rentable square feet and known as Suite 140 (the “Premises”), as more " +
      "particularly depicted on Exhibit A. The Premises are leased together with the non-exclusive right to " +
      "use the common areas of the Center, subject to the terms of this Lease and Landlord's rules and " +
      "regulations as reasonably amended from time to time.",
  },
  {
    ref: "§2",
    heading: "Term",
    text:
      "The initial term of this Lease (the “Initial Term”) shall be five (5) years, commencing on " +
      "April 1, 2026 (the “Commencement Date”) and expiring at 11:59 p.m. on March 31, 2031, unless " +
      "sooner terminated or extended as provided herein. If Landlord is unable to deliver possession of the " +
      "Premises by the Commencement Date, this Lease shall not be void or voidable, but the Commencement Date " +
      "shall be adjusted to the date possession is tendered.",
  },
  {
    ref: "§3",
    heading: "Permitted Use",
    text:
      "The Premises shall be used and occupied solely for the operation of a retail pharmacy and the sale of " +
      "related health, wellness, and convenience goods, and for no other purpose without Landlord's prior " +
      "written consent. Tenant shall continuously operate its business in the Premises during the customary " +
      "business hours of the Center and shall not abandon or vacate the Premises during the Term.",
  },
  {
    ref: "§4",
    heading: "Base Rent",
    text:
      "Tenant shall pay to Landlord base rent (“Base Rent”) for the first Lease Year in the amount of " +
      "One Hundred Forty-Four Thousand Dollars ($144,000.00) per annum, payable in equal monthly installments " +
      "of Twelve Thousand Dollars ($12,000.00) in advance on the first day of each calendar month, without " +
      "demand, deduction, or setoff. As used herein, “Lease Year” means each successive twelve (12) " +
      "month period during the Term, the first of which begins on the Commencement Date.",
  },
  {
    ref: "§5",
    heading: "Rent Escalation",
    text:
      "Commencing on the first anniversary of the Commencement Date and on each anniversary thereafter during " +
      "the Term, the Base Rent then in effect shall automatically increase by five percent (5%) over the Base " +
      "Rent payable during the immediately preceding Lease Year, compounded annually. Such increases shall " +
      "require no further notice to Tenant and shall apply to any renewal or extension of the Term.",
  },
  {
    ref: "§6",
    heading: "Security Deposit",
    text:
      "Upon execution of this Lease, Tenant shall deposit with Landlord the sum of Twenty-Four Thousand Dollars " +
      "($24,000.00) as security for the full and faithful performance of Tenant's obligations (the " +
      "“Security Deposit”). Landlord may, but shall not be obligated to, apply all or part of the " +
      "Security Deposit to cure any default of Tenant. The Security Deposit shall not bear interest and may be " +
      "commingled with Landlord's other funds.",
  },
  {
    ref: "§7",
    heading: "Operating Expenses",
    text:
      "In addition to Base Rent, Tenant shall pay as additional rent its proportionate share of the Center's " +
      "operating expenses, common area maintenance, real property taxes, and insurance (collectively, " +
      "“Operating Expenses”), based on the ratio of the rentable area of the Premises to the total " +
      "rentable area of the Center. Landlord shall furnish Tenant an annual reconciliation statement, and " +
      "controllable Operating Expenses shall not increase by more than five percent (5%) per year on a " +
      "cumulative basis.",
  },
  {
    ref: "§8",
    heading: "Utilities",
    text:
      "Tenant shall arrange and pay for all utilities and services supplied to the Premises, including " +
      "electricity, gas, water, sewer, telephone, and data, together with any connection or hook-up fees. " +
      "Where any such utility is not separately metered, Tenant shall pay Landlord's reasonable estimate of " +
      "Tenant's share. Landlord shall not be liable for any interruption of utility services not caused by " +
      "Landlord's gross negligence or willful misconduct.",
  },
  {
    ref: "§9",
    heading: "Maintenance and Repairs",
    text:
      "Tenant shall, at Tenant's sole cost and expense, keep and maintain the entire Premises in good order " +
      "and repair, including the roof, foundation, exterior and structural walls, and the heating, " +
      "ventilation, and air-conditioning systems serving the Premises, and shall replace any of the foregoing " +
      "as and when necessary. Landlord shall have no obligation whatsoever to maintain, repair, or replace any " +
      "portion of the Premises.",
  },
  {
    ref: "§10",
    heading: "Alterations",
    text:
      "Tenant shall not make any alterations, additions, or improvements to the Premises without Landlord's " +
      "prior written consent, which consent shall not be unreasonably withheld for non-structural interior " +
      "alterations. All permitted alterations shall be performed in a good and workmanlike manner, in " +
      "compliance with applicable laws, and shall become the property of Landlord upon installation unless " +
      "Landlord elects otherwise in writing.",
  },
  {
    ref: "§11",
    heading: "Assignment and Subletting",
    text:
      "Tenant shall not assign this Lease or sublet all or any portion of the Premises, whether voluntarily or " +
      "by operation of law, without the prior written consent of Landlord, which consent Landlord may grant or " +
      "withhold in its sole and absolute discretion for any reason or no reason. Any purported assignment or " +
      "sublease made without such consent shall be void and shall constitute an Event of Default.",
  },
  {
    ref: "§12",
    heading: "Insurance",
    text:
      "Tenant shall, at its expense, maintain commercial general liability insurance with limits of not less " +
      "than Two Million Dollars ($2,000,000) per occurrence, naming Landlord as an additional insured, " +
      "together with property insurance covering Tenant's personal property and improvements. Tenant shall " +
      "deliver certificates of insurance to Landlord prior to occupancy and upon each renewal of coverage.",
  },
  {
    ref: "§13",
    heading: "Indemnification",
    text:
      "Tenant shall indemnify, defend, and hold harmless Landlord from and against any and all claims, " +
      "damages, liabilities, and expenses arising out of Tenant's use of the Premises or any act or omission " +
      "of Tenant, its employees, agents, or invitees, except to the extent caused by Landlord's gross " +
      "negligence or willful misconduct.",
  },
  {
    ref: "§14",
    heading: "Default and Remedies",
    text:
      "The occurrence of any of the following shall constitute an “Event of Default”: (a) Tenant's " +
      "failure to pay any Base Rent or additional rent within five (5) days after the same is due; (b) " +
      "Tenant's failure to perform any other obligation under this Lease within fifteen (15) days after " +
      "written notice; or (c) the insolvency or bankruptcy of Tenant. Upon an Event of Default, Landlord may " +
      "terminate this Lease and pursue all remedies available at law or in equity.",
  },
  {
    ref: "§15",
    heading: "Holdover",
    text:
      "If Tenant remains in possession of the Premises after the expiration or earlier termination of this " +
      "Lease without Landlord's written consent, such occupancy shall be a tenancy at sufferance, and Tenant " +
      "shall pay holdover rent equal to two hundred percent (200%) of the Base Rent and additional rent " +
      "payable during the last month of the Term for each month or partial month of holdover. Tenant shall " +
      "also be liable for all consequential damages arising from such holdover.",
  },
  {
    ref: "§16",
    heading: "Renewal Option",
    text:
      "Tenant may request to extend the Term for one (1) additional period of five (5) years by delivering " +
      "written notice to Landlord not less than nine (9) months prior to expiration; provided, however, that " +
      "any such extension shall be granted or denied by Landlord in its sole discretion, and the Base Rent for " +
      "any extension term shall be as determined by Landlord. Tenant shall have no vested right to renew this " +
      "Lease.",
  },
  {
    ref: "§17",
    heading: "Personal Guaranty",
    text:
      "As a material inducement to Landlord's entry into this Lease, the principal of Tenant, Dr. Eleanor Voss " +
      "(the “Guarantor”), shall personally, absolutely, and unconditionally guarantee all of Tenant's " +
      "obligations under this Lease, without limitation as to amount or duration, for the entire Term and any " +
      "extension thereof. The Guarantor's liability shall be primary and shall survive any assignment, " +
      "termination, or modification of this Lease.",
  },
  {
    ref: "§18",
    heading: "Surrender",
    text:
      "Upon the expiration or termination of this Lease, Tenant shall surrender the Premises to Landlord in " +
      "good order and condition, broom-clean, ordinary wear and tear excepted, and shall remove all of " +
      "Tenant's personal property and any alterations Landlord requires to be removed. Any property left in " +
      "the Premises may be deemed abandoned and disposed of by Landlord at Tenant's expense.",
  },
  {
    ref: "§19",
    heading: "Notices",
    text:
      "All notices under this Lease shall be in writing and delivered personally, by nationally recognized " +
      "overnight courier, or by certified mail, return receipt requested, to the addresses set forth in the " +
      "preamble or such other address as either party may designate by notice. Notices shall be deemed given " +
      "upon receipt or refusal of delivery.",
  },
  {
    ref: "§20",
    heading: "Governing Law; Miscellaneous",
    text:
      "This Lease shall be governed by the laws of the State of Washington, without regard to its conflicts of " +
      "law principles. This Lease constitutes the entire agreement between the parties and supersedes all " +
      "prior negotiations and understandings. No amendment shall be effective unless in writing and signed by " +
      "both parties. If any provision is held unenforceable, the remainder shall continue in full force and " +
      "effect.",
  },
];

// Returns the clause with the given ref, or undefined.
export function getClauseByRef(ref: string): LeaseClause | undefined {
  return leaseClauses.find((c) => c.ref === ref);
}

// Derives the full plain text of the lease from its clause structure; what a DocumentService.getFullText() implementation backed by this fixture would return.
export function getLeaseFullText(): string {
  const body = leaseClauses.map((c) => `${c.ref}. ${c.heading}\n\n${c.text}`).join("\n\n");
  return `${LEASE_TITLE}\n\n${leaseRecitals}\n\n${body}\n`;
}
