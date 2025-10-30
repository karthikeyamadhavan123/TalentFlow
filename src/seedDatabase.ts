// seedDatabase.ts
import { db } from '@/db/dexie';

// Sample job data - 25 realistic jobs
const sampleJobs = [
  {
    title: "Senior Frontend Developer",
    description: "We are looking for an experienced Frontend Developer to join our team. You will be responsible for building responsive web applications using modern JavaScript frameworks.",
    department: "Engineering",
    location: "San Francisco, CA"
  },
  {
    title: "Backend Engineer - Node.js",
    description: "Join our backend team to build scalable APIs and services. Experience with microservices architecture and cloud platforms is required.",
    department: "Engineering",
    location: "Remote"
  },
  {
    title: "Full Stack Developer",
    description: "Looking for a Full Stack Developer proficient in both frontend and backend technologies. You'll work on end-to-end feature development.",
    department: "Engineering",
    location: "New York, NY"
  },
  {
    title: "DevOps Engineer",
    description: "Join our infrastructure team to build and maintain our cloud infrastructure. Experience with containerization and CI/CD pipelines required.",
    department: "Engineering",
    location: "Austin, TX"
  },
  {
    title: "Data Scientist",
    description: "We're seeking a Data Scientist to analyze complex datasets and build machine learning models to drive business decisions.",
    department: "Data Science",
    location: "Boston, MA"
  },
  {
    title: "UX/UI Designer",
    description: "Create beautiful and intuitive user interfaces for our products. Strong portfolio and experience with design tools required.",
    department: "Design",
    location: "Remote"
  },
  {
    title: "Product Manager",
    description: "Lead product development from conception to launch. Work with engineering, design, and business teams to deliver great products.",
    department: "Product",
    location: "Seattle, WA"
  },
  {
    title: "Mobile Developer - React Native",
    description: "Build cross-platform mobile applications using React Native. Experience with native iOS/Android development is a plus.",
    department: "Engineering",
    location: "Chicago, IL"
  },
  {
    title: "QA Automation Engineer",
    description: "Develop and maintain automated test suites for our web and mobile applications. Experience with testing frameworks required.",
    department: "Engineering",
    location: "Remote"
  },
  {
    title: "Technical Lead",
    description: "Lead a team of developers and drive technical excellence. Strong architecture and leadership skills required.",
    department: "Engineering",
    location: "San Francisco, CA"
  },
  {
    title: "Cloud Architect",
    description: "Design and implement cloud infrastructure solutions. AWS/Azure certifications and architecture experience required.",
    department: "Engineering",
    location: "Remote"
  },
  {
    title: "Machine Learning Engineer",
    description: "Build and deploy machine learning models at scale. Experience with TensorFlow/PyTorch and MLOps practices required.",
    department: "Data Science",
    location: "New York, NY"
  },
  {
    title: "Frontend Engineer - React",
    description: "Build modern web applications using React. Experience with state management and modern build tools required.",
    department: "Engineering",
    location: "Los Angeles, CA"
  },
  {
    title: "Backend Developer - Python",
    description: "Develop robust backend services using Python and Django/Flask. Experience with database design and API development.",
    department: "Engineering",
    location: "Remote"
  },
  {
    title: "Site Reliability Engineer",
    description: "Ensure the reliability and performance of our production systems. Experience with monitoring and incident response required.",
    department: "Engineering",
    location: "Austin, TX"
  },
  {
    title: "Data Engineer",
    description: "Build and maintain data pipelines and warehouses. Experience with ETL processes and big data technologies required.",
    department: "Data Science",
    location: "Boston, MA"
  },
  {
    title: "UI Developer",
    description: "Bridge the gap between design and engineering. Strong CSS skills and attention to detail required.",
    department: "Engineering",
    location: "Remote"
  },
  {
    title: "Senior Product Designer",
    description: "Lead design for key product areas. Experience with user research and design systems required.",
    department: "Design",
    location: "San Francisco, CA"
  },
  {
    title: "API Developer",
    description: "Design and build RESTful APIs. Experience with API design principles and documentation required.",
    department: "Engineering",
    location: "New York, NY"
  },
  {
    title: "Security Engineer",
    description: "Protect our systems and data from security threats. Experience with security testing and incident response required.",
    department: "Engineering",
    location: "Remote"
  },
  {
    title: "Junior Frontend Developer",
    description: "Great opportunity for a junior developer to grow their skills in a supportive environment. HTML/CSS/JavaScript knowledge required.",
    department: "Engineering",
    location: "Chicago, IL"
  },
  {
    title: "Database Administrator",
    description: "Manage and optimize our database systems. Experience with SQL and database performance tuning required.",
    department: "Engineering",
    location: "Remote"
  },
  {
    title: "Technical Product Manager",
    description: "Work closely with engineering teams on technical products. Strong technical background and product sense required.",
    department: "Product",
    location: "Seattle, WA"
  },
  {
    title: "Software Engineer - Java",
    description: "Build enterprise-grade applications using Java and Spring Boot. Experience with microservices architecture required.",
    department: "Engineering",
    location: "Remote"
  },
  {
    title: "Lead UX Researcher",
    description: "Conduct user research and usability testing to inform product decisions. Experience with research methodologies required.",
    department: "Design",
    location: "San Francisco, CA"
  }
];

