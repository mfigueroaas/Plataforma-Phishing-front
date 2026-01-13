import { useState, useEffect, useRef } from 'react';
import { GuideSection as GuideSectionType, TechnicalLevel } from './types';
import { GuideNavigation } from './GuideNavigation';
import { GuideSearch } from './GuideSearch';
import { GuideLevelSelector } from './GuideLevelSelector';
import { GuideSection } from './GuideSection';
import { introductionSections } from './sections-intro';
import { setupSections } from './sections-setup';
import { dashboardGroupsSections } from './sections-dashboard-groups';
import { templatesLandingSmtpSections } from './sections-templates-landing-smtp';
import { campaignsSections } from './sections-campaigns';
import { toolsAdminSections } from './sections-tools-admin';
import { annexesSections } from './sections-annexes';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { 
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

export function UserGuide() {
  const [level, setLevel] = useState<TechnicalLevel>('basico');
  const [activeSection, setActiveSection] = useState('introduccion');
  const [activeSubsection, setActiveSubsection] = useState('que-es');
  const scrollRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Scroll suave al cambiar de sección
  useEffect(() => {
    // Buscar el viewport dentro del ScrollArea ref
    const timer = setTimeout(() => {
      if (viewportRef.current) {
        viewportRef.current.scrollTop = 0;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeSection, activeSubsection]);

  const handleNavigate = (sectionId: string, subsectionId: string) => {
    setActiveSection(sectionId);
    setActiveSubsection(subsectionId);
  };

  const handleSearchResult = (sectionId: string, subsectionId: string) => {
    handleNavigate(sectionId, subsectionId);
  };

  // Navegar a siguiente/anterior subsección
  const navigateToNext = () => {
    const currentSectionIndex = sections.findIndex(s => s.id === activeSection);
    const currentSection = sections[currentSectionIndex];
    const currentSubIndex = currentSection.subsections.findIndex(
      sub => sub.id === activeSubsection
    );

    if (currentSubIndex < currentSection.subsections.length - 1) {
      // Siguiente subsección en la misma sección
      handleNavigate(
        activeSection,
        currentSection.subsections[currentSubIndex + 1].id
      );
    } else if (currentSectionIndex < sections.length - 1) {
      // Primera subsección de la siguiente sección
      const nextSection = sections[currentSectionIndex + 1];
      handleNavigate(nextSection.id, nextSection.subsections[0].id);
    }
  };

  const navigateToPrevious = () => {
    const currentSectionIndex = sections.findIndex(s => s.id === activeSection);
    const currentSection = sections[currentSectionIndex];
    const currentSubIndex = currentSection.subsections.findIndex(
      sub => sub.id === activeSubsection
    );

    if (currentSubIndex > 0) {
      // Subsección anterior en la misma sección
      handleNavigate(
        activeSection,
        currentSection.subsections[currentSubIndex - 1].id
      );
    } else if (currentSectionIndex > 0) {
      // Última subsección de la sección anterior
      const prevSection = sections[currentSectionIndex - 1];
      const lastSubsection = prevSection.subsections[prevSection.subsections.length - 1];
      handleNavigate(prevSection.id, lastSubsection.id);
    }
  };

  const scrollToTop = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }
  };

  // Combinar todas las secciones
  const sections: GuideSectionType[] = [
    ...introductionSections,
    ...setupSections,
    ...dashboardGroupsSections,
    ...templatesLandingSmtpSections,
    ...campaignsSections,
    ...toolsAdminSections,
    ...annexesSections,
  ];

  const currentSection = sections.find(s => s.id === activeSection);
  const currentSubsection = currentSection?.subsections.find(
    sub => sub.id === activeSubsection
  );

  const isFirstSubsection = activeSection === sections[0].id && 
                           activeSubsection === sections[0].subsections[0].id;
  const isLastSubsection = activeSection === sections[sections.length - 1].id &&
                          activeSubsection === sections[sections.length - 1].subsections[
                            sections[sections.length - 1].subsections.length - 1
                          ].id;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-80 lg:w-[21rem] xl:w-[22rem] 2xl:w-[23rem] border-r bg-card p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 pb-2">
          <div className="p-2 bg-primary rounded-lg">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Guía de Usuario</h1>
            <p className="text-xs text-muted-foreground">Plataforma Phishing UTEM</p>
          </div>
        </div>

        <Separator className="my-1" />

        {/* Búsqueda */}
        <GuideSearch sections={sections} onResultClick={handleSearchResult} />

        <Separator className="my-1" />

        {/* Navegación */}
        <GuideNavigation
          sections={sections}
          activeSection={activeSection}
          activeSubsection={activeSubsection}
          onNavigate={handleNavigate}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <ScrollArea className="flex-1" ref={scrollRef} viewportRef={viewportRef}>
          <div className="max-w-4xl mx-auto px-8 pt-16 pb-24">
            {/* Breadcrumbs */}
            <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground mb-12 pb-6 border-b">
              <Home className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
              <span>{currentSection?.title}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">
                {currentSubsection?.title}
              </span>
            </div>

            {/* Section Header for clear separation */}
            {currentSection && (
              <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {currentSection.title}
                </h1>
                <Separator className="mt-3" />
              </div>
            )}

            {/* Contenido */}
            {currentSubsection && (
              <div className="mt-12">
                <GuideSection subsection={currentSubsection} level={level} />
              </div>
            )}

            {/* Navegación inferior */}
            <div className="flex items-center justify-between mt-16 pt-8 border-t">
              <Button
                variant="outline"
                onClick={navigateToPrevious}
                disabled={isFirstSubsection}
                className="gap-2 min-w-[120px]"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="gap-2"
              >
                <ChevronUp className="w-4 h-4" />
                Volver arriba
              </Button>

              <Button
                variant="default"
                onClick={navigateToNext}
                disabled={isLastSubsection}
                className="gap-2 min-w-[120px]"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
