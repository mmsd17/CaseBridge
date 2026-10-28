import { INITIAL_COMPLAINTS, INSTITUTIONS } from '../data/mockData.js'

// localStorage persistence layer for single-browser demonstration.
// All keys are versioned. When a real backend is introduced, swap these
// functions for API calls (e.g. fetch('/api/...')).
const KEY_COMPLAINTS = 'casebridge:complaints:v2'
const KEY_INSTITUTIONS = 'casebridge:institutions:v2'
const KEY_RELATIONSHIPS = 'casebridge:relationships:v2'

export function loadComplaints() {
  try {
    const raw = window.localStorage.getItem(KEY_COMPLAINTS)
    if (!raw) return INITIAL_COMPLAINTS
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_COMPLAINTS
    return parsed
  } catch {
    return INITIAL_COMPLAINTS
  }
}

export function saveComplaints(complaints) {
  try {
    window.localStorage.setItem(KEY_COMPLAINTS, JSON.stringify(complaints))
  } catch (err) {
    console.warn('Unable to persist complaints to localStorage:', err)
  }
}

export function loadInstitutions() {
  try {
    const raw = window.localStorage.getItem(KEY_INSTITUTIONS)
    if (!raw) return INSTITUTIONS
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return INSTITUTIONS
    return parsed
  } catch {
    return INSTITUTIONS
  }
}

export function saveInstitutions(institutions) {
  try {
    window.localStorage.setItem(KEY_INSTITUTIONS, JSON.stringify(institutions))
  } catch (err) {
    console.warn('Unable to persist institutions to localStorage:', err)
  }
}

export function loadRelationships() {
  try {
    const raw = window.localStorage.getItem(KEY_RELATIONSHIPS)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    return parsed
  } catch {
    return {}
  }
}

export function saveRelationships(relationships) {
  try {
    window.localStorage.setItem(KEY_RELATIONSHIPS, JSON.stringify(relationships))
  } catch (err) {
    console.warn('Unable to persist relationships to localStorage:', err)
  }
}

export function resetAllStoredData() {
  try {
    window.localStorage.removeItem(KEY_COMPLAINTS)
    window.localStorage.removeItem(KEY_INSTITUTIONS)
    window.localStorage.removeItem(KEY_RELATIONSHIPS)
  } catch (err) {
    console.warn('Error clearing localStorage:', err)
  }
}