// Candidate data generators
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 
  'William', 'Elizabeth', 'David', 'Susan', 'Richard', 'Jessica', 'Joseph', 'Sarah',
  'Thomas', 'Karen', 'Charles', 'Nancy', 'Christopher', 'Lisa', 'Daniel', 'Betty',
  'Matthew', 'Dorothy', 'Anthony', 'Sandra', 'Mark', 'Ashley', 'Donald', 'Kimberly',
  'Steven', 'Donna', 'Paul', 'Emily', 'Andrew', 'Michelle', 'Joshua', 'Carol',
  'Kevin', 'Amanda', 'Brian', 'Melissa', 'George', 'Deborah', 'Timothy', 'Stephanie',
  'Ronald', 'Rebecca', 'Jason', 'Laura', 'Edward', 'Sharon', 'Jeffrey', 'Cynthia',
  'Ryan', 'Kathleen', 'Jacob', 'Amy', 'Gary', 'Angela', 'Nicholas', 'Shirley',
  'Eric', 'Emma', 'Jonathan', 'Anna', 'Stephen', 'Brenda', 'Larry', 'Pamela',
  'Justin', 'Nicole', 'Scott', 'Samantha', 'Brandon', 'Katherine', 'Benjamin', 'Christine',
  'Samuel', 'Helen', 'Gregory', 'Debra', 'Alexander', 'Rachel', 'Patrick', 'Carolyn',
  'Frank', 'Janet', 'Raymond', 'Maria', 'Jack', 'Catherine', 'Dennis', 'Heather',
  'Jerry', 'Diane', 'Tyler', 'Olivia', 'Aaron', 'Julie', 'Jose', 'Joyce',
  'Adam', 'Victoria', 'Nathan', 'Kelly', 'Henry', 'Christina', 'Douglas', 'Lauren',
  'Zachary', 'Joan', 'Peter', 'Evelyn', 'Kyle', 'Judith', 'Ethan', 'Megan',
  'Walter', 'Cheryl', 'Noah', 'Andrea', 'Jeremy', 'Hannah', 'Christian', 'Martha',
  'Keith', 'Jacqueline', 'Roger', 'Frances', 'Terry', 'Gloria', 'Gerald', 'Ann',
  'Harold', 'Teresa', 'Sean', 'Kathryn', 'Austin', 'Sara', 'Arthur', 'Janice',
  'Lawrence', 'Jean', 'Jesse', 'Alice', 'Dylan', 'Madison', 'Bryan', 'Doris',
  'Joe', 'Abigail', 'Jordan', 'Julia', 'Billy', 'Judy', 'Bruce', 'Grace',
  'Albert', 'Denise', 'Willie', 'Amber', 'Gabriel', 'Marilyn', 'Logan', 'Beverly',
  'Alan', 'Danielle', 'Juan', 'Theresa', 'Wayne', 'Sophia', 'Roy', 'Marie',
  'Ralph', 'Diana', 'Randy', 'Brittany', 'Philip', 'Natalie', 'Eugene', 'Isabella',
  'Vincent', 'Charlotte', 'Russell', 'Rose', 'Elijah', 'Alexis', 'Louis', 'Kayla'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza',
  'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers',
  'Long', 'Ross', 'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry', 'Russell',
  'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson', 'Barnes', 'Gonzales',
  'Fisher', 'Vasquez', 'Simmons', 'Romero', 'Jordan', 'Patterson', 'Alexander',
  'Hamilton', 'Graham', 'Reynolds', 'Griffin', 'Wallace', 'Moreno', 'West',
  'Cole', 'Hayes', 'Bryant', 'Herrera', 'Gibson', 'Ellis', 'Tran', 'Medina',
  'Aguilar', 'Stevens', 'Murray', 'Ford', 'Castro', 'Marshall', 'Owens', 'Harrison',
  'Fernandez', 'Mcdonald', 'Woods', 'Washington', 'Kennedy', 'Wells', 'Vargas',
  'Henry', 'Chen', 'Freeman', 'Webb', 'Tucker', 'Guzman', 'Burns', 'Crawford',
  'Olson', 'Simpson', 'Porter', 'Hunter', 'Gordon', 'Mendez', 'Silva', 'Shaw',
  'Snyder', 'Mason', 'Dixon', 'Munoz', 'Hubbard', 'Hart', 'Larson', 'Frazier'
];

