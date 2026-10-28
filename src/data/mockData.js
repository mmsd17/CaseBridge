// Mock dataset for the AICTE Complaint Monitoring Dashboard.
// Swap these arrays for API responses when the backend is wired in.

export const TODAY = new Date('2026-10-24T00:00:00')

export const STATUSES = [
  'New',
  'Under Review',
  'In Progress',
  'Escalated',
  'Resolved',
  'Closed',
]

export const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']

export const PRIORITY_SLA = { Critical: 3, High: 7, Medium: 15, Low: 30 }

export const STATUS_STYLE = {
  New: 'bg-blue-50 text-blue-700 ring-blue-200',
  'Under Review': 'bg-violet-50 text-violet-700 ring-violet-200',
  'In Progress': 'bg-amber-50 text-amber-800 ring-amber-200',
  Escalated: 'bg-red-50 text-red-700 ring-red-200',
  Resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Closed: 'bg-slate-100 text-slate-600 ring-slate-200',
}

export const PRIORITY_STYLE = {
  Critical: 'bg-red-600 text-white ring-red-600',
  High: 'bg-orange-50 text-orange-700 ring-orange-200',
  Medium: 'bg-amber-50 text-amber-800 ring-amber-200',
  Low: 'bg-slate-100 text-slate-600 ring-slate-200',
}

export const CHART_COLORS = [
  '#1d4ed8',
  '#0ea5e9',
  '#f59e0b',
  '#10b981',
  '#8b5cf6',
  '#ef4444',
  '#14b8a6',
  '#f97316',
  '#6366f1',
  '#84cc16',
]

export const BUREAUS = [
  { id: 'BTE', name: 'Bureau of Technical Education', head: 'Dr. K. Raghavan', email: 'bte@aicte.gov.in' },
  { id: 'BME', name: 'Bureau of Management Education', head: 'Dr. S. Meenakshi', email: 'bme@aicte.gov.in' },
  { id: 'BPE', name: 'Bureau of Pharmacy Education', head: 'Dr. A. Qureshi', email: 'bpe@aicte.gov.in' },
  { id: 'BAP', name: 'Bureau of Architecture & Planning', head: 'Ar. N. Deshpande', email: 'bap@aicte.gov.in' },
  { id: 'GRC', name: 'Grievance Redressal Cell', head: 'Sh. P. Bhardwaj', email: 'grc@aicte.gov.in' },
  { id: 'ARC', name: 'Anti-Ragging Cell', head: 'Dr. R. Iyer', email: 'arc@aicte.gov.in' },
  { id: 'EHC', name: 'Equality & Harassment Cell', head: 'Ms. T. Fernandes', email: 'ehc@aicte.gov.in' },
  { id: 'WLC', name: 'SC/ST & OBC Welfare Cell', head: 'Dr. M. Patil', email: 'wlc@aicte.gov.in' },
  { id: 'MCC', name: 'Monitoring & Compliance Cell', head: 'Sh. V. Nair', email: 'mcc@aicte.gov.in' },
  { id: 'ROC', name: 'Regional Office Coordination', head: 'Sh. D. Sharma', email: 'roc@aicte.gov.in' },
]

export const CATEGORIES = [
  'Admission Irregularity',
  'Fee Refund',
  'Ragging Incident',
  'Infrastructure Deficiency',
  'Faculty Shortage',
  'Inspection & Compliance',
  'Scholarship Delay',
  'Harassment (Women)',
  'Fake / Misused Approval',
  'Accreditation Issue',
  'Data & Cyber Grievance',
  'Other',
]

