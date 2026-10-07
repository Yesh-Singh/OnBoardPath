import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  UserCheck, 
  HelpCircle, 
  Bot,
  User,
  RotateCcw,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import CitationCard from './CitationCard';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AssistantChat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');

  const { processAssistantQuery, setIsHandoffModalOpen, activePersona, submitAnswerFeedback, answerFeedback } = useOnboarding();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `Hi ${activePersona.name.split(' ')[0]} — I’m here to help with your onboarding work. Ask me about setup, checklist tasks, approved sources, security, office guidance, or buddy handoff.`,
      citation: null,
      isSensitive: false
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [useSmartFallback, setUseSmartFallback] = useState(true);
  const [apiStatus, setApiStatus] = useState('idle');
  const processedInitialQuery = useRef(null);

  const resetChat = () => {
    setMessages([{
      id: Date.now(),
      sender: 'assistant',
      text: `Hi ${activePersona.name.split(' ')[0]} — I’m here to help with your onboarding work. Ask me about setup, checklist tasks, approved sources, security, office guidance, or buddy handoff.`,
      citation: null,
      isSensitive: false
    }]);
    setInputValue('');
    setIsTyping(false);
    processedInitialQuery.current = initialQuery;
  };

  const suggestedQuestions = [
    // Setup & IT
    'How do I set up my laptop and company email?',
    'How do I connect to the VPN from home?',
    'How do I set up my local dev environment?',
    // Security & compliance
    'Where can I find security guidelines?',
    'How do I report a phishing attempt?',
    'Where can I find HR documents?',
    // People & day-to-day
    'Who is my onboarding buddy?',
    'What should I complete today?',
    'Where is the office orientation information?',
    // Escalation
    'How do I escalate a blocked task?',
    'What is my salary & bonus breakdown?' // Sensitive topic test!
  ];

  const handleSendMessage = useCallback(async (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    // Add User Message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      citation: null,
      isSensitive: false
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const result = await processAssistantQuery(query, {
        useSmartFallback,
        useOpenAIFallback: useSmartFallback,
        conversationHistory: messages
      });
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: result.answer,
        citation: result.citation,
        isSensitive: result.isSensitive
      };

      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, messages, processAssistantQuery, useSmartFallback]);

  useEffect(() => {
    if (initialQuery && processedInitialQuery.current !== initialQuery) {
      processedInitialQuery.current = initialQuery;
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, handleSendMessage]);

  const checkApiStatus = async () => {
    setApiStatus('checking');
    try {
      const response = await fetch('/api/assistant/health');
      const data = await response.json();
      setApiStatus(data.status === 'working' ? 'working' : data.status === 'not_configured' ? 'not_configured' : 'unavailable');
    } catch {
      setApiStatus('unavailable');
    }
  };

  return (
    <div className="enterprise-card flex flex-col h-[700px] max-h-[80vh] overflow-hidden">
      {/* Header Banner */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
              Ask OnboardPath
            </h3>
            <p className="text-[11px] text-slate-300">
              Answers stay focused on approved onboarding sources and necessary work questions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetChat}
            className="px-3 py-1.5 rounded-full text-[10px] font-semibold border bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600 flex items-center gap-1.5"
            title="Start a new chat"
          >
            <RotateCcw className="w-3 h-3" />
            Reset chat
          </button>
          <button
            type="button"
            onClick={checkApiStatus}
            disabled={apiStatus === 'checking'}
            className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all ${
              apiStatus === 'working'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40'
                : apiStatus === 'not_configured' || apiStatus === 'unavailable'
                ? 'bg-rose-500/15 text-rose-300 border-rose-400/40'
                : 'bg-slate-700 text-slate-200 border-slate-600'
            }`}
            title="Check whether the server-side Gemini API key is working"
          >
            {apiStatus === 'checking' ? 'Checking API...' : apiStatus === 'working' ? 'Gemini: Working' : apiStatus === 'not_configured' ? 'Gemini: Not configured' : apiStatus === 'unavailable' ? 'Gemini: Unavailable' : 'Check Gemini API'}
          </button>
          <button
            type="button"
            onClick={() => setUseSmartFallback((prev) => !prev)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all ${
            useSmartFallback
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40'
              : 'bg-slate-700 text-slate-200 border-slate-600'
            }`}
          >
            {useSmartFallback ? 'Smart fallback: On' : 'Grounded answers only'}
          </button>
        </div>
      </div>

      {/* Suggested Questions Pills Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200/80 overflow-x-auto flex items-center gap-2 text-xs scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> Prompts:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 font-medium whitespace-nowrap shrink-0 transition-all shadow-2xs text-[11px]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg, msgIndex) => {
          const isUser = msg.sender === 'user';
          const prevUserMsg = messages.slice(0, msgIndex).reverse().find(item => item.sender === 'user');
          const myFeedback = answerFeedback[msg.id];
          const recordFeedback = (rating) => submitAnswerFeedback(msg.id, rating, {
            question: prevUserMsg ? prevUserMsg.text : '',
            answer: msg.text,
            source: msg.citation ? msg.citation.title : null,
            personaId: activePersona.id
          });
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 anim-msg ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                isUser ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble Content */}
              <div className={`max-w-xl text-xs ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs font-medium' 
                    : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-xs'
                }`}>
                  <p className="leading-relaxed text-xs sm:text-sm">{msg.text}</p>

                  {/* Sensitive Topic Alert Card */}
                  {msg.isSensitive && (
                    <div className="mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-slate-800">
                      <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        Sensitive topic detected
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        This question involves information that OnboardPath does not answer directly to protect employee privacy.
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setIsHandoffModalOpen(true)}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Create buddy handoff</span>
                        </button>
                        <button
                          onClick={() => setInputValue('')}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-all"
                        >
                          Ask something else
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Grounded Citation Card */}
                  {msg.citation && (
                    <CitationCard citation={msg.citation} />
                  )}
                </div>

                {/* Feedback After Each Answer */}
                {!isUser && prevUserMsg && (
                  <div key={myFeedback ? myFeedback.rating : 'unrated'} className="mt-1.5 flex items-center gap-1.5 text-[11px] anim-msg">
                    <span className={`font-medium ${myFeedback ? 'text-emerald-600 anim-pop' : 'text-slate-400'}`}>
                      {myFeedback
                        ? 'Thanks for your feedback!'
                        : 'Was this helpful?'}
                    </span>
                    <button
                      type="button"
                      onClick={() => recordFeedback('up')}
                      aria-label="This answer was helpful"
                      title="Helpful"
                      className={`thumb-btn p-1.5 rounded-lg border ${
                        myFeedback && myFeedback.rating === 'up'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-600 anim-pop'
                          : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-600'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => recordFeedback('down')}
                      aria-label="This answer was not helpful"
                      title="Not helpful"
                      className={`thumb-btn p-1.5 rounded-lg border ${
                        myFeedback && myFeedback.rating === 'down'
                          ? 'bg-rose-50 border-rose-300 text-rose-600 anim-pop'
                          : 'bg-white border-slate-200 text-slate-400 hover:border-rose-300 hover:text-rose-600'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2.5 p-2 anim-msg">
            <div className="chat-dots flex items-center gap-1 bg-white border border-slate-200 rounded-full px-3 py-2 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            </div>
            <span className="text-slate-400 text-xs italic">Searching approved sources...</span>
          </div>
        )}
      </div>

      {/* Bottom Input Area */}
      <div className="p-3.5 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question about IT setup, security, or office guides..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-blue-600 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="btn-lift p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Safety Disclaimer Footer */}
        <div className="mt-2 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Answers are grounded in approved sources. Sensitive topics route safely to human buddy.</span>
        </div>
      </div>
    </div>
  );
}
