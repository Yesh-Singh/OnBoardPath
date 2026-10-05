// Central Mock Data Store for OnboardPath

export const INITIAL_PERSONAS = {
  aanya: {
    id: 'aanya',
    name: 'Aanya Mehta',
    role: 'Software Engineer',
    department: 'Engineering',
    location: 'Bengaluru HQ',
    workType: 'Hybrid / On-site',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    manager: 'Priya Sharma (Engineering Director)',
    buddy: 'Rahul Verma (Senior Frontend Engineer)',
    startDate: 'September 22, 2026',
    personalizationChips: [
      'Sandbox repository setup',
      'HQ safety walk',
      'Engineering resources',
      'Bengaluru HQ access pass'
    ],
    scopeRationale: 'Your path includes developer sandbox access and Bengaluru campus protocols based on your role in Engineering and location at Bengaluru HQ.',
    initialTasks: [
      {
        id: 'task-1',
        title: 'Welcome Call with Manager',
        category: 'Day 1 — Getting Started',
        day: 1,
        status: 'Completed',
        description: '30-minute introductory call with Priya Sharma to discuss 30-60-90 day expectations.',
        estimatedTime: '30 min',
        required: true,
        source: {
          title: 'Manager Onboarding Guidelines',
          section: 'Initial Sync & Expectations'
        },
        steps: [
          'Join Microsoft Teams link sent in welcome email',
          'Review team structure and high-level roadmap',
          'Confirm key contacts and buddy introduction'
        ]
      },
      {
        id: 'task-2',
        title: 'MFA & Identity Setup',
        category: 'Day 1 — Getting Started',
        day: 1,
        status: 'Completed',
        description: 'Enable Multi-Factor Authentication on corporate Microsoft account and security token.',
        estimatedTime: '15 min',
        required: true,
        source: {
          title: 'IT Setup Guide',
          section: 'MFA & Security'
        },
        steps: [
          'Download Authenticator App on mobile device',
          'Scan QR code on identity portal (id.onboardpath.corp)',
          'Save emergency recovery codes in secure location'
        ]
      },
      {
        id: 'task-3',
        title: 'Security & Compliance Basics',
        category: 'Day 1 — Getting Started',
        day: 1,
        status: 'Completed',
        description: 'Complete mandatory training on data privacy, credential protection, and phishing hygiene.',
        estimatedTime: '25 min',
        required: true,
        source: {
          title: 'Security Handbook',
          section: 'Security Basics'
        },
        steps: [
          'Watch 15-minute compliance module video',
          'Complete 5-question comprehension quiz',
          'Digitally sign Acceptable Use Policy'
        ]
      },
      {
        id: 'task-4',
        title: 'Laptop & Email Setup',
        category: 'Day 2 — Getting Set Up',
        day: 2,
        status: 'Pending',
        description: 'Configure corporate email client, VPN credentials, and security agents on workstation.',
        estimatedTime: '20 min',
        required: true,
        source: {
          title: 'IT Setup Guide',
          section: 'Device & Email Setup'
        },
        steps: [
          'Log in using temporary password provided by IT Helpdesk',
          'Update primary password following complexity rules',
          'Test corporate VPN connection (GlobalProtect)'
        ]
      },
      {
        id: 'task-5',
        title: 'Meet Your Onboarding Buddy',
        category: 'Day 2 — Getting Set Up',
        day: 2,
        status: 'Pending',
        description: 'Coffee chat with Rahul Verma for informal Q&A, culture tips, and team dynamics.',
        estimatedTime: '30 min',
        required: false,
        source: {
          title: 'Buddy Program Playbook',
          section: 'First Week Sync'
        },
        steps: [
          'Schedule 30-min coffee sync with Rahul Verma',
          'Ask any non-technical or informal questions',
          'Locate engineering team seating area at Bengaluru HQ'
        ]
      },
      {
        id: 'task-6',
        title: 'Sandbox Repository & Dev Environment Setup',
        category: 'Day 3 — Your Role',
        day: 3,
        status: 'Pending',
        description: 'Clone sandbox repository, configure local Docker environment, and submit first test PR.',
        estimatedTime: '45 min',
        required: true,
        roleSpecific: true,
        source: {
          title: 'Engineering Playbook',
          section: 'Local Environment Setup'
        },
        steps: [
          'Request access to GitHub org repo (eng-sandbox)',
          'Run `./scripts/setup-dev.sh` to initialize local dependencies',
          'Submit test pull request to verify CI build workflow'
        ]
      },
      {
        id: 'task-7',
        title: 'Bengaluru HQ Safety Walk & Badge Activation',
        category: 'Day 3 — Your Role',
        day: 3,
        status: 'Pending',
        description: 'Collect physical access badge from 2nd floor security desk and complete emergency exit walk.',
        estimatedTime: '20 min',
        required: true,
        locationSpecific: true,
        source: {
          title: 'Office Orientation Guide',
          section: 'Bengaluru HQ Safety'
        },
        steps: [
          'Visit Security Desk at Tower B Entrance',
          'Verify Govt Photo ID and pick up biometric RFID badge',
          'Review fire exit routes and emergency assembly points'
        ]
      },
      {
        id: 'task-8',
        title: 'Team Introduction & Sprint Sync',
        category: 'Day 4 — Integration',
        day: 4,
        status: 'Pending',
        description: 'Attend engineering daily standup and introduce yourself to the platform squad.',
        estimatedTime: '30 min',
        required: false,
        source: {
          title: 'Engineering Playbook',
          section: 'Agile Cadence'
        },
        steps: [
          'Join 10:00 AM Standup on Teams channel',
          'Share brief 2-minute background and onboarding status'
        ]
      },
      {
        id: 'task-9',
        title: 'First-Week Retrospective Review',
        category: 'Day 5 — Review',
        day: 5,
        status: 'Pending',
        description: '1-on-1 retrospective with manager to review progress, clarify blockers, and plan Week 2.',
        estimatedTime: '30 min',
        required: true,
        source: {
          title: 'Manager Onboarding Guidelines',
          section: 'Week 1 Review'
        },
        steps: [
          'Complete self-reflection checklist',
          'Log remaining questions for manager sync'
        ]
      }
    ]
  },
  kabir: {
    id: 'kabir',
    name: 'Kabir Malhotra',
    role: 'Sales Executive',
    department: 'Commercial Sales',
    location: 'Gurugram Office',
    workType: 'In-office',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    manager: 'Vikram Roy (VP of Enterprise Sales)',
    buddy: 'Ananya Sen (Senior Account Executive)',
    startDate: 'September 22, 2026',
    personalizationChips: [
      'CRM practice sandbox',
      'Gurugram office orientation',
      'Sales playbooks',
      'Deal desk introduction'
    ],
    scopeRationale: 'Your onboarding path is tailored for commercial sales operations in Gurugram, including CRM sandbox training and enterprise pricing desk workflows.',
    initialTasks: [
      {
        id: 'task-k1',
        title: 'Welcome Call with Manager',
        category: 'Day 1 — Getting Started',
        day: 1,
        status: 'Completed',
        description: 'Introductory alignment call with Vikram Roy regarding Q4 targets and quota structures.',
        estimatedTime: '30 min',
        required: true,
        source: { title: 'Sales Onboarding Guide', section: 'Initial Sync' },
        steps: ['Review regional account territory mapping', 'Discuss buddy pairing']
      },
      {
        id: 'task-k2',
        title: 'MFA & Security Basics',
        category: 'Day 1 — Getting Started',
        day: 1,
        status: 'Completed',
        description: 'Setup two-factor security and review client NDA and data handling rules.',
        estimatedTime: '20 min',
        required: true,
        source: { title: 'Security Handbook', section: 'Account Protection' },
        steps: ['Activate Authenticator app', 'Sign compliance acknowledgement']
      },
      {
        id: 'task-k3',
        title: 'CRM Practice Sandbox & Pipeline Setup',
        category: 'Day 2 — Sales Enablement',
        day: 2,
        status: 'In Progress',
        description: 'Log into Salesforce sandbox, practice deal creation, and stage updates.',
        estimatedTime: '40 min',
        required: true,
        roleSpecific: true,
        source: { title: 'Sales Enablement Guide', section: 'CRM Hygiene' },
        steps: ['Create mock enterprise lead', 'Fill deal metrics & generate sample quote']
      },
      {
        id: 'task-k4',
        title: 'Gurugram Office Orientation & Client Room Tour',
        category: 'Day 2 — Office Setup',
        day: 2,
        status: 'Pending',
        description: 'Explore Gurugram Cyber Hub office, executive briefing center, and guest pass system.',
        estimatedTime: '25 min',
        required: true,
        locationSpecific: true,
        source: { title: 'Office Orientation Guide', section: 'Gurugram Facility' },
        steps: ['Tour 5th floor client meeting suites', 'Register RFID smart badge']
      },
      {
        id: 'task-k5',
        title: 'Meet Your Onboarding Buddy',
        category: 'Day 3 — Networking',
        day: 3,
        status: 'Pending',
        description: 'Sync with Ananya Sen to review customer persona pitch decks and deal objection handling.',
        estimatedTime: '30 min',
        required: false,
        source: { title: 'Buddy Program Playbook', section: 'Sales Coaching' },
        steps: ['Review recent winning deal case studies', 'Practice 2-minute elevator pitch']
      },
      {
        id: 'task-k6',
        title: 'Manager Check-in & Territory Review',
        category: 'Day 4 — Strategy',
        day: 4,
        status: 'Pending',
        description: 'Review assigned mid-market accounts and set prospect outreach targets.',
        estimatedTime: '30 min',
        required: true,
        source: { title: 'Sales Onboarding Guide', section: 'Territory Assignment' },
        steps: ['Confirm top 20 target accounts', 'Validate outreach sequence templates']
      }
    ]
  },
  isha: {
    id: 'isha',
    name: 'Isha Verma',
    role: 'Operations Analyst',
    department: 'Business Operations',
    location: 'Remote India',
    workType: 'Full Remote',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    manager: 'Neha Gupta (Operations Lead)',
    buddy: 'Rohan Das (Senior Ops Analyst)',
    startDate: 'September 22, 2026',
    personalizationChips: [
      'Reporting sandbox access',
      'Remote home-office setup stipend',
      'Ops SOP repository',
      'Virtual coffee pairing'
    ],
    scopeRationale: 'Your onboarding path is customized for remote analytical workflows, home ergonomic setup policies, and operational database sandbox tools.',
    initialTasks: [
      {
        id: 'task-i1',
        title: 'Welcome Call & Remote Briefing',
        category: 'Day 1 — Getting Started',
        day: 1,
        status: 'Completed',
        description: 'Virtual kickoff with Neha Gupta covering remote collaboration etiquette and async workflows.',
        estimatedTime: '30 min',
        required: true,
        source: { title: 'Remote Work Policy', section: 'Kickoff & Communication' },
        steps: ['Set up Slack status indicators', 'Review core working hours window']
      },
      {
        id: 'task-i2',
        title: 'MFA & Remote Laptop Dispatch Verification',
        category: 'Day 1 — Getting Started',
        day: 1,
        status: 'Completed',
        description: 'Confirm receipt of dispatched corporate laptop and configure secure VPN.',
        estimatedTime: '20 min',
        required: true,
        source: { title: 'IT Setup Guide', section: 'Remote Device Logistics' },
        steps: ['Inspect courier package seal', 'Log initial security key on VPN portal']
      },
      {
        id: 'task-i3',
        title: 'Reporting Sandbox & SQL Query Workspace',
        category: 'Day 2 — Tooling',
        day: 2,
        status: 'In Progress',
        description: 'Configure Read-Only Snowflake access and test sample SQL operational dashboards.',
        estimatedTime: '45 min',
        required: true,
        roleSpecific: true,
        source: { title: 'Operations Handbook', section: 'Data & Analytics Sandbox' },
        steps: ['Connect to staging data warehouse', 'Run validation query on ops_metrics']
      },
      {
        id: 'task-i4',
        title: 'Remote Home Office Setup & Ergonomics Checklist',
        category: 'Day 2 — Wellness',
        day: 2,
        status: 'Pending',
        description: 'Claim remote work stipend and complete home office ergonomics safety form.',
        estimatedTime: '15 min',
        required: true,
        locationSpecific: true,
        source: { title: 'Remote Work Policy', section: 'Ergonomics & Stipend' },
        steps: ['Submit receipt on expense portal for chair/monitor', 'Sign remote safety checklist']
      },
      {
        id: 'task-i5',
        title: 'Meet Your Onboarding Buddy',
        category: 'Day 3 — Networking',
        day: 3,
        status: 'Pending',
        description: 'Virtual coffee session with Rohan Das to walkthrough daily operational triage queues.',
        estimatedTime: '30 min',
        required: false,
        source: { title: 'Buddy Program Playbook', section: 'Remote Buddy Pairings' },
        steps: ['Join Huddle call', 'Shadow 20 minutes of daily metric verification']
      }
    ]
  }
};

