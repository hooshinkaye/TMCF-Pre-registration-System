import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
}

const botResponses: Record<string, string> = {
  enrollment: 'To enroll: 1) Complete the online pre-registration form, 2) Submit your documents to the campus for Initial Setup, 3) Wait for account activation, 4) Log in to verify your subjects. Click "Register Now" to get started!',
  schedule: 'You can view class schedules by clicking "View Schedule" in the navigation menu. You\'ll need to select your Academic Year, Program, Year Level, Section, and Semester.',
  requirements: 'Required documents for enrollment: Form 138 (Report Card), PSA Birth Certificate, Certificate of Good Moral Character, 2x2 ID Photos (4 pieces), and Medical Certificate. Bring these to the Registrar\'s Office.',
  contact: 'You can reach the Registrar\'s Office at the TMCFI campus in Northern Samar, Philippines. Visit during system hours: Mon-Fri 8AM-11AM & 1PM-4PM, Sat 8AM-11AM.',
  login: 'Only officially enrolled or confirmed students can log in. If you can\'t access your account, please visit the Registrar\'s Office for assistance.',
  password: 'First time logging in? Simply type any password to set it. Make sure to remember it for future access!',
  default: 'I\'m sorry, I didn\'t understand. Try asking about enrollment, schedule, requirements, login, password, or contact.',
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(botResponses)) {
    if (lower.includes(key)) return response;
  }
  return botResponses.default;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I help you today?", sender: 'bot' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: 'user',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        text: getBotResponse(userMsg.text),
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: [0.68, -0.55, 0.27, 1.55] }}
            className="absolute bottom-20 right-0 w-[360px] max-w-[calc(100vw-40px)] h-[480px] max-h-[70vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-[#0B1F3F] px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D4A843]/20 border-2 border-[#D4A843] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#D4A843]" />
                </div>
                <span className="text-white font-semibold text-sm">TMCFI Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F6F1]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.9, x: msg.sender === 'bot' ? -10 : 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'bot'
                        ? 'bg-white text-gray-700 shadow-sm rounded-bl-md'
                        : 'bg-[#0B1F3F] text-white rounded-br-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm inline-flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot" />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot" />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask something..."
                  className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#D4A843]/30 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="w-9 h-9 rounded-full bg-[#D4A843] hover:bg-[#C49A3A] flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-4 h-4 text-[#0B1F3F]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-[60px] h-[60px] rounded-full bg-[#0B1F3F] border-2 border-[#D4A843] shadow-lg flex items-center justify-center hover:bg-[#16325B] transition-all hover:scale-105"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>

        {/* Hover Label */}
        <div className="absolute right-[70px] top-1/2 -translate-y-1/2 bg-[#333] text-white text-[13px] px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none hidden md:block">
          TMCFI Assistant
          <div className="absolute top-1/2 -translate-y-1/2 left-full -mt-0 border-[5px] border-transparent border-l-[#333]" />
        </div>
      </div>
    </div>
  );
}
