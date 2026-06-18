"use strict";
(globalThis["webpackChunkclausekit"] = globalThis["webpackChunkclausekit"] || []).push([["taskpane"],{

/***/ "./src/fixtures/lease/document.ts"
/*!****************************************!*\
  !*** ./src/fixtures/lease/document.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LEASE_TITLE: () => (/* binding */ LEASE_TITLE),
/* harmony export */   getClauseByRef: () => (/* binding */ getClauseByRef),
/* harmony export */   getLeaseFullText: () => (/* binding */ getLeaseFullText),
/* harmony export */   leaseClauses: () => (/* binding */ leaseClauses),
/* harmony export */   leaseRecitals: () => (/* binding */ leaseRecitals)
/* harmony export */ });
/**
 * The seeded demo document: a long-form commercial lease (landlord vs tenant)
 * authored as clause-addressable data. This is the genuine input the LLM
 * reasons over — it contains NO answer key. Six clauses carry deliberately
 * off-market, landlord-favorable language (see ./metadata.ts for the curated
 * sidecar): §5, §9, §11, §15, §16, §17.
 */
const LEASE_TITLE = "COMMERCIAL LEASE AGREEMENT";
const leaseRecitals = "This Commercial Lease Agreement (this “Lease”) is entered into as of March 1, 2026 " + "(the “Effective Date”) by and between Meridian Harbor Properties, LLC, a Delaware limited " + "liability company (“Landlord”), and Northwind Apothecary, Inc., a Washington corporation " + "(“Tenant”). Landlord is the owner of the retail center commonly known as Harbor Point Commons " + "located at 1200 Wharfside Avenue, Seattle, Washington (the “Center”), and Tenant desires to " + "lease certain premises therein. In consideration of the mutual covenants below, the parties agree as follows.";
const leaseClauses = [{
  ref: "§1",
  heading: "Premises",
  text: "Landlord leases to Tenant, and Tenant leases from Landlord, those certain premises consisting of " + "approximately 3,200 rentable square feet and known as Suite 140 (the “Premises”), as more " + "particularly depicted on Exhibit A. The Premises are leased together with the non-exclusive right to " + "use the common areas of the Center, subject to the terms of this Lease and Landlord's rules and " + "regulations as reasonably amended from time to time."
}, {
  ref: "§2",
  heading: "Term",
  text: "The initial term of this Lease (the “Initial Term”) shall be five (5) years, commencing on " + "April 1, 2026 (the “Commencement Date”) and expiring at 11:59 p.m. on March 31, 2031, unless " + "sooner terminated or extended as provided herein. If Landlord is unable to deliver possession of the " + "Premises by the Commencement Date, this Lease shall not be void or voidable, but the Commencement Date " + "shall be adjusted to the date possession is tendered."
}, {
  ref: "§3",
  heading: "Permitted Use",
  text: "The Premises shall be used and occupied solely for the operation of a retail pharmacy and the sale of " + "related health, wellness, and convenience goods, and for no other purpose without Landlord's prior " + "written consent. Tenant shall continuously operate its business in the Premises during the customary " + "business hours of the Center and shall not abandon or vacate the Premises during the Term."
}, {
  ref: "§4",
  heading: "Base Rent",
  text: "Tenant shall pay to Landlord base rent (“Base Rent”) for the first Lease Year in the amount of " + "One Hundred Forty-Four Thousand Dollars ($144,000.00) per annum, payable in equal monthly installments " + "of Twelve Thousand Dollars ($12,000.00) in advance on the first day of each calendar month, without " + "demand, deduction, or setoff. As used herein, “Lease Year” means each successive twelve (12) " + "month period during the Term, the first of which begins on the Commencement Date."
}, {
  ref: "§5",
  heading: "Rent Escalation",
  text: "Commencing on the first anniversary of the Commencement Date and on each anniversary thereafter during " + "the Term, the Base Rent then in effect shall automatically increase by five percent (5%) over the Base " + "Rent payable during the immediately preceding Lease Year, compounded annually. Such increases shall " + "require no further notice to Tenant and shall apply to any renewal or extension of the Term."
}, {
  ref: "§6",
  heading: "Security Deposit",
  text: "Upon execution of this Lease, Tenant shall deposit with Landlord the sum of Twenty-Four Thousand Dollars " + "($24,000.00) as security for the full and faithful performance of Tenant's obligations (the " + "“Security Deposit”). Landlord may, but shall not be obligated to, apply all or part of the " + "Security Deposit to cure any default of Tenant. The Security Deposit shall not bear interest and may be " + "commingled with Landlord's other funds."
}, {
  ref: "§7",
  heading: "Operating Expenses",
  text: "In addition to Base Rent, Tenant shall pay as additional rent its proportionate share of the Center's " + "operating expenses, common area maintenance, real property taxes, and insurance (collectively, " + "“Operating Expenses”), based on the ratio of the rentable area of the Premises to the total " + "rentable area of the Center. Landlord shall furnish Tenant an annual reconciliation statement, and " + "controllable Operating Expenses shall not increase by more than five percent (5%) per year on a " + "cumulative basis."
}, {
  ref: "§8",
  heading: "Utilities",
  text: "Tenant shall arrange and pay for all utilities and services supplied to the Premises, including " + "electricity, gas, water, sewer, telephone, and data, together with any connection or hook-up fees. " + "Where any such utility is not separately metered, Tenant shall pay Landlord's reasonable estimate of " + "Tenant's share. Landlord shall not be liable for any interruption of utility services not caused by " + "Landlord's gross negligence or willful misconduct."
}, {
  ref: "§9",
  heading: "Maintenance and Repairs",
  text: "Tenant shall, at Tenant's sole cost and expense, keep and maintain the entire Premises in good order " + "and repair, including the roof, foundation, exterior and structural walls, and the heating, " + "ventilation, and air-conditioning systems serving the Premises, and shall replace any of the foregoing " + "as and when necessary. Landlord shall have no obligation whatsoever to maintain, repair, or replace any " + "portion of the Premises."
}, {
  ref: "§10",
  heading: "Alterations",
  text: "Tenant shall not make any alterations, additions, or improvements to the Premises without Landlord's " + "prior written consent, which consent shall not be unreasonably withheld for non-structural interior " + "alterations. All permitted alterations shall be performed in a good and workmanlike manner, in " + "compliance with applicable laws, and shall become the property of Landlord upon installation unless " + "Landlord elects otherwise in writing."
}, {
  ref: "§11",
  heading: "Assignment and Subletting",
  text: "Tenant shall not assign this Lease or sublet all or any portion of the Premises, whether voluntarily or " + "by operation of law, without the prior written consent of Landlord, which consent Landlord may grant or " + "withhold in its sole and absolute discretion for any reason or no reason. Any purported assignment or " + "sublease made without such consent shall be void and shall constitute an Event of Default."
}, {
  ref: "§12",
  heading: "Insurance",
  text: "Tenant shall, at its expense, maintain commercial general liability insurance with limits of not less " + "than Two Million Dollars ($2,000,000) per occurrence, naming Landlord as an additional insured, " + "together with property insurance covering Tenant's personal property and improvements. Tenant shall " + "deliver certificates of insurance to Landlord prior to occupancy and upon each renewal of coverage."
}, {
  ref: "§13",
  heading: "Indemnification",
  text: "Tenant shall indemnify, defend, and hold harmless Landlord from and against any and all claims, " + "damages, liabilities, and expenses arising out of Tenant's use of the Premises or any act or omission " + "of Tenant, its employees, agents, or invitees, except to the extent caused by Landlord's gross " + "negligence or willful misconduct."
}, {
  ref: "§14",
  heading: "Default and Remedies",
  text: "The occurrence of any of the following shall constitute an “Event of Default”: (a) Tenant's " + "failure to pay any Base Rent or additional rent within five (5) days after the same is due; (b) " + "Tenant's failure to perform any other obligation under this Lease within fifteen (15) days after " + "written notice; or (c) the insolvency or bankruptcy of Tenant. Upon an Event of Default, Landlord may " + "terminate this Lease and pursue all remedies available at law or in equity."
}, {
  ref: "§15",
  heading: "Holdover",
  text: "If Tenant remains in possession of the Premises after the expiration or earlier termination of this " + "Lease without Landlord's written consent, such occupancy shall be a tenancy at sufferance, and Tenant " + "shall pay holdover rent equal to two hundred percent (200%) of the Base Rent and additional rent " + "payable during the last month of the Term for each month or partial month of holdover. Tenant shall " + "also be liable for all consequential damages arising from such holdover."
}, {
  ref: "§16",
  heading: "Renewal Option",
  text: "Tenant may request to extend the Term for one (1) additional period of five (5) years by delivering " + "written notice to Landlord not less than nine (9) months prior to expiration; provided, however, that " + "any such extension shall be granted or denied by Landlord in its sole discretion, and the Base Rent for " + "any extension term shall be as determined by Landlord. Tenant shall have no vested right to renew this " + "Lease."
}, {
  ref: "§17",
  heading: "Personal Guaranty",
  text: "As a material inducement to Landlord's entry into this Lease, the principal of Tenant, Dr. Eleanor Voss " + "(the “Guarantor”), shall personally, absolutely, and unconditionally guarantee all of Tenant's " + "obligations under this Lease, without limitation as to amount or duration, for the entire Term and any " + "extension thereof. The Guarantor's liability shall be primary and shall survive any assignment, " + "termination, or modification of this Lease."
}, {
  ref: "§18",
  heading: "Surrender",
  text: "Upon the expiration or termination of this Lease, Tenant shall surrender the Premises to Landlord in " + "good order and condition, broom-clean, ordinary wear and tear excepted, and shall remove all of " + "Tenant's personal property and any alterations Landlord requires to be removed. Any property left in " + "the Premises may be deemed abandoned and disposed of by Landlord at Tenant's expense."
}, {
  ref: "§19",
  heading: "Notices",
  text: "All notices under this Lease shall be in writing and delivered personally, by nationally recognized " + "overnight courier, or by certified mail, return receipt requested, to the addresses set forth in the " + "preamble or such other address as either party may designate by notice. Notices shall be deemed given " + "upon receipt or refusal of delivery."
}, {
  ref: "§20",
  heading: "Governing Law; Miscellaneous",
  text: "This Lease shall be governed by the laws of the State of Washington, without regard to its conflicts of " + "law principles. This Lease constitutes the entire agreement between the parties and supersedes all " + "prior negotiations and understandings. No amendment shall be effective unless in writing and signed by " + "both parties. If any provision is held unenforceable, the remainder shall continue in full force and " + "effect."
}];
/** Returns the clause with the given ref, or undefined. */
function getClauseByRef(ref) {
  return leaseClauses.find(c => c.ref === ref);
}
/**
 * Derives the full plain text of the lease from its clause structure. This is
 * what a DocumentService.getFullText() implementation backed by this fixture
 * would return.
 */
function getLeaseFullText() {
  const body = leaseClauses.map(c => `${c.ref}. ${c.heading}\n\n${c.text}`).join("\n\n");
  return `${LEASE_TITLE}\n\n${leaseRecitals}\n\n${body}\n`;
}

