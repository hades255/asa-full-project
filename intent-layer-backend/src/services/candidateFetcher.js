/**
 * Candidate fetcher — re-exports from candidateSource module.
 * Source selection is driven by CANDIDATE_SOURCE env (mock | db | http | auto).
 */
export { fetchCandidates } from "../modules/candidateSource/index.js";
