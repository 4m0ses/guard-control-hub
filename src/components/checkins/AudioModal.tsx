
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Headphones, X } from "lucide-react";

interface AudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioUrl: string;
  title: string;
}

const AudioModal = ({ isOpen, onClose, audioUrl, title }: AudioModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-4">
          <audio
            controls
            src={audioUrl}
            className="w-full max-w-sm"
            autoPlay
          />
          <p className="text-center text-sm text-muted-foreground mt-2">
            Use the controls to play, pause, or adjust volume.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AudioModal;
