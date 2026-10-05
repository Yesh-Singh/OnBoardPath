import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { 
  INITIAL_PERSONAS, 
  INITIAL_NUDGES, 
  INITIAL_HANDOFFS, 
  MOCK_APPROVED_SOURCES, 
  MOCK_QA_DATABASE, 
  SENSITIVE_KEYWORDS,
  ADMIN_DEMO_METRICS
} from '../data/mockData';
import { getBestConversationResponse } from '../data/conversationDataset';
import { getDailyDialogReply } from '../data/dailyDialogLoader';

const readStoredValue = (key, fallback) => {
  try {
    const stored = localStorage.getItem(`onboardpath:${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const GENERAL_CHAT_PATTERNS = [
  'hello', 'hi', 'hey', 'how are you', 'what are you doing',
  'who are you', 'what can you do', 'tell me about yourself',
  'thanks', 'thank you', 'good morning', 'good evening',
  'how is it going', 'what do you do', 'how are you doing'
];

const getPersonaTone = (persona) => {
  const tones = {
    aanya: {
      lead: 'Absolutely — let’s keep it simple and practical.',
      reassurance: 'You’re doing well; this is just the learning curve.',
      supportive: 'I can help you move through this smoothly.'
    },
    kabir: {
      lead: 'Absolutely — let’s keep it focused and action-based.',
      reassurance: 'You’re not behind; you’re just getting oriented.',
      supportive: 'I’ll help you take the next best step.'
    },
    isha: {
      lead: 'Absolutely — let’s take this one step at a time.',
      reassurance: 'You’re not falling behind; you’re building your rhythm.',
      supportive: 'I’ll keep this calm and easy to follow.'
    }
  };

  return tones[persona.id] || tones.aanya;
};

const DEFAULT_CONVERSATION_REPLIES = [
  {
    pattern: /how are you|how are you doing|how's it going/i,
    reply: (persona) => `I’m doing great today, thanks for asking. I’m here to help with your onboarding and answer any questions you have. ${getPersonaTone(persona).lead} How can I help you today?`
  },
  {
    pattern: /what are you doing|what do you do|what are you up to/i,
    reply: (persona) => `I’m helping with onboarding support and guiding you through your first-week tasks. ${getPersonaTone(persona).supportive} What would you like help with today?`
  },
  {
    pattern: /hello|hi|hey|good morning|good evening/i,
    reply: (persona) => `Hi there — I’m OnboardPath, and I’m here to help with your onboarding journey. ${getPersonaTone(persona).lead} How can I support you today?`
  },
  {
    pattern: /who are you|tell me about yourself/i,
    reply: (persona) => `I’m OnboardPath, your onboarding assistant. I help employees with setup, security, office guidance, and first-week tasks. ${getPersonaTone(persona).supportive} How can I help you today?`
  },
  {
    pattern: /thanks|thank you/i,
    reply: (persona) => `You’re very welcome. ${getPersonaTone(persona).supportive} I’m happy to help with your onboarding questions whenever you need me.`
  }
];

const isGeneralConversation = (queryText) => {
  const clean = queryText.toLowerCase().trim();
  return GENERAL_CHAT_PATTERNS.some(pattern => clean.includes(pattern));
};

const isToolsQuery = (queryText) => {
  if (/^\s*tools?\s*[?.!]*\s*$/i.test(queryText)) return true;

  return /\b(tool|tools|software|application|applications|programs|workspace|setup)\b/i.test(queryText)
    && /\b(need|use|work|job|role|install|require|suggest|recommend|what|which)\b/i.test(queryText);
};

const getRoleToolsResponse = (persona) => {
  const recommendations = {
    aanya: {
      role: 'Software Engineer',
      tools: [
        'Visual Studio Code for editing and debugging code',
        'Git and the engineering sandbox repository for version control',
        'Microsoft Teams for team communication and sprint syncs',
        'Microsoft Authenticator for MFA and secure access',
        'Docker Desktop for local development services'
      ],
      nextStep: 'Start with the sandbox repository and developer environment setup on your checklist.'
    },
    kabir: {
      role: 'Sales Executive',
      tools: [
        'Salesforce CRM for accounts, contacts, opportunities, and pipeline updates',
        'Microsoft Outlook for customer email and calendar scheduling',
        'Microsoft Teams for internal collaboration and manager check-ins',
        'PowerPoint for customer presentations and pitch materials',
        'Microsoft Authenticator for MFA and secure access'
      ],
      nextStep: 'Start with the CRM practice sandbox and pipeline setup before working on territory tasks.'
    },
    isha: {
      role: 'Operations Analyst',
      tools: [
        'Snowflake for read-only operational data access',
        'A SQL workspace such as Snowsight for querying and validating metrics',
        'Microsoft Excel or Power BI for operational analysis and reporting',
        'Microsoft Teams or Slack for remote collaboration and async updates',
        'VPN and Microsoft Authenticator for secure remote access'
      ],
      nextStep: 'Start with the reporting sandbox and SQL query workspace on your checklist.'
    }
  };

  const recommendation = recommendations[persona.id] || recommendations.aanya;
  return `For your ${recommendation.role} role, you should use:\n\n${recommendation.tools.map(tool => `• ${tool}`).join('\n')}\n\n${recommendation.nextStep} If your manager has a team-specific standard, follow that approved setup.`;
};

const getEscalationPath = (category, persona) => {
  const buddy = persona.buddy || 'Onboarding Buddy';
  const manager = persona.manager || 'Direct Manager';
  if (/payroll|compensation|benefits|health|leave|hr|performance|appraisal/i.test(category)) {
    return [
      `${buddy} / HR Team`,
      `${manager} / People Manager`,
      'HR Business Partner',
      'Head of People Operations'
    ];
  }
  if (/it|hardware|software|access|vpn|security/i.test(category)) {
    return [
      `${buddy} / IT Helpdesk`,
      `${manager} / IT Service Manager`,
      'IT Operations Lead',
      'Head of Corporate Technology'
    ];
  }
  if (/finance|expense|reimbursement|invoice/i.test(category)) {
    return [
      `${buddy} / Finance Helpdesk`,
      `${manager} / Finance Partner`,
      'Finance Operations Manager',
      'Head of Finance'
    ];
  }
  return [
    buddy,
    manager,
    `${persona.department} Department Lead`,
    'Employee Experience Lead'
  ];
};

const getLocalConversationReply = (queryText, persona) => {
  const clean = queryText.trim();
  const match = DEFAULT_CONVERSATION_REPLIES.find(entry => entry.pattern.test(clean));
  return match ? match.reply(persona) : null;
};

const buildOpenAIPrompt = (queryText, persona, history = []) => {
  const recentConversation = history
    .slice(-6)
    .map(message => `${message.sender === 'user' ? 'Employee' : 'Assistant'}: ${message.text}`)
    .join('\n');

  return `You are OnboardPath, a capable, warm assistant for ${persona.name}, who is a ${persona.role} in ${persona.department}.

The employee's message is: "${queryText}"

Recent conversation context:
${recentConversation || '(No previous conversation)'}

Your responsibilities:
1. Welcome new employees and handle basic greetings naturally.
2. Explain the employee's role, department, first-week checklist, and next best step.
3. Give practical setup help for company email, Microsoft 365, MFA, VPN, approved role tools, and communication channels. Use the employee's role when recommending tools.
4. Explain how to contact or prepare for an onboarding buddy, manager, HR, IT, Finance, or other human support team.
5. Answer general questions across everyday topics, technology, learning, communication, productivity, and workplace basics using your general knowledge. Explain complex topics simply and give practical examples.
6. If the employee shares a private or sensitive concern, do not ask them to paste confidential details and do not expose, infer, or summarize private HR, payroll, salary, performance, banking, medical, or legal information. Tell them that only a category should be shared and recommend a human handoff.
7. If you do not know an organization-specific answer, say so clearly. Never invent company policies, links, names, deadlines, or contacts. Recommend Approved Sources or a buddy/manager for company-specific confirmation.
8. If live internet access is not available, do not claim that you searched the internet. For current news, prices, laws, schedules, or other time-sensitive facts, state that the user should verify the answer with an authoritative current source.

Keep responses friendly, concise, and actionable, normally under 220 words. Use short bullets when explaining steps. Ask one focused follow-up question when important context is missing.`;
};

const getOpenAIReply = async (queryText, persona, history = []) => {
  try {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: buildOpenAIPrompt(queryText, persona, history) })
    });

    if (!response.ok) {
      console.warn(`OpenAI assistant request failed with status ${response.status}`);
      return null;
    }

    const data = await response.json();
    return typeof data.reply === 'string' ? data.reply.trim() || null : null;
  } catch (error) {
    console.warn('OpenAI fallback failed:', error);
    return null;
  }
};

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
  // Currently selected persona: 'aanya', 'kabir', 'isha'
  const [activePersonaId, setActivePersonaId] = useState(() => readStoredValue('activePersonaId', 'aanya'));
  
  // Interactive Tasks state mapped by persona
  const [personasTasks, setPersonasTasks] = useState(() => readStoredValue('personasTasks', {
    aanya: INITIAL_PERSONAS.aanya.initialTasks,
    kabir: INITIAL_PERSONAS.kabir.initialTasks,
    isha: INITIAL_PERSONAS.isha.initialTasks
  }));

  // Interactive Nudges state
  const [nudges, setNudges] = useState(() => readStoredValue('nudges', INITIAL_NUDGES));

  // Interactive Buddy Handoffs state
  const [handoffs, setHandoffs] = useState(() => readStoredValue('handoffs', INITIAL_HANDOFFS));

  // Floating Toasts state
  const [toasts, setToasts] = useState([]);

  // Modals state
  const [activeTaskModal, setActiveTaskModal] = useState(null);
  const [activeSourceModal, setActiveSourceModal] = useState(null);
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState(false);
  const [isNudgeModalOpen, setIsNudgeModalOpen] = useState(false);
  const [adminChatMessages, setAdminChatMessages] = useState(() => readStoredValue('adminChatMessages', [
    { id: 'admin-chat-1', sender: 'buddy', text: 'Hi Aanya, I am here if you need help with your first-week tasks.', createdAt: 'Today' }
  ]));
  const [adminFiles, setAdminFiles] = useState(() => readStoredValue('adminFiles', []));

  useEffect(() => {
    const values = { activePersonaId, personasTasks, nudges, handoffs, adminChatMessages, adminFiles: adminFiles.map(({ file, ...metadata }) => metadata) };
    Object.entries(values).forEach(([key, value]) => {
      try { localStorage.setItem(`onboardpath:${key}`, JSON.stringify(value)); } catch { /* Storage may be unavailable. */ }
    });
  }, [activePersonaId, personasTasks, nudges, handoffs, adminChatMessages, adminFiles]);

  // Active persona object
  const activePersona = useMemo(() => {
    return INITIAL_PERSONAS[activePersonaId] || INITIAL_PERSONAS.aanya;
  }, [activePersonaId]);

  // Active tasks for current persona
  const currentTasks = useMemo(() => {
    return personasTasks[activePersonaId] || [];
  }, [personasTasks, activePersonaId]);

  // Live progress metrics calculation
  const progressMetrics = useMemo(() => {
    const total = currentTasks.length;
    if (total === 0) return { total: 0, completed: 0, remaining: 0, percentage: 0 };
    const completed = currentTasks.filter(t => t.status === 'Completed').length;
    const percentage = Math.round((completed / total) * 100);
    const remaining = total - completed;
    return { total, completed, remaining, percentage };
  }, [currentTasks]);

  // Persona switch handler
  const selectPersona = (personaId) => {
    if (INITIAL_PERSONAS[personaId]) {
      setActivePersonaId(personaId);
      addToast(`Switched persona to ${INITIAL_PERSONAS[personaId].name}`, 'info');
    }
  };

  // Toggle task completion
  const toggleTaskStatus = (taskId) => {
    const task = currentTasks.find(item => item.id === taskId);
    if (!task) return;

    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    setPersonasTasks(prev => {
      const pTasks = prev[activePersonaId] || [];
      const updated = pTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, status: nextStatus };
        }
        return task;
      });
      return { ...prev, [activePersonaId]: updated };
    });

    addToast(
      nextStatus === 'Completed'
        ? `Task completed: "${task.title}" 🎉`
        : `Task marked pending: "${task.title}"`,
      nextStatus === 'Completed' ? 'success' : 'info'
    );

    // Update active modal if open
    if (activeTaskModal && activeTaskModal.id === taskId) {
      setActiveTaskModal(prev => prev ? {
        ...prev,
        status: prev.status === 'Completed' ? 'Pending' : 'Completed'
      } : null);
    }
  };

  // Create a new Nudge
  const createNudge = (taskId, customTitle, dueDate) => {
    const targetTask = currentTasks.find(t => t.id === taskId);
    const title = customTitle || (targetTask ? targetTask.title : 'Required Task');
    const newNudge = {
      id: `nudge-${Date.now()}`,
      taskId: taskId || 'general',
      title,
      type: 'User Created',
      dueDate: dueDate || 'Due today',
      description: `Pending reminder for ${title}. Stay on track with your first-week onboarding.`,
      personaId: activePersonaId,
      status: 'Active'
    };

    setNudges(prev => {
      const existing = prev.find(nudge => nudge.personaId === activePersonaId && nudge.taskId === newNudge.taskId);
      if (existing) {
        return prev.map(nudge => nudge.id === existing.id ? {
          ...nudge,
          title: newNudge.title,
          dueDate: newNudge.dueDate,
          description: newNudge.description,
          type: newNudge.type,
          status: 'Active'
        } : nudge);
      }
      return [newNudge, ...prev];
    });
    addToast(`Reminder updated for ${title}`, 'success');
  };

  const snoozeNudge = (nudgeId) => {
    setNudges(prev => prev.map(nudge => nudge.id === nudgeId
      ? { ...nudge, dueDate: 'Due tomorrow', status: 'Active' }
      : nudge));
    addToast('Reminder moved to tomorrow', 'info');
  };

  // Complete / Dismiss Nudge
  const dismissNudge = (nudgeId) => {
    setNudges(prev => prev.filter(n => n.id !== nudgeId));
    addToast('Nudge dismissed', 'info');
  };

  const sendAdminChatMessage = (text, sender = 'buddy') => {
    if (!text?.trim()) return;
    setAdminChatMessages(prev => [...prev, { id: `chat-${Date.now()}`, sender, text: text.trim(), createdAt: 'Just now' }]);
  };

  const assignTaskToMember = (personaId, title, description = 'New task assigned by your onboarding buddy.', day = 1) => {
    if (!title?.trim() || !INITIAL_PERSONAS[personaId]) return;
    setPersonasTasks(prev => ({
      ...prev,
      [personaId]: [...(prev[personaId] || []), {
        id: `admin-task-${Date.now()}`, title: title.trim(), description,
        category: `Day ${day} — Buddy Assigned`, day, status: 'Pending', estimatedTime: '30 min', required: false,
        source: { title: 'Buddy Assignment', section: 'Custom task' }
      }]
    }));
  };

  const updateMemberTask = (personaId, taskId, updates) => {
    setPersonasTasks(prev => ({ ...prev, [personaId]: (prev[personaId] || []).map(task => task.id === taskId ? { ...task, ...updates } : task) }));
  };

  const reorderMemberTask = (personaId, taskId, direction) => {
    setPersonasTasks(prev => {
      const tasks = [...(prev[personaId] || [])];
      const index = tasks.findIndex(task => task.id === taskId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= tasks.length) return prev;
      [tasks[index], tasks[nextIndex]] = [tasks[nextIndex], tasks[index]];
      return { ...prev, [personaId]: tasks };
    });
  };

  const moveMemberTask = (personaId, sourceId, targetId) => {
    if (sourceId === targetId) return;
    setPersonasTasks(prev => {
      const tasks = [...(prev[personaId] || [])];
      const sourceIndex = tasks.findIndex(task => task.id === sourceId);
      const targetIndex = tasks.findIndex(task => task.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return prev;
      const [movedTask] = tasks.splice(sourceIndex, 1);
      tasks.splice(targetIndex, 0, movedTask);
      return { ...prev, [personaId]: tasks };
    });
  };

  const removeMemberTask = (personaId, taskId) => {
    setPersonasTasks(prev => ({ ...prev, [personaId]: (prev[personaId] || []).filter(task => task.id !== taskId) }));
    addToast('Task removed from the member checklist', 'info');
  };

  const uploadAdminFile = (file) => {
    if (!file) return;
    setAdminFiles(prev => [{ id: `file-${Date.now()}`, name: file.name, size: file.size, type: file.type, file, uploadedAt: 'Just now' }, ...prev]);
  };

  const removeAdminFile = (fileId) => {
    setAdminFiles(prev => prev.filter(file => file.id !== fileId));
    addToast('Shared file removed', 'info');
  };

  // Create a new Buddy Handoff (Privacy-safe)
  const createHandoff = (category, assignedTo = 'Onboarding Buddy / HR') => {
    const escalationPath = getEscalationPath(category, activePersona);
    const newHandoff = {
      id: `handoff-${Date.now()}`,
      category: category || 'General HR Inquiry',
      assignedTo: assignedTo || escalationPath[0],
      escalationLevel: 1,
      escalationPath,
      status: 'Open',
      createdAt: 'Just now',
      messages: [],
      personaId: activePersonaId,
      privacyNote: 'Only the category was shared for this handoff. Raw question text was not stored to protect employee privacy.'
    };

    setHandoffs(prev => [newHandoff, ...prev]);
    addToast(`Handoff created successfully! ${activePersona.buddy} has been notified regarding ${category}.`, 'success');
  };

  const replyToHandoff = (handoffId, text, sender = 'buddy') => {
    if (!text?.trim()) return;
    setHandoffs(prev => prev.map(handoff => handoff.id === handoffId ? {
      ...handoff,
      messages: [...(handoff.messages || []), { id: `handoff-message-${Date.now()}`, sender, text: text.trim(), createdAt: 'Just now' }]
    } : handoff));
  };

  const removeHandoff = (handoffId) => {
    setHandoffs(prev => prev.filter(handoff => handoff.id !== handoffId));
    addToast('Handoff removed', 'info');
  };

  const escalateHandoff = (handoffId) => {
    const handoff = handoffs.find(item => item.id === handoffId);
    if (!handoff) return;
    const path = handoff.escalationPath || getEscalationPath(handoff.category, activePersona);
    const currentLevel = handoff.escalationLevel || 1;
    const nextLevel = Math.min(currentLevel + 1, path.length);
    if (nextLevel === currentLevel) return;

    addToast(`Handoff escalated to ${path[nextLevel - 1]}`, 'info');
    setHandoffs(prev => prev.map(handoff => {
      if (handoff.id !== handoffId) return handoff;
      return {
        ...handoff,
        assignedTo: path[nextLevel - 1],
        escalationLevel: nextLevel,
        status: 'Escalated'
      };
    }));
  };

  // Toast System
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Assistant Query Processing with Grounding & Sensitivity Engine
  const processAssistantQuery = async (queryText, options = {}) => {
    const cleanQuery = queryText.toLowerCase().trim();
    const useSmartFallback = options.useSmartFallback ?? true;
    const useOpenAIFallback = options.useOpenAIFallback ?? true;
    const conversationHistory = options.conversationHistory ?? [];

    // 1. Sensitivity check
    const isSensitive = SENSITIVE_KEYWORDS.some(keyword => cleanQuery.includes(keyword));
    if (isSensitive) {
      return {
        isSensitive: true,
        answer: "This topic may require help from a human. OnboardPath enforces privacy rules around sensitive HR, payroll, or compensation inquiries.",
        citation: null
      };
    }

    // OpenAI is the primary assistant for non-sensitive questions. Local
    // guidance below remains available when the API is unavailable or disabled.
    if (useSmartFallback && useOpenAIFallback) {
      const openAIReply = await getOpenAIReply(queryText, activePersona, conversationHistory);
      if (openAIReply) {
        return {
          isSensitive: false,
          answer: openAIReply,
          citation: null
        };
      }
    }

    // 2. Role-aware tools guidance
    if (isToolsQuery(cleanQuery)) {
      return {
        isSensitive: false,
        answer: getRoleToolsResponse(activePersona),
        citation: null
      };
    }

    // 3. Keyword match in knowledge base
    for (const item of MOCK_QA_DATABASE) {
      if (item.keywords.some(kw => cleanQuery.includes(kw))) {
        return {
          isSensitive: false,
          answer: item.answer,
          citation: item.citation
        };
      }
    }

    // 4. Personalized onboarding support for common first-week questions
    const roleAwareSupport = (() => {
      const notCompleted = currentTasks.filter(task => task.status !== 'Completed');
      const topTasks = notCompleted.slice(0, 3).map(task => task.title);
      const personaTone = getPersonaTone(activePersona);

      if (/what should i do today|what should i complete today|what do i do today|today's tasks|today's plan/i.test(cleanQuery)) {
        return `You’re not behind — you’re just in the middle of a new routine. Based on your ${activePersona.role} onboarding, I’d focus on ${topTasks.length ? topTasks.join(', ') : 'your current onboarding checklist'} first. ${personaTone.lead} Start with the most urgent item, then check in with ${activePersona.buddy} if you need guidance.`;
      }

      if (/how do i get started|where do i start|first day|first week|start my onboarding/i.test(cleanQuery)) {
        return `A good next step is to begin with your required setup items and move into role-specific onboarding from there. For ${activePersona.role}, I’d start with your setup tasks, confirm your buddy intro, and review the checklist before the end of the day. ${personaTone.reassurance} You’re doing the right thing by taking it one step at a time.`;
      }

      if (/i am overwhelmed|i feel lost|i am nervous|stress|overwhelmed|anxious/i.test(cleanQuery)) {
        return `That’s completely normal for a first week. ${personaTone.reassurance} The best way forward is to focus on just the next task, not the whole journey. Start with your highest-priority onboarding step, then reach out to ${activePersona.buddy} or your manager if you need clarity. You’ve got this.`;
      }

      return null;
    })();

    if (roleAwareSupport) {
      return {
        isSensitive: false,
        answer: roleAwareSupport,
        citation: null
      };
    }

    // 4. DailyDialog-backed casual conversation replies first
    if (useSmartFallback && isGeneralConversation(cleanQuery)) {
      const dailyDialogReply = await getDailyDialogReply(queryText);
      if (dailyDialogReply) {
        return {
          isSensitive: false,
          answer: dailyDialogReply,
          citation: null
        };
      }
    }

    // 5. Dataset-backed casual conversation replies next
    const datasetReply = getBestConversationResponse(queryText);
    if (useSmartFallback && datasetReply && isGeneralConversation(cleanQuery)) {
      return {
        isSensitive: false,
        answer: datasetReply,
        citation: null
      };
    }

    // 6. Natural language conversational replies next
    const localConversationReply = getLocalConversationReply(queryText, activePersona);
    if (useSmartFallback && localConversationReply && isGeneralConversation(cleanQuery)) {
      return {
        isSensitive: false,
        answer: localConversationReply,
        citation: null
      };
    }

    // Final fallback for ungrounded questions
    const fallbackAnswer = `I could not find an exact match in our approved onboarding sources for "${queryText}". You can browse our Approved Sources tab or ask your buddy (${activePersona.buddy}) directly.`;

    return {
      isSensitive: false,
      answer: fallbackAnswer,
      citation: {
        sourceId: 'src-1',
        title: 'IT & HR Onboarding Portal',
        section: 'General Inquiries'
      }
    };
  };

  const value = {
    activePersonaId,
    activePersona,
    personasTasks,
    currentTasks,
    progressMetrics,
    nudges,
    handoffs,
    toasts,
    activeTaskModal,
    activeSourceModal,
    isHandoffModalOpen,
    isNudgeModalOpen,
    adminChatMessages,
    adminFiles,
    sources: MOCK_APPROVED_SOURCES,
    adminMetrics: ADMIN_DEMO_METRICS,
    selectPersona,
    toggleTaskStatus,
    createNudge,
    dismissNudge,
    snoozeNudge,
    createHandoff,
    escalateHandoff,
    replyToHandoff,
    removeHandoff,
    addToast,
    removeToast,
    processAssistantQuery,
    setActiveTaskModal,
    setActiveSourceModal,
    setIsHandoffModalOpen,
    setIsNudgeModalOpen
    , sendAdminChatMessage, assignTaskToMember, uploadAdminFile, removeAdminFile,
    updateMemberTask, reorderMemberTask, moveMemberTask, removeMemberTask
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
