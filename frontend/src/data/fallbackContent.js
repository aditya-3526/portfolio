/**
 * Fallback content so the UI renders even if the backend/DB isn't up yet.
 * Mirrors backend/data/portfolioContent.js. The app fetches /api/portfolio
 * first and only uses this if the request fails.
 */
const about = {
  name: "Aditya Aryan",
  title: "ML / AI Engineer & SDE",
  tagline: "Building intelligent systems at the intersection of ML, data, and software engineering.",
  location: "India",
  email: "adityaaryann.work@gmail.com",
  github: "https://github.com/aditya-3526",
  linkedin: "https://linkedin.com/in/aditya-aryan-168738288",
  huggingface: "https://huggingface.co/aditya3526",
  education: {
    institute: "Thapar Institute of Engineering and Technology (TIET), Patiala",
    degree: "B.E. Computer Engineering",
    graduation: "2027",
  },
  summary: [
    "I'm a Computer Engineering student at Thapar Institute of Engineering and Technology (TIET), Patiala, who enjoys building software and intelligent systems that solve real-world problems.",
    "I work across the stack — training and fine-tuning machine learning models, building data pipelines and analytics, and shipping full-stack applications from first commit to production deployment.",
    "I like turning open-ended problems into clear, measurable outcomes, and I care about systems that are reliable, well-reasoned, and genuinely useful. I'm a curious, fast-learning generalist who's happiest connecting technical depth with real-world impact.",
    "My work spans LLM and agentic pipelines, RAG and NLP, customer and business analytics, and full-stack engineering — and I'm always looking for the next interesting thing to build.",
  ],
};

const skills = [
  {
    category: "Machine Learning & AI",
    icon: "brain",
    items: ["PyTorch", "TensorFlow", "scikit-learn", "HuggingFace Transformers", "LLM Fine-tuning", "LoRA / PEFT", "RAG Systems", "mBERT", "XLM-RoBERTa", "Qwen2.5"],
  },
  {
    category: "Data Analytics & BI",
    icon: "chart",
    items: ["Python", "Pandas", "NumPy", "SQL", "Tableau", "Power BI", "BG/NBD Modeling", "CLV / RFM Segmentation", "A/B Testing"],
  },
  {
    category: "Software Engineering",
    icon: "code",
    items: ["Python", "JavaScript", "FastAPI", "Docker", "Git / GitHub", "HuggingFace Spaces", "REST APIs", "Multi-agent Architectures"],
  },
  {
    category: "NLP & Generative AI",
    icon: "sparkles",
    items: ["Gemini 2.5 Flash", "OpenAI / OpenRouter", "FAISS", "Sentence Embeddings", "Prompt Engineering", "AST-based SQL parsing (sqlglot)", "NL-to-SQL"],
  },
  {
    category: "Business & Strategy",
    icon: "briefcase",
    items: ["Consulting Case Frameworks", "Market Sizing", "Go-to-Market Strategy", "P&L Analysis", "Sales Force Effectiveness", "HCP Segmentation"],
  },
  {
    category: "Infrastructure & Tools",
    icon: "server",
    items: ["Linux / Bash", "Google Colab", "Jupyter", "VS Code", "LaTeX", "Notion", "Apify"],
  },
];

