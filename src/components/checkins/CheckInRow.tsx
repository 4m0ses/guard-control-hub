
import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckIn } from "@/types/checkIn";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, User, MapPin, Clock, ArrowRight } from "lucide-react";
import AudioModal from "./AudioModal";
import TranscriptTooltip from "./TranscriptTooltip";

interface CheckInRowProps {
  checkin: CheckIn;
}

const CheckInRow = ({ checkin }: CheckInRowProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDuration = (ms: number | null): string => {
    if (!ms) return "N/A";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "missed":
        return <Badge variant="destructive">Missed</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // In a real app, we would use real data based on IDs
  const guardName = "Guard #" + Math.floor(Math.random() * 9000 + 1000);
  const siteName = ["Downtown Office", "Westside Mall", "Corporate HQ", "Riverside Apartments"][
    Math.floor(Math.random() * 4)
  ];

  return (
    <>
      <TableRow className="hover:bg-muted/50">
        <TableCell className="font-medium">{checkin.call_id || `Call-${checkin.id}`}</TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4 text-muted-foreground" />
            {guardName}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {siteName}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {checkin.start_timestamp 
              ? formatDistanceToNow(new Date(checkin.start_timestamp * 1000), { addSuffix: true })
              : "Unknown"}
          </div>
        </TableCell>
        <TableCell>{formatDuration(checkin.duration_ms)}</TableCell>
        <TableCell>{getStatusBadge(checkin.call_status || "completed")}</TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            {checkin.transcript && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TranscriptTooltip transcript={checkin.transcript} />
              </Tooltip>
            )}
            
            {checkin.recording_url && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setIsModalOpen(true)}
              >
                <span>Play</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
      
      <AudioModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        audioUrl={checkin.recording_url || ""} 
        title={`Call Recording: ${checkin.call_id || `Call-${checkin.id}`}`}
      />
    </>
  );
};

export default CheckInRow;
