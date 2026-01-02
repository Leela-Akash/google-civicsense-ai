import ChromaGrid from "../components/effects/ChromaGrid";
import Footer from "../components/common/Footer";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import bhargavaImg from "../assets/bhargava.jpg";
import leelaImg from "../assets/leelaakash.jpg";
import arunImg from "../assets/arunadithya.jpg";


gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate each team section
      gsap.utils.toArray(".team-section").forEach((section) => {
        const card = section.querySelector(".team-card");
        const name = section.querySelector(".team-name");
        const para = section.querySelector(".team-para");

        gsap.set(card, { opacity: 0, y: 100 });
        gsap.set(name, { opacity: 0, y: -50 });
        gsap.set(para, { opacity: 0, y: 50 });

        ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          onEnter: () => {
            gsap.to(card, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
            gsap.to(name, { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power2.out" });
            gsap.to(para, { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: "power2.out" });
          },
          onLeave: () => {
            gsap.to(card, { opacity: 0, y: -100, duration: 1, ease: "power2.out" });
            gsap.to(name, { opacity: 0, y: 50, duration: 1, delay: 0.2, ease: "power2.out" });
            gsap.to(para, { opacity: 0, y: -50, duration: 1, delay: 0.4, ease: "power2.out" });
          },
          onEnterBack: () => {
            gsap.to(card, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
            gsap.to(name, { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power2.out" });
            gsap.to(para, { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: "power2.out" });
          },
          onLeaveBack: () => {
            gsap.to(card, { opacity: 0, y: 100, duration: 1, ease: "power2.out" });
            gsap.to(name, { opacity: 0, y: -50, duration: 1, delay: 0.2, ease: "power2.out" });
            gsap.to(para, { opacity: 0, y: 50, duration: 1, delay: 0.4, ease: "power2.out" });
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const teamMembers = [
    {
      name: "BHARGAVA",
      para: "Bhargava is a passionate developer with expertise in frontend technologies. He brings creativity and innovation to every project, ensuring seamless user experiences.",
       image: bhargavaImg,
      title: 'BHARGAVA',
      subtitle: 'Team Member',
      handle: '@bhargava',
      borderColor: '#4285F4',
      gradient: 'linear-gradient(145deg, #4285F4, #000)',
      url: '#'
    },
    {
      name: "LEELA AKASH",
      para: "Leela Akash specializes in backend development and database management. His analytical skills and attention to detail make her an invaluable asset to the team.",
      image: leelaImg,
      title: 'LEELA AKASH',
      subtitle: 'Team Member',
      handle: '@leelaakash',
      borderColor: '#34A853',
      gradient: 'linear-gradient(210deg, #34A853, #000)',
      url: '#'
    },
    {
      name: "ARUN ADITHYA",
      para: "Arun Adithya is our UI/UX design expert, crafting intuitive and visually appealing interfaces. His design philosophy focuses on user-centric solutions.",
      image: arunImg,
      title: 'ARUN ADITHYA',
      subtitle: 'Team Member',
      handle: '@arunadithya',
      borderColor: '#AF99F6',
      gradient: 'linear-gradient(165deg, #AF99F6, #000)',
      url: '#'
    }
  ];

  return (
    <div ref={containerRef} style={{ background: "#050508", color: "#fff" }}>
      {/* ================= TEAM SECTION ================= */}
      <section
        style={{
          position: "relative",
          background: "#050508",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              padding: "120px 12% 60px",
              textAlign: "center",
              background: "linear-gradient(135deg, #4285F4, #AF99F6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Meet Our Team
          </h2>

          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="team-section"
              style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 12%",
                position: "relative"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "80px",
                  maxWidth: "1400px",
                  width: "100%"
                }}
              >
                {/* Left Side - Name and Para Box */}
                <div
                  style={{
                    flex: "1",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "16px",
                    padding: "80px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  <div
                    className="team-name"
                    style={{
                      fontSize: "3rem",
                      fontWeight: "bold",
                      marginBottom: "20px",
                      background: "linear-gradient(135deg, #4285F4, #AF99F6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      lineHeight: "1.2"
                    }}
                  >
                    {member.name}
                  </div>
                  <p
                    className="team-para"
                    style={{
                      fontSize: "1.2rem",
                      lineHeight: "1.6",
                      color: "#ccc"
                    }}
                  >
                    {member.para}
                  </p>
                </div>

                {/* Right Side - Team Card */}
                <div
                  className="team-card"
                  style={{
                    flex: "1",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <ChromaGrid
                    items={[member]}
                    columns={1}
                    rows={1}
                    radius={500}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};

export default About;