export const INSTITUTIONS = [
  { id: 'IN-01', name: 'Sri Venkateswara College of Engineering', code: 'AIC-EN-1042', city: 'Chennai', state: 'Tamil Nadu', type: 'Engineering', approval: 'Approved', validTill: '2027-06-30' },
  { id: 'IN-02', name: 'National Institute of Management Studies', code: 'AIC-MN-2217', city: 'Jaipur', state: 'Rajasthan', type: 'Management', approval: 'Approved', validTill: '2026-12-31' },
  { id: 'IN-03', name: 'Dr. B. R. Ambedkar Polytechnic', code: 'AIC-PT-0885', city: 'Nagpur', state: 'Maharashtra', type: 'Polytechnic', approval: 'Provisional', validTill: '2026-07-15' },
  { id: 'IN-04', name: 'Ganga Institute of Pharmacy', code: 'AIC-PH-3390', city: 'Lucknow', state: 'Uttar Pradesh', type: 'Pharmacy', approval: 'Approved', validTill: '2028-03-31' },
  { id: 'IN-05', name: 'Coastal School of Architecture', code: 'AIC-AR-1520', city: 'Kochi', state: 'Kerala', type: 'Architecture', approval: 'Restricted', validTill: '2026-11-30' },
  { id: 'IN-06', name: 'Netaji Subhash Engineering College', code: 'AIC-EN-0471', city: 'Kolkata', state: 'West Bengal', type: 'Engineering', approval: 'Approved', validTill: '2027-06-30' },
  { id: 'IN-07', name: 'Deccan College of Technology', code: 'AIC-EN-2904', city: 'Hyderabad', state: 'Telangana', type: 'Engineering', approval: 'Approved', validTill: '2027-06-30' },
  { id: 'IN-08', name: 'Maharana Pratap Institute of Management', code: 'AIC-MN-3158', city: 'Indore', state: 'Madhya Pradesh', type: 'Management', approval: 'Provisional', validTill: '2026-09-30' },
  { id: 'IN-09', name: 'Shri Guru Gobind Singh Pharmacy College', code: 'AIC-PH-0662', city: 'Amritsar', state: 'Punjab', type: 'Pharmacy', approval: 'Approved', validTill: '2028-03-31' },
  { id: 'IN-10', name: 'Himalayan Institute of Technology', code: 'AIC-EN-4126', city: 'Dehradun', state: 'Uttarakhand', type: 'Engineering', approval: 'Approved', validTill: '2027-06-30' },
  { id: 'IN-11', name: 'Kalinga Centre for Applied Research', code: 'AIC-AR-2077', city: 'Bhubaneswar', state: 'Odisha', type: 'Architecture', approval: 'Approved', validTill: '2027-01-31' },
  { id: 'IN-12', name: 'Sardar Vallabhbhai Institute of Technology', code: 'AIC-EN-1803', city: 'Vadodara', state: 'Gujarat', type: 'Engineering', approval: 'Restricted', validTill: '2026-12-31' },
]

export const ASSIGNEES = [
  'Sh. A. Kulkarni (DS)',
  'Ms. R. Sethi (JS)',
  'Sh. B. Mahato (Director)',
  'Dr. L. Thomas (Adviser)',
  'Sh. C. Reddy (Director)',
  'Ms. F. Khan (Under Secretary)',
]

// ---------- helpers ----------

export function parseDate(iso) {
  return new Date(`${iso}T00:00:00`)
}

export function toISO(date) {
  return date.toISOString().slice(0, 10)
}

export function addDays(iso, days) {
  const d = parseDate(iso)
  d.setDate(d.getDate() + days)
  return toISO(d)
}

export function daysBetween(fromIso, toIso) {
  return Math.round((parseDate(toIso) - parseDate(fromIso)) / 86400000)
}

