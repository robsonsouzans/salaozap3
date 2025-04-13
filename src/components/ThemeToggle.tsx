
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
      description: `O tema foi alterado para o modo ${newTheme === 'dark' ? 'escuro' : 'claro'}`,
      variant: "success",
    });
  };
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full border-sidebar-accent transition-all duration-300 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105 relative overflow-hidden"
      aria-label="Alternar tema"
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: theme === "light" ? 0 : 180 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
        className="relative h-5 w-5"
      >
        {theme === "light" ? (
          <Sun className="absolute h-5 w-5 transform rotate-0 transition-all text-amber-500" />
        ) : (
          <Moon className="absolute h-5 w-5 transform rotate-180 transition-all text-indigo-300" />
        )}
      </motion.div>
      <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-sidebar-accent/0 to-sidebar-accent/20 animate-pulse-gentle opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    </Button>
  );
}