const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com'];
const skills = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes', 
  'TypeScript', 'Vue', 'Angular', 'PHP', 'Ruby', 'Go', 'Rust', 'SQL', 'MongoDB',
  'PostgreSQL', 'GraphQL', 'Redis', 'Jenkins', 'Git', 'CI/CD', 'Agile', 'Scrum',
  'HTML5', 'CSS3', 'SASS', 'Webpack', 'Babel', 'Express', 'Django', 'Flask',
  'Spring', 'Hibernate', 'MySQL', 'Oracle', 'Azure', 'GCP', 'Linux', 'Windows',
  'MacOS', 'iOS', 'Android', 'Swift', 'Kotlin', 'React Native', 'Flutter',
  'Machine Learning', 'AI', 'Data Analysis', 'Tableau', 'Power BI', 'Excel',
  'Photoshop', 'Figma', 'Sketch', 'UI/UX', 'Wireframing', 'Prototyping',
  'Project Management', 'JIRA', 'Confluence', 'Slack', 'Teams', 'Zoom',
  'Customer Service', 'Sales', 'Marketing', 'SEO', 'SEM', 'Content Writing',
  'Technical Writing', 'Documentation', 'Training', 'Mentoring', 'Leadership'
];

const stages = ['applied', 'screening', 'interview', 'technical', 'offer', 'hired', 'rejected'];

// Simple UUID generator
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generate a unique slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Generate random tags based on job type
function generateTags(title: string): string[] {
  const tags: string[] = [];
  
  if (title.toLowerCase().includes('frontend')) {
    tags.push('React', 'JavaScript', 'TypeScript', 'CSS', 'HTML');
  } else if (title.toLowerCase().includes('backend')) {
    tags.push('Node.js', 'Python', 'Java', 'API', 'Database');
  } else if (title.toLowerCase().includes('full stack')) {
    tags.push('React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS');
  } else if (title.toLowerCase().includes('devops')) {
    tags.push('AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux');
  } else if (title.toLowerCase().includes('mobile')) {
    tags.push('React Native', 'iOS', 'Android', 'TypeScript');
  } else if (title.toLowerCase().includes('data')) {
    tags.push('Python', 'SQL', 'Machine Learning', 'Analysis');
  } else if (title.toLowerCase().includes('ux')) {
    tags.push('Figma', 'UI/UX', 'Prototyping', 'Research');
  } else if (title.toLowerCase().includes('product')) {
    tags.push('Strategy', 'Roadmap', 'User Research', 'Agile');
  } else if (title.toLowerCase().includes('qa')) {
    tags.push('Testing', 'Automation', 'Selenium', 'Quality');
  } else {
    tags.push('Technology', 'Software', 'Development');
  }
  
  // Add some random additional tags
  const allTags = ['Remote', 'Flexible', 'Senior', 'Junior', 'Team Lead', 'Agile', 'Scrum'];
  const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
  if (!tags.includes(randomTag)) {
    tags.push(randomTag);
  }
  
  return tags.slice(0, 4); // Return max 4 tags
}

function generateRandomName() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return { firstName, lastName };
}

function generateEmail(firstName: string, lastName: string): string {
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const variations = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}@${domain}`,
    `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}@${domain}`
  ];
  return variations[Math.floor(Math.random() * variations.length)];
}

function generatePhone(): string {
  return `+1-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function generateCandidateTags(): string[] {
  const numTags = Math.floor(Math.random() * 4) + 2; // 2-5 tags
  const shuffled = [...skills].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numTags);
}

function generateRating(): number {
  // More candidates with average ratings, fewer with extreme ratings
  const rand = Math.random();
  if (rand < 0.1) return 1; // 10% 1-star
  if (rand < 0.3) return 2; // 20% 2-star
  if (rand < 0.6) return 3; // 30% 3-star
  if (rand < 0.85) return 4; // 25% 4-star
  return 5; // 15% 5-star
}