/***/ },

/***/ "./src/fixtures/lease/index.ts"
/*!*************************************!*\
  !*** ./src/fixtures/lease/index.ts ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LEASE_TITLE: () => (/* reexport safe */ _document__WEBPACK_IMPORTED_MODULE_0__.LEASE_TITLE),
/* harmony export */   contestedClauses: () => (/* reexport safe */ _metadata__WEBPACK_IMPORTED_MODULE_1__.contestedClauses),
/* harmony export */   contestedRefs: () => (/* reexport safe */ _metadata__WEBPACK_IMPORTED_MODULE_1__.contestedRefs),
/* harmony export */   getClauseByRef: () => (/* reexport safe */ _document__WEBPACK_IMPORTED_MODULE_0__.getClauseByRef),
/* harmony export */   getContestedClause: () => (/* reexport safe */ _metadata__WEBPACK_IMPORTED_MODULE_1__.getContestedClause),
/* harmony export */   getLeaseFullText: () => (/* reexport safe */ _document__WEBPACK_IMPORTED_MODULE_0__.getLeaseFullText),
/* harmony export */   leaseClauses: () => (/* reexport safe */ _document__WEBPACK_IMPORTED_MODULE_0__.leaseClauses),
/* harmony export */   leaseRecitals: () => (/* reexport safe */ _document__WEBPACK_IMPORTED_MODULE_0__.leaseRecitals)
/* harmony export */ });
/* harmony import */ var _document__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./document */ "./src/fixtures/lease/document.ts");
/* harmony import */ var _metadata__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./metadata */ "./src/fixtures/lease/metadata.ts");



/***/ },

/***/ "./src/fixtures/lease/metadata.ts"
/*!****************************************!*\
  !*** ./src/fixtures/lease/metadata.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   contestedClauses: () => (/* binding */ contestedClauses),
/* harmony export */   contestedRefs: () => (/* binding */ contestedRefs),
/* harmony export */   getContestedClause: () => (/* binding */ getContestedClause)
/* harmony export */ });
/**
 * Curated reference sidecar for the seeded lease — SEPARATE from the prose in
 * ./document.ts. This is NOT an answer key fed to the LLM: it is our curation
 * for review and the pre-wired fallback ladders the step 9 Negotiation
 * Simulator reuses. Each ladder is ordered landlord-favorable → tenant-favorable,
 * with rung[0] echoing the clause's current (off-market) language, so either
 * side can be role-played from its own end of the ladder.
 */
const contestedClauses = [{
  clauseRef: "§5",
  issue: "Base Rent escalates 5% compounding annually with no cap — well above market for a five-year " + "retail lease, roughly doubling rent over a typical renewal horizon.",
  favoredParty: "landlord",
  fallbackLadder: [{
    label: "Landlord opening",
    language: "increase by five percent (5%) over the Base Rent payable during the immediately preceding Lease " + "Year, compounded annually",
    rationale: "Aggressive fixed escalator that compounds well ahead of typical retail inflation."
  }, {
    label: "Market",
    language: "increase by three percent (3%) over the Base Rent payable during the immediately preceding Lease Year",
    rationale: "Fixed 3% annual bumps are the prevailing norm for multi-year retail leases."
  }, {
    label: "Tenant target",
    language: "increase by the lesser of (a) the percentage increase in the Consumer Price Index or (b) two and " + "one-half percent (2.5%) over the Base Rent payable during the immediately preceding Lease Year",
    rationale: "CPI-with-a-cap ties rent to actual inflation and shields Tenant in high-inflation years."
  }]
}, {
  clauseRef: "§9",
  issue: "Tenant bears full repair AND replacement of the roof, foundation, structure, and HVAC, with Landlord " + "carrying no obligation at all — atypical for a single suite in a multi-tenant center.",
  favoredParty: "landlord",
  fallbackLadder: [{
    label: "Landlord opening",
    language: "including the roof, foundation, exterior and structural walls, and the heating, ventilation, and " + "air-conditioning systems serving the Premises, and shall replace any of the foregoing as and when necessary",
    rationale: "Pushes all building-envelope and capital-replacement risk onto a small-suite tenant."
  }, {
    label: "Market",
    language: "excluding the roof, foundation, and exterior structural walls, which Landlord shall maintain and " + "repair; Tenant shall maintain the heating, ventilation, and air-conditioning systems serving the Premises",
    rationale: "Standard split: Landlord keeps the structure/envelope, Tenant handles interior and routine HVAC."
  }, {
    label: "Tenant target",
    language: "excluding the roof, foundation, exterior structural walls, and the heating, ventilation, and " + "air-conditioning systems, all of which Landlord shall maintain, repair, and replace; Tenant shall be " + "responsible only for routine HVAC servicing under a maintenance contract",
    rationale: "Caps Tenant to predictable routine servicing and shifts HVAC capital replacement to Landlord."
  }]
}, {
  clauseRef: "§11",
  issue: "Consent to assignment or subletting is at Landlord's sole and absolute discretion for any or no reason, " + "leaving Tenant no exit, no affiliate transfers, and no path through a sale of the business.",
  favoredParty: "landlord",
  fallbackLadder: [{
    label: "Landlord opening",
    language: "which consent Landlord may grant or withhold in its sole and absolute discretion for any reason or no reason",
    rationale: "Absolute veto; Tenant cannot transfer even to a qualified successor."
  }, {
    label: "Market",
    language: "which consent Landlord shall not unreasonably withhold, condition, or delay",
    rationale: "The reasonableness standard is the prevailing default and preserves Landlord's legitimate interests."
  }, {
    label: "Tenant target",
    language: "which consent Landlord shall not unreasonably withhold, condition, or delay, and no consent shall be " + "required for an assignment to an affiliate or in connection with a merger or sale of substantially all " + "of Tenant's assets to a successor meeting Landlord's reasonable net-worth criteria",
    rationale: "Adds permitted-transfer carve-outs for corporate reorganizations Tenant cannot control."
  }]
}, {
  clauseRef: "§15",
  issue: "Holdover rent is set at 200% of rent plus consequential damages — punitive versus the 125–150% market " + "range, and an inadvertent holdover could expose Tenant to open-ended consequentials.",
  favoredParty: "landlord",
  fallbackLadder: [{
    label: "Landlord opening",
    language: "two hundred percent (200%)",
    rationale: "Double rent plus consequentials is a penalty, not holdover compensation."
  }, {
    label: "Market",
    language: "one hundred fifty percent (150%)",
    rationale: "150% of the last month's rent is the common holdover premium."
  }, {
    label: "Tenant target",
    language: "one hundred twenty-five percent (125%)",
    rationale: "125% covers Landlord's real holdover cost; pair with a waiver of consequential damages for an " + "inadvertent, short holdover."
  }]
}, {
  clauseRef: "§16",
  issue: "Renewal is entirely at Landlord's discretion with Landlord-set rent — an illusory option that gives " + "Tenant no enforceable right to stay and no rent protection.",
  favoredParty: "landlord",
  fallbackLadder: [{
    label: "Landlord opening",
    language: "any such extension shall be granted or denied by Landlord in its sole discretion, and the Base Rent " + "for any extension term shall be as determined by Landlord",
    rationale: "Illusory option; Tenant has no enforceable right to renew."
  }, {
    label: "Market",
    language: "Tenant shall have the option to extend, exercisable by such notice, at a Base Rent equal to the " + "then-fair-market rent for comparable space in the Center",
    rationale: "A true tenant option at fair-market rent is the standard renewal construct."
  }, {
    label: "Tenant target",
    language: "Tenant shall have the option to extend, exercisable by such notice, at a Base Rent equal to the " + "lesser of fair-market rent or 103% of the prior year's Base Rent, with fair-market rent determined by " + "binding appraisal if the parties disagree",
    rationale: "Caps renewal rent and adds an appraisal backstop so Landlord cannot price Tenant out."
  }]
}, {
  clauseRef: "§17",
  issue: "The personal guaranty is unlimited in amount and duration and survives termination — open-ended personal " + "exposure for the Guarantor with no cap and no sunset.",
  favoredParty: "landlord",
  fallbackLadder: [{
    label: "Landlord opening",
    language: "without limitation as to amount or duration, for the entire Term and any extension thereof",
    rationale: "Open-ended personal liability with no cap and no end date."
  }, {
    label: "Market",
    language: "limited to obligations accruing during the first twenty-four (24) months of the Term and to a maximum " + "of six (6) months' Base Rent",
    rationale: "A guaranty capped in time and amount is typical for a creditworthy small-business tenant."
  }, {
    label: "Tenant target",
    language: "which guaranty shall terminate upon Tenant's completion of twenty-four (24) months without an uncured " + "monetary default and shall in no event exceed three (3) months' Base Rent",
    rationale: "Burn-down guaranty rewards a clean payment history and caps downside to one quarter's rent."
  }]
}];
/** Refs of the contested clauses, in document order. */
const contestedRefs = contestedClauses.map(c => c.clauseRef);
/** Returns the contested-clause metadata for a ref, or undefined. */
function getContestedClause(ref) {
  return contestedClauses.find(c => c.clauseRef === ref);
}

/***/ },

/***/ "./src/services/index.ts"
/*!*******************************!*\
  !*** ./src/services/index.ts ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DocumentServiceProvider: () => (/* reexport safe */ _DocumentServiceContext__WEBPACK_IMPORTED_MODULE_0__.DocumentServiceProvider),
/* harmony export */   useDocumentService: () => (/* reexport safe */ _DocumentServiceContext__WEBPACK_IMPORTED_MODULE_0__.useDocumentService)
/* harmony export */ });
/* harmony import */ var _DocumentServiceContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DocumentServiceContext */ "./src/services/DocumentServiceContext.tsx");


/***/ },

/***/ "./src/services/office/StubDocumentService.ts"
/*!****************************************************!*\
  !*** ./src/services/office/StubDocumentService.ts ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StubDocumentService: () => (/* binding */ StubDocumentService)
/* harmony export */ });
const NOT_IMPLEMENTED = "ClauseKit can't read or edit the Word document yet — the live Word integration arrives in step 7.";
/**
 * Placeholder DocumentService so the task pane still mounts inside real Word
 * before the Word-backed implementation exists. Read-of-nothing methods are
 * safe no-ops; the mutating/locating methods fail loudly so the UI's error
 * path is exercised rather than silently doing nothing. Replaced by
 * OfficeDocumentService in step 7.
 */
class StubDocumentService {
  async getFullText() {
    throw new Error(NOT_IMPLEMENTED);
  }
  async getSelection() {
    return null;
  }
  async applyTrackedChange(_edit) {
    throw new Error(NOT_IMPLEMENTED);
  }
  async scrollTo(_target) {
    return false;
  }
}

/***/ },

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/clausekit.css"
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/clausekit.css ***!
  \************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── ClauseKit Task Pane Design System ──
 *
 * Single source of truth for the task-pane UI. Loaded by both the Office
 * entry (src/taskpane/index.tsx) and the browser playground
 * (src/playground/playground.tsx) so the pane looks identical in either host.
 */
