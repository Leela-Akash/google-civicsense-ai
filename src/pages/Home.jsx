import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GridScan } from "../components/effects/GridScan"; // ✅ FIXED IMPORT
import TextType from "../components/effects/TextType";
import Footer from "../components/common/Footer";
import SpotlightCard from "../components/home/SpotlightCard";
import TimelineItem from "../components/home/TimelineItem";
import StatCard from "../components/home/StatCard";
import WhyCard from "../components/home/WhyCard";
import ProjectWorkflowStepper from "../components/home/ProjectWorkflowStepper";
import CircularGallery from "../components/effects/CircularGallery";
import { useAuth } from '../context/AuthContext';

const animateCounter = (element, target) => {
  let current = 0;
  const increment = target / 100;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 20);
};

const styles = `
.animate {
  opacity: 1 !important;
  transform: translateY(0) !important;
}
.card {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
@media (max-width: 768px) {
  .timeline {
    flex-direction: column !important;
  }
  .timeline-item::before {
    display: none !important;
  }
  .timeline-item::after {
    content: '';
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 2px;
    height: 100%;
    background: #AF99F6;
  }
  .timeline-item:last-child::after {
    display: none;
  }
}
`;

const Home = () => {
  const [animatedStats, setAnimatedStats] = useState(false);
  const statsRef = useRef(null);
  const featureRef = useRef(null);
  const howItWorksRef = useRef(null);
  const whyRef = useRef(null);
  const ctaRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRaiseComplaint = () => {
    if (user) {
      navigate('/citizen/raise-complaint');
    } else {
      navigate('/citizen/login');
    }
  };

  const handleTrackComplaint = () => {
    if (user) {
      navigate('/citizen/complaint-status');
    } else {
      navigate('/citizen/login');
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            if (entry.target === statsRef.current && !animatedStats) {
              setAnimatedStats(true);
              const counters = entry.target.querySelectorAll('.counter');
              counters.forEach((counter, index) => {
                const targets = [10000, 2500, 48, 50];
                animateCounter(counter, targets[index]);
              });
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featureRef.current) observer.observe(featureRef.current);
    if (howItWorksRef.current) observer.observe(howItWorksRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    if (whyRef.current) observer.observe(whyRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, [animatedStats]);

  return (
    <div style={{ background: "#050508", color: "#fff" }}>
      <style>{styles}</style>

      {/* ================= HERO SECTION ================= */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          background: "#050508",
          overflow: "hidden"
        }}
      >
        {/* 🟣 GRIDSCAN BACKGROUND */}
        <GridScan
          scanColor="#AF99F6"
          linesColor="#392e4e"
          scanOpacity={0.35}
          gridScale={0.12}
          lineThickness={1}
          lineJitter={0.08}
          scanGlow={0.6}
          scanSoftness={2}
          noiseIntensity={0.015}
          bloomIntensity={0.2}
          scanDuration={2.5}
          scanDelay={2}
          scanDirection="pingpong"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0
          }}
        />

        {/* 📝 CENTER TEXT (Typing Effect) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            textAlign: "center",
            pointerEvents: "none"
          }}
        >
          <div>
            <TextType
              text={[
                "Google CivicSense AI",
                "AI-Powered Civic Complaints",
                "Smart Governance Platform"
              ]}
              typingSpeed={70}
              deletingSpeed={35}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              className="home-typing"
            />
          </div>
          <p
            style={{
              marginTop: "20px",
              fontSize: "1.2rem",
              color: "#ccc",
              maxWidth: "600px",
              lineHeight: "1.5"
            }}
          >
            AI-powered civic complaint platform for smart governance
          </p>
          <div
            style={{
              marginTop: "40px",
              display: "flex",
              gap: "20px",
              pointerEvents: "auto"
            }}
          >
            <button
              onClick={handleRaiseComplaint}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #4285F4, #34A853)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "transform 0.2s",
                boxShadow: "0 4px 15px rgba(66, 133, 244, 0.3)"
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              Raise a Complaint
            </button>
            <button
              onClick={handleTrackComplaint}
              style={{
                padding: "12px 24px",
                background: "transparent",
                color: "#4285F4",
                border: "2px solid #4285F4",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 0 10px rgba(66, 133, 244, 0.2)"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#4285F4";
                e.target.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#4285F4";
              }}
            >
              Track Complaint
            </button>
          </div>
        </div>
      </div>

      {/* ================= FEATURE CARDS SECTION ================= */}
      <section
        ref={featureRef}
        style={{
          position: "relative",
          padding: "120px 12%",
          background: "#050508",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "60px",
              background: "linear-gradient(135deg, #4285F4, #AF99F6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Key Features
          </h2>



          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "40px"
            }}
          >
            <SpotlightCard
              icon="🎙️"
              title="Voice-based complaint registration"
              description="for easy and inclusive access"
              colorIndex={0}
            />
            <SpotlightCard
              icon="🌍"
              title="Multi-language support"
              description="for all regional users"
              colorIndex={1}
            />
            <SpotlightCard
              icon="🤖"
              title="AI-driven priority detection"
              description="for urgent issues"
              colorIndex={2}
            />
            <SpotlightCard
              icon="🏛️"
              title="Automatic department routing"
              description="of complaints"
              colorIndex={3}
            />
            <SpotlightCard
              icon="📊"
              title="Real-time complaint tracking"
              description="for citizens"
              colorIndex={4}
            />
            <SpotlightCard
              icon="🔐"
              title="Secure Google Sign-In authentication"
              description=""
              colorIndex={5}
            />
            <SpotlightCard
              icon="🧑‍🤝‍🧑"
              title="Citizen-first, accessible design"
              description=""
              colorIndex={6}
            />
            <SpotlightCard
              icon="⚡"
              title="Faster resolution & improved accountability"
              description=""
              colorIndex={7}
            />
            <SpotlightCard
              icon="🌱"
              title="Scalable smart governance platform"
              description=""
              colorIndex={8}
            />
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section
        ref={howItWorksRef}
        style={{
          position: "relative",
          padding: "120px 12%",
          background: "#050508",
          overflow: "hidden"
        }}
      >
        <GridScan
          scanColor="#AF99F6"
          linesColor="#392e4e"
          scanOpacity={0.25}
          gridScale={0.14}
          lineThickness={1}
          scanGlow={0.4}
          scanSoftness={2.2}
          noiseIntensity={0.01}
          scanDuration={3}
          scanDelay={3}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "60px",
              background: "linear-gradient(135deg, #4285F4, #AF99F6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            How It Works
          </h2>

          {/* Interactive Stepper */}
          <ProjectWorkflowStepper />

          {/* Legacy Timeline (hidden but kept for reference) */}
          <div
            className="timeline"
            style={{
              display: "none",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
              maxWidth: "1000px",
              margin: "0 auto"
            }}
          >
            <TimelineItem
              step="Record your complaint using voice in any language"
              index={0}
            />
            <TimelineItem
              step="AI analyzes and prioritizes the issue automatically"
              index={1}
            />
            <TimelineItem
              step="Municipal authorities receive and process the complaint"
              index={2}
            />
            <TimelineItem
              step="Track resolution status and receive updates in real-time"
              index={3}
            />
            <TimelineItem
              step="Complaint resolved with transparent communication"
              index={4}
            />
          </div>
        </div>
      </section>

      {/* ================= IMPACT/STATS SECTION ================= */}
      <section
        ref={statsRef}
        style={{
          position: "relative",
          padding: "120px 12%",
          background: "#050508",
          overflow: "hidden"
        }}
      >
        <GridScan
          scanColor="#AF99F6"
          linesColor="#392e4e"
          scanOpacity={0.25}
          gridScale={0.14}
          lineThickness={1}
          scanGlow={0.4}
          scanSoftness={2.2}
          noiseIntensity={0.01}
          scanDuration={3}
          scanDelay={3}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "60px",
              background: "linear-gradient(135deg, #4285F4, #AF99F6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Our Impact
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "40px"
            }}
          >
            <StatCard
              label="Total Complaints"
              value="10,000+"
              suffix="+"
            />
            <StatCard
              label="High Priority Cases"
              value="2,500+"
              suffix="+"
            />
            <StatCard
              label="Average Resolution Time"
              value="48"
              suffix=" hours"
            />
            <StatCard
              label="Cities Covered"
              value="50+"
              suffix="+"
            />
          </div>

          {/* Circular Gallery for Impact Categories */}
          <div style={{ marginTop: "80px", height: "600px" }}>
            <CircularGallery
              bend={2}
              textColor="#ffffff"
              borderRadius={0.05}
              font="bold 32px Figtree"
              scrollSpeed={1}
              scrollEase={0.08}
              autoRotate={true}
              autoRotateSpeed={0.3}
            />
          </div>
        </div>
      </section>

      {/* ================= WHY CIVICSENSE AI SECTION ================= */}
