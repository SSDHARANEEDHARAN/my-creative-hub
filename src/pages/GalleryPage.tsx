import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { MapPin } from "lucide-react";

const GalleryPage = () => {
  const travelPhotos = [
    {
      country: "Japan",
      city: "Tokyo",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
      description: "Neon-lit streets of Shibuya"
    },
    {
      country: "Italy",
      city: "Rome",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop",
      description: "Ancient Colosseum at sunset"
    },
    {
      country: "Iceland",
      city: "Reykjavik",
      image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&h=400&fit=crop",
      description: "Northern Lights magic"
    },
    {
      country: "Thailand",
      city: "Bangkok",
      image: "https://images.unsplash.com/photo-1508009603885-50cf7c579f7c?w=600&h=400&fit=crop",
      description: "Golden temples at dawn"
    },
    {
      country: "Portugal",
      city: "Lisbon",
      image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop",
      description: "Colorful tram streets"
    },
    {
      country: "Morocco",
      city: "Marrakech",
      image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&h=400&fit=crop",
      description: "Vibrant medina markets"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Gallery | Tharaneetharan SS - Travel Adventures</title>
        <meta name="description" content="Explore travel photos from around the world - Japan, Italy, Iceland, Thailand, Portugal, Morocco and more." />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-6">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <span className="text-primary font-medium text-sm tracking-widest uppercase mb-4 block">
                    Adventures
                  </span>
                  <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                    Travel <span className="text-gradient">Gallery</span>
                  </h1>
                  <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    Moments captured from around the world — each destination inspiring new perspectives and creativity.
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {travelPhotos.map((photo, index) => (
                  <ScrollReveal key={index} delay={index * 100}>
                    <div className="group relative overflow-hidden rounded-2xl cursor-pointer">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={photo.image}
                          alt={`${photo.city}, ${photo.country}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
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
    </>
  );
};

export default GalleryPage;
