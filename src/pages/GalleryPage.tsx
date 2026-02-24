import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ImageLightbox from "@/components/ImageLightbox";
import { MapPin } from "lucide-react";

const GalleryPage = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const travelPhotos = [
    { country: "India", city: "Namakkal", image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=600&h=400&fit=crop", description: "Historic Namakkal Fort & Rock" },
    { country: "India", city: "Ooty", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", description: "Misty Nilgiri Hills retreat" },
    { country: "India", city: "Pondicherry", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop", description: "French Quarter coastal charm" },
    { country: "India", city: "Rameswaram", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=400&fit=crop", description: "Sacred island temple town" },
    { country: "India", city: "Kodaikanal", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop", description: "Princess of Hill stations" },
    { country: "India", city: "Mahabalipuram", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400&fit=crop", description: "UNESCO heritage shore temples" },
  ];

  const lightboxImages = travelPhotos.map((p) => ({ src: p.image, alt: `${p.city}, ${p.country}` }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Gallery | Dharaneedharan SS - Travel Adventures in India</title>
        <meta name="description" content="Explore travel photos from beautiful places across India - Namakkal, Ooty, Pondicherry, Rameswaram, Kodaikanal and more." />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-6">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <span className="text-primary font-medium text-sm tracking-widest uppercase mb-4 block">Adventures</span>
                  <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">Travel <span className="text-gradient">Gallery</span></h1>
                  <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Moments captured from around the world — each destination inspiring new perspectives and creativity.</p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {travelPhotos.map((photo, index) => (
                  <ScrollReveal key={index} delay={index * 100}>
                    <div
                      className="group relative overflow-hidden rounded-2xl cursor-pointer"
                      onClick={() => openLightbox(index)}
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
        </main>
        <Footer />
      </div>

      <ImageLightbox images={lightboxImages} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </>
  );
};

export default GalleryPage;
