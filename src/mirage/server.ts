
import { createServer, Model, Response } from 'miragejs';
import { db } from '@/db/dexie';
import type { JobProps, JobsResponse, CreateJobData, UpdateJobData, Assessment, CandidateResponse } from '@/types';
import { v4 as uuidv4 } from 'uuid';

import type { CandidatesResponse } from '@/types';

export const JobModel = Model.extend({});
export const CandidateModel = Model.extend({});

export function makeServer({ environment = 'development' } = {}) {
    return createServer({
        environment,
        models: {
            job: JobModel
        },
        routes() {
            this.namespace = 'api';
            this.timing = 200; // this is the latency for all the requests between (200–1200ms)

            // GET /api/jobs - Get jobs with filtering, pagination, and sorting
            this.get('/jobs', async (_schema, request) => {
                try {
                    const allJobs = await db.jobs.toArray();

                    // ✅ Normalize query params safely
                    const getParam = (param: string, def: string) => {
                        const val = request.queryParams[param];
                        if (Array.isArray(val)) return val[0] || def;
                        return val ?? def;
                    };

                    const search = getParam('search', '').toLowerCase();
                    const status = getParam('status', '');
                    const sort = getParam('sort', 'order');

                    const tagsParam = request.queryParams.tags;
                    const tags = typeof tagsParam === 'string' ? tagsParam.split(',') : (tagsParam || []);

                    const page = Number(getParam('page', '1')) || 1;
                    const pageSize = Number(getParam('pageSize', '10')) || 10;

                    // ✅ Filtering
                    const filteredJobs = allJobs.filter(job => {
                        if (search) {
                            const term = search.toLowerCase();
                            const matches =
                                job.title?.toLowerCase().includes(term) ||
                                job.department?.toLowerCase().includes(term) ||
                                job.description?.toLowerCase().includes(term) ||
                                job.tags?.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(term));
                            if (!matches) return false;
                        }
                        if (status && job.status !== status) return false;

                        if (tags.length > 0 && job.tags?.length) {
                            const hasTag = tags.some(t =>
                                job.tags!.some(tag => typeof tag === 'string' && tag.toLowerCase() === t.toLowerCase())
                            );
                            if (!hasTag) return false;
                        }

                        return true;
                    });

                    // ✅ Sorting
                    filteredJobs.sort((a, b) => {
                        switch (sort) {
                            case 'title': return a.title.localeCompare(b.title);
                            case 'title_desc': return b.title.localeCompare(a.title);
                            case 'createdAt': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                            case 'createdAt_desc': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                            default: return a.order - b.order;
                        }
                    });

                    // ✅ Pagination
                    const totalCount = filteredJobs.length;
                    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
                    const startIndex = (page - 1) * pageSize;
                    const endIndex = startIndex + pageSize;
                    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

                    const response: JobsResponse = {
                        jobs: paginatedJobs,
                        totalCount,
                        totalPages,
                        currentPage: page,
                        hasNext: page < totalPages,
                        hasPrev: page > 1
                    };
                    // ✅ Explicit Response
                    return new Response(200, {}, response);

                } catch (error) {
                    console.error(error);
                    return new Response(500, {}, { error: 'Failed to fetch jobs' });
                }
            });


            // GET /api/jobs/search - Search jobs (for modal - simplified)
            this.get('/jobs/search', async (_schema, request) => {
                try {
                    const qParam = Array.isArray(request.queryParams.q) ? request.queryParams.q[0] : request.queryParams.q;
                    const allJobs = await db.jobs.toArray();

                    if (!qParam) {
                        return allJobs.slice(0, 10);
                    }

                    const searchTerm = qParam.toLowerCase();

                    const filteredJobs = allJobs.filter(job => {
                        if (job.title?.toLowerCase().includes(searchTerm)) return true;
                        if (job.department?.toLowerCase().includes(searchTerm)) return true;
                        if (job.location?.toLowerCase().includes(searchTerm)) return true;
                        if (job.description?.toLowerCase().includes(searchTerm)) return true;

                        if (job.tags && Array.isArray(job.tags)) {
                            const hasMatchingTag = job.tags.some(tag => {
                                if (typeof tag === 'string') {
                                    return tag.toLowerCase().includes(searchTerm);
                                }
                                return false;
                            });
                            if (hasMatchingTag) return true;
                        }

                        return false;
                    });

                    return filteredJobs.slice(0, 20);
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to fetch filtered jobs' });
                }
            });

            // GET /api/jobs/:id - Get specific job by ID
            this.get('/jobs/:id', async (_schema, request) => {
                try {
                    const { id } = request.params;

                    let job = await db.jobs.get(id);

                    if (!job) {
                        job = await db.jobs.get(id);
                    }

                    if (!job) {
                        const allJobs = await db.jobs.toArray();
                        job = allJobs.find(j => j.id == id || j.id === id);
                    }

                    if (!job) {
                        return new Response(404, {}, { error: 'Job not found' });
                    }

                    return job;
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to fetch job' });
                }
            });

            // POST /api/jobs - Create new job
            this.post('/jobs', async (_schema, request) => {
                try {
                    const attrs = JSON.parse(request.requestBody) as CreateJobData;

                    // Validate required fields
                    if (!attrs.title || !attrs.slug) {
                        return new Response(400, {}, { error: 'Title and slug are required' });
                    }

                    // Check if slug already exists
                    const existingJob = await db.jobs.where('slug').equals(attrs.slug).first();
                    if (existingJob) {
                        return new Response(400, {}, { error: 'Slug must be unique' });
                    }

                    // Get the highest order to place new job at the end
                    const allJobs = await db.jobs.toArray();
                    const maxOrder = allJobs.length > 0 ? Math.max(...allJobs.map(j => j.order)) : 0;

                    const newJob: JobProps = {
                        id: uuidv4(),
                        title: attrs.title,
                        slug: attrs.slug,
                        status: attrs.status || 'active',
                        tags: attrs.tags || [],
                        order: attrs.order || maxOrder + 1,
                        description: attrs.description,
                        department: attrs.department,
                        location: attrs.location,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        isArchived: attrs.status === 'active' ? false : true,
                    };

                    const id = await db.jobs.add(newJob);
                    const createdJob = await db.jobs.get(id);

                    return createdJob;
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to create job' });
                }
            });

            // In your makeServer() function, add this route:
            this.patch('/jobs/:id/reorder', async (_schema, request) => {
                try {
                    const { id } = request.params;
                    const { fromOrder, toOrder } = JSON.parse(request.requestBody);

                    console.log('🔄 Reordering job:', { id, fromOrder, toOrder });

                    const allJobs = await db.jobs.toArray();
                    const movingJob = await db.jobs.get(id);

                    if (!movingJob) {
                        return new Response(404, {}, { error: 'Job not found' });
                    }

                    // Update all affected jobs' orders
                    const updatedJobs = allJobs.map(job => {
                        if (job.id === id) {
                            // This is the job being moved
                            return { ...job, order: toOrder, updatedAt: new Date() };
                        } else if (fromOrder < toOrder) {
                            // Moving down - shift jobs between old and new position up
                            if (job.order > fromOrder && job.order <= toOrder) {
                                return { ...job, order: job.order - 1, updatedAt: new Date() };
                            }
                        } else if (fromOrder > toOrder) {
                            // Moving up - shift jobs between new and old position down
                            if (job.order >= toOrder && job.order < fromOrder) {
                                return { ...job, order: job.order + 1, updatedAt: new Date() };
                            }
                        }
                        return job;
                    });

                    // Update all jobs in the database
                    for (const job of updatedJobs) {
                        if (job.order !== allJobs.find(j => j.id === job.id)?.order) {
                            await db.jobs.update(job.id, job);
                        }
                    }

                    const reorderedJobs = await db.jobs.toArray();
                    reorderedJobs.sort((a, b) => a.order - b.order);

                    return new Response(200, {}, {
                        message: 'Job reordered successfully',
                        jobs: reorderedJobs
                    });

                } catch (error) {
                    console.error('Reorder error:', error);
                    return new Response(500, {}, { error: 'Failed to reorder job' });
                }
            });

            // PUT /api/jobs/:id - Update job
            this.put('/jobs/:id', async (_schema, request) => {
                try {
                    const { id } = request.params;
                    const attrs = JSON.parse(request.requestBody) as UpdateJobData;

                    const existingJob = await db.jobs.get(id);
                    if (!existingJob) {
                        return new Response(404, {}, { error: 'Job not found' });
                    }

                    // Check if slug is being changed and if it already exists
                    if (attrs.slug && attrs.slug !== existingJob.slug) {
                        const slugExists = await db.jobs.where('slug').equals(attrs.slug).first();
                        if (slugExists) {
                            return new Response(400, {}, { error: 'Slug must be unique' });
                        }
                    }

                    const updatedJob = {
                        ...existingJob,
                        ...attrs,
                        updatedAt: new Date()
                    };

                    await db.jobs.update(id, updatedJob);
                    const job = await db.jobs.get(id);

                    return job;
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to update job' });
                }
            });

            this.patch('/jobs/:id/archive', async (_schema, request) => {
                try {
                    const { id } = request.params;
                    const existingJob = await db.jobs.get(id);
                    if (!existingJob) {
                        return new Response(404, {}, { error: 'Job not found' });
                    }

                    const updatedJob = {
                        ...existingJob,
                    }
                    updatedJob.status = 'archived', // Fixed spelling
                        updatedJob.isArchived = true,   // Fixed spelling
                        updatedJob.updatedAt = new Date()

                    await db.jobs.put(updatedJob);

                    // Return the updated job object so frontend can update state
                    return new Response(200, {}, { job: updatedJob });
                } catch (error) {
                    console.error('Archive error:', error);
                    return new Response(500, {}, { error: 'Failed to archive job' });
                }
            });

            // Also add the unarchive endpoint
            this.patch('/jobs/:id/unarchive', async (_schema, request) => {
                try {
                    const { id } = request.params;
                    const existingJob = await db.jobs.get(id);
                    if (!existingJob) {
                        return new Response(404, {}, { error: 'Job not found' });
                    }

                    const updatedJob = {
                        ...existingJob,
                    };
                    updatedJob.status = 'active', // Fixed spelling
                        updatedJob.isArchived = false,   // Fixed spelling
                        updatedJob.updatedAt = new Date()

                    await db.jobs.put(updatedJob);

                    // Return the updated job object so frontend can update state
                    return new Response(200, {}, { job: updatedJob });
                } catch (error) {
                    console.error('Unarchive error:', error);
                    return new Response(500, {}, { error: 'Failed to unarchive job' });
                }
            });

            // DELETE /api/jobs/:id - Delete job
            this.delete('/jobs/:id', async (_schema, request) => {
                try {
                    const { id } = request.params;

                    const existingJob = await db.jobs.get(id);
                    if (!existingJob) {
                        return new Response(404, {}, { error: 'Job not found' });
                    }

                    await db.jobs.delete(id);

                    return new Response(200, {}, { message: 'Job deleted successfully' });
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to delete job' });
                }
            });

            // GET /api/jobs/filters/options - Get available filter options
            this.get('/jobs/filters/options', async () => {
                try {
                    const allJobs = await db.jobs.toArray();

                    const statuses = [...new Set(allJobs.map(job => job.status).filter(Boolean))];
                    const allTags = allJobs.flatMap(job => job.tags || []);
                    const tags = [...new Set(allTags.filter(tag => typeof tag === 'string'))];
                    const departments = [...new Set(allJobs.map(job => job.department).filter(Boolean))];
                    const locations = [...new Set(allJobs.map(job => job.location).filter(Boolean))];

                    return {
                        statuses,
                        tags,
                        departments,
                        locations
                    };
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to fetch filter options' });
                }
            });
            // GET /api/jobs/search - Search jobs (for modal - simplified)
            this.get('/jobs/archive', async (_schema) => {
                try {
                    const allJobs = await db.jobs.toArray();
                    const filteredJobs = allJobs.filter((job) => job.status !== 'active');
                    return filteredJobs;
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to fetch filtered jobs' });
                }
            });

            this.get('/candidates', async (_schema, request) => {
                try {
                    const allCandidates = await db.candidates.toArray();

                    // Normalize query params
                    const getParam = (param: string, def: string) => {
                        const val = request.queryParams[param];
                        if (Array.isArray(val)) return val[0] || def;
                        return val ?? def;
                    };

                    const search = getParam('search', '').toLowerCase();
                    const stage = getParam('stage', '');
                    const jobId = getParam('jobId', '');
                    const tags = getParam('tags', '').split(',').filter(tag => tag);

                    const page = Number(getParam('page', '1')) || 1;
                    const pageSize = Number(getParam('pageSize', '50')) || 50;
                    const sort = getParam('sort', 'appliedDate_desc');

                    // Filter candidates
                    let filteredCandidates = allCandidates.filter(candidate => {
                        // Search in name and email
                        if (search) {
                            const searchTerm = search.toLowerCase();
                            const matches =
                                candidate.firstName.toLowerCase().includes(searchTerm) ||
                                candidate.lastName.toLowerCase().includes(searchTerm) ||
                                candidate.email.toLowerCase().includes(searchTerm);
                            if (!matches) return false;
                        }

                        // Filter by stage
                        if (stage && candidate.stage !== stage) return false;

                        // Filter by job
                        if (jobId && candidate.jobId !== jobId) return false;

                        // Filter by tags
                        if (tags.length > 0 && candidate.tags.length) {
                            const hasTag = tags.some(tag =>
                                candidate.tags.some((candidateTag: string) =>
                                    candidateTag.toLowerCase().includes(tag.toLowerCase())
                                )
                            );
                            if (!hasTag) return false;
                        }

                        return true;
                    });

                    // Sort candidates
                    filteredCandidates.sort((a, b) => {
                        switch (sort) {
                            case 'name_asc':
                                return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
                            case 'name_desc':
                                return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
                            case 'appliedDate_asc':
                                return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
                            case 'appliedDate_desc':
                                return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
                            case 'rating_asc':
                                return (a.rating || 0) - (b.rating || 0);
                            case 'rating_desc':
                                return (b.rating || 0) - (a.rating || 0);
                            default:
                                return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
                        }
                    });

                    // Pagination
                    const totalCount = filteredCandidates.length;
                    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
                    const startIndex = (page - 1) * pageSize;
                    const endIndex = startIndex + pageSize;
                    const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

                    const response: CandidatesResponse = {
                        candidates: paginatedCandidates,
                        totalCount,
                        totalPages,
                        currentPage: page,
                        hasNext: page < totalPages,
                        hasPrev: page > 1
                    };

                    return new Response(200, {}, response);

                } catch (error) {
                    console.error('Error fetching candidates:', error);
                    return new Response(500, {}, { error: 'Failed to fetch candidates' });
                }
            });

            // Get candidate by ID
            this.get('/candidates/:id', async (_schema, request) => {
                try {
                    const { id } = request.params;
                    const candidate = await db.candidates.where('id').equals(id).first();
                    if (!candidate) {
                        return new Response(404, {}, { error: 'Candidate not found' });
                    }

                    return candidate;
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to fetch candidate' });
                }
            });

            // Update candidate stage
            // In your MirageJS route for PATCH /candidates/:id/stage
            this.patch('/candidates/:id/stage', async (_schema, request) => {
                try {
                    const { id } = request.params;
                    const { stage } = JSON.parse(request.requestBody);

                    console.log('🟡 Mirage: Updating candidate stage', { id, stage });

                    // Validate stage
                    const validStages = ['applied', 'screening', 'interview', 'technical', 'offer', 'hired', 'rejected'];
                    if (!validStages.includes(stage)) {
                        return new Response(400, {}, {
                            error: `Invalid stage: ${stage}. Must be one of: ${validStages.join(', ')}`
                        });
                    }

                    const candidate = await db.candidates.where('id').equals(id).first();
                    if (!candidate) {
                        console.log('🔴 Mirage: Candidate not found', id);
                        return new Response(404, {}, { error: 'Candidate not found' });
                    }

                    console.log('🟢 Mirage: Candidate found', candidate);

                    const updatedCandidate = {
                        ...candidate,
                        stage,
                        updatedAt: new Date().toISOString()
                    };

                    await db.candidates.update(id, updatedCandidate);

                    console.log('🟢 Mirage: Candidate updated successfully');
                    return updatedCandidate;

                } catch (error) {
                    console.error('🔴 Mirage: Error updating candidate stage:', error);
                    return new Response(500, {}, { error: 'Failed to update candidate stage' });
                }
            });

            // Get candidate statistics
            this.get('/candidates/stats', async (_schema, request) => {
                try {
                    const allCandidates = await db.candidates.toArray();
                    const jobId = request.queryParams.jobId;

                    let candidates = allCandidates;
                    if (jobId) {
                        candidates = candidates.filter(c => c.jobId === jobId);
                    }

                    const stats = {
                        total: candidates.length,
                        byStage: {
                            applied: candidates.filter(c => c.stage === 'applied').length,
                            screening: candidates.filter(c => c.stage === 'screening').length,
                            interview: candidates.filter(c => c.stage === 'interview').length,
                            technical: candidates.filter(c => c.stage === 'technical').length,
                            offer: candidates.filter(c => c.stage === 'offer').length,
                            hired: candidates.filter(c => c.stage === 'hired').length,
                            rejected: candidates.filter(c => c.stage === 'rejected').length,
                        },
                        averageRating: candidates.length > 0
                            ? candidates.reduce((sum, c) => sum + (c.rating || 0), 0) / candidates.length
                            : 0
                    };

                    return stats;
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to fetch candidate stats' });
                }
            });
            this.get('/candidates', async (_schema, request) => {
                try {
                    const allCandidates = await db.candidates.toArray();

                    // Normalize query params
                    const getParam = (param: string, def: string) => {
                        const val = request.queryParams[param];
                        if (Array.isArray(val)) return val[0] || def;
                        return val ?? def;
                    };

                    const search = getParam('search', '').toLowerCase();
                    const stage = getParam('stage', '');
                    const jobId = getParam('jobId', '');
                    const tags = getParam('tags', '').split(',').filter(tag => tag);

                    const page = Number(getParam('page', '1')) || 1;
                    const pageSize = Number(getParam('pageSize', '50')) || 50;
                    const sort = getParam('sort', 'appliedDate_desc');

                    // Filter candidates
                    let filteredCandidates = allCandidates.filter(candidate => {
                        // Search in name and email
                        if (search) {
                            const searchTerm = search.toLowerCase();
                            const matches =
                                candidate.firstName.toLowerCase().includes(searchTerm) ||
                                candidate.lastName.toLowerCase().includes(searchTerm) ||
                                candidate.email.toLowerCase().includes(searchTerm);
                            if (!matches) return false;
                        }

                        // Filter by stage
                        if (stage && candidate.stage !== stage) return false;

                        // Filter by job
                        if (jobId && candidate.jobId !== jobId) return false;

                        // Filter by tags
                        if (tags.length > 0 && candidate.tags.length) {
                            const hasTag = tags.some(tag =>
                                candidate.tags.some((candidateTag: string) =>
                                    candidateTag.toLowerCase().includes(tag.toLowerCase())
                                )
                            );
                            if (!hasTag) return false;
                        }

                        return true;
                    });

                    // Sort candidates
                    filteredCandidates.sort((a, b) => {
                        switch (sort) {
                            case 'name_asc':
                                return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
                            case 'name_desc':
                                return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
                            case 'appliedDate_asc':
                                return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
                            case 'appliedDate_desc':
                                return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
                            case 'rating_asc':
                                return (a.rating || 0) - (b.rating || 0);
                            case 'rating_desc':
                                return (b.rating || 0) - (a.rating || 0);
                            default:
                                return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
                        }
                    });

                    // Pagination
                    const totalCount = filteredCandidates.length;
                    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
                    const startIndex = (page - 1) * pageSize;
                    const endIndex = startIndex + pageSize;
                    const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

                    const response: CandidatesResponse = {
                        candidates: paginatedCandidates,
                        totalCount,
                        totalPages,
                        currentPage: page,
                        hasNext: page < totalPages,
                        hasPrev: page > 1
                    };

                    return new Response(200, {}, response);

                } catch (error) {
                    console.error('Error fetching candidates:', error);
                    return new Response(500, {}, { error: 'Failed to fetch candidates' });
                }
            });

            // Get candidate by ID
            this.get('/candidates/:id', async (_schema, request) => {
                try {
                    const { id } = request.params;
                    const candidate = await db.candidates.where('id').equals(id).first();

                    if (!candidate) {
                        return new Response(404, {}, { error: 'Candidate not found' });
                    }

                    return candidate;
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to fetch candidate' });
                }
            });

            // Update candidate stage
            this.patch('/candidates/:id/stage', async (_schema, request) => {
                try {
                    const { id } = request.params;
                    const { stage } = JSON.parse(request.requestBody);

                    const candidate = await db.candidates.where('id').equals(id).first();
                    if (!candidate) {
                        return new Response(404, {}, { error: 'Candidate not found' });
                    }

                    const updatedCandidate = {
                        ...candidate,
                        stage,
                        updatedAt: new Date().toISOString()
                    };

                    await db.candidates.update(id, updatedCandidate);
                    return updatedCandidate;

                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to update candidate stage' });
                }
            });

            // Get candidate statistics
            this.get('/candidates/stats', async (_schema, request) => {
                try {
                    const allCandidates = await db.candidates.toArray();
                    const jobId = request.queryParams.jobId;

                    let candidates = allCandidates;
                    if (jobId) {
                        candidates = candidates.filter(c => c.jobId === jobId);
                    }

                    const stats = {
                        total: candidates.length,
                        byStage: {
                            applied: candidates.filter(c => c.stage === 'applied').length,
                            screening: candidates.filter(c => c.stage === 'screening').length,
                            interview: candidates.filter(c => c.stage === 'interview').length,
                            technical: candidates.filter(c => c.stage === 'technical').length,
                            offer: candidates.filter(c => c.stage === 'offer').length,
                            hired: candidates.filter(c => c.stage === 'hired').length,
                            rejected: candidates.filter(c => c.stage === 'rejected').length,
                        },
                        averageRating: candidates.length > 0
                            ? candidates.reduce((sum, c) => sum + (c.rating || 0), 0) / candidates.length
                            : 0
                    };

                    return stats;
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to fetch candidate stats' });
                }
            });

            this.get('/assessments', async (_schema, request) => {
                try {
                    const allAssessments = await db.assessments.toArray();

                    // Normalize query params
                    const getParam = (param: string, def: string) => {
                        const val = request.queryParams[param];
                        if (Array.isArray(val)) return val[0] || def;
                        return val ?? def;
                    };

                    const jobId = getParam('jobId', '');
                    const page = Number(getParam('page', '1')) || 1;
                    const pageSize = Number(getParam('pageSize', '10')) || 10;

                    // Filter by job ID if provided
                    let filteredAssessments = allAssessments;
                    if (jobId) {
                        filteredAssessments = filteredAssessments.filter(assessment =>
                            assessment.jobId === jobId
                        );
                    }

                    // Sort by creation date (newest first)
                    filteredAssessments.sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );

                    // Pagination
                    const totalCount = filteredAssessments.length;
                    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
                    const startIndex = (page - 1) * pageSize;
                    const endIndex = startIndex + pageSize;
                    const paginatedAssessments = filteredAssessments.slice(startIndex, endIndex);

                    return new Response(200, {}, {
                        assessments: paginatedAssessments,
                        totalCount,
                        totalPages,
                        currentPage: page,
                        hasNext: page < totalPages,
                        hasPrev: page > 1
                    });

                } catch (error) {
                    console.error('Error fetching assessments:', error);
                    return new Response(500, {}, { error: 'Failed to fetch assessments' });
                }
            });

            this.get('/assessments/:id', async (_schema, request) => {
                try {
                    const { id } = request.params;
                    const assessment = await db.assessments.get(id);

                    if (!assessment) {
                        return new Response(404, {}, { error: 'Assessment not found' });
                    }

                    return assessment;
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to fetch assessment' });
                }
            });

            this.get('/assessments/job/:jobId', async (_schema, request) => {
                try {
                    const { jobId } = request.params;
                    const assessment = await db.assessments
                        .where('jobId')
                        .equals(jobId)
                        .first();

                    if (!assessment) {
                        return new Response(404, {}, { error: 'Assessment not found for this job' });
                    }

                    return assessment;
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to fetch assessment' });
                }
            });

            this.post('/assessments', async (_schema, request) => {
                try {
                    const attrs = JSON.parse(request.requestBody) as Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>;

                    if (!attrs.title || !attrs.jobId) {
                        return new Response(400, {}, { error: 'Title and jobId are required' });
                    }

                    const existingAssessment = await db.assessments
                        .where('jobId')
                        .equals(attrs.jobId)
                        .first();

                    if (existingAssessment) {
                        return new Response(400, {}, { error: 'Assessment already exists for this job' });
                    }

                    const newAssessment: Assessment = {
                        id: uuidv4(), // Keep UUID for API consistency
                        ...attrs,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };

                    const id = await db.assessments.add(newAssessment);
                    const createdAssessment = await db.assessments.get(id);

                    return new Response(201, {}, createdAssessment);
                } catch (error) {
                    console.error('Error creating assessment:', error);
                    return new Response(500, {}, { error: 'Failed to create assessment' });
                }
            });

            this.put('/assessments/:id', async (_schema, request) => {
                try {
                    const { id } = request.params;
                    const attrs = JSON.parse(request.requestBody) as Partial<Assessment>;

                    const existingAssessment = await db.assessments.get(id);
                    if (!existingAssessment) {
                        return new Response(404, {}, { error: 'Assessment not found' });
                    }

                    const updatedAssessment = {
                        ...existingAssessment,
                        ...attrs,
                        updatedAt: new Date().toISOString(),
                    };

                    await db.assessments.update(id, updatedAssessment);
                    const assessment = await db.assessments.get(id);

                    return assessment;
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to update assessment' });
                }
            });

            this.delete('/assessments/:id', async (_schema, request) => {
                try {
                    const { id } = request.params;

                    const existingAssessment = await db.assessments.get(id);
                    if (!existingAssessment) {
                        return new Response(404, {}, { error: 'Assessment not found' });
                    }

                    await db.assessments.delete(id);

                    // Delete all candidate responses for this assessment
                    const responses = await db.candidateResponses
                        .where('assessmentId')
                        .equals(id)
                        .toArray();

                    for (const response of responses) {
                        await db.candidateResponses.delete(response.id!);
                    }

                    return new Response(200, {}, { message: 'Assessment deleted successfully' });
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to delete assessment' });
                }
            });

            // CANDIDATE RESPONSE ROUTES

            // POST /api/assessments/:assessmentId/responses - Submit candidate response
            this.post('/assessments/:assessmentId/responses', async (_schema, request) => {
                try {
                    const { assessmentId } = request.params;
                    const attrs = JSON.parse(request.requestBody) as Omit<CandidateResponse, 'id' | 'submittedAt'>;

                    if (!attrs.candidateId || !attrs.responses) {
                        return new Response(400, {}, { error: 'Candidate ID and responses are required' });
                    }

                    const assessment = await db.assessments.where('id').equals(assessmentId).first();
                    if (!assessment) {
                        return new Response(404, {}, { error: 'Assessment not found' });
                    }

                    const candidate = await db.candidates.where('id').equals(attrs.candidateId).first();
                    if (!candidate) {
                        return new Response(404, {}, { error: 'Candidate not found' });
                    }

                    const existingResponse = await db.candidateResponses
                        .where('[assessmentId+candidateId]')
                        .equals([assessmentId, attrs.candidateId])
                        .first();

                    if (existingResponse) {
                        return new Response(400, {}, { error: 'Response already submitted for this assessment' });
                    }

                    const newResponse: CandidateResponse & { id?: string } = {
                        id: uuidv4(),
                        ...attrs,
                        assessmentId,
                        submittedAt: new Date().toISOString(),
                    };

                    const id = await db.candidateResponses.add(newResponse);
                    const createdResponse = await db.candidateResponses.get(id);

                    return new Response(201, {}, createdResponse);
                } catch (error) {
                    console.error('Error submitting response:', error);
                    return new Response(500, {}, { error: 'Failed to submit response' });
                }
            });

            // GET /api/assessments/:assessmentId/responses - Get all responses for an assessment
            this.get('/assessments/:assessmentId/responses', async (_schema, request) => {
                try {
                    const { assessmentId } = request.params;

                    const responses = await db.candidateResponses
                        .where('assessmentId')
                        .equals(assessmentId)
                        .toArray();

                    const enrichedResponses = await Promise.all(
                        responses.map(async (response) => {
                            const candidate = await db.candidates
                                .where('id')
                                .equals(response.candidateId)
                                .first();
                            return {
                                ...response,
                                candidate: candidate ? {
                                    id: candidate.id,
                                    firstName: candidate.firstName,
                                    lastName: candidate.lastName,
                                    email: candidate.email,
                                    stage: candidate.stage
                                } : null
                            };
                        })
                    );

                    return new Response(200, {}, { responses: enrichedResponses });
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to fetch responses' });
                }
            });

            // GET /api/assessments/:assessmentId/responses/:candidateId - Get specific candidate response
            this.get('/assessments/:assessmentId/responses/:candidateId', async (_schema, request) => {
                try {
                    const { assessmentId, candidateId } = request.params;

                    const response = await db.candidateResponses
                        .where('[assessmentId+candidateId]')
                        .equals([assessmentId, candidateId])
                        .first();

                    if (!response) {
                        return new Response(404, {}, { error: 'Response not found' });
                    }

                    const candidate = await db.candidates
                        .where('id')
                        .equals(candidateId)
                        .first();

                    const enrichedResponse = {
                        ...response,
                        candidate: candidate ? {
                            id: candidate.id,
                            firstName: candidate.firstName,
                            lastName: candidate.lastName,
                            email: candidate.email,
                            stage: candidate.stage
                        } : null
                    };

                    return enrichedResponse;
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to fetch response' });
                }
            });

            // GET /api/candidates/:candidateId/responses - Get all responses for a candidate
            this.get('/candidates/:candidateId/responses', async (_schema, request) => {
                try {
                    const { candidateId } = request.params;

                    const responses = await db.candidateResponses
                        .where('candidateId')
                        .equals(candidateId)
                        .toArray();

                    const enrichedResponses = await Promise.all(
                        responses.map(async (response) => {
                            const assessment = await db.assessments
                                .where('id')
                                .equals(response.assessmentId)
                                .first();
                            return {
                                ...response,
                                assessment: assessment ? {
                                    id: assessment.id,
                                    title: assessment.title,
                                    description: assessment.description
                                } : null
                            };
                        })
                    );

                    return new Response(200, {}, { responses: enrichedResponses });
                } catch (error) {
                    return new Response(500, {}, { error: 'Failed to fetch candidate responses' });
                }
            });
            this.passthrough();
        }
        
    });
    

}