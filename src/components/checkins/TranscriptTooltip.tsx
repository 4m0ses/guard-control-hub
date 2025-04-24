
import { TooltipContent } from "@/components/ui/tooltip";

interface TranscriptTooltipProps {
  transcript: string;
}

const TranscriptTooltip = ({ transcript }: TranscriptTooltipProps) => {
  // Limit transcript to a reasonable length for tooltip
  const maxLength = 300;
  const displayText = transcript.length > maxLength
    ? `${transcript.substring(0, maxLength)}...`
    : transcript;
  
  return (
    <TooltipContent className="max-w-md p-4 bg-white border shadow-lg">
      <div className="space-y-2">
        <h4 className="font-medium">Call Transcript</h4>
        <p className="text-sm">{displayText}</p>
        {transcript.length > maxLength && (
          <p className="text-xs text-muted-foreground">
            (Showing first {maxLength} characters)
          </p>
        )}
      </div>
    </TooltipContent>
  );
};

export default TranscriptTooltip;
