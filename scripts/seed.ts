import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/careersaathi";
const DB_NAME = "careersaathi";

const jobPostings = [
  {
    title: "Senior Frontend Engineer",
    company: "Nexora Technologies",
    companyLogoUrl: "",
    location: "San Francisco, CA",
    category: "Engineering",
    employmentType: "full-time" as const,
    salaryRange: "$150,000 – $200,000",
    shortDescription: "Build high-performance React applications powering Nexora's analytics dashboard used by Fortune 500 companies.",
    fullDescription: "We are looking for a Senior Frontend Engineer to join our core product team. You will lead the development of our analytics dashboard, working closely with design and data teams.\n\nResponsibilities:\n- Architect and build React/TypeScript applications with complex state management\n- Optimize rendering performance for data-heavy visualizations\n- Mentor junior engineers and conduct code reviews\n- Collaborate with UX designers to implement pixel-perfect interfaces\n- Drive technical decisions and maintain coding standards\n\nRequirements:\n- 5+ years of experience with React and TypeScript\n- Strong understanding of web performance optimization\n- Experience with charting libraries (D3.js, Recharts, or similar)\n- Familiarity with Next.js and server-side rendering\n- Excellent communication skills",
    postedAt: new Date("2026-07-10"),
  },
  {
    title: "Product Designer",
    company: "Lumina Design Co.",
    companyLogoUrl: "",
    location: "New York, NY",
    category: "Design",
    employmentType: "full-time" as const,
    salaryRange: "$120,000 – $160,000",
    shortDescription: "Shape the user experience for Lumina's suite of creative tools used by 2M+ designers worldwide.",
    fullDescription: "Lumina Design Co. is seeking a Product Designer to help define and refine the user experience of our creative tool suite.\n\nResponsibilities:\n- Lead end-to-end design process from research to high-fidelity prototypes\n- Conduct user research and usability testing\n- Create wireframes, user flows, and interactive prototypes in Figma\n- Work with engineering to ensure design intent is preserved in implementation\n- Contribute to and maintain our design system\n\nRequirements:\n- 3+ years of product design experience\n- Strong portfolio demonstrating UX thinking and visual design\n- Expert-level Figma skills\n- Experience with design systems at scale\n- User research and testing methodology knowledge",
    postedAt: new Date("2026-07-12"),
  },
  {
    title: "Growth Marketing Manager",
    company: "Pulse Health",
    companyLogoUrl: "",
    location: "Austin, TX",
    category: "Marketing",
    employmentType: "full-time" as const,
    salaryRange: "$100,000 – $140,000",
    shortDescription: "Drive user acquisition and retention strategies for a fast-growing digital health platform.",
    fullDescription: "Pulse Health is a digital health platform connecting patients with personalized wellness programs. We need a Growth Marketing Manager to scale our user base.\n\nResponsibilities:\n- Develop and execute multi-channel growth strategies (paid, organic, partnerships)\n- Analyze funnel metrics and optimize conversion rates at each stage\n- Manage a monthly marketing budget of $200K+\n- Build and lead A/B testing programs across landing pages and email campaigns\n- Collaborate with product team on growth-related feature development\n\nRequirements:\n- 4+ years in growth/performance marketing\n- Deep expertise in Google Ads, Meta Ads, and attribution modeling\n- Strong analytical skills with experience in Mixpanel, Amplitude, or similar\n- Healthcare or wellness industry experience is a plus\n- Data-driven mindset with creative problem-solving ability",
    postedAt: new Date("2026-07-08"),
  },
  {
    title: "Backend Engineer (Node.js)",
    company: "Vectrix AI",
    companyLogoUrl: "",
    location: "Remote",
    category: "Engineering",
    employmentType: "remote" as const,
    salaryRange: "$130,000 – $180,000",
    shortDescription: "Build scalable APIs and data pipelines for an AI-powered document processing platform.",
    fullDescription: "Vectrix AI processes millions of documents daily using cutting-edge ML models. We need a Backend Engineer to build and maintain our API infrastructure.\n\nResponsibilities:\n- Design and implement RESTful APIs using Node.js and TypeScript\n- Build data processing pipelines handling 10M+ documents/day\n- Optimize database queries and implement caching strategies\n- Write comprehensive tests and maintain CI/CD pipelines\n- Participate in on-call rotation and incident response\n\nRequirements:\n- 3+ years of backend development with Node.js\n- Experience with MongoDB, PostgreSQL, or similar databases\n- Understanding of message queues (RabbitMQ, Kafka)\n- Familiarity with containerization (Docker, Kubernetes)\n- Strong problem-solving skills and attention to detail",
    postedAt: new Date("2026-07-14"),
  },
  {
    title: "Data Scientist",
    company: "Meridian Analytics",
    companyLogoUrl: "",
    location: "Chicago, IL",
    category: "Data Science",
    employmentType: "full-time" as const,
    salaryRange: "$140,000 – $185,000",
    shortDescription: "Build predictive models and derive insights from large-scale financial datasets.",
    fullDescription: "Meridian Analytics helps financial institutions make data-driven decisions. We are looking for a Data Scientist to join our modeling team.\n\nResponsibilities:\n- Develop and deploy machine learning models for risk assessment\n- Analyze large datasets to identify patterns and business opportunities\n- Build dashboards and visualizations for stakeholder communication\n- Collaborate with engineering to productionize models\n- Stay current with ML research and evaluate new techniques\n\nRequirements:\n- MS/PhD in Statistics, Mathematics, Computer Science, or related field\n- 3+ years of experience in data science or machine learning\n- Proficiency in Python, scikit-learn, TensorFlow or PyTorch\n- Strong SQL skills and experience with big data tools\n- Excellent communication and presentation skills",
    postedAt: new Date("2026-07-11"),
  },
  {
    title: "DevOps Engineer",
    company: "CloudStack Systems",
    companyLogoUrl: "",
    location: "Seattle, WA",
    category: "DevOps",
    employmentType: "full-time" as const,
    salaryRange: "$135,000 – $175,000",
    shortDescription: "Design and maintain cloud infrastructure for a platform serving 50M+ monthly active users.",
    fullDescription: "CloudStack Systems provides enterprise cloud solutions. We need a DevOps Engineer to scale our infrastructure.\n\nResponsibilities:\n- Design and maintain AWS/GCP infrastructure using Terraform\n- Implement and manage CI/CD pipelines (GitHub Actions, Jenkins)\n- Monitor system performance and implement alerting solutions\n- Manage Kubernetes clusters and container orchestration\n- Drive infrastructure-as-code best practices\n\nRequirements:\n- 4+ years of DevOps/SRE experience\n- Expert knowledge of AWS or GCP services\n- Strong Terraform and Kubernetes experience\n- Scripting proficiency in Bash and Python\n- Understanding of networking, security, and compliance",
    postedAt: new Date("2026-07-13"),
  },
  {
    title: "Sales Development Representative",
    company: "Orbit CRM",
    companyLogoUrl: "",
    location: "Boston, MA",
    category: "Sales",
    employmentType: "full-time" as const,
    salaryRange: "$55,000 – $75,000 + Commission",
    shortDescription: "Generate qualified leads and build pipeline for Orbit's AI-powered CRM platform.",
    fullDescription: "Orbit CRM is an AI-powered customer relationship management platform. We are hiring SDRs to join our growing sales team.\n\nResponsibilities:\n- Prospect and qualify inbound and outbound leads\n- Conduct outreach via email, phone, and LinkedIn\n- Schedule meetings and demos for Account Executives\n- Maintain accurate records in Salesforce\n- Meet or exceed monthly quota of qualified meetings\n\nRequirements:\n- 1+ years of sales or business development experience\n- Excellent written and verbal communication\n- Comfortable with cold outreach and rejection\n- Experience with Salesforce or similar CRM tools\n- Self-motivated with a growth mindset",
    postedAt: new Date("2026-07-09"),
  },
  {
    title: "UX Research Intern",
    company: "Lumina Design Co.",
    companyLogoUrl: "",
    location: "New York, NY",
    category: "Design",
    employmentType: "internship" as const,
    salaryRange: "$30/hour",
    shortDescription: "Support user research initiatives and help shape the future of creative tooling.",
    fullDescription: "Join Lumina's UX Research team as an intern and gain hands-on experience in user research methodologies.\n\nResponsibilities:\n- Assist in planning and conducting user interviews\n- Help analyze qualitative and quantitative research data\n- Create research reports and presentations\n- Support usability testing sessions\n- Contribute to persona and journey map development\n\nRequirements:\n- Currently pursuing a degree in HCI, Psychology, Design, or related field\n- Familiarity with user research methods\n- Strong analytical and communication skills\n- Attention to detail and curiosity about user behavior\n- Available for 3-6 months, 20-40 hours per week",
    postedAt: new Date("2026-07-15"),
  },
  {
    title: "Product Manager",
    company: "Nexora Technologies",
    companyLogoUrl: "",
    location: "San Francisco, CA",
    category: "Product",
    employmentType: "full-time" as const,
    salaryRange: "$160,000 – $210,000",
    shortDescription: "Own the product roadmap for Nexora's enterprise analytics platform.",
    fullDescription: "Nexora Technologies is seeking a Product Manager to drive strategy and execution for our flagship analytics platform.\n\nResponsibilities:\n- Define product vision and strategy aligned with business goals\n- Prioritize features based on customer feedback, data analysis, and market trends\n- Write detailed PRDs and collaborate closely with engineering and design\n- Conduct competitive analysis and market research\n- Present product updates to leadership and stakeholders\n\nRequirements:\n- 5+ years of product management experience in B2B SaaS\n- Technical background or ability to communicate effectively with engineers\n- Experience with analytics or data products\n- Strong analytical and prioritization skills\n- Excellent storytelling and stakeholder management",
    postedAt: new Date("2026-07-07"),
  },
  {
    title: "Part-Time Content Writer",
    company: "Pulse Health",
    companyLogoUrl: "",
    location: "Remote",
    category: "Marketing",
    employmentType: "part-time" as const,
    salaryRange: "$40 – $60/hour",
    shortDescription: "Create engaging health and wellness content for Pulse Health's blog and social media channels.",
    fullDescription: "Pulse Health is looking for a part-time Content Writer to create compelling health and wellness content.\n\nResponsibilities:\n- Write 4-6 blog posts per month on health and wellness topics\n- Create social media content for Instagram, Twitter, and LinkedIn\n- Research trending health topics and suggest content ideas\n- Optimize content for SEO\n- Collaborate with the marketing team on content calendar\n\nRequirements:\n- 2+ years of content writing experience\n- Knowledge of health and wellness industry\n- Strong SEO writing skills\n- Portfolio of published articles\n- Ability to translate complex medical concepts into accessible content",
    postedAt: new Date("2026-07-16"),
  },
  {
    title: "Financial Analyst",
    company: "Meridian Analytics",
    companyLogoUrl: "",
    location: "Chicago, IL",
    category: "Finance",
    employmentType: "full-time" as const,
    salaryRange: "$85,000 – $115,000",
    shortDescription: "Analyze financial data and build models to support strategic decision-making.",
    fullDescription: "Meridian Analytics is hiring a Financial Analyst to join our finance team.\n\nResponsibilities:\n- Build and maintain financial models for forecasting and budgeting\n- Analyze revenue trends and provide actionable insights\n- Prepare monthly financial reports for leadership\n- Support M&A due diligence and valuation analysis\n- Collaborate with business units on financial planning\n\nRequirements:\n- 2+ years of financial analysis experience\n- Advanced Excel and financial modeling skills\n- Experience with SQL and data visualization tools\n- CFA or CPA certification is a plus\n- Strong attention to detail and analytical thinking",
    postedAt: new Date("2026-07-06"),
  },
  {
    title: "HR Coordinator",
    company: "CloudStack Systems",
    companyLogoUrl: "",
    location: "Seattle, WA",
    category: "Human Resources",
    employmentType: "full-time" as const,
    salaryRange: "$60,000 – $80,000",
    shortDescription: "Support HR operations including onboarding, benefits, and employee engagement.",
    fullDescription: "CloudStack Systems is looking for an HR Coordinator to support our growing team.\n\nResponsibilities:\n- Coordinate new hire onboarding and orientation programs\n- Manage employee benefits administration\n- Support recruitment activities including scheduling and coordination\n- Maintain HR records and ensure compliance\n- Plan and execute employee engagement events\n\nRequirements:\n- 1+ years of HR experience\n- Knowledge of HR policies and employment law\n- Experience with HRIS systems (BambooHR, Workday, etc.)\n- Excellent organizational and communication skills\n- Detail-oriented with ability to handle confidential information",
    postedAt: new Date("2026-07-05"),
  },
  {
    title: "Customer Support Lead",
    company: "Orbit CRM",
    companyLogoUrl: "",
    location: "Boston, MA",
    category: "Customer Support",
    employmentType: "full-time" as const,
    salaryRange: "$70,000 – $95,000",
    shortDescription: "Lead a team of support specialists and ensure exceptional customer experience.",
    fullDescription: "Orbit CRM is seeking a Customer Support Lead to manage our support team and improve customer satisfaction.\n\nResponsibilities:\n- Lead and mentor a team of 6-8 support specialists\n- Develop and optimize support processes and documentation\n- Handle escalated customer issues with empathy and efficiency\n- Analyze support metrics and report on team performance\n- Collaborate with product team on customer feedback\n\nRequirements:\n- 3+ years of customer support experience, 1+ in a leadership role\n- Experience with support tools (Zendesk, Intercom, etc.)\n- Strong problem-solving and communication skills\n- Ability to manage multiple priorities in a fast-paced environment\n- Empathetic, patient, and customer-focused mindset",
    postedAt: new Date("2026-07-04"),
  },
  {
    title: "Mobile Engineer (React Native)",
    company: "Pulse Health",
    companyLogoUrl: "",
    location: "Austin, TX",
    category: "Engineering",
    employmentType: "full-time" as const,
    salaryRange: "$125,000 – $165,000",
    shortDescription: "Build cross-platform mobile experiences for Pulse Health's patient-facing wellness app.",
    fullDescription: "Pulse Health needs a Mobile Engineer to build and enhance our React Native mobile application.\n\nResponsibilities:\n- Develop and maintain cross-platform mobile app using React Native\n- Implement push notifications, offline sync, and health data integrations\n- Optimize app performance and reduce crash rates\n- Write unit and integration tests\n- Collaborate with backend team on API design\n\nRequirements:\n- 3+ years of React Native development experience\n- Experience publishing apps to App Store and Google Play\n- Knowledge of native iOS/Android development is a plus\n- Familiarity with health data frameworks (HealthKit, Google Fit)\n- Strong debugging and performance optimization skills",
    postedAt: new Date("2026-07-15"),
  },
  {
    title: "Machine Learning Engineer",
    company: "Vectrix AI",
    companyLogoUrl: "",
    location: "Remote",
    category: "Engineering",
    employmentType: "remote" as const,
    salaryRange: "$160,000 – $220,000",
    shortDescription: "Deploy and optimize ML models that power intelligent document processing at scale.",
    fullDescription: "Vectrix AI is looking for a Machine Learning Engineer to productionize our ML models.\n\nResponsibilities:\n- Deploy and optimize ML models for document classification and extraction\n- Build model training pipelines and experiment tracking infrastructure\n- Monitor model performance in production and implement retraining strategies\n- Optimize inference latency and throughput\n- Collaborate with research team to bring new models to production\n\nRequirements:\n- 3+ years of ML engineering experience\n- Strong Python skills and experience with PyTorch or TensorFlow\n- Experience with MLOps tools (MLflow, Kubeflow, SageMaker)\n- Understanding of NLP and computer vision models\n- Experience with model serving and optimization (ONNX, TensorRT)",
    postedAt: new Date("2026-07-14"),
  },
  {
    title: "Full Stack Engineer",
    company: "Orbit CRM",
    companyLogoUrl: "",
    location: "Boston, MA",
    category: "Engineering",
    employmentType: "full-time" as const,
    salaryRange: "$120,000 – $160,000",
    shortDescription: "Build features across the entire stack for Orbit's AI-powered CRM platform.",
    fullDescription: "Orbit CRM is hiring a Full Stack Engineer to work across our Next.js frontend and Node.js backend.\n\nResponsibilities:\n- Build end-to-end features from database schema to UI implementation\n- Design and implement RESTful APIs and GraphQL endpoints\n- Write clean, maintainable TypeScript code with comprehensive tests\n- Participate in architecture discussions and code reviews\n- Contribute to our component library and design system\n\nRequirements:\n- 3+ years of full-stack development experience\n- Strong proficiency in TypeScript, React, and Node.js\n- Experience with relational and NoSQL databases\n- Understanding of authentication and authorization patterns\n- Good understanding of web accessibility (WCAG)",
    postedAt: new Date("2026-07-12"),
  },
  {
    title: "Brand Designer",
    company: "Vectrix AI",
    companyLogoUrl: "",
    location: "Remote",
    category: "Design",
    employmentType: "remote" as const,
    salaryRange: "$95,000 – $130,000",
    shortDescription: "Define and evolve Vectrix AI's visual identity across all touchpoints.",
    fullDescription: "Vectrix AI is looking for a Brand Designer to own our visual identity.\n\nResponsibilities:\n- Develop and maintain brand guidelines\n- Create marketing materials, presentations, and social media assets\n- Design landing pages and campaign visuals\n- Collaborate with product design team on brand consistency\n- Create illustrations and iconography for product and marketing\n\nRequirements:\n- 3+ years of brand/visual design experience\n- Strong portfolio showing brand identity work\n- Proficiency in Figma, Illustrator, and Photoshop\n- Understanding of typography, color theory, and layout principles\n- Motion design skills are a plus",
    postedAt: new Date("2026-07-10"),
  },
  {
    title: "QA Engineer",
    company: "Nexora Technologies",
    companyLogoUrl: "",
    location: "San Francisco, CA",
    category: "Engineering",
    employmentType: "full-time" as const,
    salaryRange: "$110,000 – $145,000",
    shortDescription: "Ensure product quality through automated testing and QA processes for enterprise analytics.",
    fullDescription: "Nexora Technologies is hiring a QA Engineer to improve our product quality.\n\nResponsibilities:\n- Design and implement automated test suites (Cypress, Playwright)\n- Create and maintain test plans and test cases\n- Perform manual exploratory testing when needed\n- Set up and maintain CI/CD test pipelines\n- Collaborate with developers on testability improvements\n\nRequirements:\n- 3+ years of QA engineering experience\n- Strong experience with test automation frameworks\n- Knowledge of API testing tools (Postman, REST Assured)\n- Understanding of CI/CD pipelines and DevOps practices\n- Attention to detail and strong analytical thinking",
    postedAt: new Date("2026-07-08"),
  },
  {
    title: "Technical Writer",
    company: "CloudStack Systems",
    companyLogoUrl: "",
    location: "Remote",
    category: "Engineering",
    employmentType: "part-time" as const,
    salaryRange: "$50 – $70/hour",
    shortDescription: "Create clear, comprehensive documentation for CloudStack's cloud infrastructure platform.",
    fullDescription: "CloudStack Systems is looking for a Technical Writer to improve our developer documentation.\n\nResponsibilities:\n- Write and maintain API documentation, guides, and tutorials\n- Create onboarding documentation for new users\n- Work with engineering teams to understand technical concepts\n- Maintain documentation site infrastructure\n- Review and edit existing documentation for clarity and accuracy\n\nRequirements:\n- 2+ years of technical writing experience\n- Understanding of cloud infrastructure concepts\n- Experience with documentation tools (GitBook, Docusaurus)\n- Ability to translate complex technical concepts into clear writing\n- Familiarity with Markdown, Git, and developer workflows",
    postedAt: new Date("2026-07-03"),
  },
  {
    title: "Data Engineer",
    company: "Meridian Analytics",
    companyLogoUrl: "",
    location: "Chicago, IL",
    category: "Data Science",
    employmentType: "full-time" as const,
    salaryRange: "$125,000 – $165,000",
    shortDescription: "Build and maintain data pipelines and infrastructure for financial analytics at scale.",
    fullDescription: "Meridian Analytics needs a Data Engineer to build robust data infrastructure.\n\nResponsibilities:\n- Design and build ETL/ELT pipelines using modern data stack\n- Manage and optimize data warehouse (Snowflake/BigQuery)\n- Implement data quality monitoring and alerting\n- Build real-time streaming pipelines with Kafka\n- Collaborate with data scientists on feature engineering\n\nRequirements:\n- 3+ years of data engineering experience\n- Proficiency in Python and SQL\n- Experience with Airflow, dbt, or similar orchestration tools\n- Knowledge of cloud data platforms (Snowflake, BigQuery, Redshift)\n- Understanding of data modeling and warehouse design principles",
    postedAt: new Date("2026-07-11"),
  },
];

