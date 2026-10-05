// Curated conversational phrases modeled after Kaggle DailyDialog-style natural chat data.
// This keeps the app's onboarding grounding while improving casual small-talk responses.

export const CONVERSATION_DATASET = [
  {
    category: 'greeting',
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
    responses: [
      'Hi there — I’m OnboardPath, and I’m here to help with your onboarding journey. How can I support you today?',
      'Hello! I’m here to help with your onboarding and answer any questions you have. How can I help you today?'
    ]
  },
  {
    category: 'small_talk',
    patterns: ['how are you', 'how are you doing', 'how is it going', "what's up"],
    responses: [
      'I’m doing great today, thanks for asking. I’m here to help with your onboarding and answer any questions you have. How can I help you today?',
      'I’m doing well — thanks for asking. I’m here to help with your onboarding and make this first week easier for you.'
    ]
  },
  {
    category: 'task_support',
    patterns: ['what are you doing', 'what do you do', 'what are you up to'],
    responses: [
      'I’m helping with onboarding support and guiding you through your first-week tasks. What would you like help with today?',
      'I’m helping employees navigate onboarding steps, setup tasks, and first-week guidance. What can I help you with today?'
    ]
  },
  {
    category: 'identity',
    patterns: ['who are you', 'tell me about yourself'],
    responses: [
      'I’m OnboardPath, your onboarding assistant. I help employees with setup, security, office guidance, and first-week tasks. How can I help you today?',
      'I’m your onboarding guide. I help with setup, security, office questions, and the first-week flow. What do you need help with?'
    ]
  },
  {
    category: 'encouragement',
    patterns: ['i am overwhelmed', 'i feel lost', 'i am nervous', 'i am anxious', 'i feel stressed', 'overwhelmed'],
    responses: [
      'That is completely normal for a first week. Let’s focus on the next step instead of the whole journey. Start with the most important onboarding task, and I’ll help you from there.',
      'You’re not behind — you’re just getting started. Take it one step at a time, and we can work through the next task together.'
    ]
  },
  {
    category: 'task_plan',
    patterns: ['what should i do today', 'what should i complete today', 'what do i do today', 'today plan', 'today tasks'],
    responses: [
      'You’re not behind — you’re just in the middle of a new routine. Start with your highest-priority onboarding task, then move to the next one. I can help you sort it into the easiest order.',
      'The best approach is to do the most urgent setup task first, then move into the next task on your checklist. We can keep it simple and focused.'
    ]
  },
  {
    category: 'gratitude',
    patterns: ['thanks', 'thank you'],
    responses: [
      'You’re very welcome. I’m happy to help with your onboarding questions whenever you need me.',
      'Of course — I’m glad to help.'
    ]
  }
];

const normalize = (value = '') => value.toLowerCase().trim();

export const getBestConversationResponse = (queryText) => {
  const clean = normalize(queryText);

  if (!clean) {
    return null;
  }

  let bestMatch = null;

  for (const item of CONVERSATION_DATASET) {
    for (const pattern of item.patterns) {
      const normalizedPattern = normalize(pattern);
      const exactMatch = clean.includes(normalizedPattern);
      const reverseMatch = normalizedPattern.includes(clean);

      if (exactMatch || reverseMatch) {
        const candidate = item.responses[Math.floor(Math.random() * item.responses.length)];
        if (!bestMatch || item.category === 'greeting' || item.category === 'small_talk') {
          bestMatch = candidate;
        }
      }
    }
  }

  return bestMatch;
};