const projects = [
  {
    slug: "sentryflow",
    name: "SentryFlow",
    category: "ML Systems",
    blurb: "Guarded multi-agent NL-to-SQL pipeline with a deterministic controller, AST-parsed SQL safety, and a budget ledger.",
    description:
      "SentryFlow is a production-grade natural-language-to-SQL system built around safety and determinism. A deterministic controller orchestrates multiple agents; every generated SQL statement is parsed with sqlglot and validated against an AST-level allowlist before execution, preventing destructive or unauthorized queries. A budget ledger caps token spend per session, and output gates validate results before they reach the user. Deployed as a Docker container on HuggingFace Spaces.",
    highlights: [
      "Deterministic multi-agent controller (not free-form agent chaining)",
      "AST-parsed SQL safety layer via sqlglot with an operation allowlist",
      "Per-session budget ledger to cap LLM token spend",
      "Output validation gates before returning results",
      "Containerized and deployed to HuggingFace Spaces",
    ],
    stack: ["Python", "sqlglot", "Gemini 2.5 Flash", "Docker", "FastAPI"],
    metrics: [
      { label: "SQL Safety", value: "AST" },
      { label: "Deploy", value: "Docker / HF" },
      { label: "LLM", value: "Gemini 2.5" },
    ],
    links: { live: "https://huggingface.co/spaces/aditya3526/sentryflow", repo: "https://github.com/aditya-3526" },
    featured: true,
  },
  {
    slug: "toxicity-classifier",
    name: "Multilingual Toxicity Classifier",
    category: "NLP / Research",
    blurb: "Benchmarked mBERT, XLM-RoBERTa, and Qwen2.5-0.5B+LoRA on a 330K-sample English+Hinglish corpus across six toxicity labels.",
    description:
      "A research project comparing three transformer approaches to multilingual toxicity detection on a merged 330,000-sample English and Hinglish corpus annotated with six toxicity labels. We fine-tuned mBERT and XLM-RoBERTa, and used parameter-efficient LoRA fine-tuning on Qwen2.5-0.5B. The work was written up as a full IEEE-style research paper with reproducible methodology, presentation scripts, and a documented GitHub repository.",
    highlights: [
      "330K-sample merged English + Hinglish corpus, six toxicity labels",
      "mBERT achieved F1 of 0.7182",
      "XLM-RoBERTa achieved F1 of 0.7270",
      "Qwen2.5-0.5B + LoRA achieved the best F1 of 0.7362",
      "Full IEEE-style paper and reproducible pipeline",
    ],
    stack: ["PyTorch", "HuggingFace", "LoRA / PEFT", "mBERT", "XLM-RoBERTa", "Qwen2.5"],
    metrics: [
      { label: "Best F1", value: "0.7362" },
      { label: "Corpus", value: "330K" },
      { label: "Labels", value: "6" },
    ],
    links: { repo: "https://github.com/aditya-3526" },
    team: "Aditya Aryan, Mansehaj Preet Singh, Tanisha Dua, Ritisha Sidana (supervised by Kanupriya Mam)",
    featured: true,
  },
  {
    slug: "novamed",
    name: "NovaMed Pharmaceuticals",
    category: "Data Analytics",
    blurb: "HCP segmentation and territory clustering for a pharma sales force, with a VP-facing Tableau dashboard.",
    description:
      "An end-to-end pharma sales-force-effectiveness analytics project. I segmented healthcare professionals (HCPs) and clustered sales territories to identify high-value prescribers and underserved regions, then built a VP-facing Tableau dashboard to surface the findings. This project maps directly to the sales-force-effectiveness (SFE) domain that consulting firms like ZS Associates and ProcDNA work in.",
    highlights: [
      "HCP segmentation to identify high-value prescriber groups",
      "Territory clustering to find underserved regions",
      "VP-facing Tableau dashboard for executive decision-making",
      "Direct match to pharma SFE consulting domain",
    ],
    stack: ["Python", "Tableau", "k-Means", "Pandas"],
    metrics: [
      { label: "Method", value: "HCP Seg." },
      { label: "Output", value: "Tableau" },
      { label: "Domain", value: "Pharma SFE" },
    ],
    links: { repo: "https://github.com/aditya-3526/NovaMed-Pharmaceuticals" },
    featured: true,
  },
  {
    slug: "prguardian",
    name: "PRGuardian",
    category: "DevOps / Agentic AI",
    blurb: "Merge-consequence intelligence system built for the Lyzr × HackCulture hackathon, with a deterministic risk scorer and secret scanner.",
    description:
      "PRGuardian analyzes the consequences of merging a pull request before it happens. Built on the GitAgent framework for the Lyzr × HackCulture hackathon, it exposes 7 agent skills, computes a deterministic 0–100 merge-risk score, scans for secrets using 14 detection patterns, and posts idempotent review comments (so re-runs never spam the PR).",
    highlights: [
      "7-skill GitAgent framework",
      "Deterministic 0–100 merge-risk scorer",
      "14-pattern secret scanner",
      "Idempotent comment posting (safe re-runs)",
      "Built for Lyzr × HackCulture hackathon",
    ],
    stack: ["Python", "GitAgent", "GitHub API", "Lyzr"],
    metrics: [
      { label: "Skills", value: "7" },
      { label: "Secret Patterns", value: "14" },
      { label: "Risk Score", value: "0–100" },
    ],
    links: { repo: "https://github.com/aditya-3526/prguardian-gitagent" },
    featured: false,
  },
  {
    slug: "churn-analysis",
    name: "Customer Churn Analysis",
    category: "ML / Customer Analytics",
    blurb: "Logistic regression and decision-tree models on the Telco dataset to predict churn risk, with quantified retention savings.",
    description:
      "A customer-churn modeling project on the Telco dataset using logistic regression and a decision tree. The model reached a verified ROC-AUC of 0.843 and accuracy of 0.80. The analysis identified roughly $3,700/month in potential retention savings — framed honestly as a finding that points toward a broader portfolio of retention interventions rather than a single silver bullet.",
    highlights: [
      "Logistic regression + decision tree on Telco churn data",
      "Verified ROC-AUC of 0.843",
      "Accuracy of 0.80",
      "Identified ~$3,700/month in potential retention savings",
      "Framed as a finding pointing to a portfolio of interventions",
    ],
    stack: ["scikit-learn", "Pandas", "Matplotlib", "Logistic Regression"],
    metrics: [
      { label: "ROC-AUC", value: "0.843" },
      { label: "Accuracy", value: "0.80" },
      { label: "Savings", value: "$3.7K/mo" },
    ],
    links: { repo: "https://github.com/aditya-3526/Customer-Churn-Analysis" },
    featured: false,
  },
  {
    slug: "docinsights",
    name: "DocInsights",
    category: "RAG / Document AI",
    blurb: "RAG document-intelligence platform with FAISS flat→IVF auto-upgrade and a safe LLM call wrapper.",
    description:
      "DocInsights is a retrieval-augmented document-intelligence platform. It auto-upgrades its FAISS index from a flat index to an IVF index as the document corpus grows, wraps every model call in a safe_llm_call error-handling layer, and uses all-MiniLM-L6-v2 sentence embeddings. Re-homed and deployed on HuggingFace Spaces using an OpenRouter key.",
    highlights: [
      "FAISS flat→IVF index auto-upgrade as corpus scales",
      "safe_llm_call wrapper for resilient model calls",
      "all-MiniLM-L6-v2 embeddings",
      "Deployed on HuggingFace Spaces via OpenRouter",
    ],
    stack: ["FAISS", "LangChain", "OpenRouter", "HuggingFace Spaces"],
    metrics: [
      { label: "Index", value: "FAISS IVF" },
      { label: "Embeddings", value: "MiniLM" },
      { label: "Deploy", value: "HF Spaces" },
    ],
    links: { repo: "https://github.com/aditya-3526" },
    featured: false,
  },
  {
    slug: "lumiskin",
    name: "LumiSkin",
    category: "Data Analytics",
    blurb: "Customer-lifetime-value and RFM segmentation on the Olist dataset using BG/NBD probabilistic modeling.",
    description:
      "LumiSkin is a customer-analytics project on the Olist e-commerce dataset. It computes customer lifetime value (CLV) and performs RFM (recency, frequency, monetary) segmentation, using BG/NBD probabilistic models to forecast future purchasing behavior and identify the most valuable customer cohorts.",
    highlights: [
      "CLV computation on the Olist dataset",
      "RFM segmentation of the customer base",
      "BG/NBD probabilistic purchase modeling",
    ],
    stack: ["Python", "Lifetimes", "Pandas", "BG/NBD"],
    metrics: [
      { label: "Method", value: "BG/NBD" },
      { label: "Segments", value: "RFM" },
      { label: "Metric", value: "CLV" },
    ],
    links: { repo: "https://github.com/aditya-3526/LumiSkin" },
    featured: false,
  },
  {
    slug: "crm-lite",
    name: "CRM Lite",
    category: "Full-Stack / SaaS",
    blurb: "Full-stack SaaS CRM with a Gemini-powered insights engine, a drag-and-drop deal pipeline, and natural-language customer search.",
    description:
      "CRM Lite is a production-grade SaaS CRM for managing the full customer lifecycle. It pairs a React 19 + TypeScript front end with an Express 5 / MongoDB back end and integrates Google Gemini to generate per-customer engagement scores, churn-risk assessments, and recommendations. Natural-language queries are translated into database filters, deals move across a six-stage drag-and-drop Kanban pipeline, and logged interactions auto-create 3-day follow-up reminders. Ships with 8 pages, 18 REST endpoints, JWT auth, and analytics dashboards.",
    highlights: [
      "Gemini-powered engagement scores, churn risk, and recommendations per customer",
      "Natural-language search translated into database filters",
      "Six-stage drag-and-drop deal pipeline (Kanban)",
      "Interaction logging with automatic 3-day follow-up reminders",
      "8 pages, 18 REST endpoints, JWT auth, analytics dashboards",
    ],
    stack: ["React 19", "TypeScript", "Express 5", "MongoDB", "Google Gemini"],
    metrics: [
      { label: "Endpoints", value: "18" },
      { label: "AI", value: "Gemini" },
      { label: "Auth", value: "JWT" },
    ],
    links: { repo: "https://github.com/aditya-3526/CRM-Customer-Relationship-Management-" },
    featured: false,
  },
  {
    slug: "supply-chain-optimization",
    name: "Supply Chain Optimization",
    category: "Data Analytics",
    blurb: "Logistics-efficiency analysis for bulk cement distribution — delay root-causing, route-utilization clustering, and optimization scenarios.",
    description:
      "A data-driven study of bulk cement distribution logistics. It benchmarks on-time delivery, root-causes delays by geography and seasonality, evaluates cost drivers, and clusters routes by utilization. Scenario simulation shows that peak-season loading-bay bottlenecks — not fleet capacity — are the primary choke points, and that consolidating underutilized short-haul \"ghost runs\" cuts transportation spend while mitigating ~20% of delays recovers hundreds of fleet operating hours.",
    highlights: [
      "On-time delivery benchmarking and delay root-cause analysis",
      "Route-utilization clustering and cost-driver evaluation",
      "Optimization scenario simulation",
      "Identified loading-bay bottlenecks (not fleet capacity) as the key constraint",
      "Mitigating ~20% of delays recovers hundreds of fleet hours",
    ],
    stack: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
    metrics: [
      { label: "Domain", value: "Logistics" },
      { label: "Delay Cut", value: "~20%" },
      { label: "Method", value: "Clustering" },
    ],
    links: { repo: "https://github.com/aditya-3526/Supply-Chain-Optimization" },
    featured: false,
  },
  {
    slug: "ecommerce-profit-optimization",
    name: "E-commerce Profit Optimization",
    category: "Data Analytics",
    blurb: "Margin-rescue analysis on $2.3M of e-commerce sales — discount-cap modeling projected a ~$219K (+76%) profit lift.",
    description:
      "An analysis of $2.30M in e-commerce sales data to find and fix profit leakage in a high-revenue, low-margin (12.47%) retailer. It shows discounts above 20% destroy profitability without driving compensating volume, identifies loss-making furniture subcategories (Tables, Bookcases), and flags the Central region's margin compression from logistics costs. Enforcing a 20% discount cap is projected to add ~$219K in profit — roughly a 76% increase over baseline net profit.",
    highlights: [
      "Analyzed $2.30M in sales; baseline margin 12.47%",
      "Discounts >20% destroy profit without compensating volume",
      "Identified loss-making furniture subcategories",
      "Surfaced regional margin compression in the Central region",
      "20% discount cap → ~$219K (+76%) projected profit",
    ],
    stack: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
    metrics: [
      { label: "Sales", value: "$2.3M" },
      { label: "Profit Lift", value: "+76%" },
      { label: "Discount Cap", value: "20%" },
    ],
    links: { repo: "https://github.com/aditya-3526/E-commerce-Profit-Optimization" },
    featured: false,
  },
  {
    slug: "topsis-text-gen-eval",
    name: "TOPSIS Text-Gen Model Evaluation",
    category: "NLP / Research",
    blurb: "Multi-criteria (TOPSIS) ranking of five pre-trained text-generation models across efficiency and output metrics.",
    description:
      "Applies TOPSIS, a multi-criteria decision-making method, to objectively rank five pre-trained text-generation models — GPT-2, DistilGPT-2, GPT-Neo, T5-base, and BART-large — spanning decoder-only and encoder-decoder architectures. Four metrics (inference time, model size, parameter count, and output length) are normalized and weighted to compute distances from the ideal solution, producing a ranked decision matrix without any fine-tuning.",
    highlights: [
      "TOPSIS multi-criteria ranking of 5 pre-trained models",
      "Compares decoder-only and encoder-decoder architectures",
      "Four criteria: inference time, size, parameter count, output length",
      "Objective model selection without fine-tuning",
    ],
    stack: ["Python", "HuggingFace Transformers", "TOPSIS", "Pandas"],
    metrics: [
      { label: "Models", value: "5" },
      { label: "Criteria", value: "4" },
      { label: "Method", value: "TOPSIS" },
    ],
    links: { repo: "https://github.com/aditya-3526/TOPSIS-Based-Evaluation-of-Pre-trained-Text-Generation-Models" },
    featured: false,
  },
  {
    slug: "credit-card-fraud-detection",
    name: "Credit Card Fraud Detection",
    category: "ML Systems",
    blurb: "End-to-end fraud-detection system with imbalance handling (SMOTE), tree/boosting models, and a React monitoring dashboard.",
    description:
      "An end-to-end ML application that flags fraudulent credit-card transactions in near real time. It handles the heavily imbalanced Kaggle dataset via SMOTE / undersampling, trains and compares Logistic Regression, Random Forest, and XGBoost, and evaluates with precision, recall, F1, and AUC-ROC. A React + Tailwind dashboard on a FastAPI backend surfaces transaction metrics, fraud statistics, and model performance.",
    highlights: [
      "Imbalance handling via SMOTE / undersampling",
      "Logistic Regression, Random Forest, and XGBoost compared",
      "Precision / Recall / F1 / AUC-ROC evaluation",
      "React + Tailwind monitoring dashboard on a FastAPI backend",
    ],
    stack: ["Python", "scikit-learn", "XGBoost", "FastAPI", "React"],
    metrics: [
      { label: "Models", value: "3" },
      { label: "Imbalance", value: "SMOTE" },
      { label: "Eval", value: "AUC-ROC" },
    ],
    links: { repo: "https://github.com/aditya-3526/Credit-card-fraud-detection-system" },
    featured: false,
  },
  {
    slug: "air-pointer",
    name: "Air-Pointer",
    category: "Computer Vision",
    blurb: "Webcam gesture-control interface — hand-tracked cursor, click/scroll gestures, and a virtual drawing canvas.",
    description:
      "Air-Pointer turns a webcam into a touchless interface. Using MediaPipe's hand-landmark model and OpenCV, it tracks the hand in real time and maps gestures to actions: pinch to click, two-finger gestures to scroll, and open palm to lift the drawing pen. Cursor motion is smoothed via interpolation, and a virtual canvas supports color customization. Built from modular components (camera test, hand detection, gesture recognition, main app) and cross-platform across Windows, macOS, and Linux.",
    highlights: [
      "Real-time hand tracking with MediaPipe landmarks",
      "Gesture set: pinch-to-click, two-finger scroll, open-palm pen lift",
      "Smoothed cursor interpolation for fluid motion",
      "Virtual drawing canvas with color customization",
      "Cross-platform across Windows, macOS, and Linux",
    ],
    stack: ["Python", "OpenCV", "MediaPipe", "PyAutoGUI", "NumPy"],
    metrics: [
      { label: "Input", value: "Webcam" },
      { label: "Tracking", value: "MediaPipe" },
      { label: "Platforms", value: "3 OS" },
    ],
    links: { repo: "https://github.com/aditya-3526/Air-Pointer" },
    featured: false,
  },
];