export const MOCK_APPROVED_SOURCES = [
  {
    id: 'src-1',
    title: 'IT Setup Guide',
    badge: 'Approved Source',
    category: 'IT & Access',
    lastReviewed: 'September 15, 2026',
    author: 'IT Infrastructure Team',
    summary: 'Complete device provisioning, email configuration, VPN credentials, and identity security setup instructions.',
    sections: [
      {
        name: 'Device & Email Setup',
        content: 'New employees receive a pre-configured corporate laptop. Initial login requires the temporary password delivered via encrypted SMS. Configure Outlook/Teams using your @onboardpath.corp credentials within 24 hours of receiving device.'
      },
      {
        name: 'MFA & Security',
        content: 'Multi-Factor Authentication (MFA) is mandatory across all enterprise systems. Register Microsoft Authenticator app on your smartphone and save offline emergency recovery codes in your password vault.'
      },
      {
        name: 'VPN & Remote Access',
        content: 'To access internal subnets, repositories, and staging servers from outside campus networks, launch GlobalProtect VPN and select the nearest gateway (India-South for Bengaluru/Gurugram).'
      }
    ]
  },
  {
    id: 'src-2',
    title: 'Security Handbook',
    badge: 'Approved Source',
    category: 'Compliance',
    lastReviewed: 'September 10, 2026',
    author: 'Information Security Office',
    summary: 'Mandatory policies regarding data classification, incident response, password standards, and phishing reporting.',
    sections: [
      {
        name: 'Security Basics',
        content: 'Never share corporate credentials or 2FA tokens. Always lock workstation (Win + L / Cmd + Ctrl + Q) when leaving your desk. Ensure sensitive customer PII is never stored in unencrypted local drives.'
      },
      {
        name: 'Account Protection & Phishing',
        content: 'Report suspicious emails immediately using the "PhishAlert" button in Outlook. IT Security will never ask for your password or SMS verification code.'
      }
    ]
  },
  {
    id: 'src-3',
    title: 'Office Orientation Guide',
    badge: 'Approved Source',
    category: 'Workplace & Facilities',
    lastReviewed: 'August 28, 2026',
    author: 'Workplace Experience Team',
    summary: 'Campus maps, physical RFID badge rules, cafeteria timings, visitor access, and emergency evacuation protocols.',
    sections: [
      {
        name: 'Bengaluru HQ Campus',
        content: 'Located at Outer Ring Road Tech Park. Tower B houses Engineering & Product. Facilities include 24/7 cafeteria on 3rd floor, wellness room on 4th floor, and IT Helpdesk bar on 2nd floor.'
      },
      {
        name: 'Gurugram Office',
        content: 'Located at Cyber City Tower 10. Commercial Sales & Leadership occupy the 5th floor. Reception opens 8:30 AM IST daily.'
      },
      {
        name: 'Workplace Safety & Badge Rules',
        content: 'RFID badges must be worn visibly at all times while on campus grounds. Tailgating behind other employees at access turnstiles is strictly prohibited.'
      }
    ]
  },
  {
    id: 'src-4',
    title: 'Engineering Playbook',
    badge: 'Approved Source',
    category: 'Department Guide',
    lastReviewed: 'September 18, 2026',
    author: 'Engineering Steering Committee',
    summary: 'Developer tooling, Git branching strategies, CI/CD pipeline guides, code review norms, and sandbox environments.',
    sections: [
      {
        name: 'Local Environment Setup',
        content: 'Clone the eng-sandbox repository. Run the setup script to pull local Docker containers for PostgreSQL and Redis. Ensure Node 22+ and Docker Desktop are running.'
      },
      {
        name: 'Agile Cadence & Code Reviews',
        content: 'Sprint planning occurs bi-weekly on Mondays. Every pull request requires at least 2 peer approvals and green CI status before merging to main.'
      }
    ]
  }
];

