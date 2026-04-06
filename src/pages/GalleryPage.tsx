import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ImageLightbox from "@/components/ImageLightbox";
import { MapPin, Factory } from "lucide-react";
import { industrialProjects } from "@/data/projectsData";

const GalleryPage = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<{ src: string; alt: string }[]>([]);

  const travelPhotos = [
    { country: "India", city: "Namakkal", image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=600&h=400&fit=crop", description: "Historic Namakkal Fort & Rock" },
    { country: "India", city: "Ooty", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", description: "Misty Nilgiri Hills retreat" },
    { country: "India", city: "Pondicherry", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop", description: "French Quarter coastal charm" },
    { country: "India", city: "Rameswaram", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=400&fit=crop", description: "Sacred island temple town" },
    { country: "India", city: "Kodaikanal", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop", description: "Princess of Hill stations" },
    { country: "India", city: "Mahabalipuram", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400&fit=crop", description: "UNESCO heritage shore temples" },
  ];

  const openTravelLightbox = (index: number) => {
    const imgs = travelPhotos.map((p) => ({ src: p.image, alt: `${p.city}, ${p.country}` }));
    setLightboxImages(imgs);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const openProjectLightbox = (project: typeof industrialProjects[0], imageIndex: number) => {
    const imgs = (project.images || []).map((src, i) => ({ src, alt: `${project.title} - Image ${i + 1}` }));
    setLightboxImages(imgs);
    setLightboxIndex(imageIndex);
    setLightboxOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Gallery | Dharaneedharan SS - Travel & Project Gallery</title>
        <meta name="description" content="Explore travel photos and industrial project galleries including Cobot Trainer Kit and Modular Manufacturing System." />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          {/* Travel Photos Section */}
          <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6">
              <ScrollReveal>
                <div className="text-center mb-10 sm:mb-16">
                  <span className="text-primary font-medium text-xs sm:text-sm tracking-widest uppercase mb-4 block">Adventures</span>
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">Travel <span className="text-gradient">Gallery</span></h1>
                  <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">Moments captured from around the world — each destination inspiring new perspectives and creativity.</p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {travelPhotos.map((photo, index) => (
                  <ScrollReveal key={index} delay={index * 100}>
                    <div
                      className="group relative overflow-hidden rounded-2xl cursor-pointer"
                      onClick={() => openTravelLightbox(index)}
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={photo.image} alt={`${photo.city}, ${photo.country}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <MapPin size={16} />
                          <span className="text-sm font-medium">{photo.city}, {photo.country}</span>
                        </div>
                        <p className="text-foreground font-medium">{photo.description}</p>
                      </div>
                      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs font-medium text-foreground">{photo.country}</span>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Industrial Projects Gallery Section */}
          <section className="py-12 sm:py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6">
              <ScrollReveal>
                <div className="text-center mb-10 sm:mb-16">
                  <span className="text-primary font-medium text-xs sm:text-sm tracking-widest uppercase mb-4 block flex items-center justify-center gap-2">
                    <Factory size={16} />
                    Industrial Projects
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Project <span className="text-gradient">Gallery</span></h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
                    Explore the visual documentation of our industrial-grade didactic systems and robotics platforms.
                  </p>
                </div>
              </ScrollReveal>

              {industrialProjects.map((project) => (
                <div key={project.id} className="mb-16">
                  <ScrollReveal>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-6 max-w-3xl text-sm sm:text-base">{project.description}</p>
                    <div className="text-xs text-muted-foreground mb-4">{project.images?.length || 0} images</div>
                  </ScrollReveal>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {(project.images || []).map((image, imgIndex) => (
                      <ScrollReveal key={imgIndex} delay={Math.min(imgIndex * 30, 300)}>
                        <div
                          className="group relative overflow-hidden rounded-lg cursor-pointer aspect-square"
                          onClick={() => openProjectLightbox(project, imgIndex)}
                        >
                          <img
                            src={image}
                            alt={`${project.title} - Image ${imgIndex + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300" />
                          <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            {imgIndex + 1}/{project.images?.length}
                          </div>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>

      <ImageLightbox images={lightboxImages} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </>
  );
};

export default GalleryPage;
