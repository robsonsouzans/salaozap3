
import React from 'react';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SidebarMenu from '@/components/SidebarMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Star, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const reviews = [
  {
    id: 1,
    client: 'Maria Silva',
    avatar: null,
    initials: 'MS',
    rating: 5,
    date: '15/03/2023',
    comment: 'Atendimento excelente! O corte ficou perfeito, exatamente como eu queria. Ambiente agradável e limpo.',
    service: 'Corte feminino',
    responded: true,
    response: 'Obrigado pelo feedback, Maria! Estamos muito felizes que você tenha gostado do serviço. Esperamos vê-la novamente em breve!'
  },
  {
    id: 2,
    client: 'João Costa',
    avatar: null,
    initials: 'JC',
    rating: 4,
    date: '10/03/2023',
    comment: 'Ótimo serviço. O corte ficou muito bom, embora eu tenha esperado um pouco mais do que o esperado.',
    service: 'Barba e cabelo',
    responded: false
  },
  {
    id: 3,
    client: 'Paula Mendes',
    avatar: null,
    initials: 'PM',
    rating: 3,
    date: '05/03/2023',
    comment: 'O serviço foi bom, mas o salão estava muito cheio e barulhento. Profissionais atenciosos.',
    service: 'Manicure',
    responded: false
  }
];

const ReviewCard: React.FC<typeof reviews[0]> = ({ client, avatar, initials, rating, date, comment, service, responded, response }) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            {avatar ? (
              <AvatarImage src={avatar} alt={client} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{client}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span className="inline-flex mr-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </span>
                  <span>{date}</span>
                </div>
              </div>
              <Badge variant="outline">{service}</Badge>
            </div>
            
            <p className="mt-3 text-gray-700 dark:text-gray-300">{comment}</p>
            
            {responded && response && (
              <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium">Sua resposta:</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{response}</p>
              </div>
            )}
            
            {!responded && (
              <button className="mt-4 text-sm text-salon-500 font-medium flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                Responder
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewsPage: React.FC = () => {
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
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar>
        <SidebarMenu />
        <div className="mt-auto mb-4 px-3">
          <ThemeToggle />
        </div>
      </Sidebar>
      
      <main className="md:pl-[240px] pt-16 pb-20 md:pb-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={itemAnimation}>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-50">
                Avaliações
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Veja e responda às avaliações dos seus clientes
              </p>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Resumo de avaliações</CardTitle>
                  <CardDescription>
                    Média geral e estatísticas de avaliações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold">4.5</div>
                      <div className="flex justify-center mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < 4 || i === 4 && i < 4.5 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : i === 4 
                                  ? 'text-yellow-400 fill-yellow-400 opacity-50' 
                                  : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">15 avaliações</div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <div className="flex items-center w-16">
                            <span className="text-sm">{rating}</span>
                            <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400" />
                          </div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400 rounded-full" 
                              style={{ 
                                width: `${rating === 5 
                                  ? 60 
                                  : rating === 4 
                                    ? 30 
                                    : rating === 3 
                                      ? 10 
                                      : 0}%` 
                              }} 
                            />
                          </div>
                          <span className="text-sm text-gray-500 w-8">
                            {rating === 5 
                              ? 9 
                              : rating === 4 
                                ? 4 
                                : rating === 3 
                                  ? 2 
                                  : 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <h2 className="text-xl font-semibold mb-4">Todas as avaliações</h2>
              <div className="space-y-4">
                {reviews.map(review => (
                  <ReviewCard key={review.id} {...review} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default ReviewsPage;