<section
  ref={whyRef}
  style={{
    position: "relative",
    padding: "120px 12%",
    background: "#050508",
    overflow: "hidden"
  }}
>
  {/* Grid background */}
  <GridScan
    scanColor="#AF99F6"
    linesColor="#392e4e"
    scanOpacity={0.12}
    gridScale={0.18}
    lineThickness={1}
    scanGlow={0.2}
    scanSoftness={2.2}
    noiseIntensity={0.004}
    scanDuration={4}
    scanDelay={3}
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 0
    }}
  />

  {/* Dark overlay to push grid back */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(to bottom, rgba(5,5,8,0.92), rgba(5,5,8,0.75), rgba(5,5,8,0.92))",
      zIndex: 1
    }}
  />

  {/* CONTENT */}
  <div
    style={{
      position: "relative",
      zIndex: 2,
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "70px",
      background: "rgba(20,18,35,0.65)",
      backdropFilter: "blur(14px)",
      borderRadius: "26px",
      border: "1px solid rgba(175,153,246,0.25)",
      boxShadow: "0 0 80px rgba(175,153,246,0.15)"
    }}
  >
    {/* Heading */}
    <h2
      style={{
        fontSize: "2.6rem",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "20px",
        background: "linear-gradient(135deg, #4285F4, #AF99F6)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}
    >
      Why CivicSense AI?
    </h2>

    {/* Sub text */}
    <p
      style={{
        maxWidth: "850px",
        margin: "0 auto 70px",
        textAlign: "center",
        color: "#c3bedc",
        fontSize: "1.05rem",
        lineHeight: 1.7
      }}
    >
      CivicSense AI modernizes civic complaint systems by making them
      voice-enabled, multilingual, intelligent, and transparent — ensuring
      every citizen can report issues easily and every authority can act faster.
    </p>

    {/* Cards */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "40px"
      }}
    >
      <WhyCard
        title="🎙️ Voice-First Reporting"
        description="Citizens can simply speak to register complaints. CivicSense AI converts voice into structured data, understands intent, and removes the need for typing."
      />

      <WhyCard
        title="🌐 Multilingual Intelligence"
        description="Supports regional languages, Hindi, English, and mixed speech. AI automatically detects, translates, and processes complaints without language barriers."
      />

      <WhyCard
        title="📸 Photo-Based Evidence"
        description="Users can upload photos of civic issues like potholes or garbage. AI analyzes images to validate complaints and accelerate resolution."
      />

      <WhyCard
        title="🧠 AI-Powered Prioritization"
        description="Advanced AI detects urgency, assigns priority levels, and routes complaints to the correct department so critical issues are addressed first."
      />
    </div>

    {/* Footer line */}
    <p
      style={{
        marginTop: "80px",
        textAlign: "center",
        color: "#a39dc2",
        fontSize: "0.95rem"
      }}
    >
      CivicSense AI bridges citizens and governments through intelligent,
      inclusive, and accountable digital governance.
    </p>
  </div>
</section>


      {/* ================= CALL TO ACTION SECTION ================= */}
      <section
        ref={ctaRef}
        style={{
          position: "relative",
          padding: "120px 12%",
          background: "#050508",
          overflow: "hidden"
        }}
      >
        <GridScan
          scanColor="#AF99F6"
          linesColor="#392e4e"
          scanOpacity={0.25}
          gridScale={0.14}
          lineThickness={1}
          scanGlow={0.4}
          scanSoftness={2.2}
          noiseIntensity={0.01}
          scanDuration={3}
          scanDelay={3}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0
          }}
        />

        <div
          className="card"
          style={{
            position: "relative",
            zIndex: 2,
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "60px",
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "20px",
              background: "linear-gradient(135deg, #4285F4, #AF99F6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Join the CivicSense AI Revolution
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#ccc",
              marginBottom: "40px",
              lineHeight: "1.6"
            }}
          >
            Be part of a smarter governance ecosystem. Raise your voice, track progress, and make a difference.
          </p>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
};

export default Home;