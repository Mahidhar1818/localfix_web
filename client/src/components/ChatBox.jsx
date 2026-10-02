import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, Shield, Lock, PhoneOff } from 'lucide-react';

export default function ChatBox({ jobId }) {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Fetch initial chat messages from REST API
    if (jobId) {
      API.get(`/jobs/${jobId}/messages`)
        .then(res => setMessages(res.data.messages || []))
        .catch(err => console.error('Chat fetch error:', err));
    }

    // Connect Socket.IO
    socketRef.current = io('/', {
      auth: { token }
    });

    socketRef.current.emit('job:join', jobId);

    socketRef.current.on('message:new', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('job:leave', jobId);
        socketRef.current.disconnect();
      }
    };
  }, [jobId, token]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !jobId) return;

    socketRef.current?.emit('message:send', { jobId, body: input });
    setInput('');
  };

  return (
    <div className="glass-card rounded-2xl flex flex-col h-[480px] overflow-hidden border border-slate-700/60 shadow-2xl">
      
      {/* Masked Phone Banner */}
      <div className="bg-navy-800 border-b border-slate-700/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-signal-600/20 text-signal-400 flex items-center justify-center border border-signal-500/30">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              Encrypted LocalFix Relay Chat
            </h4>
            <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <Lock className="w-3 h-3" /> Phone Masking Active (No Personal Mobile Exchanged)
            </p>
          </div>
        </div>
        <div className="text-[10px] bg-slate-800 px-2 py-1 rounded-md text-slate-400 flex items-center gap-1">
          <PhoneOff className="w-3 h-3 text-rose-400" /> Virtual Phone
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-navy-900/60">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
            No messages yet. Send a message to coordinate repair details.
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div
                key={msg.id || index}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-signal-600 text-white rounded-br-none shadow-md shadow-signal-600/20'
                      : 'bg-navy-700/90 text-slate-200 rounded-bl-none border border-slate-600/40'
                  }`}
                >
                  <p>{msg.body}</p>
                  <span className={`block text-[9px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Send Message Input */}
      <form onSubmit={handleSend} className="p-3 bg-navy-800 border-t border-slate-700/80 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message to technician..."
          className="flex-1 bg-navy-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-signal-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-signal-600 hover:bg-signal-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-signal-600/20 active:scale-95"
        >
          <Send className="w-3.5 h-3.5" /> Send
        </button>
      </form>
    </div>
  );
}
