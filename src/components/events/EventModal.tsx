import { Calendar, MapPin, Monitor, Users, GraduationCap, FileText, Mic, Briefcase } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaGallery } from "./MediaGallery";
import { ShareButtons } from "./ShareButtons";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  monitor: Monitor,
  users: Users,
  "graduation-cap": GraduationCap,
  "file-text": FileText,
  mic: Mic,
  briefcase: Briefcase,
};

const categoryLabels: Record<string, string> = {
  meeting: "Заседание",
  networking: "Нетворкинг",
  education: "Образование",
  law: "Закон",
  conference: "Конференция",
  visit: "Визит",
};

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventUrl?: string;
  event: {
    id: string;
    title: string;
    description: string;
    fullContent?: string;
    date: string;
    category: string;
    location: string;
    icon: string;
    media?: { images: string[]; videos: string[] };
    stats?: { views: number; likes: number; shares: number };
  } | null;
}

export const EventModal = ({ isOpen, onClose, event, eventUrl }: EventModalProps) => {
  if (!event) return null;

  const IconComponent = iconMap[event.icon] || Monitor;
  const formattedDate = new Date(event.date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
              <IconComponent className="w-5 h-5" />
            </div>
            <span className="px-2 py-1 bg-muted border border-border rounded text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {categoryLabels[event.category] || event.category}
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Media Gallery */}
          {event.media && (event.media.images.length > 0 || event.media.videos.length > 0) && (
            <MediaGallery images={event.media.images} videos={event.media.videos} />
          )}

          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {event.fullContent || event.description}
            </p>
          </div>

          {/* Share Buttons */}
          {event.stats && (
            <ShareButtons
              title={event.title}
              url={eventUrl}
              stats={event.stats}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
