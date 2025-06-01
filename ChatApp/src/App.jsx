import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, LogIn, LogOut, Send, 
  User, ChevronRight, Loader2, Smile, 
  Paperclip, Mic, MoreHorizontal 
} from "lucide-react";

function App() {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [usersOnline, setUsersOnline] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setUsersOnline([]);
      return;
    }
    
    const roomOne = supabase.channel("room_one", {
      config: { presence: { key: session?.user?.id } },
    });

    roomOne.on("broadcast", { event: "message" }, (payload) => {
      setMessages(prev => [...prev, payload.payload]);
    });

    roomOne.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await roomOne.track({ id: session?.user?.id });
      }
    });

    roomOne.on("presence", { event: "sync" }, () => {
      const state = roomOne.presenceState();
      setUsersOnline(Object.keys(state));
    });

    return () => roomOne.unsubscribe();
  }, [session]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    
    try {
      await supabase.channel("room_one").send({
        type: "broadcast",
        event: "message",
        payload: {
          message: newMessage,
          user_name: session?.user?.email,
          name: session?.user?.user_metadata?.name,
          avatar: session?.user?.user_metadata?.avatar_url,
          timestamp: new Date().toISOString(),
        },
      });
      
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 20 
      }
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-6"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 rounded-full">
                <MessageCircle className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Welcome to ChatApp
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400"
            >
              Sign in to start chatting with others
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button 
              onClick={signIn}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-medium flex items-center justify-center transition-all transform hover:-translate-y-0.5 shadow-lg"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
              </svg>
              Sign in with Google
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex justify-center"
          >
            <div className="bg-gray-700 p-4 rounded-xl w-full">
              <div className="flex space-x-4 mb-4">
                <div className="rounded-full bg-gray-600 h-10 w-10 flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-600 rounded w-full"></div>
                  <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex space-x-4 justify-end">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-blue-600 rounded w-3/4 ml-auto"></div>
                  <div className="h-4 bg-blue-600 rounded w-full"></div>
                </div>
                <div className="rounded-full bg-gray-600 h-10 w-10 flex-shrink-0"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      {/* Header */}
      <motion.header 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="bg-gray-800 border-b border-gray-700 py-4 px-6 flex justify-between items-center"
      >
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-lg mr-3">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">ChatApp</h1>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <p className="text-xs text-gray-400">
                {usersOnline.length} {usersOnline.length === 1 ? 'person' : 'people'} online
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="mr-4 text-right hidden sm:block">
            <p className="text-white font-medium truncate max-w-[120px]">
              {session?.user?.user_metadata?.name || session?.user?.email}
            </p>
            <p className="text-xs text-gray-400">Online</p>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer"
          >
            <img 
              src={session?.user?.user_metadata?.avatar_url} 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-indigo-500"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
          </motion.div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={signOut}
            className="ml-4 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-3 rounded-lg text-sm transition-colors flex items-center"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Sign out</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-gray-800 to-gray-900"
      >
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center h-full text-gray-500"
            >
              <motion.div 
                animate={{ 
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="mb-4 p-6 bg-gray-800 rounded-full"
              >
                <MessageCircle className="h-12 w-12" />
              </motion.div>
              <h3 className="text-xl font-medium mb-2">No messages yet</h3>
              <p>Be the first to send a message!</p>
            </motion.div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div
                key={idx}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={`flex ${msg?.user_name === session?.user?.email ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-4 flex ${msg?.user_name === session?.user?.email ? 'flex-row-reverse' : ''}`}
                >
                  {msg?.user_name !== session?.user?.email && (
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <img
                        src={msg?.avatar}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
                      />
                    </motion.div>
                  )}
                  
                  <div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className={`rounded-2xl px-4 py-3 ${msg?.user_name === session?.user?.email 
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-700 text-white rounded-bl-none'}`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                    </motion.div>
                    
                    <div className={`mt-1 text-xs flex items-center ${msg?.user_name === session?.user?.email ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-gray-500">
                        {msg?.user_name === session?.user?.email ? 'You' : msg?.name || msg?.user_name?.split('@')[0]}
                      </span>
                      <span className="mx-2 text-gray-500">•</span>
                      <span className="text-gray-500">{formatTime(msg?.timestamp)}</span>
                    </div>
                  </div>
                  
                  {msg?.user_name === session?.user?.email && (
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <img
                        src={msg?.avatar}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full ml-3 flex-shrink-0"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Message Input */}
      <motion.form 
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        onSubmit={sendMessage}
        className="bg-gray-800 border-t border-gray-700 p-4"
      >
        <div className="flex items-center">
          <div className="flex space-x-2 mr-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="p-2 rounded-full bg-gray-700 text-gray-400 hover:text-white"
            >
              <Smile className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="p-2 rounded-full bg-gray-700 text-gray-400 hover:text-white"
            >
              <Paperclip className="h-5 w-5" />
            </motion.button>
          </div>
          
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          
          <div className="flex space-x-2 ml-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="p-2 rounded-full bg-gray-700 text-gray-400 hover:text-white"
            >
              <Mic className="h-5 w-5" />
            </motion.button>
            
            <motion.button 
              type="submit"
              disabled={!newMessage.trim() || isSending}
              whileHover={!newMessage.trim() || isSending ? {} : { scale: 1.05 }}
              whileTap={!newMessage.trim() || isSending ? {} : { scale: 0.95 }}
              className={`p-3 rounded-full font-medium transition-colors ${newMessage.trim() && !isSending
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
            >
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}

export default App;