export const MOCK_QA_DATABASE = [
  {
    keywords: ['email', 'laptop', 'device', 'outlook', 'teams', 'setup'],
    question: 'How do I set up my laptop and company email?',
    answer: 'Start with the IT Setup Guide. It covers your device setup, account activation, and email configuration. Make sure to complete initial password reset and log into Microsoft 365 with your official credentials.',
    citation: {
      sourceId: 'src-1',
      title: 'IT Setup Guide',
      section: 'Device & Email Setup'
    }
  },
  {
    keywords: ['security', 'mfa', 'password', 'phishing', '2fa', 'policy'],
    question: 'Where can I find security guidelines?',
    answer: 'Security guidelines are documented in the Security Handbook. Key rules include enabling MFA via Authenticator app, maintaining strong unique credentials, and reporting suspicious emails using the PhishAlert button.',
    citation: {
      sourceId: 'src-2',
      title: 'Security Handbook',
      section: 'Security Basics'
    }
  },
  {
    keywords: ['buddy', 'onboarding buddy', 'who is my buddy', 'contact buddy'],
    question: 'Who is my onboarding buddy?',
    answer: 'Your assigned onboarding buddy is listed in your Onboarding Profile. You can schedule a 1-on-1 coffee chat with them to discuss culture, team workflows, or general day-to-day questions.',
    citation: {
      sourceId: 'src-1',
      title: 'Buddy Program Playbook',
      section: 'First Week Sync'
    }
  },
  {
    keywords: ['today', 'complete', 'schedule', 'tasks', 'agenda'],
    question: 'What should I complete today?',
    answer: 'Check your First-Week Checklist dashboard for tasks marked for Today. Finish mandatory security setup, email setup, and your scheduled buddy sync.',
    citation: {
      sourceId: 'src-1',
      title: 'IT Setup Guide',
      section: 'Device & Email Setup'
    }
  },
  {
    keywords: ['hr document', 'hr documents', 'hr documentation', 'hr doc', 'human resources document', 'human resources documents', 'hr', 'doc'],
    question: 'Where can I find HR documents?',
    answer: 'You can find approved HR documentation in the HR and IT Onboarding Portal. Start with the Employee Handbook, HR Policies & Leave guide, Benefits & Health Insurance guide, and your onboarding forms. For a policy-specific question, contact your onboarding buddy or HR Business Partner. Do not share confidential personal details in chat.',
    citation: {
      sourceId: 'src-1',
      title: 'IT & HR Onboarding Portal',
      section: 'HR Documentation'
    }
  },
  {
    keywords: ['office', 'orientation', 'bengaluru', 'gurugram', 'cafeteria', 'badge'],
    question: 'Where is the office orientation information?',
    answer: 'Campus layouts, security desk locations, and RFID badge issuance details are in the Office Orientation Guide under your specific office location section (Bengaluru HQ or Gurugram Office).',
    citation: {
      sourceId: 'src-3',
      title: 'Office Orientation Guide',
      section: 'Campus Facilities'
    }
  }
];