:root {
  --navy: #0E0E12;
  --navy-700: #2b2b34;
  --navy-300: #6c6c77;
  --amber: #F59E0B;
  --amber-600: #d4870a;
  --amber-soft: #FEF3C7;
  --amber-grad: linear-gradient(180deg, #FCC04A 0%, #F59E0B 52%, #E88B05 100%);
  --amber-glow: inset 0 1px 0 rgba(255,255,255,.35), 0 2px 10px rgba(245,158,11,.4), 0 1px 2px rgba(160,98,0,.45);
  --bg: #F8F9FA;
  --surface: #FFFFFF;
  --user-bubble: #EEF2FF;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --border: #E5E7EB;
  --border-strong: #D1D5DB;
  --destructive: #EF4444;
  --destructive-soft: #FEF2F2;
  --fs-header: 16px;
  --fs-body: 13px;
  --fs-label: 11px;
  --pane-pad: 12px;
  --shadow-card: 0 1px 2px rgba(17,24,39,.06), 0 1px 3px rgba(17,24,39,.05);
  --font-display: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'Roboto Mono', monospace;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; height: 100%; -webkit-font-smoothing: antialiased; }
body { font-family: var(--font-body); background: var(--bg); color: var(--text-primary); }
#container { height: 100%; }

/* Pane shell */
.ck-pane { height: 100%; display: flex; flex-direction: column; }

/* ── Header ── */
.ck-header {
  background: linear-gradient(180deg, #08080b 0%, #131318 55%, #232329 100%);
  color: #fff; height: 52px; display: flex; align-items: center;
  padding: 0 var(--pane-pad); gap: 10px;
  border-bottom: 1px solid rgba(255,255,255,.06); flex-shrink: 0;
}
.h-mark { width: 28px; height: 28px; border-radius: 7px; background: rgba(255,255,255,.10); display: grid; place-items: center; flex: none; position: relative; border: 1px solid rgba(255,255,255,.14); }
.h-mark span { font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 2px; }
.h-mark::after { content:""; position:absolute; left:6px; right:6px; bottom:6px; height:1.5px; background: var(--amber); border-radius:2px; }
.h-txt { display: flex; flex-direction: column; line-height: 1.15; }
.h-name { font-family: var(--font-display); font-size: var(--fs-header); font-weight: 600; letter-spacing: -.01em; }
.h-status { font-size: var(--fs-label); color: rgba(244,246,251,.66); display: flex; align-items: center; gap: 5px; }
.h-status .live { width: 6px; height: 6px; border-radius: 50%; background: #34d399; box-shadow: 0 0 0 2px rgba(52,211,153,.25); }
.h-actions { margin-left: auto; display: flex; gap: 2px; }
.ck-icon-btn { width: 30px; height: 30px; border-radius: 6px; display: grid; place-items: center; color: rgba(255,255,255,.8); cursor: pointer; background: none; border: none; }
.ck-icon-btn:hover { background: rgba(255,255,255,.12); }
.kebab { display:flex; flex-direction: column; gap: 2.5px; }
.kebab b { width: 3px; height: 3px; border-radius: 50%; background: currentColor; display: block; }

/* ── Chat scroll area ── */
.ck-chat { flex: 1; background: var(--bg); padding: var(--pane-pad); display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }
.ck-daydiv { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); font-size: var(--fs-label); }
.ck-daydiv::before, .ck-daydiv::after { content:""; height:1px; background: var(--border); flex:1; }

/* Message rows */
.ck-row { display: flex; gap: 8px; }
.ck-row.user { justify-content: flex-end; }
.ck-avatar { width: 24px; height: 24px; border-radius: 6px; background: var(--navy); display: grid; place-items: center; flex: none; margin-top: 2px; }
.ck-avatar span { font-size: 9px; font-weight: 700; color: #fff; letter-spacing: .02em; }
.ck-bubble { font-size: var(--fs-body); line-height: 1.55; padding: 10px 12px; border-radius: 12px; max-width: 264px; }
.ck-bubble.user { background: var(--user-bubble); color: var(--navy); border-radius: 12px 12px 4px 12px; }
.ck-bubble.ai { background: var(--surface); border: 1px solid var(--border); border-radius: 4px 12px 12px 12px; box-shadow: var(--shadow-card); }
.ck-bubble p { margin: 0; }
.ck-bubble p + p { margin-top: 8px; }
.ck-bubble strong { font-weight: 600; }
.ck-time { font-size: 10px; color: var(--text-secondary); margin-top: 4px; }
.ck-row.user .ck-time { text-align: right; }

/* Quote block */
.ck-quote { background: #fafbfc; border: 1px solid var(--border); border-left: 3px solid var(--navy-300); border-radius: 6px; padding: 9px 11px; margin: 10px 0 4px; }
.q-meta { font-family: var(--font-mono); font-size: 10px; color: var(--text-secondary); letter-spacing: .02em; margin-bottom: 5px; display: flex; align-items: center; gap: 6px; }
.q-meta::before { content:"\\201C"; font-family: Georgia, serif; font-size: 16px; line-height: 0; color: var(--navy-300); position: relative; top: 3px; }
.q-text { font-size: 12px; line-height: 1.6; color: #374151; font-style: italic; }
.q-text mark { background: var(--amber-soft); font-style: normal; padding: 0 1px; }

/* Citation chip */
.ck-cite { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; font-size: 11px; font-weight: 500; color: var(--navy); background: #eef2ff; border: 1px solid #dbe3fb; border-radius: 999px; padding: 4px 10px 4px 8px; cursor: pointer; }
.ck-cite:hover { background: #e4eafd; }
.pin { width: 11px; height: 11px; position: relative; flex: none; }
.pin::before { content:""; position:absolute; inset:0; border:1.5px solid var(--navy); border-radius:50% 50% 50% 0; transform: rotate(-45deg); }
.cite-arr { margin-left: 1px; color: var(--navy-300); font-size: 10px; }

/* ── Action card ── */
.ck-action { background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--amber); border-radius: 8px; box-shadow: var(--shadow-card); overflow: hidden; }
.a-head { padding: 11px 12px 0; display: flex; align-items: flex-start; gap: 8px; flex-direction: column; }
.a-badge { font-family: var(--font-mono); font-size: 9.5px; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; color: var(--amber-600); background: var(--amber-soft); border-radius: 4px; padding: 3px 6px; }
.a-title { font-size: 12.5px; font-weight: 600; line-height: 1.35; color: var(--text-primary); }
.a-body { padding: 9px 12px 0; }
.a-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.55; margin: 0; }
.a-error { font-size: 12px; color: var(--destructive); background: var(--destructive-soft); border: 1px solid #fecdca; border-radius: 6px; padding: 7px 9px; margin: 10px 0 0; line-height: 1.45; }

/* Diff */
.ck-diff { margin: 10px 0 2px; border: 1px solid var(--border); border-radius: 6px; overflow: hidden; font-family: var(--font-mono); font-size: 11px; line-height: 1.55; }
.d-line { padding: 6px 10px 6px 24px; position: relative; }
.d-del { background: var(--destructive-soft); color: #b42318; }
.d-del .t { text-decoration: line-through; text-decoration-color: rgba(180,35,24,.5); }
.d-add { background: #ecfdf3; color: #067647; border-top: 1px solid #d1fadf; }
.d-line::before { position: absolute; left: 9px; top: 6px; font-weight: 700; }
.d-del::before { content: "−"; color: #d92d20; }
.d-add::before { content: "+"; color: #079455; }

/* Action footer */
.a-foot { display: flex; gap: 8px; padding: 12px; align-items: center; }
.a-foot .spacer { flex: 1; }
.ck-btn { font-size: 13px; font-weight: 500; border-radius: 6px; padding: 8px 14px; cursor: pointer; border: 1px solid transparent; line-height: 1; display: inline-flex; align-items: center; gap: 7px; white-space: nowrap; font-family: var(--font-body); transition: background .12s, border-color .12s; }
.ck-btn.primary { background: var(--amber-grad); color: #3a2900; font-weight: 600; border-color: rgba(150,92,0,.45); box-shadow: var(--amber-glow); }
.ck-btn.primary:hover { filter: brightness(1.04); }
.ck-btn.danger-ghost { background: transparent; color: var(--text-secondary); border-color: transparent; }
.ck-btn.danger-ghost:hover { background: var(--destructive-soft); color: var(--destructive); }
.ck-btn.applied { background: #ecfdf3; color: #067647; border-color: #d1fadf; cursor: default; }
.ck-btn.applied:hover { filter: none; }
.chk { width: 6px; height: 11px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(40deg) translateY(-1px); display: inline-block; }

/* Thinking dots */
.ck-thinking { display: flex; gap: 8px; align-items: center; }
.t-bubble { background: var(--surface); border: 1px solid var(--border); border-radius: 4px 12px 12px 12px; box-shadow: var(--shadow-card); padding: 12px 14px; display: flex; gap: 5px; align-items: center; }
.t-bubble i { width: 6px; height: 6px; border-radius: 50%; background: var(--navy-300); animation: blink 1.2s infinite ease-in-out; font-style: normal; display: block; }
.t-bubble i:nth-child(2){ animation-delay: .18s; }
.t-bubble i:nth-child(3){ animation-delay: .36s; }
@keyframes blink { 0%,60%,100%{ opacity:.28; transform:translateY(0);} 30%{ opacity:1; transform:translateY(-2px);} }

/* ── Empty state ── */
.ck-empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 36px 22px; gap: 0; flex: 1; }
.e-mark { width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(180deg,#1d1d24 0%,#101015 100%); display: grid; place-items: center; position: relative; box-shadow: 0 8px 22px rgba(0,0,0,.3); border: 1px solid #2e2e36; margin-bottom: 18px; }
.e-mark span { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 4px; font-family: var(--font-display); }
.e-mark::after { content:""; position:absolute; left:13px; right:13px; bottom:11px; height:2.5px; background: var(--amber); border-radius:2px; }
.ck-empty h3 { font-family: var(--font-display); font-size: 15px; font-weight: 600; margin: 0 0 6px; color: var(--text-primary); }
.e-sub { font-size: 12.5px; color: var(--text-secondary); line-height: 1.55; margin: 0 0 20px; max-width: 30ch; }
.ck-suggest { display: flex; flex-direction: column; gap: 8px; width: 100%; }
.s-btn { text-align: left; font-size: 12.5px; color: var(--navy); background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; cursor: pointer; box-shadow: var(--shadow-card); display: flex; align-items: center; gap: 9px; font-family: var(--font-body); }
.s-btn:hover { border-color: var(--navy-300); background: #fdfdfe; }
.s-btn .s-ar { margin-left: auto; color: var(--navy-300); font-size: 13px; flex: none; }
.s-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--amber); flex: none; }

/* ── Privacy note ── */
.ck-privacy { background: #fff; border-top: 1px solid var(--border); padding: 9px 12px; display: flex; align-items: center; gap: 9px; flex-shrink: 0; }
.p-shield { width: 22px; height: 24px; flex: none; position: relative; }
.p-shield::before { content:""; position:absolute; inset:0; background: #eef2ff; border:1.4px solid #dbe3fb; border-radius: 4px 4px 9px 9px / 4px 4px 14px 14px; }
.p-shield::after { content:""; position:absolute; left:7px; top:8px; width:5px; height:8px; border-right:1.8px solid var(--navy); border-bottom:1.8px solid var(--navy); transform: rotate(40deg); }
.p-txt { font-size: var(--fs-label); color: var(--text-secondary); line-height: 1.45; margin: 0; }
.p-txt b { color: var(--text-primary); font-weight: 600; }

/* ── Input area ── */
.ck-input-wrap { background: var(--surface); border-top: 1px solid var(--border); padding: 10px var(--pane-pad) 8px; flex-shrink: 0; }
.ck-input { background: #fff; border: 1px solid var(--border-strong); border-radius: 10px; padding: 9px 10px 9px 12px; display: flex; align-items: flex-end; gap: 8px; transition: border-color .12s, box-shadow .12s; }
.ck-input:focus-within { border-color: var(--navy); box-shadow: 0 0 0 3px rgba(14,14,18,.08); }
.ck-input textarea { flex: 1; font-size: var(--fs-body); color: var(--text-primary); line-height: 1.5; padding: 1px 0; border: none; outline: none; resize: none; background: transparent; font-family: var(--font-body); min-height: 20px; max-height: 80px; overflow-y: auto; }
.ck-input textarea::placeholder { color: var(--text-secondary); }
.ck-send { width: 32px; height: 32px; border-radius: 8px; background: var(--navy); display: grid; place-items: center; flex: none; cursor: pointer; border: none; transition: background .12s; }
.ck-send:hover { background: var(--navy-700); }
.ck-send.disabled { background: #c9ced6; cursor: default; pointer-events: none; }
.send-arrow { width: 13px; height: 13px; position: relative; display: block; }
.send-arrow::before { content:""; position:absolute; left:5.5px; top:1px; width:2px; height:11px; background:#fff; border-radius:2px; }
.send-arrow::after { content:""; position:absolute; left:2.5px; top:1px; width:8px; height:8px; border-top:2px solid #fff; border-left:2px solid #fff; transform: rotate(45deg); border-radius:2px 0 0 0; }
.ck-hint { font-size: var(--fs-label); color: var(--text-secondary); margin-top: 7px; display: flex; align-items: center; gap: 5px; padding: 0 2px; }
.lock-icon { width: 9px; height: 9px; border: 1.4px solid var(--text-secondary); border-radius: 2px; position: relative; flex: none; }
.lock-icon::before { content:""; position:absolute; left:1.5px; top:-3.5px; width:5px; height:5px; border:1.4px solid var(--text-secondary); border-bottom:0; border-radius:3px 3px 0 0; }
`, "",{"version":3,"sources":["webpack://./src/styles/clausekit.css"],"names":[],"mappings":"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","sourcesContent":["/* ── ClauseKit Task Pane Design System ──\n *\n * Single source of truth for the task-pane UI. Loaded by both the Office\n * entry (src/taskpane/index.tsx) and the browser playground\n * (src/playground/playground.tsx) so the pane looks identical in either host.\n */\n:root {\n  --navy: #0E0E12;\n  --navy-700: #2b2b34;\n  --navy-300: #6c6c77;\n  --amber: #F59E0B;\n  --amber-600: #d4870a;\n  --amber-soft: #FEF3C7;\n  --amber-grad: linear-gradient(180deg, #FCC04A 0%, #F59E0B 52%, #E88B05 100%);\n  --amber-glow: inset 0 1px 0 rgba(255,255,255,.35), 0 2px 10px rgba(245,158,11,.4), 0 1px 2px rgba(160,98,0,.45);\n  --bg: #F8F9FA;\n  --surface: #FFFFFF;\n  --user-bubble: #EEF2FF;\n  --text-primary: #111827;\n  --text-secondary: #6B7280;\n  --border: #E5E7EB;\n  --border-strong: #D1D5DB;\n  --destructive: #EF4444;\n  --destructive-soft: #FEF2F2;\n  --fs-header: 16px;\n  --fs-body: 13px;\n  --fs-label: 11px;\n  --pane-pad: 12px;\n  --shadow-card: 0 1px 2px rgba(17,24,39,.06), 0 1px 3px rgba(17,24,39,.05);\n  --font-display: 'Space Grotesk', 'Inter', system-ui, sans-serif;\n  --font-body: 'Inter', system-ui, sans-serif;\n  --font-mono: 'Roboto Mono', monospace;\n}\n* { box-sizing: border-box; }\nhtml, body { margin: 0; padding: 0; height: 100%; -webkit-font-smoothing: antialiased; }\nbody { font-family: var(--font-body); background: var(--bg); color: var(--text-primary); }\n#container { height: 100%; }\n\n/* Pane shell */\n.ck-pane { height: 100%; display: flex; flex-direction: column; }\n\n/* ── Header ── */\n.ck-header {\n  background: linear-gradient(180deg, #08080b 0%, #131318 55%, #232329 100%);\n  color: #fff; height: 52px; display: flex; align-items: center;\n  padding: 0 var(--pane-pad); gap: 10px;\n  border-bottom: 1px solid rgba(255,255,255,.06); flex-shrink: 0;\n}\n.h-mark { width: 28px; height: 28px; border-radius: 7px; background: rgba(255,255,255,.10); display: grid; place-items: center; flex: none; position: relative; border: 1px solid rgba(255,255,255,.14); }\n.h-mark span { font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 2px; }\n.h-mark::after { content:\"\"; position:absolute; left:6px; right:6px; bottom:6px; height:1.5px; background: var(--amber); border-radius:2px; }\n.h-txt { display: flex; flex-direction: column; line-height: 1.15; }\n.h-name { font-family: var(--font-display); font-size: var(--fs-header); font-weight: 600; letter-spacing: -.01em; }\n.h-status { font-size: var(--fs-label); color: rgba(244,246,251,.66); display: flex; align-items: center; gap: 5px; }\n.h-status .live { width: 6px; height: 6px; border-radius: 50%; background: #34d399; box-shadow: 0 0 0 2px rgba(52,211,153,.25); }\n.h-actions { margin-left: auto; display: flex; gap: 2px; }\n.ck-icon-btn { width: 30px; height: 30px; border-radius: 6px; display: grid; place-items: center; color: rgba(255,255,255,.8); cursor: pointer; background: none; border: none; }\n.ck-icon-btn:hover { background: rgba(255,255,255,.12); }\n.kebab { display:flex; flex-direction: column; gap: 2.5px; }\n.kebab b { width: 3px; height: 3px; border-radius: 50%; background: currentColor; display: block; }\n\n/* ── Chat scroll area ── */\n.ck-chat { flex: 1; background: var(--bg); padding: var(--pane-pad); display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }\n.ck-daydiv { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); font-size: var(--fs-label); }\n.ck-daydiv::before, .ck-daydiv::after { content:\"\"; height:1px; background: var(--border); flex:1; }\n\n/* Message rows */\n.ck-row { display: flex; gap: 8px; }\n.ck-row.user { justify-content: flex-end; }\n.ck-avatar { width: 24px; height: 24px; border-radius: 6px; background: var(--navy); display: grid; place-items: center; flex: none; margin-top: 2px; }\n.ck-avatar span { font-size: 9px; font-weight: 700; color: #fff; letter-spacing: .02em; }\n.ck-bubble { font-size: var(--fs-body); line-height: 1.55; padding: 10px 12px; border-radius: 12px; max-width: 264px; }\n.ck-bubble.user { background: var(--user-bubble); color: var(--navy); border-radius: 12px 12px 4px 12px; }\n.ck-bubble.ai { background: var(--surface); border: 1px solid var(--border); border-radius: 4px 12px 12px 12px; box-shadow: var(--shadow-card); }\n.ck-bubble p { margin: 0; }\n.ck-bubble p + p { margin-top: 8px; }\n.ck-bubble strong { font-weight: 600; }\n.ck-time { font-size: 10px; color: var(--text-secondary); margin-top: 4px; }\n.ck-row.user .ck-time { text-align: right; }\n\n/* Quote block */\n.ck-quote { background: #fafbfc; border: 1px solid var(--border); border-left: 3px solid var(--navy-300); border-radius: 6px; padding: 9px 11px; margin: 10px 0 4px; }\n.q-meta { font-family: var(--font-mono); font-size: 10px; color: var(--text-secondary); letter-spacing: .02em; margin-bottom: 5px; display: flex; align-items: center; gap: 6px; }\n.q-meta::before { content:\"\\201C\"; font-family: Georgia, serif; font-size: 16px; line-height: 0; color: var(--navy-300); position: relative; top: 3px; }\n.q-text { font-size: 12px; line-height: 1.6; color: #374151; font-style: italic; }\n.q-text mark { background: var(--amber-soft); font-style: normal; padding: 0 1px; }\n\n/* Citation chip */\n.ck-cite { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; font-size: 11px; font-weight: 500; color: var(--navy); background: #eef2ff; border: 1px solid #dbe3fb; border-radius: 999px; padding: 4px 10px 4px 8px; cursor: pointer; }\n.ck-cite:hover { background: #e4eafd; }\n.pin { width: 11px; height: 11px; position: relative; flex: none; }\n.pin::before { content:\"\"; position:absolute; inset:0; border:1.5px solid var(--navy); border-radius:50% 50% 50% 0; transform: rotate(-45deg); }\n.cite-arr { margin-left: 1px; color: var(--navy-300); font-size: 10px; }\n\n/* ── Action card ── */\n.ck-action { background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--amber); border-radius: 8px; box-shadow: var(--shadow-card); overflow: hidden; }\n.a-head { padding: 11px 12px 0; display: flex; align-items: flex-start; gap: 8px; flex-direction: column; }\n.a-badge { font-family: var(--font-mono); font-size: 9.5px; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; color: var(--amber-600); background: var(--amber-soft); border-radius: 4px; padding: 3px 6px; }\n.a-title { font-size: 12.5px; font-weight: 600; line-height: 1.35; color: var(--text-primary); }\n.a-body { padding: 9px 12px 0; }\n.a-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.55; margin: 0; }\n.a-error { font-size: 12px; color: var(--destructive); background: var(--destructive-soft); border: 1px solid #fecdca; border-radius: 6px; padding: 7px 9px; margin: 10px 0 0; line-height: 1.45; }\n\n/* Diff */\n.ck-diff { margin: 10px 0 2px; border: 1px solid var(--border); border-radius: 6px; overflow: hidden; font-family: var(--font-mono); font-size: 11px; line-height: 1.55; }\n.d-line { padding: 6px 10px 6px 24px; position: relative; }\n.d-del { background: var(--destructive-soft); color: #b42318; }\n.d-del .t { text-decoration: line-through; text-decoration-color: rgba(180,35,24,.5); }\n.d-add { background: #ecfdf3; color: #067647; border-top: 1px solid #d1fadf; }\n.d-line::before { position: absolute; left: 9px; top: 6px; font-weight: 700; }\n.d-del::before { content: \"−\"; color: #d92d20; }\n.d-add::before { content: \"+\"; color: #079455; }\n\n/* Action footer */\n.a-foot { display: flex; gap: 8px; padding: 12px; align-items: center; }\n.a-foot .spacer { flex: 1; }\n.ck-btn { font-size: 13px; font-weight: 500; border-radius: 6px; padding: 8px 14px; cursor: pointer; border: 1px solid transparent; line-height: 1; display: inline-flex; align-items: center; gap: 7px; white-space: nowrap; font-family: var(--font-body); transition: background .12s, border-color .12s; }\n.ck-btn.primary { background: var(--amber-grad); color: #3a2900; font-weight: 600; border-color: rgba(150,92,0,.45); box-shadow: var(--amber-glow); }\n.ck-btn.primary:hover { filter: brightness(1.04); }\n.ck-btn.danger-ghost { background: transparent; color: var(--text-secondary); border-color: transparent; }\n.ck-btn.danger-ghost:hover { background: var(--destructive-soft); color: var(--destructive); }\n.ck-btn.applied { background: #ecfdf3; color: #067647; border-color: #d1fadf; cursor: default; }\n.ck-btn.applied:hover { filter: none; }\n.chk { width: 6px; height: 11px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(40deg) translateY(-1px); display: inline-block; }\n\n/* Thinking dots */\n.ck-thinking { display: flex; gap: 8px; align-items: center; }\n.t-bubble { background: var(--surface); border: 1px solid var(--border); border-radius: 4px 12px 12px 12px; box-shadow: var(--shadow-card); padding: 12px 14px; display: flex; gap: 5px; align-items: center; }\n.t-bubble i { width: 6px; height: 6px; border-radius: 50%; background: var(--navy-300); animation: blink 1.2s infinite ease-in-out; font-style: normal; display: block; }\n.t-bubble i:nth-child(2){ animation-delay: .18s; }\n.t-bubble i:nth-child(3){ animation-delay: .36s; }\n@keyframes blink { 0%,60%,100%{ opacity:.28; transform:translateY(0);} 30%{ opacity:1; transform:translateY(-2px);} }\n\n/* ── Empty state ── */\n.ck-empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 36px 22px; gap: 0; flex: 1; }\n.e-mark { width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(180deg,#1d1d24 0%,#101015 100%); display: grid; place-items: center; position: relative; box-shadow: 0 8px 22px rgba(0,0,0,.3); border: 1px solid #2e2e36; margin-bottom: 18px; }\n.e-mark span { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 4px; font-family: var(--font-display); }\n.e-mark::after { content:\"\"; position:absolute; left:13px; right:13px; bottom:11px; height:2.5px; background: var(--amber); border-radius:2px; }\n.ck-empty h3 { font-family: var(--font-display); font-size: 15px; font-weight: 600; margin: 0 0 6px; color: var(--text-primary); }\n.e-sub { font-size: 12.5px; color: var(--text-secondary); line-height: 1.55; margin: 0 0 20px; max-width: 30ch; }\n.ck-suggest { display: flex; flex-direction: column; gap: 8px; width: 100%; }\n.s-btn { text-align: left; font-size: 12.5px; color: var(--navy); background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; cursor: pointer; box-shadow: var(--shadow-card); display: flex; align-items: center; gap: 9px; font-family: var(--font-body); }\n.s-btn:hover { border-color: var(--navy-300); background: #fdfdfe; }\n.s-btn .s-ar { margin-left: auto; color: var(--navy-300); font-size: 13px; flex: none; }\n.s-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--amber); flex: none; }\n\n/* ── Privacy note ── */\n.ck-privacy { background: #fff; border-top: 1px solid var(--border); padding: 9px 12px; display: flex; align-items: center; gap: 9px; flex-shrink: 0; }\n.p-shield { width: 22px; height: 24px; flex: none; position: relative; }\n.p-shield::before { content:\"\"; position:absolute; inset:0; background: #eef2ff; border:1.4px solid #dbe3fb; border-radius: 4px 4px 9px 9px / 4px 4px 14px 14px; }\n.p-shield::after { content:\"\"; position:absolute; left:7px; top:8px; width:5px; height:8px; border-right:1.8px solid var(--navy); border-bottom:1.8px solid var(--navy); transform: rotate(40deg); }\n.p-txt { font-size: var(--fs-label); color: var(--text-secondary); line-height: 1.45; margin: 0; }\n.p-txt b { color: var(--text-primary); font-weight: 600; }\n\n/* ── Input area ── */\n.ck-input-wrap { background: var(--surface); border-top: 1px solid var(--border); padding: 10px var(--pane-pad) 8px; flex-shrink: 0; }\n.ck-input { background: #fff; border: 1px solid var(--border-strong); border-radius: 10px; padding: 9px 10px 9px 12px; display: flex; align-items: flex-end; gap: 8px; transition: border-color .12s, box-shadow .12s; }\n.ck-input:focus-within { border-color: var(--navy); box-shadow: 0 0 0 3px rgba(14,14,18,.08); }\n.ck-input textarea { flex: 1; font-size: var(--fs-body); color: var(--text-primary); line-height: 1.5; padding: 1px 0; border: none; outline: none; resize: none; background: transparent; font-family: var(--font-body); min-height: 20px; max-height: 80px; overflow-y: auto; }\n.ck-input textarea::placeholder { color: var(--text-secondary); }\n.ck-send { width: 32px; height: 32px; border-radius: 8px; background: var(--navy); display: grid; place-items: center; flex: none; cursor: pointer; border: none; transition: background .12s; }\n.ck-send:hover { background: var(--navy-700); }\n.ck-send.disabled { background: #c9ced6; cursor: default; pointer-events: none; }\n.send-arrow { width: 13px; height: 13px; position: relative; display: block; }\n.send-arrow::before { content:\"\"; position:absolute; left:5.5px; top:1px; width:2px; height:11px; background:#fff; border-radius:2px; }\n.send-arrow::after { content:\"\"; position:absolute; left:2.5px; top:1px; width:8px; height:8px; border-top:2px solid #fff; border-left:2px solid #fff; transform: rotate(45deg); border-radius:2px 0 0 0; }\n.ck-hint { font-size: var(--fs-label); color: var(--text-secondary); margin-top: 7px; display: flex; align-items: center; gap: 5px; padding: 0 2px; }\n.lock-icon { width: 9px; height: 9px; border: 1.4px solid var(--text-secondary); border-radius: 2px; position: relative; flex: none; }\n.lock-icon::before { content:\"\"; position:absolute; left:1.5px; top:-3.5px; width:5px; height:5px; border:1.4px solid var(--text-secondary); border-bottom:0; border-radius:3px 3px 0 0; }\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "./node_modules/css-loader/dist/runtime/api.js"
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
(module) {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ },

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js"
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
(module) {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ },

/***/ "./src/taskpane/taskpane.html"
/*!************************************!*\
  !*** ./src/taskpane/taskpane.html ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Module
var code = `<!-- Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license. -->
<!-- See LICENSE in the project root for license information -->

<!doctype html>
<html lang="en" data-framework="typescript">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ClauseKit</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">

    <!-- Office JavaScript API -->
    ${"<" + "script"} type="text/javascript" src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js">${"<" + "/script"}>

    <!-- Design-system styles are imported by src/taskpane/index.tsx from
         src/styles/clausekit.css (the single source of truth shared with the
         browser playground). -->
</head>

<body style="width: 100%; height: 100%; margin: 0; padding: 0;">
    <div id="container"></div>

    <!--
        Fluent UI React v. 9 uses modern JavaScript syntax that is not supported in
        Trident (Internet Explorer) or EdgeHTML (Edge Legacy), so this add-in won't
        work in Office versions that use these webviews. The script below makes the
        following div display when an unsupported webview is in use, and hides the
        React container div.
    -->
    <div id="tridentmessage" style="display: none; padding: 10;">
        This add-in will not run in your version of Office. Please upgrade either to perpetual Office 2021 (or later)
        or to a Microsoft 365 account.
    </div>
    ${"<" + "script"}>
        if ((navigator.userAgent.indexOf("Trident") !== -1) || (navigator.userAgent.indexOf("Edge") !== -1)) {
            var tridentMessage = document.getElementById("tridentmessage");
            var normalContainer = document.getElementById("container");
            tridentMessage.style.display = "block";
            normalContainer.style.display = "none";
        }
    ${"<" + "/script"}>
</body>

</html>
`;
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);

/***/ },

/***/ "./node_modules/react-dom/client.js"
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {



var m = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
if (false) // removed by dead control flow
{} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ },

/***/ "./node_modules/react/cjs/react-jsx-runtime.development.js"
/*!*****************************************************************!*\
  !*** ./node_modules/react/cjs/react-jsx-runtime.development.js ***!
  \*****************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  (function() {
'use strict';

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

// ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types.
var REACT_ELEMENT_TYPE = Symbol.for('react.element');
var REACT_PORTAL_TYPE = Symbol.for('react.portal');
var REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
var REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
var REACT_PROFILER_TYPE = Symbol.for('react.profiler');
var REACT_PROVIDER_TYPE = Symbol.for('react.provider');
var REACT_CONTEXT_TYPE = Symbol.for('react.context');
var REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
var REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
var REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
var REACT_MEMO_TYPE = Symbol.for('react.memo');
var REACT_LAZY_TYPE = Symbol.for('react.lazy');
var REACT_OFFSCREEN_TYPE = Symbol.for('react.offscreen');
var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }

  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }

  return null;
}

var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

function error(format) {
  {
    {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      printWarning('error', format, args);
    }
  }
}

function printWarning(level, format, args) {
  // When changing this logic, you might want to also
  // update consoleWithStackDev.www.js as well.
  {
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();

    if (stack !== '') {
      format += '%s';
      args = args.concat([stack]);
    } // eslint-disable-next-line react-internal/safe-string-coercion


    var argsWithFormat = args.map(function (item) {
      return String(item);
    }); // Careful: RN currently depends on this prefix

    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
    // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging

    Function.prototype.apply.call(console[level], console, argsWithFormat);
  }
}

// -----------------------------------------------------------------------------

var enableScopeAPI = false; // Experimental Create Event Handle API.
var enableCacheElement = false;
var enableTransitionTracing = false; // No known bugs, but needs performance testing

var enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber
// stuff. Intended to enable React core members to more easily debug scheduling
// issues in DEV builds.

var enableDebugTracing = false; // Track which Fiber(s) schedule render work.

var REACT_MODULE_REFERENCE;

{
  REACT_MODULE_REFERENCE = Symbol.for('react.module.reference');
}

function isValidElementType(type) {
  if (typeof type === 'string' || typeof type === 'function') {
    return true;
  } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


  if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing  || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden  || type === REACT_OFFSCREEN_TYPE || enableScopeAPI  || enableCacheElement  || enableTransitionTracing ) {
    return true;
  }

  if (typeof type === 'object' && type !== null) {
    if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
    // types supported by any Flight configuration anywhere since
    // we don't know which Flight build this will end up being used
    // with.
    type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
      return true;
    }
  }

  return false;
}

function getWrappedName(outerType, innerType, wrapperName) {
  var displayName = outerType.displayName;

  if (displayName) {
    return displayName;
  }

  var functionName = innerType.displayName || innerType.name || '';
  return functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName;
} // Keep in sync with react-reconciler/getComponentNameFromFiber


function getContextName(type) {
  return type.displayName || 'Context';
} // Note that the reconciler package should generally prefer to use getComponentNameFromFiber() instead.


function getComponentNameFromType(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }

  {
    if (typeof type.tag === 'number') {
      error('Received an unexpected object in getComponentNameFromType(). ' + 'This is likely a bug in React. Please file an issue.');
    }
  }

  if (typeof type === 'function') {
    return type.displayName || type.name || null;
  }

  if (typeof type === 'string') {
    return type;
  }

  switch (type) {
    case REACT_FRAGMENT_TYPE:
      return 'Fragment';

    case REACT_PORTAL_TYPE:
      return 'Portal';

    case REACT_PROFILER_TYPE:
      return 'Profiler';

    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';

    case REACT_SUSPENSE_TYPE:
      return 'Suspense';

    case REACT_SUSPENSE_LIST_TYPE:
      return 'SuspenseList';

  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        var context = type;
        return getContextName(context) + '.Consumer';

      case REACT_PROVIDER_TYPE:
        var provider = type;
        return getContextName(provider._context) + '.Provider';

      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, 'ForwardRef');

      case REACT_MEMO_TYPE:
        var outerName = type.displayName || null;

        if (outerName !== null) {
          return outerName;
        }

        return getComponentNameFromType(type.type) || 'Memo';

      case REACT_LAZY_TYPE:
        {
          var lazyComponent = type;
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;

          try {
            return getComponentNameFromType(init(payload));
          } catch (x) {
            return null;
          }
        }

      // eslint-disable-next-line no-fallthrough
    }
  }

  return null;
}

var assign = Object.assign;

// Helpers to patch console.logs to avoid logging during side-effect free
// replaying on render function. This currently only patches the object
// lazily which won't cover if the log function was extracted eagerly.
// We could also eagerly patch the method.
var disabledDepth = 0;
var prevLog;
var prevInfo;
var prevWarn;
var prevError;
var prevGroup;
var prevGroupCollapsed;
var prevGroupEnd;

function disabledLog() {}

disabledLog.__reactDisabledLog = true;
function disableLogs() {
  {
    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      prevLog = console.log;
      prevInfo = console.info;
      prevWarn = console.warn;
      prevError = console.error;
      prevGroup = console.group;
      prevGroupCollapsed = console.groupCollapsed;
      prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

      var props = {
        configurable: true,
        enumerable: true,
        value: disabledLog,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        info: props,
        log: props,
        warn: props,
        error: props,
        group: props,
        groupCollapsed: props,
        groupEnd: props
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    disabledDepth++;
  }
}
function reenableLogs() {
  {
    disabledDepth--;

    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      var props = {
        configurable: true,
        enumerable: true,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        log: assign({}, props, {
          value: prevLog
        }),
        info: assign({}, props, {
          value: prevInfo
        }),
        warn: assign({}, props, {
          value: prevWarn
        }),
        error: assign({}, props, {
          value: prevError
        }),
        group: assign({}, props, {
          value: prevGroup
        }),
        groupCollapsed: assign({}, props, {
          value: prevGroupCollapsed
        }),
        groupEnd: assign({}, props, {
          value: prevGroupEnd
        })
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    if (disabledDepth < 0) {
      error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
    }
  }
}

var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
var prefix;
function describeBuiltInComponentFrame(name, source, ownerFn) {
  {
    if (prefix === undefined) {
      // Extract the VM specific prefix used by each line.
      try {
        throw Error();
      } catch (x) {
        var match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || '';
      }
    } // We use the prefix to ensure our stacks line up with native stack frames.


    return '\n' + prefix + name;
  }
}
var reentry = false;
var componentFrameCache;

{
  var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
  componentFrameCache = new PossiblyWeakMap();
}

function describeNativeComponentFrame(fn, construct) {
  // If something asked for a stack inside a fake render, it should get ignored.
  if ( !fn || reentry) {
    return '';
  }

  {
    var frame = componentFrameCache.get(fn);

    if (frame !== undefined) {
      return frame;
    }
  }

  var control;
  reentry = true;
  var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

  Error.prepareStackTrace = undefined;
  var previousDispatcher;

  {
    previousDispatcher = ReactCurrentDispatcher.current; // Set the dispatcher in DEV because this might be call in the render function
    // for warnings.

    ReactCurrentDispatcher.current = null;
    disableLogs();
  }

  try {
    // This should throw.
    if (construct) {
      // Something should be setting the props in the constructor.
      var Fake = function () {
        throw Error();
      }; // $FlowFixMe


      Object.defineProperty(Fake.prototype, 'props', {
        set: function () {
          // We use a throwing setter instead of frozen or non-writable props
          // because that won't throw in a non-strict mode function.
          throw Error();
        }
      });

      if (typeof Reflect === 'object' && Reflect.construct) {
        // We construct a different control for this case to include any extra
        // frames added by the construct call.
        try {
          Reflect.construct(Fake, []);
        } catch (x) {
          control = x;
        }

        Reflect.construct(fn, [], Fake);
      } else {
        try {
          Fake.call();
        } catch (x) {
          control = x;
        }

        fn.call(Fake.prototype);
      }
    } else {
      try {
        throw Error();
      } catch (x) {
        control = x;
      }

      fn();
    }
  } catch (sample) {
    // This is inlined manually because closure doesn't do it for us.
    if (sample && control && typeof sample.stack === 'string') {
      // This extracts the first frame from the sample that isn't also in the control.
      // Skipping one frame that we assume is the frame that calls the two.
      var sampleLines = sample.stack.split('\n');
      var controlLines = control.stack.split('\n');
      var s = sampleLines.length - 1;
      var c = controlLines.length - 1;

      while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
        // We expect at least one stack frame to be shared.
        // Typically this will be the root most one. However, stack frames may be
        // cut off due to maximum stack limits. In this case, one maybe cut off
        // earlier than the other. We assume that the sample is longer or the same
        // and there for cut off earlier. So we should find the root most frame in
        // the sample somewhere in the control.
        c--;
      }

      for (; s >= 1 && c >= 0; s--, c--) {
        // Next we find the first one that isn't the same which should be the
        // frame that called our sample function and the control.
        if (sampleLines[s] !== controlLines[c]) {
          // In V8, the first line is describing the message but other VMs don't.
          // If we're about to return the first line, and the control is also on the same
          // line, that's a pretty good indicator that our sample threw at same line as
          // the control. I.e. before we entered the sample frame. So we ignore this result.
          // This can happen if you passed a class to function component, or non-function.
          if (s !== 1 || c !== 1) {
            do {
              s--;
              c--; // We may still have similar intermediate frames from the construct call.
              // The next one that isn't the same should be our match though.

              if (c < 0 || sampleLines[s] !== controlLines[c]) {
                // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                var _frame = '\n' + sampleLines[s].replace(' at new ', ' at '); // If our component frame is labeled "<anonymous>"
                // but we have a user-provided "displayName"
                // splice it in to make the stack more readable.


                if (fn.displayName && _frame.includes('<anonymous>')) {
                  _frame = _frame.replace('<anonymous>', fn.displayName);
                }

                {
                  if (typeof fn === 'function') {
                    componentFrameCache.set(fn, _frame);
                  }
                } // Return the line we found.


                return _frame;
              }
            } while (s >= 1 && c >= 0);
          }

          break;
        }
      }
    }
  } finally {
    reentry = false;

    {
      ReactCurrentDispatcher.current = previousDispatcher;
      reenableLogs();
    }

    Error.prepareStackTrace = previousPrepareStackTrace;
  } // Fallback to just using the name if we couldn't make it throw.


  var name = fn ? fn.displayName || fn.name : '';
  var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

  {
    if (typeof fn === 'function') {
      componentFrameCache.set(fn, syntheticFrame);
    }
  }

  return syntheticFrame;
}
function describeFunctionComponentFrame(fn, source, ownerFn) {
  {
    return describeNativeComponentFrame(fn, false);
  }
}

function shouldConstruct(Component) {
  var prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {

  if (type == null) {
    return '';
  }

  if (typeof type === 'function') {
    {
      return describeNativeComponentFrame(type, shouldConstruct(type));
    }
  }

  if (typeof type === 'string') {
    return describeBuiltInComponentFrame(type);
  }

  switch (type) {
    case REACT_SUSPENSE_TYPE:
      return describeBuiltInComponentFrame('Suspense');

    case REACT_SUSPENSE_LIST_TYPE:
      return describeBuiltInComponentFrame('SuspenseList');
  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE:
        return describeFunctionComponentFrame(type.render);

      case REACT_MEMO_TYPE:
        // Memo may contain any component type so we recursively resolve it.
        return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);

      case REACT_LAZY_TYPE:
        {
          var lazyComponent = type;
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;

          try {
            // Lazy may contain any component type so we recursively resolve it.
            return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
          } catch (x) {}
        }
    }
  }

  return '';
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

var loggedTypeFailures = {};
var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

function setCurrentlyValidatingElement(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
      ReactDebugCurrentFrame.setExtraStackFrame(stack);
    } else {
      ReactDebugCurrentFrame.setExtraStackFrame(null);
    }
  }
}

function checkPropTypes(typeSpecs, values, location, componentName, element) {
  {
    // $FlowFixMe This is okay but Flow doesn't know it.
    var has = Function.call.bind(hasOwnProperty);

    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.

        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            // eslint-disable-next-line react-internal/prod-error-codes
            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
            err.name = 'Invariant Violation';
            throw err;
          }

          error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
        } catch (ex) {
          error$1 = ex;
        }

        if (error$1 && !(error$1 instanceof Error)) {
          setCurrentlyValidatingElement(element);

          error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error$1);

          setCurrentlyValidatingElement(null);
        }

        if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error$1.message] = true;
          setCurrentlyValidatingElement(element);

          error('Failed %s type: %s', location, error$1.message);

          setCurrentlyValidatingElement(null);
        }
      }
    }
  }
}

var isArrayImpl = Array.isArray; // eslint-disable-next-line no-redeclare

function isArray(a) {
  return isArrayImpl(a);
}

/*
 * The `'' + value` pattern (used in in perf-sensitive code) throws for Symbol
 * and Temporal.* types. See https://github.com/facebook/react/pull/22064.
 *
 * The functions in this module will throw an easier-to-understand,
 * easier-to-debug exception with a clear errors message message explaining the
 * problem. (Instead of a confusing exception thrown inside the implementation
 * of the `value` object).
 */
// $FlowFixMe only called in DEV, so void return is not possible.
function typeName(value) {
  {
    // toStringTag is needed for namespaced types like Temporal.Instant
    var hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
    var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || 'Object';
    return type;
  }
} // $FlowFixMe only called in DEV, so void return is not possible.


function willCoercionThrow(value) {
  {
    try {
      testStringCoercion(value);
      return false;
    } catch (e) {
      return true;
    }
  }
}

function testStringCoercion(value) {
  // If you ended up here by following an exception call stack, here's what's
  // happened: you supplied an object or symbol value to React (as a prop, key,
  // DOM attribute, CSS property, string ref, etc.) and when React tried to
  // coerce it to a string using `'' + value`, an exception was thrown.
  //
  // The most common types that will cause this exception are `Symbol` instances
  // and Temporal objects like `Temporal.Instant`. But any object that has a
  // `valueOf` or `[Symbol.toPrimitive]` method that throws will also cause this
  // exception. (Library authors do this to prevent users from using built-in
  // numeric operators like `+` or comparison operators like `>=` because custom
  // methods are needed to perform accurate arithmetic or comparison.)
  //
  // To fix the problem, coerce this object or symbol value to a string before
  // passing it to React. The most reliable way is usually `String(value)`.
  //
  // To find which value is throwing, check the browser or debugger console.
  // Before this exception was thrown, there should be `console.error` output
  // that shows the type (Symbol, Temporal.PlainDate, etc.) that caused the
  // problem and how that type was used: key, atrribute, input value prop, etc.
  // In most cases, this console output also shows the component and its
  // ancestor components where the exception happened.
  //
  // eslint-disable-next-line react-internal/safe-string-coercion
  return '' + value;
}
function checkKeyStringCoercion(value) {
  {
    if (willCoercionThrow(value)) {
      error('The provided key is an unsupported type %s.' + ' This value must be coerced to a string before before using it here.', typeName(value));

      return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
    }
  }
}

var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
var specialPropKeyWarningShown;
var specialPropRefWarningShown;
var didWarnAboutStringRefs;

{
  didWarnAboutStringRefs = {};
}

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.key !== undefined;
}

function warnIfStringRefCannotBeAutoConverted(config, self) {
  {
    if (typeof config.ref === 'string' && ReactCurrentOwner.current && self && ReactCurrentOwner.current.stateNode !== self) {
      var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);

      if (!didWarnAboutStringRefs[componentName]) {
        error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', getComponentNameFromType(ReactCurrentOwner.current.type), config.ref);

        didWarnAboutStringRefs[componentName] = true;
      }
    }
  }
}

function defineKeyPropWarningGetter(props, displayName) {
  {
    var warnAboutAccessingKey = function () {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;

        error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
      }
    };

    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, 'key', {
      get: warnAboutAccessingKey,
      configurable: true
    });
  }
}

function defineRefPropWarningGetter(props, displayName) {
  {
    var warnAboutAccessingRef = function () {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;

        error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
      }
    };

    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, 'ref', {
      get: warnAboutAccessingRef,
      configurable: true
    });
  }
}
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */


var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.

    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    }); // self and source are DEV only properties.

    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    }); // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.

    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });

    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
/**
 * https://github.com/reactjs/rfcs/pull/107
 * @param {*} type
 * @param {object} props
 * @param {string} key
 */

function jsxDEV(type, config, maybeKey, source, self) {
  {
    var propName; // Reserved names are extracted

    var props = {};
    var key = null;
    var ref = null; // Currently, key can be spread in as a prop. This causes a potential
    // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
    // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
    // but as an intermediary step, we will use jsxDEV for everything except
    // <div {...props} key="Hi" />, because we aren't currently able to tell if
    // key is explicitly declared to be undefined or not.

    if (maybeKey !== undefined) {
      {
        checkKeyStringCoercion(maybeKey);
      }

      key = '' + maybeKey;
    }

    if (hasValidKey(config)) {
      {
        checkKeyStringCoercion(config.key);
      }

      key = '' + config.key;
    }

    if (hasValidRef(config)) {
      ref = config.ref;
      warnIfStringRefCannotBeAutoConverted(config, self);
    } // Remaining properties are added to a new props object


    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    } // Resolve default props


    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;

      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }

    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }

      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }

    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }
}

var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

function setCurrentlyValidatingElement$1(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
      ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
    } else {
      ReactDebugCurrentFrame$1.setExtraStackFrame(null);
    }
  }
}

var propTypesMisspellWarningShown;

{
  propTypesMisspellWarningShown = false;
}
/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a ReactElement.
 * @final
 */


function isValidElement(object) {
  {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }
}

function getDeclarationErrorAddendum() {
  {
    if (ReactCurrentOwner$1.current) {
      var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);

      if (name) {
        return '\n\nCheck the render method of `' + name + '`.';
      }
    }

    return '';
  }
}

function getSourceInfoErrorAddendum(source) {
  {
    if (source !== undefined) {
      var fileName = source.fileName.replace(/^.*[\\\/]/, '');
      var lineNumber = source.lineNumber;
      return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
    }

    return '';
  }
}
/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */


var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  {
    var info = getDeclarationErrorAddendum();

    if (!info) {
      var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

      if (parentName) {
        info = "\n\nCheck the top-level render call using <" + parentName + ">.";
      }
    }

    return info;
  }
}
/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */


function validateExplicitKey(element, parentType) {
  {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }

    element._store.validated = true;
    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
      return;
    }

    ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.

    var childOwner = '';

    if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
      // Give the component that originally created this child.
      childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
    }

    setCurrentlyValidatingElement$1(element);

    error('Each child in a list should have a unique "key" prop.' + '%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);

    setCurrentlyValidatingElement$1(null);
  }
}
/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */


function validateChildKeys(node, parentType) {
  {
    if (typeof node !== 'object') {
      return;
    }

    if (isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];

        if (isValidElement(child)) {
          validateExplicitKey(child, parentType);
        }
      }
    } else if (isValidElement(node)) {
      // This element was passed in a valid location.
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      var iteratorFn = getIteratorFn(node);

      if (typeof iteratorFn === 'function') {
        // Entry iterators used to provide implicit keys,
        // but now we print a separate warning for them later.
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step;

          while (!(step = iterator.next()).done) {
            if (isValidElement(step.value)) {
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      }
    }
  }
}
/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */


function validatePropTypes(element) {
  {
    var type = element.type;

    if (type === null || type === undefined || typeof type === 'string') {
      return;
    }

    var propTypes;

    if (typeof type === 'function') {
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
    // Inner props are checked in the reconciler.
    type.$$typeof === REACT_MEMO_TYPE)) {
      propTypes = type.propTypes;
    } else {
      return;
    }

    if (propTypes) {
      // Intentionally inside to avoid triggering lazy initializers:
      var name = getComponentNameFromType(type);
      checkPropTypes(propTypes, element.props, 'prop', name, element);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

      var _name = getComponentNameFromType(type);

      error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', _name || 'Unknown');
    }

    if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
      error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
    }
  }
}
/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */


function validateFragmentProps(fragment) {
  {
    var keys = Object.keys(fragment.props);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key !== 'children' && key !== 'key') {
        setCurrentlyValidatingElement$1(fragment);

        error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

        setCurrentlyValidatingElement$1(null);
        break;
      }
    }

    if (fragment.ref !== null) {
      setCurrentlyValidatingElement$1(fragment);

      error('Invalid attribute `ref` supplied to `React.Fragment`.');

      setCurrentlyValidatingElement$1(null);
    }
  }
}

var didWarnAboutKeySpread = {};
function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
  {
    var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.

    if (!validType) {
      var info = '';

      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }

      var sourceInfo = getSourceInfoErrorAddendum(source);

      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      var typeString;

      if (type === null) {
        typeString = 'null';
      } else if (isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = "<" + (getComponentNameFromType(type.type) || 'Unknown') + " />";
        info = ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      error('React.jsx: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }

    var element = jsxDEV(type, props, key, source, self); // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.

    if (element == null) {
      return element;
    } // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)


    if (validType) {
      var children = props.children;

      if (children !== undefined) {
        if (isStaticChildren) {
          if (isArray(children)) {
            for (var i = 0; i < children.length; i++) {
              validateChildKeys(children[i], type);
            }

            if (Object.freeze) {
              Object.freeze(children);
            }
          } else {
            error('React.jsx: Static children should always be an array. ' + 'You are likely explicitly calling React.jsxs or React.jsxDEV. ' + 'Use the Babel transform instead.');
          }
        } else {
          validateChildKeys(children, type);
        }
      }
    }

    {
      if (hasOwnProperty.call(props, 'key')) {
        var componentName = getComponentNameFromType(type);
        var keys = Object.keys(props).filter(function (k) {
          return k !== 'key';
        });
        var beforeExample = keys.length > 0 ? '{key: someKey, ' + keys.join(': ..., ') + ': ...}' : '{key: someKey}';

        if (!didWarnAboutKeySpread[componentName + beforeExample]) {
          var afterExample = keys.length > 0 ? '{' + keys.join(': ..., ') + ': ...}' : '{}';

          error('A props object containing a "key" prop is being spread into JSX:\n' + '  let props = %s;\n' + '  <%s {...props} />\n' + 'React keys must be passed directly to JSX without using spread:\n' + '  let props = %s;\n' + '  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);

          didWarnAboutKeySpread[componentName + beforeExample] = true;
        }
      }
    }

    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      validatePropTypes(element);
    }

    return element;
  }
} // These two functions exist to still get child warnings in dev
// even with the prod transform. This means that jsxDEV is purely
// opt-in behavior for better messages but that we won't stop
// giving you warnings if you use production apis.

function jsxWithValidationStatic(type, props, key) {
  {
    return jsxWithValidation(type, props, key, true);
  }
}
function jsxWithValidationDynamic(type, props, key) {
  {
    return jsxWithValidation(type, props, key, false);
  }
}

var jsx =  jsxWithValidationDynamic ; // we may want to special case jsxs internally to take advantage of static children.
// for now we can ship identical prod functions

var jsxs =  jsxWithValidationStatic ;

exports.Fragment = REACT_FRAGMENT_TYPE;
exports.jsx = jsx;
exports.jsxs = jsxs;
  })();
}


/***/ },

/***/ "./node_modules/react/jsx-runtime.js"
/*!*******************************************!*\
  !*** ./node_modules/react/jsx-runtime.js ***!
  \*******************************************/
(module, __unused_webpack_exports, __webpack_require__) {



if (false) // removed by dead control flow
{} else {
  module.exports = __webpack_require__(/*! ./cjs/react-jsx-runtime.development.js */ "./node_modules/react/cjs/react-jsx-runtime.development.js");
}


/***/ },

/***/ "./src/styles/clausekit.css"
/*!**********************************!*\
  !*** ./src/styles/clausekit.css ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clausekit_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./clausekit.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/clausekit.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clausekit_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clausekit_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_clausekit_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_clausekit_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ },

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
(module) {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js"
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
(module) {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js"
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
(module) {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js"
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
(module) {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js"
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
(module) {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ },

/***/ "./src/services/DocumentServiceContext.tsx"
/*!*************************************************!*\
  !*** ./src/services/DocumentServiceContext.tsx ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DocumentServiceProvider: () => (/* binding */ DocumentServiceProvider),
/* harmony export */   useDocumentService: () => (/* binding */ useDocumentService)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


/**
 * React context carrying the active {@link DocumentService}. Defaults to `null`
 * so {@link useDocumentService} can detect use outside a provider. The concrete
 * implementation (mock or real Word) is injected by whoever mounts the tree —
 * the playground supplies the mock, the add-in supplies the Word one.
 */
const DocumentServiceContext = (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(null);
/** Provides a {@link DocumentService} to everything beneath it. */
function DocumentServiceProvider({ service, children }) {
    return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(DocumentServiceContext.Provider, { value: service, children: children });
}
/**
 * Consumes the injected {@link DocumentService}.
 *
 * @throws if called outside a {@link DocumentServiceProvider}, so a missing
 * implementation fails loudly at the point of use rather than silently no-op'ing.
 */
function useDocumentService() {
    const service = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(DocumentServiceContext);
    if (!service) {
        throw new Error("useDocumentService must be used within a <DocumentServiceProvider>. " +
            "Wrap the app in a provider with a mock or Word DocumentService.");
    }
    return service;
}


/***/ },

/***/ "./src/taskpane/components/ActionCard.tsx"
/*!************************************************!*\
  !*** ./src/taskpane/components/ActionCard.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ActionCard)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services */ "./src/services/index.ts");
/* harmony import */ var _fixtures_lease__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../fixtures/lease */ "./src/fixtures/lease/index.ts");




/**
 * Demo edit built from the §5 contested-clause sidecar: lower the 5% compounding
 * escalator (the landlord-opening rung) to the market 3% rung. Replaces the old
 * hardcoded MSA liability content so the card matches the seeded lease.
 */
const escalation = (0,_fixtures_lease__WEBPACK_IMPORTED_MODULE_3__.getContestedClause)("§5");
const demoEdit = {
    clauseRef: "§5",
    originalText: escalation?.fallbackLadder[0].language ?? "",
    proposedText: escalation?.fallbackLadder[1].language ?? "",
    rationale: escalation?.fallbackLadder[1].rationale ?? "",
    severity: "high",
};
function ActionCard() {
    const service = (0,_services__WEBPACK_IMPORTED_MODULE_2__.useDocumentService)();
    const [state, setState] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("idle");
    const [errorMsg, setErrorMsg] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [dismissed, setDismissed] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    if (dismissed)
        return null;
    const handleApply = async () => {
        setState("applying");
        setErrorMsg("");
        try {
            const result = await service.applyTrackedChange(demoEdit);
            switch (result.status) {
                case "applied":
                    setState("applied");
                    await service.scrollTo({ clauseRef: result.clauseRef ?? demoEdit.clauseRef });
                    break;
                case "not-found":
                    setState("error");
                    setErrorMsg(`Couldn't find the original text in ${demoEdit.clauseRef} to redline.`);
                    break;
                case "ambiguous":
                    setState("error");
                    setErrorMsg(`Found ${result.matchCount} matches in ${demoEdit.clauseRef}; can't redline unambiguously.`);
                    break;
            }
        }
        catch (err) {
            setState("error");
            setErrorMsg(err instanceof Error ? err.message : "Failed to apply the change.");
        }
    };
    const applyLabel = state === "applying" ? "Applying…" : state === "error" ? "Retry" : "Apply Change";
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-action", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "a-head", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "a-badge", children: "Suggested edit" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "a-title", children: "Lower the rent escalation to a market 3%" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "a-body", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "a-desc", children: demoEdit.rationale }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-diff", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "d-line d-del", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "t", children: demoEdit.originalText }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "d-line d-add", children: demoEdit.proposedText })] }), state === "error" && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "a-error", children: errorMsg })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "a-foot", children: [state === "applied" ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "ck-btn applied", disabled: true, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "chk" }), " Applied to document"] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "ck-btn primary", onClick: handleApply, disabled: state === "applying", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "chk" }), " ", applyLabel] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "spacer" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "ck-btn danger-ghost", onClick: () => setDismissed(true), children: "Dismiss" })] })] }));
}


