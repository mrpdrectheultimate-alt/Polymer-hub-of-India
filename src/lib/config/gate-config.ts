// src/lib/config/gate-config.ts
// Centralized configuration for GATE examination cycle

export const GATE_CONFIG = {
  year: 2027,
  organizingInstitute: 'IIT Madras',
  paperCode: 'XE5',
  previousPaperCode: 'XE-F',
  paperName: 'Polymer Science and Engineering',
  examDates: ['2027-02-06', '2027-02-07', '2027-02-13', '2027-02-14', '2027-02-20', '2027-02-21'],
  examDatesFormatted: '6, 7, 13, 14, 20, 21 February 2027',
  resultDate: '2027-03-19',
  resultDateFormatted: '19 March 2027',
  registrationClose: '2026-10-12',
  officialUrl: 'https://gate2027.iitm.ac.in',
  syllabusUrl: 'https://gate2027.iitm.ac.in/exam_papers_and_syllabus',
  syllabusPdfUrl: 'https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/XE5_GATE2027_Syllabus.pdf',
} as const

export type GateConfig = typeof GATE_CONFIG
