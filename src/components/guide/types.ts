export type TechnicalLevel = 'basico' | 'intermedio' | 'avanzado';

export interface GuideSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  subsections: GuideSubsection[];
}

export interface GuideSubsection {
  id: string;
  title: string;
  content: {
    basico: React.ReactNode;
    intermedio?: React.ReactNode;
    avanzado?: React.ReactNode;
  };
  searchKeywords?: string[];
}

export interface SearchResult {
  sectionId: string;
  subsectionId: string;
  sectionTitle: string;
  subsectionTitle: string;
  matchedKeyword?: string;
}