/***/ },

/***/ "./src/taskpane/components/App.tsx"
/*!*****************************************!*\
  !*** ./src/taskpane/components/App.tsx ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _CKHeader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CKHeader */ "./src/taskpane/components/CKHeader.tsx");
/* harmony import */ var _EmptyState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./EmptyState */ "./src/taskpane/components/EmptyState.tsx");
/* harmony import */ var _ChatPane__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ChatPane */ "./src/taskpane/components/ChatPane.tsx");
/* harmony import */ var _ChatInput__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ChatInput */ "./src/taskpane/components/ChatInput.tsx");






function App(_props) {
    const [view, setView] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("empty");
    const [firstQuery, setFirstQuery] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const handleSend = (query) => {
        if (!query.trim())
            return;
        if (view === "empty") {
            setFirstQuery(query);
            setView("chat");
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-pane", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_CKHeader__WEBPACK_IMPORTED_MODULE_2__["default"], { status: view === "chat" ? "Reviewing MSA · §9" : "Ready to review" }), view === "empty" ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_EmptyState__WEBPACK_IMPORTED_MODULE_3__["default"], { onPrompt: handleSend })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ChatPane__WEBPACK_IMPORTED_MODULE_4__["default"], { query: firstQuery })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ChatInput__WEBPACK_IMPORTED_MODULE_5__["default"], { onSend: handleSend, chatOpen: view === "chat" })] }));
}


/***/ },

/***/ "./src/taskpane/components/CKHeader.tsx"
/*!**********************************************!*\
  !*** ./src/taskpane/components/CKHeader.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CKHeader)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");

function CKHeader({ status }) {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "h-mark", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "CK" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "h-txt", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "h-name", children: "ClauseKit" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "h-status", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "live" }), status] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "h-actions", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "ck-icon-btn", "aria-label": "More options", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "kebab", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("b", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("b", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("b", {})] }) }) })] }));
}


/***/ },

