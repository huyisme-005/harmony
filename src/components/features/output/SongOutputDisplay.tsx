/**
 * @fileOverview SongOutputDisplay component for La Musique.
 * This component is responsible for displaying the outputs of the song creation process,
 * including the generated lyrics, melody details (description, singing instructions,
 * MusicXML representation), and AI-generated lyric feedback. It uses sectioned cards
 * for organized presentation.
 *
 * @exports SongOutputDisplay - The React functional component for displaying song outputs.
 */
"use client";

import React, { type FC, useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, ListMusic, Disc3, UserRoundCheck, MessageSquareQuote, ShieldAlert } from 'lucide-react';
import type { GenerateMelodyOutput } from '@/ai/flows/generate-melody';
import { useToast } from "@/hooks/use-toast";


interface SongSectionCardProps {
  title: string;
  icon: React.ElementType;
  description?: string;
  children: React.ReactNode;
  contentClassName?: string;
  footerContent?: React.ReactNode;
}

const SongSectionCard: FC<SongSectionCardProps> = ({ title, icon: Icon, description, children, contentClassName, footerContent }) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="flex-1 flex flex-col min-w-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Icon className="text-primary" /> {title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea
          type="scroll"
          className="w-full flex-grow"
          viewportRef={viewportRef}
        >
          <div className={`min-w-max p-4 ${contentClassName || ''}`}>
            {children}
          </div>
        </ScrollArea>
      </CardContent>
      {footerContent && (
        <CardFooter className="pt-4 border-t">
          {footerContent}
        </CardFooter>
      )}
    </Card>
  );
};


interface SongOutputDisplayProps {
  lyrics: string;
  melody: GenerateMelodyOutput | null;
}

const SongOutputDisplay: FC<SongOutputDisplayProps> = ({ lyrics, melody }) => {
  const { toast } = useToast();

  const handleScanLyrics = () => {
    toast({
      title: "Feature Not Implemented",
      description: "Lyrics plagiarism scanning will be available in a future update.",
      variant: "default",
    });
  };


  return (
    <div className="space-y-6 h-full flex flex-col">
      <SongSectionCard
        title="Generated Lyrics"
        icon={FileText}
        contentClassName="h-[calc(33vh-120px)] md:h-auto"
        footerContent={
            <div className="w-full">
                <Button onClick={handleScanLyrics} disabled={!lyrics || lyrics.trim() === ""} className="w-full sm:w-auto">
                    <ShieldAlert className="mr-2" />
                    Scan Lyrics for Plagiarism (Future Feature)
                </Button>
            </div>
        }
      >
        <ScrollArea className="h-full w-full rounded-md border p-4 bg-muted/30">
          {lyrics ? (
            <pre className="whitespace-pre-wrap text-sm font-mono">{lyrics}</pre>
          ) : (
            <p className="text-muted-foreground italic">Your generated lyrics will appear here once crafted.</p>
          )}
        </ScrollArea>
      </SongSectionCard>

      <SongSectionCard
        title="Generated Melody"
        icon={ListMusic}
        description="Details about the composed melody, including how to sing it."
        contentClassName="h-[calc(33vh-140px)] md:h-auto"
      >
        <ScrollArea className="h-full w-full rounded-md border p-4 bg-muted/30">
          {melody ? (
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-1"><UserRoundCheck size={16} className="text-accent"/> Melody & Singing Instructions:</h4>
                <p className="text-sm whitespace-pre-wrap mt-1">{melody.description}</p>
              </div>
              <div className="pt-2">
                <h4 className="font-semibold text-sm">Melody Structure (MusicXML Representation):</h4>
                <p className="text-xs text-muted-foreground italic">(MusicXML data is generated for structural representation. Actual playback/visualization is a future feature.)</p>
                <ScrollArea className="max-h-[100px] bg-background p-2 rounded mt-1" type="auto">
                   <pre className="whitespace-pre text-xs">
                    {melody.melody}
                  </pre>
                </ScrollArea>
              </div>
               <div className="flex items-center justify-center pt-4 text-muted-foreground">
                  <Disc3 size={32} className="mr-2 animate-spin [animation-duration:3s]" />
                  <p>Melody visualization & playback coming soon!</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">Melody details and singing instructions will appear here once composed.</p>
          )}
        </ScrollArea>
      </SongSectionCard>

      {melody?.lyricFeedback && (
        <SongSectionCard
          title="AI Lyric Feedback"
          icon={MessageSquareQuote}
          description="Suggestions and analysis for the lyrics used to generate the melody."
          contentClassName="h-[calc(33vh-140px)] md:h-auto"
        >
          <ScrollArea className="h-full w-full rounded-md border p-4 bg-muted/30">
            <p className="text-sm whitespace-pre-wrap">{melody.lyricFeedback}</p>
          </ScrollArea>
        </SongSectionCard>
      )}
    </div>
  );
};

export default SongOutputDisplay;
