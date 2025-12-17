import { Mail, Phone, Award, Send } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface LeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  leader: {
    id: string;
    name: string;
    initials: string;
    position: string;
    company: string;
    pk: string;
    description: string;
    fullBio?: string;
    photo?: string;
    telegram?: string;
    email?: string;
    phone?: string;
    achievements?: string[];
  } | null;
}

export const LeaderModal = ({ isOpen, onClose, leader }: LeaderModalProps) => {
  if (!leader) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 [&>button]:hidden">
        <div className="relative">
          {/* Header with photo */}
          <div className="bg-muted p-4 sm:p-6 pb-16 sm:pb-20 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
            <span className="px-2 py-1 bg-foreground text-background rounded text-[10px] font-bold uppercase tracking-wider">
              {leader.position}
            </span>
          </div>

          {/* Photo */}
          <div className="absolute left-4 sm:left-6 top-12 sm:top-[4.5rem] w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-background shadow-lg">
            {leader.photo ? (
              <img
                src={leader.photo}
                alt={leader.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-full h-full bg-foreground text-background flex items-center justify-center text-xl sm:text-2xl font-medium">${leader.initials}</div>`;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full bg-foreground text-background flex items-center justify-center text-xl sm:text-2xl font-medium">
                {leader.initials}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 pt-12 sm:pt-16 pb-6">
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground mb-1">
              {leader.name}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">{leader.company}</p>

            {/* Contact */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
              {leader.email && (
                <a
                  href={`mailto:${leader.email}`}
                  className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">{leader.email}</span>
                  <span className="sm:hidden">Email</span>
                </a>
              )}
              {leader.phone && (
                <a
                  href={`tel:${leader.phone}`}
                  className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{leader.phone}</span>
                </a>
              )}
              {leader.telegram && (
                <a
                  href={leader.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram</span>
                </a>
              )}
            </div>

            {/* Achievements */}
            {leader.achievements && leader.achievements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent" />
                  Экспертиза
                </h3>
                <div className="flex flex-wrap gap-2">
                  {leader.achievements.map((achievement, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-accent/10 text-accent text-xs rounded-full"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                {leader.fullBio || leader.description}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