/***/ "./src/taskpane/components/ChatInput.tsx"
/*!***********************************************!*\
  !*** ./src/taskpane/components/ChatInput.tsx ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ChatInput)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


function ChatInput({ onSend, chatOpen }) {
    const [value, setValue] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const textareaRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const handleSend = () => {
        const trimmed = value.trim();
        if (!trimmed)
            return;
        onSend(trimmed);
        setValue("");
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    const hasText = value.trim().length > 0;
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-privacy", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-shield" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "p-txt", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("b", { children: "Your document stays private." }), " Text is only sent when you ask a question."] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-input-wrap", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-input", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("textarea", { ref: textareaRef, rows: 1, placeholder: chatOpen ? "Ask a follow-up…" : "Ask about this contract…", value: value, onChange: (e) => setValue(e.target.value), onKeyDown: handleKeyDown }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `ck-send${hasText ? "" : " disabled"}`, onClick: handleSend, "aria-label": "Send", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "send-arrow" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-hint", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "lock-icon" }), "End-to-end encrypted \u00B7 Your firm's data is never used to train models"] })] })] }));
}


/***/ },

/***/ "./src/taskpane/components/ChatPane.tsx"
/*!**********************************************!*\
  !*** ./src/taskpane/components/ChatPane.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ChatPane)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ActionCard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ActionCard */ "./src/taskpane/components/ActionCard.tsx");



