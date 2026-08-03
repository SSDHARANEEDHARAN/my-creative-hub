import { useState, memo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectImageCarouselProps {
  images: string[];
  title: string;
  onImageClick?: (index: number) => void;
}

const ProjectImageCarousel = memo(({ images, title, onImageClick }: ProjectImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const goToPrevious = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleDotClick = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setImageLoaded(false);
    setCurrentIndex(index);
  }, []);

  return (
    <div className="relative w-full h-full group/carousel bg-muted">
      {/* Current Image */}
      <img
        src={images[currentIndex]}
        alt={`${title} - Image ${currentIndex + 1}`}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${onImageClick ? 'cursor-pointer' : ''}`}
        loading={currentIndex === 0 ? "lazy" : "eager"}
        decoding="async"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(true)}
        onClick={(e) => { if (onImageClick) { e.stopPropagation(); onImageClick(currentIndex); } }}
      />

      {/* Shimmer placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 overflow-hidden bg-muted animate-pulse" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Preload the next image so swipes feel instant */}
      {images.length > 1 && (
        <img
          src={images[(currentIndex + 1) % images.length]}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          className="absolute w-px h-px opacity-0 pointer-events-none -z-10"
        />
      )}

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 backdrop-blur-sm text-foreground opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 hover:bg-background hover:scale-105 shadow-lg z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 backdrop-blur-sm text-foreground opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 hover:bg-background hover:scale-105 shadow-lg z-10"
            aria-label="Next image"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => handleDotClick(e, index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-primary w-4"
                  : "bg-background/70 hover:bg-background"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground z-10">
        {currentIndex + 1}/{images.length}
      </div>
    </div>
  );
});

ProjectImageCarousel.displayName = 'ProjectImageCarousel';

export default ProjectImageCarousel;
