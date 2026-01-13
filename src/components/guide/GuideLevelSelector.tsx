import { TechnicalLevel } from './types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { BookOpen, Code, Cpu } from 'lucide-react';

interface GuideLevelSelectorProps {
  level: TechnicalLevel;
  onLevelChange: (level: TechnicalLevel) => void;
}

export function GuideLevelSelector({ level, onLevelChange }: GuideLevelSelectorProps) {
  const levels: { id: TechnicalLevel; label: string; icon: typeof BookOpen; description: string }[] = [
    { 
      id: 'basico', 
      label: 'Básico', 
      icon: BookOpen,
      description: 'Usuario no técnico'
    },
    { 
      id: 'intermedio', 
      label: 'Intermedio', 
      icon: Code,
      description: 'Administrador IT'
    },
    { 
      id: 'avanzado', 
      label: 'Avanzado', 
      icon: Cpu,
      description: 'APIs y arquitectura'
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-muted-foreground">Nivel técnico:</span>
        <Badge variant="outline" className="bg-primary/10 text-primary">
          {levels.find(l => l.id === level)?.label}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {levels.map((lvl) => {
          const Icon = lvl.icon;
          const isActive = level === lvl.id;
          
          return (
            <Button
              key={lvl.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onLevelChange(lvl.id)}
              className={`justify-start gap-2 h-auto py-2 ${
                isActive ? '' : 'hover:bg-secondary/10'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <div className="flex flex-col items-start text-left">
                <span className="font-semibold text-sm">{lvl.label}</span>
                <span className={`text-xs ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {lvl.description}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