function generateCandidate(jobId: string, jobTitle: string) {
  const { firstName, lastName } = generateRandomName();
  const email = generateEmail(firstName, lastName);
  
  // Generate applied date within last 90 days
  const appliedDate = new Date();
  appliedDate.setDate(appliedDate.getDate() - Math.floor(Math.random() * 90));
  
  // Weighted stage distribution (more in early stages)
  const stageWeights = [0.25, 0.20, 0.15, 0.12, 0.10, 0.10, 0.08];
  const random = Math.random();
  let stageIndex = 0;
  let weightSum = 0;
  
  for (let i = 0; i < stageWeights.length; i++) {
    weightSum += stageWeights[i];
    if (random <= weightSum) {
      stageIndex = i;
      break;
    }
  }
  
  const stage = stages[stageIndex] as "applied" | "screening" | "interview" | "technical" | "offer" | "hired" | "rejected";
  const rating = generateRating();
  const tags = generateCandidateTags();
  
  // Generate last contact date (if applicable)
  let lastContactDate = null;
  if (stage !== 'applied') {
    const daysSinceApplied = Math.floor((new Date().getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
    const contactOffset = Math.floor(Math.random() * daysSinceApplied);
    lastContactDate = new Date(appliedDate.getTime() + contactOffset * 24 * 60 * 60 * 1000);
  }

  // Generate notes based on rating and stage
  let notes = '';
  if (Math.random() > 0.5) {
    const noteTemplates = [
      `Strong experience in ${tags[0]}.`,
      `Good cultural fit for the team.`,
      `Requires additional technical screening.`,
      `Excellent communication skills.`,
      `Previous experience in similar role.`,
      `Looking for career growth opportunities.`,
      `Available to start immediately.`,
      `Requires visa sponsorship.`,
      `Local candidate - no relocation needed.`,
      `Great portfolio and project examples.`
    ];
    notes = noteTemplates[Math.floor(Math.random() * noteTemplates.length)];
  }

  return {
    id: generateUUID(),
    firstName,
    lastName,
    email,
    phone: generatePhone(),
    jobId,
    jobTitle,
    stage,
    rating,
    tags,
    appliedDate: appliedDate.toISOString(),
    lastContactDate: lastContactDate?.toISOString() || null,
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Function to seed the database
export async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Checking if database needs seeding...');
    
    // Check if jobs already exist
    const existingJobsCount = await db.jobs.count();
    const existingCandidatesCount = await db.candidates.count();
    
    let jobsCreated = 0;
    let candidatesCreated = 0;

    // Seed jobs if none exist
    if (existingJobsCount === 0) {
      console.log('📦 No jobs found, seeding jobs...');
      
      const jobsToAdd = sampleJobs.map((job, index) => {
        const slug = generateSlug(job.title);
        const tags = generateTags(job.title);
        
        return {
          id: generateUUID(),
          title: job.title,
          slug: slug,
          status: 'active' as const,
          description: job.description,
          department: job.department,
          location: job.location,
          tags: tags,
          order: index + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          isArchived: false
        };
      });

      await db.jobs.bulkAdd(jobsToAdd);
      jobsCreated = jobsToAdd.length;
      console.log(`✅ Successfully seeded ${jobsCreated} jobs into the database`);
    } else {
      console.log(`📊 Database already has ${existingJobsCount} jobs, skipping job seeding`);
    }

    // Seed candidates if none exist
    if (existingCandidatesCount === 0) {
      console.log('👥 No candidates found, seeding candidates...');
      
      const jobs = await db.jobs.toArray();
      const totalCandidates = 1200;
      const candidatesPerJob = Math.ceil(totalCandidates / jobs.length);
      
      const allCandidates = [];
      
      // Generate candidates for each job
      for (const job of jobs) {
        for (let i = 0; i < candidatesPerJob; i++) {
          if (allCandidates.length >= totalCandidates) break;
          
          const candidate = generateCandidate(job.id, job.title);
          allCandidates.push(candidate);
          
          // Update progress in console
          if (allCandidates.length % 100 === 0) {
            console.log(`📝 Generated ${allCandidates.length}/${totalCandidates} candidates...`);
          }
        }
      }
      
      console.log(`📥 Adding ${allCandidates.length} candidates to database...`);
      
      // Batch insert in chunks to avoid memory issues
      const chunkSize = 100;
      for (let i = 0; i < allCandidates.length; i += chunkSize) {
        const chunk = allCandidates.slice(i, i + chunkSize);
        await db.candidates.bulkAdd(chunk);
        
        if (i % 500 === 0) {
          console.log(`💾 Added ${Math.min(i + chunkSize, allCandidates.length)}/${allCandidates.length} candidates...`);
        }
      }
      
      candidatesCreated = allCandidates.length;
      console.log(`✅ Successfully seeded ${candidatesCreated} candidates into the database`);
    } else {
      console.log(`📊 Database already has ${existingCandidatesCount} candidates, skipping candidate seeding`);
    }

    if (jobsCreated > 0 || candidatesCreated > 0) {
      console.log(`🎉 Database seeding completed: ${jobsCreated} jobs and ${candidatesCreated} candidates added`);
    } else {
      console.log('📊 Database already seeded, no new data added');
    }
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}