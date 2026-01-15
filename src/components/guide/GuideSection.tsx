import { TechnicalLevel, GuideSubsection } from './types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle, Info, Lightbulb, Code2, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/badge';

interface GuideSectionProps {
  subsection: GuideSubsection;
  level: TechnicalLevel;
}

export function GuideSection({ subsection, level }: GuideSectionProps) {
  const content = subsection.content[level] || subsection.content.basico;

  return (
    <div className="space-y-8" id={subsection.id}>
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-3">{subsection.title}</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            Nivel: {level}
          </Badge>
        </div>
      </div>

      <div className="prose prose-base max-w-none dark:prose-invert prose-headings:scroll-mt-20">
        {content}
      </div>
    </div>
  );
}

// Componentes auxiliares reutilizables para el contenido
export function Warning({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}

export function InfoBox({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <Alert className="my-4 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
      <Info className="h-4 w-4 text-blue-600" />
      {title && <AlertTitle className="text-blue-900 dark:text-blue-100">{title}</AlertTitle>}
      <AlertDescription className="text-blue-800 dark:text-blue-200">
        {children}
      </AlertDescription>
    </Alert>
  );
}

export function Tip({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <Alert className="my-4 border-green-200 bg-green-50 dark:bg-green-950/20">
      <Lightbulb className="h-4 w-4 text-green-600" />
      {title && <AlertTitle className="text-green-900 dark:text-green-100">{title}</AlertTitle>}
      <AlertDescription className="text-green-800 dark:text-green-200">
        {children}
      </AlertDescription>
    </Alert>
  );
}

export function CodeBlock({ children, language }: { children: string; language?: string }) {
  return (
    <div className="my-4 relative">
      {language && (
        <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {language}
        </div>
      )}
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">{children}</code>
      </pre>
    </div>
  );
}

export function StepByStep({ 
  steps, 
  title 
}: { 
  steps: { title: string; content: React.ReactNode }[]; 
  title?: string;
}) {
  return (
    <div className="my-6 space-y-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {steps.map((step, index) => (
        <Card key={index} className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {index + 1}
              </div>
              {step.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {step.content}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SuccessBox({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <Alert className="my-4 border-green-200 bg-green-50 dark:bg-green-950/20">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      {title && <AlertTitle className="text-green-900 dark:text-green-100">{title}</AlertTitle>}
      <AlertDescription className="text-green-800 dark:text-green-200">
        {children}
      </AlertDescription>
    </Alert>
  );
}