export function formatDate(iso) {
  if (!iso) return '—'
  return parseDate(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function dueOnFor(complaint) {
  if (complaint.dueDate) return complaint.dueDate
  return addDays(complaint.filedOn, PRIORITY_SLA[complaint.priority] || 15)
}

export function isOpen(complaint) {
  return !['Resolved', 'Closed'].includes(complaint.status)
}

export function isOverdue(complaint) {
  return isOpen(complaint) && daysBetween(dueOnFor(complaint), toISO(TODAY)) > 0
}

export function daysOverdue(complaint) {
  return isOverdue(complaint) ? daysBetween(dueOnFor(complaint), toISO(TODAY)) : 0
}

export function daysOpen(complaint) {
  const end = complaint.resolvedOn || toISO(TODAY)
  return daysBetween(complaint.filedOn, end)
}

function buildTimeline(c) {
  const entries = [
    {
      date: c.filedOn,
      action: 'Complaint registered',
      by: 'Online Grievance Portal',
      note: `Received under category "${c.category}".`,
    },
    {
      date: addDays(c.filedOn, 1),
      action: `Assigned to ${c.assignee}`,
      by: 'Secretariat Cell',
      note: 'Routed to the concerned bureau/cell for examination.',
    },
  ]
  if (['In Progress', 'Escalated', 'Resolved', 'Closed'].includes(c.status)) {
    entries.push({
      date: addDays(c.filedOn, 3),
      action: 'Preliminary examination completed',
      by: c.assignee,
      note: 'Institution called upon to furnish records and reply.',
    })
  }
  if (c.status === 'Escalated') {
    entries.push({
      date: addDays(c.filedOn, 6),
      action: 'Escalated to Vice-Chairman, AICTE',
      by: c.assignee,
      note: 'No satisfactory response from institution within SLA window.',
    })
  }
  if (['Resolved', 'Closed'].includes(c.status)) {
    entries.push({
      date: c.resolvedOn,
      action: 'Show-cause notice issued & compliance verified',
      by: c.assignee,
      note: 'Institution complied with AICTE directives; case closed.',
    })
  }
  if (c.status === 'Closed') {
    entries.push({
      date: addDays(c.resolvedOn, 5),
      action: 'Complaint formally closed',
      by: 'Secretariat Cell',
      note: 'Complainant informed of the outcome and appeal window.',
    })
  }
  return entries
}

const RAW = [
  ['0142', 'Ragging complaint against senior students in boys hostel', 'Ragging Incident', 'ARC', 'IN-06', 'Critical', 'Escalated', '2026-10-02', 'Anonymous (Student)', 'Freshers report sustained harassment in Hall-4; institute internal committee allegedly inactive.'],
  ['0139', 'Fee refund not processed after seat cancellation', 'Fee Refund', 'GRC', 'IN-02', 'High', 'In Progress', '2026-09-28', 'Rakesh Sharma (Guardian)', 'Student cancelled admission within cooling-off period; Rs. 85,000 refund pending for 40 days.'],
  ['0136', 'Faculty shortage in CSE & ECE branches', 'Faculty Shortage', 'BTE', 'IN-07', 'High', 'In Progress', '2026-09-21', 'Alumni Association', 'Sanctioned 24 posts, only 14 filled. Practical sessions being conducted by unqualified staff.'],
  ['0133', 'Labs without required equipment as per approval norms', 'Inspection & Compliance', 'MCC', 'IN-03', 'Medium', 'Under Review', '2026-09-14', 'Ex-faculty (Confidential)', 'First-year workshop and CNC lab non-functional since last academic year.'],
  ['0130', 'Exorbitant capitation fee charged over published fee', 'Admission Irregularity', 'BTE', 'IN-12', 'Critical', 'Escalated', '2026-09-08', 'Guardian Forum Gujarat', 'Donation receipts collected in cash; fee structure on AICTE portal contradicted by college demand slips.'],
  ['0127', 'Post-matric scholarship disbursement delayed 6 months', 'Scholarship Delay', 'WLC', 'IN-03', 'High', 'In Progress', '2026-09-02', 'Student Union', 'SC/ST students awaiting state scholarship; institute threatens debarment from exams over fee dues.'],
  ['0124', 'Unsafe construction at new academic block', 'Infrastructure Deficiency', 'BAP', 'IN-05', 'Critical', 'Resolved', '2026-08-25', 'Faculty Member', 'Unauthorized additional floor under construction without revised approval; structural safety concerns.'],
  ['0121', 'Harassment complaint against department head', 'Harassment (Women)', 'EHC', 'IN-04', 'Critical', 'Resolved', '2026-08-18', 'Staff Member (Confidential)', 'Internal complaints committee report sought; interim relief requested for complainant.'],
  ['0118', 'Fake AICTE approval letter circulated to parents', 'Fake / Misused Approval', 'MCC', 'IN-08', 'Critical', 'Escalated', '2026-08-11', 'Whistleblower', 'Photographed approval letter carries altered validity dates and does not match portal record.'],
  ['0115', 'Library and internet facilities below prescribed norms', 'Infrastructure Deficiency', 'GRC', 'IN-10', 'Low', 'Resolved', '2026-08-04', 'Student (Hosteller)', 'Library remains closed on weekends; campus bandwidth far below claimed capacity.'],
  ['0112', 'Accreditation grade claimed misleadingly in ads', 'Accreditation Issue', 'MCC', 'IN-02', 'Medium', 'In Progress', '2026-07-27', 'Competing Institution', 'NBA accreditation lapsed in March 2026 but NAAC grade and NBA status still used in newspaper ads.'],
  ['0109', 'Delay in issuing degree certificates', 'Other', 'GRC', 'IN-01', 'Medium', 'Resolved', '2026-07-20', 'Batch of 2025 Graduates', 'Provisional certificates pending for two semesters; students unable to apply for higher studies abroad.'],
  ['0106', 'Ragging incident during hostel orientation', 'Ragging Incident', 'ARC', 'IN-12', 'High', 'Resolved', '2026-07-13', 'Parent', 'Physical and verbal ragging reported during orientation week; complainant fears retaliation.'],
  ['0103', 'Lateral entry admissions beyond sanctioned intake', 'Admission Irregularity', 'BTE', 'IN-01', 'High', 'Under Review', '2026-07-06', 'Anonymous (Employee)', '32 lateral entries recorded against approved intake of 18 in mechanical engineering.'],
  ['0100', 'MBA intake increased without additional faculty', 'Admission Irregularity', 'BME', 'IN-08', 'Medium', 'Closed', '2026-06-29', 'Guardian', 'Intake raised 60 to 120 without proportionate faculty or classroom augmentation.'],
  ['0097', 'Wi-Fi and hostel water supply chronic issues', 'Infrastructure Deficiency', 'ROC', 'IN-06', 'Low', 'Closed', '2026-06-22', 'Student Representatives', 'Repeated complaints across two academic years; regional office to inspect during next visit.'],
  ['0094', 'Pharmacy lab chemicals expired and unlabeled', 'Inspection & Compliance', 'BPE', 'IN-04', 'High', 'Resolved', '2026-06-15', 'Lab Assistant', 'Expired chemicals in dispensing lab; safety data sheets missing for reagents in storage.'],
  ['0091', 'Staff salaries unpaid for three months', 'Other', 'GRC', 'IN-05', 'High', 'Escalated', '2026-06-08', 'Faculty Association', 'Teaching and non-teaching staff unpaid since March; management citing cash-flow issues.'],
  ['0088', 'Placement data fabricated in prospectus', 'Other', 'MCC', 'IN-02', 'Medium', 'In Progress', '2026-06-01', 'Placement Volunteer', 'Claimed 94% placement rate not supported by any audited record shared with students.'],
  ['0085', 'Sexual harassment complaint against lab instructor', 'Harassment (Women)', 'EHC', 'IN-09', 'Critical', 'Resolved', '2026-05-25', 'Student (Confidential)', 'Complaint registered with internal committee; interim measures ordered pending enquiry.'],
  ['0082', 'SC/ST students denied examination form', 'Scholarship Delay', 'WLC', 'IN-10', 'High', 'Resolved', '2026-05-18', 'Student Union', 'Students with pending scholarship dues withheld from filling examination forms.'],
  ['0079', 'Architecture studio without qualified faculty', 'Faculty Shortage', 'BAP', 'IN-11', 'Medium', 'Closed', '2026-05-11', 'Parent', 'Sanctioned professor and associate professor posts vacant for over a year.'],
  ['0076', 'Ghost students admitted under management quota', 'Admission Irregularity', 'BTE', 'IN-03', 'Critical', 'Resolved', '2026-05-04', 'Whistleblower', 'Attendance registers show non-existent students; likely misuse of state subsidy scheme.'],
  ['0073', 'Cyber fraud using institute email domain', 'Data & Cyber Grievance', 'ROC', 'IN-07', 'High', 'Closed', '2026-04-27', 'Alumni', 'Fraudulent fee-payment mails sent to students from spoofed institute domain.'],
  ['0070', 'Girls common room inaccessible, no separate facilities', 'Infrastructure Deficiency', 'EHC', 'IN-12', 'Medium', 'In Progress', '2026-04-20', 'Women Students Forum', 'No designated common room; separate washroom facilities non-functional in workshop block.'],
  ['0067', 'Library books missing during compliance inspection', 'Inspection & Compliance', 'MCC', 'IN-08', 'Medium', 'Resolved', '2026-04-13', 'Inspection Team', 'Prescribed title count not met; borrowed records unavailable during surprise verification.'],
  ['0064', 'Refund of caution deposit pending one year', 'Fee Refund', 'GRC', 'IN-09', 'Low', 'Closed', '2026-04-06', 'Former Student', 'Caution deposit of Rs. 10,000 not refunded one year after completion of course.'],
  ['0061', 'Polytechnic affiliation fee receipt withheld', 'Other', 'ROC', 'IN-03', 'Low', 'Resolved', '2026-03-30', 'Institute Administrator', 'Fee deposited at regional office but receipt not issued for reconciliation.'],
  ['0058', 'Unapproved increase in hostel capacity', 'Inspection & Compliance', 'BTE', 'IN-10', 'High', 'Closed', '2026-03-23', 'Neighbourhood Association', 'Hostel occupancy exceeded sanctioned capacity; fire safety clearance not renewed.'],
  ['0055', 'Management degree without NBA accredited programme', 'Accreditation Issue', 'BME', 'IN-02', 'Medium', 'Resolved', '2026-03-16', 'Prospective Student', 'Admission marketing implied accreditation status not held by the programme at time of admission.'],
]

export const INITIAL_COMPLAINTS = RAW.map(
  ([seq, title, category, bureauId, institutionId, priority, status, filedOn, filedBy, description]) => {
    const c = {
      id: `AIT/2026/${seq}`,
      title,
      category,
      bureauId,
      institutionId,
      priority,
      status,
      filedOn,
      filedBy,
      description,
      dueDate: addDays(filedOn, PRIORITY_SLA[priority] || 15),
      assignee: ASSIGNEES[seq.charCodeAt(seq.length - 1) % ASSIGNEES.length],
      resolvedOn: ['Resolved', 'Closed'].includes(status) ? addDays(filedOn, (PRIORITY_SLA[priority] || 15) + 2) : null,
    }
    c.timeline = buildTimeline(c)
    return c
  },
)

export function bureauName(id) {
  return BUREAUS.find((b) => b.id === id)?.name || id
}

export function institutionById(id, institutionsList = INSTITUTIONS) {
  return (institutionsList || INSTITUTIONS).find((i) => i.id === id)
}

export function institutionLabel(id, institutionsList = INSTITUTIONS) {
  const inst = institutionById(id, institutionsList)
  return inst ? inst.name : id
}

// Transparent Keyword Extraction for Related Case Matching
const KEYWORDS = [
  'ragging',
  'hostel',
  'fee',
  'refund',
  'faculty',
  'shortage',
  'scholarship',
  'lab',
  'equipment',
  'admission',
  'capitation',
  'intake',
  'approval',
  'harassment',
  'construction',
  'infrastructure',
  'accreditation',
  'salary',
  'certificate',
]

export function extractKeywords(text = '') {
  const lower = text.toLowerCase()
  return KEYWORDS.filter((kw) => lower.includes(kw))
}

/**
 * Transparent rule-based related-case detection.
 * Evaluates complaints against each other using explicit rules:
 * 1. Shared Institution ID.
 * 2. Shared category or overlapping grievance keywords.
 * 3. Never matches a complaint with itself.
 * 4. Treats any un-reviewed pair as a 'candidate' until an officer confirms or dismisses it.
 */
export function findRelatedCandidates(complaints = [], relationships = {}, institutions = INSTITUTIONS) {
  const candidates = []
  const seenPairs = new Set()

  for (let i = 0; i < complaints.length; i++) {
    for (let j = i + 1; j < complaints.length; j++) {
      const c1 = complaints[i]
      const c2 = complaints[j]

      if (c1.id === c2.id) continue

      const pairKey = c1.id < c2.id ? `${c1.id}__${c2.id}` : `${c2.id}__${c1.id}`
      if (seenPairs.has(pairKey)) continue
      seenPairs.add(pairKey)

      const inst = institutionById(c1.institutionId, institutions)
      const sameInst = c1.institutionId === c2.institutionId
      const sameCategory = c1.category === c2.category

      const kw1 = extractKeywords(`${c1.title} ${c1.description}`)
      const kw2 = extractKeywords(`${c2.title} ${c2.description}`)
      const sharedKw = kw1.filter((k) => kw2.includes(k))

      let matched = false
      let matchType = ''
      let matchReason = ''
      let confidence = 'Low'

      if (sameInst && sameCategory) {
        matched = true
        matchType = 'Same Institution & Category'
        matchReason = `Both filed against ${inst?.name || c1.institutionId} under identical regulatory category "${c1.category}".`
        confidence = 'High'
      } else if (sameInst && sharedKw.length > 0) {
        matched = true
        matchType = 'Same Institution & Overlapping Topic'
        matchReason = `Both filed against ${inst?.name || c1.institutionId} sharing grievance keywords: [${sharedKw.join(', ')}].`
        confidence = 'High'
      } else if (sameInst) {
        matched = true
        matchType = 'Co-occurring Institution Case'
        matchReason = `Multiple statutory petitions logged against ${inst?.name || c1.institutionId}.`
        confidence = 'Medium'
      } else if (sameCategory && sharedKw.length >= 2 && ['Critical', 'High'].includes(c1.priority) && ['Critical', 'High'].includes(c2.priority)) {
        matched = true
        matchType = 'Multi-Campus Regulatory Pattern'
        matchReason = `Correlated high-priority pattern across institutions in category "${c1.category}" (Keywords: ${sharedKw.join(', ')}).`
        confidence = 'Medium'
      }

      if (matched) {
        const review = relationships[pairKey] || {
          status: 'candidate', // candidate | confirmed | dismissed
          reviewedAt: null,
          reviewedBy: null,
          reason: null,
        }

        candidates.push({
          pairKey,
          c1,
          c2,
          matchType,
          matchReason,
          confidence,
          sharedKeywords: sharedKw,
          status: review.status,
          reviewedAt: review.reviewedAt,
          reviewedBy: review.reviewedBy,
          reviewReason: review.reason,
        })
      }
    }
  }

  return candidates
}

/**
 * Generate CSV formatted string from complaints data.
 */
export function generateComplaintsCSV(complaints = [], institutions = INSTITUTIONS) {
  const headers = [
    'Complaint ID',
    'Title',
    'Category',
    'Institution Code',
    'Institution Name',
    'City',
    'State',
    'Bureau',
    'Priority',
    'Status',
    'Filed On',
    'SLA Due Date',
    'Assignee',
    'Complainant',
    'Description',
  ]

  const escape = (val) => {
    if (val === null || val === undefined) return '""'
    const str = String(val).replace(/"/g, '""')
    return `"${str}"`
  }

  const rows = complaints.map((c) => {
    const inst = institutionById(c.institutionId, institutions)
    return [
      escape(c.id),
      escape(c.title),
      escape(c.category),
      escape(inst?.code || c.institutionId),
      escape(inst?.name || c.institutionId),
      escape(inst?.city || ''),
      escape(inst?.state || ''),
      escape(bureauName(c.bureauId)),
      escape(c.priority),
      escape(c.status),
      escape(c.filedOn),
      escape(dueOnFor(c)),
      escape(c.assignee),
      escape(c.filedBy),
      escape(c.description),
    ].join(',')
  })

  return [headers.join(','), ...rows].join('\r\n')
}
