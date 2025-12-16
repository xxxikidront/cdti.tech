import { useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Play, Pause, Image as ImageIcon, Volume2, VolumeX } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MediaGalleryProps {
  images: string[];
  videos: string[];
  compact?: boolean;
}

const isLocalVideo = (url: string) => {
  return url.startsWith('/') || url.startsWith('./') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
};

export const MediaGallery = ({ images, videos, compact = false }: MediaGalleryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const totalMedia = images.length + videos.length;

  if (totalMedia === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openGallery = (index: number, isVideo = false, videoIdx = 0) => {
    setCurrentIndex(index);
    setShowVideo(isVideo);
    setCurrentVideoIndex(videoIdx);
    setIsOpen(true);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {images.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openGallery(0);
            }}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{images.length}</span>
          </button>
        )}
        {videos.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openGallery(0, true, 0);
            }}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{videos.length}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
        {images.slice(0, 3).map((image, index) => (
          <button
            key={index}
            onClick={() => openGallery(index)}
            className="relative aspect-square rounded-lg overflow-hidden bg-muted hover:opacity-90 transition-opacity"
          >
            <img
              src={image}
              alt={`Фото ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </button>
        ))}
        {(images.length > 3 || videos.length > 0) && (
          <button
            onClick={() => images.length > 3 ? openGallery(3) : openGallery(0, true, 0)}
            className="relative aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <div className="text-center">
              <span className="text-lg font-medium text-foreground">
                +{Math.max(0, images.length - 3) + videos.length}
              </span>
              <p className="text-[10px] text-muted-foreground">ещё</p>
            </div>
          </button>
        )}
      </div>

      {/* Video Thumbnails */}
      {videos.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {videos.map((video, index) => (
            <button
              key={index}
              onClick={() => openGallery(0, true, index)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Play className="w-3 h-3" />
              <span>Видео {index + 1}</span>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 bg-foreground/95 border-none [&>button]:hidden">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background hover:bg-background/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {showVideo ? (
            <div className="aspect-video relative bg-black">
              {isLocalVideo(videos[currentVideoIndex]) ? (
                <>
                  <video
                    ref={videoRef}
                    src={videos[currentVideoIndex]}
                    className="w-full h-full object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center text-background hover:bg-background/30 transition-colors"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center text-background hover:bg-background/30 transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <iframe
                  src={videos[currentVideoIndex]}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          ) : (
            <div className="relative">
              <img
                src={images[currentIndex]}
                alt={`Фото ${currentIndex + 1}`}
                className="w-full max-h-[80vh] object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background hover:bg-background/20 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background hover:bg-background/20 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? "bg-background" : "bg-background/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
