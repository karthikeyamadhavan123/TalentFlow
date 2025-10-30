import { db } from './dexie';
import type { JobProps } from '@/types';

const departments = [
  'Engineering',
  'Marketing',
  'Sales',
  'Product',
  'Design',
  'HR',
  'Finance',
  'Operations'
];

const locations = [
  'Remote',
  'New York, NY',
  'San Francisco, CA',
  'Austin, TX',
  'Seattle, WA',
  'Boston, MA',
  'Chicago, IL',
  'Los Angeles, CA',
  'Denver, CO',
  'Hybrid - US'
];

const jobTitles = [
  'Senior Frontend Developer',
  'Backend Engineer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Product Manager',
  'UX Designer',
  'UI Designer',
  'Marketing Manager',
  'Sales Development Representative',
  'Account Executive',
  'Data Analyst',
  'Machine Learning Engineer',
  'QA Engineer',
  'Technical Writer',
  'Customer Success Manager',
  'HR Business Partner',
  'Financial Analyst',
  'Operations Manager',
  'Content Writer',
  'Social Media Manager',
  'Brand Designer',
  'Growth Marketing Lead',
  'Engineering Manager',
  'Recruiter',
  'Executive Assistant'
];

const techTags = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'AWS',
  'Docker', 'Kubernetes', 'GraphQL', 'PostgreSQL', 'MongoDB',
  'Vue.js', 'Angular', 'Go', 'Rust', 'Ruby', 'Rails'
];

const generalTags = [
  'Remote', 'Full-time', 'Part-time', 'Contract', 'Senior',
  'Junior', 'Mid-level', 'Leadership', 'IC', 'B2B', 'B2C',
  'Startup', 'Enterprise', 'SaaS'
];

const allTags = [...techTags, ...generalTags];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateJobDescription(title: string, department: string): string {
  return `We are seeking a talented ${title} to join our ${department} team. You will be responsible for driving innovation and excellence in your domain.`;
}

function generateJobs(): JobProps[] {
  const jobs: JobProps[] = [];
  const now = new Date();

  for (let i = 0; i < 25; i++) {
    const title = jobTitles[i];
    const department = departments[i % departments.length];
    const location = locations[i % locations.length];

    // Fixed pattern: first 15 jobs active, last 10 jobs archived
    const status = i < 15 ? 'active' : 'archived';

    // Generate 3-5 random tags
    const tagCount = Math.floor(Math.random() * 3) + 3;
    const tags = getRandomElements(allTags, tagCount);

    // Sequential dates - newer jobs have higher numbers
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - (25 - i)); // Job 1 is oldest, Job 25 is newest

    const updatedAt = new Date(createdAt);

    jobs.push({
      id: `job_${i + 1}`,
      title,
      slug: generateSlug(title),
      status,
      tags,
      order: i + 1, // Sequential order from 1 to 25
      description: generateJobDescription(title, department),
      department,
      location,
      createdAt,
      updatedAt
    });
  }

  return jobs;
}

async function seedJobs() {
  try {
    console.log('🌱 Starting job seeding...');

    // Clear existing jobs
    await db.jobs.clear();
    console.log('🗑️  Cleared existing jobs');

    // Generate and insert jobs
    const jobs = generateJobs();
    await db.jobs.bulkAdd(jobs);

    const activeJobs = jobs.filter(j => j.status === 'active').length;
    const archivedJobs = jobs.filter(j => j.status === 'archived').length;

    console.log(`✅ Successfully seeded ${jobs.length} jobs`);
    console.log(`   - Active jobs: ${activeJobs}`);
    console.log(`   - Archived jobs: ${archivedJobs}`);

    // Display all jobs in sequential order
    console.log('\n📋 All jobs (in sequential order 1-25):');
    jobs.forEach(job => {
      const statusIcon = job.status === 'active' ? '🟢' : '🔴';
      console.log(`   ${job.order}. ${statusIcon} ${job.title}`);
      console.log(`      Department: ${job.department} | Location: ${job.location}`);
      console.log(`      Created: ${job.createdAt.toLocaleDateString()}`);
    });

  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
  }
}

// Run the seed function
seedJobs();