function ChatPane({ query }) {
    const ref = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (ref.current)
            ref.current.scrollTop = ref.current.scrollHeight;
    }, []);
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-chat", ref: ref, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-daydiv", children: "Today" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-row user", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-bubble user", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: query }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-time", children: "Just now" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-row", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-avatar", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "CK" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-bubble ai", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { children: ["The cap ties total liability to ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: "12 months of fees" }), " - below market for a deal of this value."] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-quote", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "q-meta", children: "\u00A7 9.1 \u00B7 Limitation of Liability" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "q-text", children: ["\u2026shall not exceed the total fees paid by Customer in the", " ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("mark", { children: "twelve (12) months" }), " preceding the claim."] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { children: ["Most MSAs at this contract value cap at", " ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: "the greater of 12 months' fees or 2\u00D7" }), ". I can propose a revision."] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "ck-cite", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "pin" }), "Jump to \u00A7 9.1", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "cite-arr", children: "\u203A" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-time", children: "Just now" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-row", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-avatar", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "CK" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { flex: 1, minWidth: 0 }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ActionCard__WEBPACK_IMPORTED_MODULE_2__["default"], {}) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-row user", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-bubble user", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Can you also carve indemnity and confidentiality out of the cap?" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-time", children: "Just now" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-row ck-thinking", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-avatar", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "CK" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "t-bubble", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("i", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("i", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("i", {})] })] })] }));
}


