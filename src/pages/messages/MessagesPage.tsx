
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Search, Send, MoreVertical, Phone, Video, 
  Paperclip, MessageSquare
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Sample conversations data
const conversations = [
  {
    id: 1,
    contact: 'Maria Silva',
    avatar: null,
    initials: 'MS',
    lastMessage: 'Olá, gostaria de confirmar meu horário para amanhã às 14h.',
    time: '10:30',
    unread: 2,
  },
  {
    id: 2,
    contact: 'João Costa',
    avatar: null,
    initials: 'JC',
    lastMessage: 'Preciso remarcar meu horário, é possível?',
    time: 'Ontem',
    unread: 0,
  },
  {
    id: 3,
    contact: 'Ana Pereira',
    avatar: null,
    initials: 'AP',
    lastMessage: 'Obrigada pelo atendimento!',
    time: 'Ontem',
    unread: 0,
  },
  {
    id: 4,
    contact: 'Carlos Mendes',
    avatar: null,
    initials: 'CM',
    lastMessage: 'Vocês trabalham aos domingos?',
    time: 'Seg',
    unread: 0,
  },
  {
    id: 5,
    contact: 'Fernanda Lima',
    avatar: null,
    initials: 'FL',
    lastMessage: 'Qual o preço do corte feminino?',
    time: 'Seg',
    unread: 0,
  }
];

// Sample messages for the active conversation
const messages = [
  {
    id: 1,
    sender: 'Maria Silva',
    text: 'Olá, gostaria de confirmar meu horário para amanhã às 14h.',
    time: '10:30',
    isOwn: false,
  },
  {
    id: 2,
    sender: 'Você',
    text: 'Olá Maria! Sim, está tudo confirmado para amanhã às 14h para corte e escova.',
    time: '10:35',
    isOwn: true,
  },
  {
    id: 3,
    sender: 'Maria Silva',
    text: 'Ótimo! Obrigada pela confirmação. Até amanhã!',
    time: '10:37',
    isOwn: false,
  },
  {
    id: 4,
    sender: 'Você',
    text: 'Estamos aguardando sua visita! Caso precise remarcar, é só nos avisar.',
    time: '10:38',
    isOwn: true,
  },
  {
    id: 5,
    sender: 'Maria Silva',
    text: 'Perfeito, muito obrigada!',
    time: '10:40',
    isOwn: false,
  },
];

const MessagesPage: React.FC = () => {
  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState('');
  
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  
  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    
    // In a real app, this would send the message to the backend
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar>
        <SidebarMenu />
        <div className="mt-auto mb-4 px-3">
          <ThemeToggle />
        </div>
      </Sidebar>
      
      <main className="md:pl-[240px] pt-16 pb-20 md:pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="show"
            className="md:h-[calc(100vh-150px)] h-[calc(100vh-180px)]"
          >
            <motion.h1 
              variants={itemAnimation}
              className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-50 mb-6 md:mb-8"
            >
              Mensagens
            </motion.h1>
            
            <motion.div 
              variants={itemAnimation}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full"
            >
              {/* Conversations list */}
              <Card className="border-none shadow-md md:col-span-1 h-[300px] md:h-full">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="p-4 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar conversas"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {conversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() => setActiveConversation(conversation)}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                            activeConversation.id === conversation.id
                              ? 'bg-salon-50 dark:bg-gray-800'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className="relative">
                            <Avatar>
                              {conversation.avatar ? (
                                <AvatarImage src={conversation.avatar} alt={conversation.contact} />
                              ) : (
                                <AvatarFallback>{conversation.initials}</AvatarFallback>
                              )}
                            </Avatar>
                            {conversation.unread > 0 && (
                              <span className="absolute -top-1 -right-1 bg-salon-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                          
                          <div className="ml-3 flex-1 overflow-hidden">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium truncate">{conversation.contact}</h3>
                              <span className="text-xs text-gray-500">{conversation.time}</span>
                            </div>
                            <p className={`text-sm truncate ${
                              conversation.unread > 0 
                                ? 'font-medium text-gray-900 dark:text-gray-100' 
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {conversation.lastMessage}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              {/* Chat area */}
              <Card className="border-none shadow-md md:col-span-2 flex flex-col h-[calc(100%-120px)] md:h-full">
                <div className="border-b p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      {activeConversation.avatar ? (
                        <AvatarImage src={activeConversation.avatar} alt={activeConversation.contact} />
                      ) : (
                        <AvatarFallback>{activeConversation.initials}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="ml-3">
                      <h3 className="font-medium">{activeConversation.contact}</h3>
                      <p className="text-xs text-green-500">Online</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.isOwn
                              ? 'bg-salon-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className={`text-xs mt-1 text-right ${
                            message.isOwn ? 'text-salon-100' : 'text-gray-500'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="border-t p-4">
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="mx-2"
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button 
                      className="shrink-0 bg-salon-500 hover:bg-salon-600" 
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={messageInput.trim() === ''}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default MessagesPage;
