import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const QuickChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to LayzoMarket. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const WEBHOOK_URL = 'https://test4532.app.n8n.cloud/webhook-test/b14b33f9-317d-4f78-ba58-e6860f7d6bb2';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage;
    setInputMessage('');
    setIsSending(true);
    setIsTyping(true);

    try {
      // Send message to webhook and get response
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          timestamp: new Date().toISOString(),
          userId: 'anonymous',
          source: 'quickchat'
        })
      });
      
      if (response.ok) {
        let botResponseText = '';
        
        try {
          const responseText = await response.text();
          console.log('Raw webhook response:', responseText);
          
          if (responseText.trim()) {
            try {
              const responseData = JSON.parse(responseText);
              console.log('Parsed webhook response:', responseData);
              
              if (Array.isArray(responseData) && responseData.length > 0) {
                const firstItem = responseData[0];
                if (firstItem.output) {
                  botResponseText = firstItem.output;
                } else if (firstItem.message) {
                  botResponseText = firstItem.message;
                } else if (firstItem.response) {
                  botResponseText = firstItem.response;
                } else if (typeof firstItem === 'string') {
                  botResponseText = firstItem;
                } else {
                  botResponseText = 'Thank you for your message. We will get back to you soon!';
                }
              }
              else if (responseData.output) {
                botResponseText = responseData.output;
              } else if (responseData.message) {
                botResponseText = responseData.message;
              } else if (responseData.response) {
                botResponseText = responseData.response;
              } else if (responseData.reply) {
                botResponseText = responseData.reply;
              } else if (typeof responseData === 'string') {
                botResponseText = responseData;
              } else {
                botResponseText = 'Thank you for your message. We will get back to you soon!';
              }
            } catch (jsonError) {
              console.warn('Response is not valid JSON, treating as plain text:', jsonError);
              botResponseText = responseText;
            }
          } else {
            botResponseText = 'Thank you for your message. We will get back to you soon!';
          }
        } catch (readError) {
          console.error('Failed to read response:', readError);
          botResponseText = 'Sorry, I\'m having trouble processing the response. Please try again.';
        }
        
        // Simulate typing delay for better UX
        setTimeout(() => {
          setIsTyping(false);
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: botResponseText,
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, botMessage]);
          console.log('Bot response added to chat:', botResponseText);
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
        
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send message to webhook:', error);
      
      setTimeout(() => {
        setIsTyping(false);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }, 1000);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Animation variants
  const chatButtonVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    hover: { 
      scale: 1.1,
      boxShadow: "0 10px 30px rgba(139, 92, 246, 0.4)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const chatWindowVariants = {
    hidden: { 
      opacity: 0, 
      y: 100, 
      scale: 0.8,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: 100, 
      scale: 0.8,
      rotateX: -15,
      transition: { duration: 0.3 }
    }
  };

  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

  const typingIndicatorVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      {/* Enhanced Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            variants={chatButtonVariants}
            initial="initial"
            animate="animate"
            exit="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center group overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #8B5CF6 100%)",
            }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 group-hover:opacity-20"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Icon with sparkle effect */}
            <div className="relative">
              <MessageCircle className="w-7 h-7 relative z-10" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </motion.div>
            </div>
            
            {/* Notification pulse */}
            <motion.div 
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div 
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-purple-300"
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.5, 0.2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Enhanced Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-8 right-8 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            style={{
              height: isMinimized ? 80 : 600,
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)"
            }}
          >
            {/* Enhanced Header */}
            <motion.div 
              className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white p-6 flex items-center justify-between relative overflow-hidden"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* Animated background pattern */}
              <motion.div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 50%, white 2px, transparent 2px)",
                  backgroundSize: "30px 30px"
                }}
                animate={{
                  backgroundPosition: ["0px 0px", "30px 30px"],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <div className="flex items-center space-x-4 relative z-10">
                <motion.div 
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Bot className="w-6 h-6" />
                </motion.div>
                <div>
                  <motion.h3 
                    className="font-bold text-lg"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    LayzoMarket Support
                  </motion.h3>
                  <motion.p 
                    className="text-sm opacity-90 flex items-center"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-green-400 rounded-full mr-2"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    Online now
                  </motion.p>
                </div>
              </div>
              <div className="flex items-center space-x-2 relative z-10">
                <motion.button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
                </motion.button>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Chat Content */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Enhanced Messages */}
                  <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          variants={messageVariants}
                          initial="hidden"
                          animate="visible"
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start space-x-3 max-w-xs ${
                            message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                          }`}>
                            <motion.div 
                              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                                message.sender === 'user' 
                                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border-2 border-white'
                              }`}
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              {message.sender === 'user' ? (
                                <User className="w-5 h-5" />
                              ) : (
                                <Bot className="w-5 h-5" />
                              )}
                            </motion.div>
                            <motion.div 
                              className={`rounded-2xl p-4 shadow-lg backdrop-blur-sm ${
                                message.sender === 'user'
                                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                  : 'bg-white text-gray-800 border border-gray-200'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <p className="text-sm leading-relaxed">{message.text}</p>
                              <p className={`text-xs mt-2 ${
                                message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                              }`}>
                                {formatTime(message.timestamp)}
                              </p>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {/* Enhanced Typing Indicator */}
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          variants={typingIndicatorVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="flex justify-start"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                              <Bot className="w-5 h-5" />
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-lg">
                              <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                  {[0, 1, 2].map((i) => (
                                    <motion.div
                                      key={i}
                                      className="w-2 h-2 bg-gray-400 rounded-full"
                                      animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 1, 0.5],
                                      }}
                                      transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: "easeInOut"
                                      }}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">AI is typing...</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Enhanced Input */}
                  <motion.div 
                    className="p-6 bg-white border-t border-gray-200"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 relative">
                        <motion.input
                          ref={inputRef}
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                          disabled={isSending}
                          whileFocus={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        />
                        {inputMessage && (
                          <motion.div
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                          >
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          </motion.div>
                        )}
                      </div>
                      <motion.button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isSending}
                        className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={isSending ? { rotate: [0, 360] } : {}}
                        transition={isSending ? { duration: 1, repeat: Infinity, ease: "linear" } : { type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Send className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <motion.p 
                      className="text-xs text-gray-500 mt-3 text-center flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <motion.div
                        className="w-1 h-1 bg-green-400 rounded-full mr-2"
                        animate={{
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      Messages are sent to our support team
                    </motion.p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickChat;