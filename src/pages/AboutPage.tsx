import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ResumeButton from "@/components/ResumeButton";
import CertificateModal from "@/components/CertificateModal";
import { Code, Cpu, Settings, Wrench, GraduationCap, Briefcase, Target, Lightbulb, MapPin, Calendar, Building2, Award, Mail, Phone } from "lucide-react";
import { socialLinks } from "@/components/SocialLinks";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import aboutProfilePhoto from "@/assets/about-profile.jpg";
import certIndustrial from "@/assets/certificates/industrial-training.avif";
import certInternship from "@/assets/certificates/internship-letter.avif";
import certProfPractice from "@/assets/certificates/professional-practice.avif";
import certFour from "@/assets/certificates/certificate-4.avif";
import certProject from "@/assets/certificates/project-certificate.avif";
import certSix from "@/assets/certificates/certificate-6.avif";
import certSeven from "@/assets/certificates/certificate-7.avif";
import certEight from "@/assets/certificates/certificate-8.avif";
import certWebinar from "@/assets/certificates/webinar-certificate.avif";
import certWebinar2 from "@/assets/certificates/webinar-certificate-2.avif";
import certNss from "@/assets/certificates/nss-certificate.avif";
import certDiploma from "@/assets/certificates/diploma-course-certificate.avif";
import certPp1 from "@/assets/certificates/pp-1.avif";
import certPp2 from "@/assets/certificates/pp-2.avif";
import certIn2 from "@/assets/certificates/industrial-training-2.avif";
import certIn1 from "@/assets/certificates/industrial-training-1.avif";
import certCswa from "@/assets/certificates/cswa-solidworks.jpg";
import certFullStack from "@/assets/certificates/Full Stack Certificate.jpg";

interface DBCertificate {
  id: string; title: string; issuer: string; date: string;
  image_url: string | null; category: string; sort_order: number;
}

interface DBWorkExperience {
  id: string; title: string; company: string; location: string;
  duration: string; description: string; skills: string[];
  category: string; sort_order: number;
}

const fallbackExperience = [
  { company: "Janatics India Pvt Ltd", role: "Mechatronics Design Engineer", duration: "Sep 2023 – Present", location: "Coimbatore, India", description: "Designed Industry 4.0 based mechatronics systems. Developed robotics systems and cobot trainer kits.", skills: ["Industry 4.0", "Robotics", "PLC", "HMI", "IIoT"] },
  { company: "TV Sundram Iyengar & Sons Pvt Ltd", role: "Engine & ECU Diagnostics", duration: "2020 – 2021", location: "Namakkal, India", description: "Worked on engine and ECU diagnostics for automotive systems.", skills: ["Engine Diagnostics", "ECU", "Automotive"] },
  { company: "Rinex Technology Pvt Ltd", role: "Inline Sales Executive", duration: "2023 – 2023", location: "Mangalore, India", description: "Worked as an inline sales executive for technology products.", skills: ["Sales", "Technology", "Client Relations"] },
];

const fallbackCertifications = [
  { name: "Full Stack Developer", issuer: "Certification", year: "2024", image: certFullStack },
  { name: "CSWA - Mechanical Design", issuer: "Dassault Systèmes", year: "2026", image: certCswa },
  { name: "Industrial Training Certificate", issuer: "T V Sundram Iyengar & Sons Pvt Ltd", year: "2018", image: certIndustrial },
  { name: "ICETS'21 - Conference Paper Presentation", issuer: "Muthayammal College of Engineering", year: "2021", image: certIn1 },
  { name: "Industrial Training Certificate", issuer: "Industry Partner", year: "2023", image: certIn2 },
  { name: "Internship Completion Letter", issuer: "Rinex Technologies Pvt Ltd", year: "2023", image: certInternship },
  { name: "Professional Practice Certificate", issuer: "Rinex Technologies Pvt Ltd", year: "2023", image: certProfPractice },
  { name: "Professional Practice - Phase 1", issuer: "Bannari Amman Institute of Technology", year: "2023", image: certPp1 },
  { name: "Professional Practice - Phase 2", issuer: "Bannari Amman Institute of Technology", year: "2023", image: certPp2 },
  { name: "Certificate of Achievement", issuer: "Bannari Amman Institute of Technology", year: "2023", image: certFour },
  { name: "Project Completion Certificate", issuer: "Bannari Amman Institute of Technology", year: "2023", image: certProject },
  { name: "Certificate of Completion", issuer: "Bannari Amman Institute of Technology", year: "2023", image: certSix },
  { name: "Certificate of Participation", issuer: "Bannari Amman Institute of Technology", year: "2023", image: certSeven },
  { name: "Certificate of Excellence", issuer: "Bannari Amman Institute of Technology", year: "2023", image: certEight },
  { name: "NSS Certificate", issuer: "National Service Scheme (NSS)", year: "2023", image: certNss },
  { name: "Diploma Course Completion Certificate", issuer: "Kongunadu Polytechnic College", year: "2020", image: certDiploma },
  { name: "3D Printing & 4D Printing Webinar", issuer: "iNSTA3D Technologies / Coimbatore Institute of Technology", year: "2021", image: certWebinar },
  { name: "ADAS in Modern Cars Webinar", issuer: "SKODA SGA Cars / Coimbatore Institute of Technology", year: "2021", image: certWebinar2 },
];

const AboutPage = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<{ name: string; issuer: string; year: string; image?: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbCertificates, setDbCertificates] = useState<DBCertificate[]>([]);
  const [dbExperiences, setDbExperiences] = useState<DBWorkExperience[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from("certificates").select("*").order("sort_order", { ascending: true }),
      supabase.from("work_experiences").select("*").order("sort_order", { ascending: true }),
    ]).then(([certsRes, expsRes]) => {
      if (certsRes.data) setDbCertificates(certsRes.data as DBCertificate[]);
      if (expsRes.data) setDbExperiences(expsRes.data as DBWorkExperience[]);
    });
  }, []);

  const skills = [
    { icon: <Code size={24} />, title: "Web Development", desc: "React, Python, Full-Stack Apps", color: "text-primary", level: 90 },
    { icon: <Cpu size={24} />, title: "Embedded Systems", desc: "Arduino, IoT, Hardware Integration", color: "text-accent", level: 80 },
    { icon: <Settings size={24} />, title: "CAD Engineering", desc: "SolidWorks, NX, Creo, Windchill", color: "text-primary", level: 92 },
    { icon: <Wrench size={24} />, title: "Simulation", desc: "FlexSim, FEA, Process Optimization", color: "text-accent", level: 85 },
    { icon: <Cpu size={24} />, title: "ROS 2", desc: "Robotics, Navigation, Simulation", color: "text-primary", level: 75 },
    { icon: <Code size={24} />, title: "App Development", desc: "React Native, Mobile, Cross-Platform", color: "text-accent", level: 82 },
  ];

  const highlights = [
    { icon: <GraduationCap size={20} />, text: "B.E. Mechanical Engineering" },
    { icon: <Target size={20} />, text: "Problem Solver" },
    { icon: <Briefcase size={20} />, text: "Cross-Domain Expert" },
    { icon: <Lightbulb size={20} />, text: "Innovative Thinker" },
  ];

  // Use DB data if available, otherwise fallback
  const experiences = dbExperiences.length > 0
    ? dbExperiences.map(e => ({ company: e.company, role: e.title, duration: e.duration, location: e.location, description: e.description, skills: e.skills || [] }))
    : fallbackExperience;

  const certifications = [
    { name: "Full Stack Developer", issuer: "Certification", year: "2024", image: certFullStack },
    ...(dbCertificates.length > 0
      ? dbCertificates.map(c => ({ name: c.title, issuer: c.issuer, year: c.date, image: c.image_url || undefined }))
      : fallbackCertifications.filter(c => c.name !== "Full Stack Developer"))
  ];

  const handleCertificateClick = (cert: { name: string; issuer: string; year: string; image?: string }) => {
    setSelectedCertificate(cert);
    setIsModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>About | Dharaneedharan SS - Mechatronics Design Engineer & Full Stack Developer</title>
        <meta name="description" content="Learn more about Dharaneedharan SS, a versatile professional with expertise in IT development and CAD engineering." />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          {/* Hero Profile Section */}
           <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary/40 -z-10" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }} />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 -z-10" />
            
            <div className="container mx-auto px-4 sm:px-6">
              <ScrollReveal>
                <div className="max-w-4xl mx-auto bg-card border-2 border-border p-4 sm:p-6 md:p-8 lg:p-12 sharp-card mb-10 sm:mb-16">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="shrink-0 group/photo">
                      <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden bg-secondary rounded-lg">
                        <img src={aboutProfilePhoto} alt="Dharaneedharan SS" loading="lazy" decoding="async" width={160} height={160} className="w-full h-full object-cover grayscale group-hover/photo:grayscale-0 transition-all duration-500" />
                      </div>
                      <p className="mt-3 text-[7px] italic text-muted-foreground leading-relaxed max-w-[10rem] text-center mx-auto font-normal group-hover/photo:font-bold transition-all duration-500">
                        "Code the Brain, Move the Machine — Designing the Future || Coding Minds, Moving Machines — Powering Robotics Behind the Scenes"
                      </p>
                    </div>
                    
                    <div className="flex-1">
                       <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Dharaneedharan SS</h1>
                      <p className="text-base sm:text-lg md:text-xl text-primary font-semibold mb-3 sm:mb-4">Mechatronics Design Engineer & Full Stack Developer</p>
                      
                       <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6">
                        <span className="flex items-center gap-1"><MapPin size={14} className="text-primary" />Namakkal, India</span>
                        <span className="flex items-center gap-1 break-all"><Mail size={14} className="text-primary shrink-0" />tharaneetharanss@gmail.com</span>
                        <span className="flex items-center gap-1"><Phone size={14} className="text-primary" />+91 8870086023</span>
                      </div>
                      
                      <div className="flex gap-3 mb-6">
                        {socialLinks.map((link) => (
                          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                             onClick={(e) => { if (link.comingSoon) { e.preventDefault(); toast({ title: "Coming Soon! 🚀", description: `${link.label} page is coming soon.` }); } }}
                             className="w-10 h-10 bg-secondary border-2 border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-all duration-300">
                            <link.icon size={18} />
                          </a>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {highlights.map((item) => (
                          <div key={item.text} className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-2 border border-border">
                            <div className="text-primary">{item.icon}</div>
                            <span className="text-xs font-medium">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <div className="max-w-4xl mx-auto mb-10 sm:mb-16">
                  <div className="section-badge-sharp mb-6">
                    <span className="section-badge-dot-sharp" />
                    <span className="text-secondary-foreground font-medium text-sm uppercase tracking-wider">About Me</span>
                  </div>
                   <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6">
                    I'm a versatile professional with a unique blend of <span className="text-primary font-semibold">IT development</span> and 
                    <span className="text-accent font-semibold"> mechanical engineering</span> expertise. My journey spans across full-stack web development, 
                    embedded systems, and advanced CAD engineering.
                  </p>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8">
                    With hands-on experience in both IT and Non-IT domains, I bring a holistic approach to problem-solving. 
                    Whether it's building responsive web applications with React, developing IoT solutions, or designing complex 
                    assemblies in SolidWorks and NX, I thrive on creating solutions that make a difference.
                  </p>
                  <ResumeButton />
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Experience Section */}
           <section className="py-12 sm:py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 sm:px-6">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <div className="section-badge-sharp mx-auto mb-6">
                    <Building2 size={16} className="text-primary" />
                    <span className="text-secondary-foreground font-medium text-sm uppercase tracking-wider">Work Experience</span>
                  </div>
                   <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">Professional <span className="text-gradient">Journey</span></h2>
                </div>
              </ScrollReveal>

              <div className="max-w-4xl mx-auto space-y-6">
                {experiences.map((exp, index) => (
                  <ScrollReveal key={`${exp.company}-${index}`} delay={index * 100}>
                    <div className="bg-card border-2 border-border p-4 sm:p-6 md:p-8 sharp-card group hover:border-primary transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                        <div className="w-14 h-14 bg-secondary border-2 border-border flex items-center justify-center shrink-0 group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
                          <Building2 size={24} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                            <div>
                              <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">{exp.role}</h3>
                              <p className="text-primary font-semibold">{exp.company}</p>
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar size={14} />{exp.duration}</span>
                              <span className="flex items-center gap-1"><MapPin size={14} />{exp.location}</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">{exp.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {exp.skills.map((skill) => (
                              <span key={skill} className="px-3 py-1 bg-secondary text-xs font-medium border border-border group-hover:border-primary/30 transition-colors">{skill}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Skills Section */}
           <section className="py-12 sm:py-16 md:py-20">
            <div className="container mx-auto px-4 sm:px-6">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <div className="section-badge-sharp mx-auto mb-6">
                    <Award size={16} className="text-primary" />
                    <span className="text-secondary-foreground font-medium text-sm uppercase tracking-wider">Expertise</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">Skills & <span className="text-gradient">Proficiency</span></h2>
                </div>
              </ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {skills.map((skill, index) => (
                  <ScrollReveal key={skill.title} delay={index * 80}>
                    <div className="p-5 bg-card border-2 border-border sharp-card group hover:border-primary transition-all duration-300 text-center h-full flex flex-col items-center">
                      <div className={`w-11 h-11 bg-secondary border border-border flex items-center justify-center mb-3 ${skill.color} group-hover:scale-110 group-hover:border-primary transition-all duration-300`}>{skill.icon}</div>
                      <h3 className="font-display text-base font-semibold mb-1 group-hover:text-primary transition-colors">{skill.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{skill.desc}</p>
                      <div className="w-full mt-auto">
                        <div className="flex items-baseline justify-between gap-2 text-xs mb-1.5">
                          <span className="text-muted-foreground truncate">Proficiency</span>
                          <span className="text-primary font-semibold font-mono tabular-nums shrink-0">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${skill.level}%` }} />
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Certificates Section */}
           <section className="py-12 sm:py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 sm:px-6">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <div className="section-badge-sharp mx-auto mb-6">
                    <Award size={16} className="text-primary" />
                    <span className="text-secondary-foreground font-medium text-sm uppercase tracking-wider">Achievements</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">My <span className="text-gradient">Certifications</span></h2>
                  <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Click on any certificate to view details</p>
                </div>
              </ScrollReveal>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {certifications.map((cert, index) => (
                  <ScrollReveal key={cert.name} delay={index * 50} className="h-full">
                    <button
                      onClick={() => handleCertificateClick(cert)}
                      className="w-full h-[130px] text-left p-5 bg-card border-2 border-border sharp-card group hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                          <Award size={18} className="text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-sm leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">{cert.name}</h4>
                          <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                          <p className="text-xs text-primary/70 mt-1">{cert.year}</p>
                        </div>
                      </div>
                    </button>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />

        <CertificateModal
          certificate={selectedCertificate}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedCertificate(null); }}
        />
      </div>
    </>
  );
};

export default AboutPage;
