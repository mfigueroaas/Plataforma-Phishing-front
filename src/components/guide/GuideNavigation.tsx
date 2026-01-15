import { GuideSection } from './types';
import { Button } from '../ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';

interface GuideNavigationProps {
  sections: GuideSection[];
  activeSection: string;
  activeSubsection: string;
  onNavigate: (sectionId: string, subsectionId: string) => void;
}

export function GuideNavigation({
  sections,
  activeSection,
  activeSubsection,
  onNavigate,
}: GuideNavigationProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([activeSection])
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  return (
    <ScrollArea className="flex-1">
      <nav className="space-y-1 pr-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.has(section.id);
          const isActive = activeSection === section.id;

          return (
            <div key={section.id} className="space-y-1">
              {/* Sección principal */}
              <Button
                variant="ghost"
                className={`!flex w-full h-auto py-2.5 px-3.5 text-left justify-between ${
                  isActive ? 'bg-accent/30 text-foreground' : ''
                }`}
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {section.title}
                  </span>
                </div>
                <div className="flex-shrink-0 ml-3">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </Button>

              {/* Subsecciones */}
              {isExpanded && (
                <div className="ml-7 space-y-0.5 border-l-2 border-border pl-4">
                  {section.subsections.map((subsection) => {
                    const isSubActive =
                      activeSection === section.id &&
                      activeSubsection === subsection.id;

                    return (
                      <Button
                        key={subsection.id}
                        variant={isSubActive ? 'default' : 'ghost'}
                        size="sm"
                        className="w-full justify-start text-left h-auto py-2 px-4"
                        onClick={() => onNavigate(section.id, subsection.id)}
                      >
                        <span className="text-xs truncate">
                          {subsection.title}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Indicador de progreso */}
        <div className="pt-4 mt-4 border-t">
          <div className="text-xs text-muted-foreground text-center">
            {sections.length} secciones
          </div>
          <Badge variant="outline" className="w-full justify-center mt-2">
            Guía completa
          </Badge>
        </div>
      </nav>
    </ScrollArea>
  );
}