export const SENSITIVE_KEYWORDS = [
  'salary', 'pay', 'compensation', 'bonus', 'appraisal', 'raise', 
  'increment', 'payroll', 'bank account change', 'bank account', 'tax form',
  'hr dispute', 'grievance', 'termination', 'resignation', 'paternity leave',
  'maternity leave policy detail', 'performance rating', 'pip'
];

export const INITIAL_NUDGES = [
  {
    id: 'nudge-1',
    taskId: 'task-4',
    title: 'Laptop & Email Setup',
    type: 'Required task',
    dueDate: 'Due today',
    description: 'You still have this required task pending. Setting up your device ensures access to team channels.',
    personaId: 'aanya',
    status: 'Active'
  },
  {
    id: 'nudge-2',
    taskId: 'task-5',
    title: 'Manager Check-in Sync',
    type: 'Pending alignment',
    dueDate: 'Due tomorrow',
    description: 'Confirm your 1-on-1 time slot with your manager for your first-week retrospective.',
    personaId: 'aanya',
    status: 'Active'
  }
];

export const INITIAL_HANDOFFS = [
  {
    id: 'handoff-101',
    category: 'Payroll & Banking Setup',
    assignedTo: 'Rahul Verma / HR Payroll Team',
    escalationLevel: 1,
    escalationPath: [
      'Rahul Verma / HR Payroll Team',
      'Priya Sharma / People Manager',
      'HR Business Partner',
      'Head of People Operations'
    ],
    status: 'Open',
    createdAt: 'Sep 25, 2026',
    personaId: 'aanya',
    privacyNote: 'Only category is shared. Raw text question was discarded to ensure complete employee privacy.'
  }
];

export const ADMIN_DEMO_METRICS = {
  activeJoiners: 24,
  checklistCompletionRate: 78,
  sourceBackedAnswersRate: 94,
  openBuddyHandoffs: 3,
  recentActivity: [
    { id: 1, text: 'Aanya Mehta completed MFA Setup', time: '10 mins ago', type: 'task' },
    { id: 2, text: 'Kabir Malhotra completed CRM practice sandbox', time: '25 mins ago', type: 'task' },
    { id: 3, text: 'Isha Verma created a Payroll buddy handoff', time: '1 hour ago', type: 'handoff' },
    { id: 4, text: 'Aanya Mehta asked OnboardPath about laptop setup', time: '2 hours ago', type: 'qa' },
    { id: 5, text: 'Kabir Malhotra completed Gurugram Safety Walk', time: '3 hours ago', type: 'task' }
  ]
};
