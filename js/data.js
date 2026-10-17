// Seed mock data for internships
const INITIAL_INTERNSHIPS = [
  {
    id: "int-001",
    title: "Frontend Engineering Intern",
    company: "ApexCloud Systems",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80",
    domain: "Software Engineering",
    workplaceType: "Remote",
    location: "Remote (Global)",
    stipendAmount: 2500,
    stipendFormatted: "$2,500 / month",
    duration: "3 Months",
    startDate: "Immediate",
    deadline: "2026-11-15",
    postedDate: "2026-10-12",
    experienceLevel: "Beginner to Intermediate",
    openings: 3,
    description: "Join our core UI engineering team to build lightning-fast web applications, real-time analytics dashboards, and interactive user experiences using React, TypeScript, and Tailwind CSS.",
    responsibilities: [
      "Collaborate with product designers to implement pixel-perfect user interfaces.",
      "Optimize web applications for maximum speed, accessibility, and scalability.",
      "Participate in sprint planning, agile standups, and peer code reviews.",
      "Write reusable, clean, and well-documented component libraries."
    ],
    requirements: [
      "Solid understanding of HTML5, modern JavaScript (ES6+), and CSS3.",
      "Experience with modern UI frameworks like React, Next.js, or Vue.",
      "Familiarity with Git/GitHub version control workflows.",
      "Strong communication skills and passion for building user-centric software."
    ],
    perks: [
      "Certificate of Internship & Letter of Recommendation",
      "Flexible working hours across timezones",
      "Mentorship from Principal Software Engineers",
      "Pre-Placement Offer (PPO) potential for top performers"
    ],
    tags: ["React", "TypeScript", "Tailwind CSS", "Remote", "PPO Available"]
  },
  {
    id: "int-002",
    title: "Machine Learning Research Intern",
    company: "NeuroScale AI Labs",
    logo: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=120&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&auto=format&fit=crop&q=80",
    domain: "Data Science & AI",
    workplaceType: "Hybrid",
    location: "San Francisco, CA",
    stipendAmount: 3200,
    stipendFormatted: "$3,200 / month",
    duration: "6 Months",
    startDate: "2026-12-01",
    deadline: "2026-11-20",
    postedDate: "2026-10-14",
    experienceLevel: "Intermediate",
    openings: 2,
    description: "Explore multimodal foundation models, fine-tuning LLMs, and real-time inference optimization for enterprise AI workloads alongside PhD researchers and AI architects.",
    responsibilities: [
      "Perform experiments on LLM evaluation, prompt optimization, and RAG pipelines.",
      "Curate, clean, and benchmark high-volume synthetic datasets.",
      "Implement and evaluate model quantizations (LoRA, QLoRA) for edge devices.",
      "Document findings and co-author technical whitepapers and patents."
    ],
    requirements: [
      "Strong Python proficiency with PyTorch, Hugging Face, and NumPy.",
      "Foundational knowledge of Transformer architectures, embeddings, and vector databases.",
      "Prior coursework or project experience in Machine Learning / Deep Learning.",
      "Familiarity with Docker and Linux development environments."
    ],
    perks: [
      "High-compute GPU cluster access (H100 & A100)",
      "Opportunity to co-publish academic papers",
      "Subsidized housing allowance for non-local candidates",
      "Gourmet lunch and wellness stipends"
    ],
    tags: ["Python", "PyTorch", "LLM", "RAG", "Deep Learning"]
  },
  {
    id: "int-003",
    title: "Product Design (UI/UX) Intern",
    company: "Starlight Digital Studio",
    logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=120&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80",
    domain: "UI/UX Design",
    workplaceType: "Remote",
    location: "Remote (North America / Europe)",
    stipendAmount: 2000,
    stipendFormatted: "$2,000 / month",
    duration: "4 Months",
    startDate: "Immediate",
    deadline: "2026-11-10",
    postedDate: "2026-10-15",
    experienceLevel: "Beginner",
    openings: 1,
    description: "Help craft intuitive, aesthetically compelling digital experiences for fintech and consumer apps. You'll work closely with product managers and engineers throughout design sprints.",
    responsibilities: [
      "Design wireframes, user journeys, and high-fidelity interactive prototypes in Figma.",
      "Conduct user research interviews and synthesize feedback into design iterations.",
      "Contribute to and maintain our growing design tokens and system library.",
      "Create micro-interactions and motion design assets."
    ],
    requirements: [
      "Proficiency in Figma, auto-layout, interactive components, and styles.",
      "A portfolio showcasing at least 2 web or mobile UI/UX case studies.",
      "Understanding of typography, visual hierarchy, color theory, and accessibility (WCAG).",
      "Empathy for user pain points and eagerness to learn."
    ],
    perks: [
      "Annual software tool subscription (Figma Pro, Spline)",
      "1-on-1 portfolio coaching and portfolio reviews",
      "Flexible remote schedule with asynchronous workflows",
      "Full-time conversion review at 90 days"
    ],
    tags: ["Figma", "Design Systems", "Prototyping", "User Research"]
  },
  {
    id: "int-004",
    title: "Backend Engineering Intern",
    company: "FinEdge Technologies",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    domain: "Software Engineering",
    workplaceType: "In-Office",
    location: "New York, NY",
    stipendAmount: 2800,
    stipendFormatted: "$2,800 / month",
    duration: "3 Months",
    startDate: "2026-11-01",
    deadline: "2026-10-31",
    postedDate: "2026-10-10",
    experienceLevel: "Intermediate",
    openings: 4,
    description: "Build robust, low-latency APIs and distributed microservices powering modern fintech transactions. Tackle high concurrency, database optimization, and cloud architecture.",
    responsibilities: [
      "Develop and document RESTful & GraphQL microservices in Go and Node.js.",
      "Design schemas, write optimized SQL queries, and configure caching with Redis.",
      "Implement test suites (unit, integration, load testing) to ensure 99.99% reliability.",
      "Monitor system health using Prometheus, Grafana, and Datadog."
    ],
    requirements: [
      "Good understanding of backend languages (Go, Node.js, Python, or Java).",
      "Knowledge of relational databases (PostgreSQL/MySQL) and ACID principles.",
      "Understanding of HTTP, REST concepts, and authentication (JWT, OAuth2).",
      "Problem-solving mindset with strong data structures and algorithms fundamentals."
    ],
    perks: [
      "Modern Manhattan office with skyline views and catered lunches",
      "Commuter transit card benefit",
      "Direct exposure to enterprise financial architectures",
      "Competitive performance completion bonus"
    ],
    tags: ["Node.js", "Go", "PostgreSQL", "Redis", "APIs"]
  },
  {
    id: "int-005",
    title: "Associate Product Management Intern",
    company: "Kuro Commerce",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    domain: "Product Management",
    workplaceType: "Hybrid",
    location: "Austin, TX",
    stipendAmount: 2200,
    stipendFormatted: "$2,200 / month",
    duration: "6 Months",
    startDate: "2026-11-15",
    deadline: "2026-11-05",
    postedDate: "2026-10-09",
    experienceLevel: "Beginner to Intermediate",
    openings: 2,
    description: "Shape the roadmap for next-gen omnichannel commerce. You will bridge customer requirements, engineering feasibility, and business metrics to ship impactful customer-facing features.",
    responsibilities: [
      "Write clear product requirement documents (PRDs) and user stories.",
      "Analyze funnel drop-offs, user session recordings, and A/B test data.",
      "Coordinate with engineering and marketing teams on launch schedules.",
      "Gather customer feedback through surveys, interviews, and community forums."
    ],
    requirements: [
      "Analytical mindset with familiarity in SQL, Mixpanel, or Google Analytics.",
      "Excellent written communication and presentation abilities.",
      "Ability to break down ambiguous problems into structured roadmaps.",
      "Curiosity about consumer behaviors and marketplace mechanics."
    ],
    perks: [
      "Executive mentorship program with VP of Product",
      "Conference and educational stipend",
      "Hybrid work flexibility (2 days office, 3 days remote)",
      "Employee discount on ecosystem products"
    ],
    tags: ["Product Roadmap", "User Stories", "Analytics", "A/B Testing"]
  },
  {
    id: "int-006",
    title: "Growth & Digital Marketing Intern",
    company: "Verve Media & Tech",
    logo: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=120&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200&auto=format&fit=crop&q=80",
    domain: "Marketing & Growth",
    workplaceType: "Remote",
    location: "Remote",
    stipendAmount: 1600,
    stipendFormatted: "$1,600 / month",
    duration: "3 Months",
    startDate: "Immediate",
    deadline: "2026-11-12",
    postedDate: "2026-10-16",
    experienceLevel: "Beginner",
    openings: 3,
    description: "Execute organic and paid acquisition strategies, content creation, social campaigns, and newsletter funnels to scale user growth across international markets.",
    responsibilities: [
      "Manage and craft content for LinkedIn, Twitter/X, and technical blog channels.",
      "Track and report weekly performance across SEO, CAC, and conversion metrics.",
      "Assist in running growth experiments and landing page copy iterations.",
      "Coordinate influencer partnerships and developer community outreach."
    ],
    requirements: [
      "Creative storytelling skills and crisp copywriting flair.",
      "Familiarity with social media analytics, SEO fundamentals, and Canva.",
      "Self-driven, proactive attitude with high attention to detail.",
      "Enthusiasm for fast-paced tech startups."
    ],
    perks: [
      "Direct work with the founding team and CMO",
      "Remote work setup allowance",
      "Letter of Recommendation and LinkedIn endorsement",
      "Flexible schedule around university exams"
    ],
    tags: ["SEO", "Content Strategy", "Social Media", "Growth Experiments"]
  },
  {
    id: "int-007",
    title: "Cybersecurity Analyst Intern",
    company: "IronFortress Security",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
    domain: "Cybersecurity",
    workplaceType: "Hybrid",
    location: "Boston, MA",
    stipendAmount: 2600,
    stipendFormatted: "$2,600 / month",
    duration: "4 Months",
    startDate: "2026-12-15",
    deadline: "2026-11-25",
    postedDate: "2026-10-11",
    experienceLevel: "Intermediate",
    openings: 2,
    description: "Support our Security Operations Center (SOC) with vulnerability assessments, penetration testing simulations, and cloud threat monitoring.",
    responsibilities: [
      "Triage SIEM alerts, identify anomalous network activities, and report incidents.",
      "Perform automated vulnerability scans and suggest patching remediation.",
      "Review cloud access policies and assist in compliance audits (SOC2, ISO 27001).",
      "Develop security awareness training materials for internal teams."
    ],
    requirements: [
      "Knowledge of networking protocols (TCP/IP, DNS, SSL/TLS, VPN).",
      "Familiarity with security tools like Wireshark, Burp Suite, or Splunk.",
      "Understanding of common security vulnerabilities (OWASP Top 10).",
      "Relevant certifications (CompTIA Security+, CEH) are a plus."
    ],
    perks: [
      "Sponsorship for professional security certification exams",
      "Hands-on red team / blue team war room drills",
      "Competitive stipend and full equipment setup provided",
      "Strong possibility of conversion to full-time junior analyst"
    ],
    tags: ["Network Security", "OWASP", "SIEM", "Penetration Testing"]
  },
  {
    id: "int-008",
    title: "Data Analyst & Business Intelligence Intern",
    company: "OmniMetrics Analytics",
    logo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&auto=format&fit=crop&q=80",
    domain: "Data Science & AI",
    workplaceType: "Remote",
    location: "Remote",
    stipendAmount: 2100,
    stipendFormatted: "$2,100 / month",
    duration: "3 Months",
    startDate: "Immediate",
    deadline: "2026-11-08",
    postedDate: "2026-10-13",
    experienceLevel: "Beginner",
    openings: 2,
    description: "Translate complex datasets into intuitive executive dashboards and actionable business insights. Assist sales, marketing, and finance teams in tracking KPIs.",
    responsibilities: [
      "Build dynamic dashboards in Tableau, Power BI, or Looker.",
      "Clean, transform, and aggregate raw datasets using SQL and Python pandas.",
      "Perform cohort analysis, retention modeling, and churn prediction.",
      "Present weekly insights to cross-department leadership."
    ],
    requirements: [
      "Strong proficiency in SQL for data extraction and joins.",
      "Experience with data visualization tools (Power BI, Tableau, or Metabase).",
      "Basic understanding of statistical concepts and Excel formulas.",
      "Good presentation and storytelling skills with numbers."
    ],
    perks: [
      "Work with modern modern data stacks (Snowflake, dbt)",
      "Flexible asynchronous schedule",
      "Monthly learning stipend for courses and books",
      "Direct business impact on high-growth SaaS metrics"
    ],
    tags: ["SQL", "Tableau", "Power BI", "Data Visualization", "Python"]
  }
];

// Domains list for filter dropdowns
const DOMAINS = [
  "All Domains",
  "Software Engineering",
  "Data Science & AI",
  "UI/UX Design",
  "Product Management",
  "Marketing & Growth",
  "Cybersecurity"
];

// Workplace types
const WORKPLACE_TYPES = [
  "All Types",
  "Remote",
  "Hybrid",
  "In-Office"
];

// Durations
const DURATIONS = [
  "Any Duration",
  "3 Months",
  "4 Months",
  "6 Months"
];