/***/ },

/***/ "./src/taskpane/components/EmptyState.tsx"
/*!************************************************!*\
  !*** ./src/taskpane/components/EmptyState.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EmptyState)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");

const PROMPTS = [
    "Is this liability cap standard for an MSA?",
    "Flag any uncapped indemnity obligations",
    "Does confidentiality survive termination?",
];
function EmptyState({ onPrompt }) {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-empty", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "e-mark", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "CK" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Review with confidence" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "e-sub", children: "Ask anything about the contract you're in - or pick a starting point below." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-suggest", children: PROMPTS.map((p) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "s-btn", onClick: () => onPrompt(p), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "s-dot" }), p, (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "s-ar", children: "\u203A" })] }, p))) })] }));
}


/***/ },

/***/ "./src/taskpane/index.tsx"
/*!********************************!*\
  !*** ./src/taskpane/index.tsx ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _components_App__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/App */ "./src/taskpane/components/App.tsx");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services */ "./src/services/index.ts");
/* harmony import */ var _services_office_StubDocumentService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/office/StubDocumentService */ "./src/services/office/StubDocumentService.ts");
/* harmony import */ var _styles_clausekit_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../styles/clausekit.css */ "./src/styles/clausekit.css");






/* global document, Office, module, require, HTMLElement */
const title = "ClauseKit";
// The Word-backed DocumentService arrives in step 7; until then a stub keeps the
// pane mountable (useDocumentService throws without a provider).
const documentService = new _services_office_StubDocumentService__WEBPACK_IMPORTED_MODULE_4__.StubDocumentService();
const rootElement = document.getElementById("container");
const root = rootElement ? (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(rootElement) : undefined;
Office.onReady(() => {
    root?.render((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_services__WEBPACK_IMPORTED_MODULE_3__.DocumentServiceProvider, { service: documentService, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_App__WEBPACK_IMPORTED_MODULE_2__["default"], { title: title }) }));
});
if (false) // removed by dead control flow
{}


/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/taskpane/index.tsx"), __webpack_exec__("./src/taskpane/taskpane.html"));
/******/ }
]);
//# sourceMappingURL=taskpane.js.map