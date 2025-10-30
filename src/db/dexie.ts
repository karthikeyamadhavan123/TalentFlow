import type { JobProps, CandidateProps, Assessment, CandidateResponse } from '@/types';
import Dexie, { type EntityTable } from 'dexie';

const db = new Dexie('jobPortal') as Dexie & {
    jobs: EntityTable<JobProps, 'id'>;
    candidates: EntityTable<CandidateProps, 'id'>;
    assessments: EntityTable<Assessment, 'id'>;
    candidateResponses: EntityTable<CandidateResponse & { id?: string }, 'id'>; // primary key "id" (for the typings only)
}
db.version(2).stores({
    jobs: '++id, title, slug, status, order, createdAt',
    candidates: '++id, firstName, lastName, email, jobId, stage, createdAt, [jobId+stage]',
    assessments: '++id, jobId, title, createdAt, updatedAt',
    candidateResponses: '++id, assessmentId, candidateId, submittedAt, [assessmentId+candidateId]'
});
export { db };