async function seed() {
  console.log("🌱 Starting seed process...\n");

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB\n");

    const db = client.db(DB_NAME);

    // Clear existing data
    await db.collection("jobPosting").deleteMany({});
    console.log("  Cleared existing job postings");

    // Insert job postings
    const result = await db.collection("jobPosting").insertMany(jobPostings);
    console.log(`  ✅ Inserted ${result.insertedCount} job postings\n`);

    // Create demo user via Better Auth
    console.log("Creating demo user...");
    const authInstance = betterAuth({
      baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      secret: process.env.BETTER_AUTH_SECRET || "dev-secret-change-in-production",
      database: mongodbAdapter(db, { client }),
      emailAndPassword: { enabled: true },
    });

    // Check if demo user exists
    const existingUser = await db.collection("user").findOne({ email: "demo@careersaathi.app" });
    if (!existingUser) {
      try {
        await authInstance.api.signUpEmail({
          body: {
            name: "Demo User",
            email: "demo@careersaathi.app",
            password: "demo123456",
          },
        });
        console.log("  ✅ Demo user created (demo@careersaathi.app / demo123456)\n");
      } catch (err) {
        console.log("  ⚠️  Demo user may already exist or creation failed:", err);
      }
    } else {
      console.log("  ℹ️  Demo user already exists\n");
    }

    console.log("🎉 Seed completed successfully!");
    console.log("\nDemo credentials:");
    console.log("  Email: demo@careersaathi.app");
    console.log("  Password: demo123456");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
