
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    toast({
      title: `Modo ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`,
      description: `Alterado para o tema ${newTheme === 'dark' ? 'escuro' : 'claro'}`,
    });
  };
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full border-sidebar-accent transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      aria-label="Alternar tema"
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: theme === "light" ? 0 : 180 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
        className="relative h-5 w-5"
      >
        {theme === "light" ? (
          <Sun className="absolute h-5 w-5 transform rotate-0 transition-all" />
        ) : (
          <Moon className="absolute h-5 w-5 transform rotate-180 transition-all" />
        )}
      </motion.div>
    </Button>
  );
}
