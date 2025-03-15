
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-full max-w-md ${className}`}
    >
      <Card className="glass-card shadow-xl border border-white/20 overflow-hidden">
        <CardContent className="pt-6 px-6 pb-4">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuthCard;
