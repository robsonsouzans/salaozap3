
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";

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
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
      aria-label="Alternar tema"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