const experience = [
  {
    role: "Data Analyst Intern",
    org: "Raman Enterprises",
    orgDetail: "Regional Distributor, Shree Cement Ltd.",
    period: "2024",
    bullets: [
      "Built Tableau dashboards visualizing plant-level operations and shift-level performance data for distribution leadership.",
      "Translated raw operational CSV data into actionable shift-level KPIs that surfaced efficiency bottlenecks.",
      "Delivered structured reports enabling managers to make faster, evidence-backed inventory and logistics decisions.",
    ],
  },
  {
    role: "Secretary",
    org: "Marketing, Finance & Investment Cell (MFIC)",
    orgDetail: "TIET Patiala",
    period: "2023 – Present",
    bullets: [
      "Progressed from Core Member to Head of Media to Secretary, scaling the cell's presence and membership.",
      "Led cross-functional teams for finance workshops, investment simulations, and consulting case events on campus.",
      "Managed media strategy and content pipelines that grew engagement across the club's digital channels.",
    ],
  },
];

const involvements = [
  {
    title: "Marketing, Finance & Investment Cell (MFIC)",
    role: "Secretary (formerly Head of Media, Core Member)",
    detail: "Led campus finance, marketing, and investment initiatives — workshops, simulations, and case events.",
  },
];

const honors = [
  {
    title: "ZS Campus Beats Case Challenge 2026",
    award: "Top 100 (National)",
    detail: "Finished in the top 100 nationally in ZS Associates' analytics-and-strategy case competition.",
  },
  {
    title: "BrainWars 2026",
    award: "Semi-Finalist",
    detail: "Reached the semi-final stage, demonstrating structured problem decomposition and data-driven recommendations.",
  },
];


const fallbackContent = { about, skills, projects, experience, involvements, honors };
export default fallbackContent;
