import { useState, useMemo } from 'react';
import { Input } from '../ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '../ui/button';
import { GuideSection, SearchResult } from './types';
import { ScrollArea } from '../ui/scroll-area';

interface GuideSearchProps {
  sections: GuideSection[];
  onResultClick: (sectionId: string, subsectionId: string) => void;
}

export function GuideSearch({ sections, onResultClick }: GuideSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();
    const results: SearchResult[] = [];

    sections.forEach((section) => {
      section.subsections.forEach((subsection) => {
        // Buscar en título de sección
        if (section.title.toLowerCase().includes(term)) {
          results.push({
            sectionId: section.id,
            subsectionId: subsection.id,
            sectionTitle: section.title,
            subsectionTitle: subsection.title,
          });
          return;
        }

        // Buscar en título de subsección
        if (subsection.title.toLowerCase().includes(term)) {
          results.push({
            sectionId: section.id,
            subsectionId: subsection.id,
            sectionTitle: section.title,
            subsectionTitle: subsection.title,
          });
          return;
        }

        // Buscar en keywords
        if (subsection.searchKeywords?.some(kw => kw.toLowerCase().includes(term))) {
          const matchedKeyword = subsection.searchKeywords.find(kw => 
            kw.toLowerCase().includes(term)
          );
          results.push({
            sectionId: section.id,
            subsectionId: subsection.id,
            sectionTitle: section.title,
            subsectionTitle: subsection.title,
            matchedKeyword,
          });
        }
      });
    });

    return results;
  }, [searchTerm, sections]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Buscar en la guía..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm('')}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {searchTerm && (
        <div className="border rounded-lg bg-card">
          <ScrollArea className="h-[300px]">
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No se encontraron resultados para "{searchTerm}"
              </div>
            ) : (
              <div className="divide-y">
                {searchResults.map((result, idx) => (
                  <button
                    key={`${result.sectionId}-${result.subsectionId}-${idx}`}
                    onClick={() => {
                      onResultClick(result.sectionId, result.subsectionId);
                      setSearchTerm('');
                    }}
                    className="w-full text-left p-3 hover:bg-secondary/10 transition-colors"
                  >
                    <div className="text-xs text-muted-foreground mb-1">
                      {result.sectionTitle}
                    </div>
                    <div className="text-sm font-medium">
                      {result.subsectionTitle}
                    </div>
                    {result.matchedKeyword && (
                      <div className="text-xs text-primary mt-1">
                        Coincidencia: {result.matchedKeyword}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
