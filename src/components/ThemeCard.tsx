
import { Book, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeCardProps {
  title: string;
  description: string;
  progress: number;
  questionsCount: number;
  timeSpent: string;
  className?: string;
}

export const ThemeCard = ({
  title,
  description,
  progress,
  questionsCount,
  timeSpent,
  className,
}: ThemeCardProps) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md",
        "animate-fade-in",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative space-y-4">
        <div className="space-y-2">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Tema Médico
          </span>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Book className="h-4 w-4 text-primary" />
            <span className="text-sm text-gray-600">
              {questionsCount} questões disponíveis
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm text-gray-600">
              Tempo de estudo: {timeSpent}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Progresso</span>
              <span className="text-sm font-medium text-primary">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-1 text-success">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Última revisão em dia</span>
          </div>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90">
            Estudar
          </button>
        </div>
      </div>
    </div>
  );
};
