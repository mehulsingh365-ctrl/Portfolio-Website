import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const projects = [
  {
    title: "Cannes Lions: Too Yumm!",
    category: "Silver Cannes Lion Winner 🏆",
    tools: "Silver Cannes Lion 2024. Ambient & outdoor media campaign, high-impact cultural engagement across India.",
    image: "/images/work_too_yumm.png",
  },
  {
    title: "Diageo Johnnie Walker, Revibe",
    category: "Diageo Premium Portfolio",
    tools: "Condé Nast media partnerships, 7M+ unique reach, cultural storytelling & programmatic DV360 execution.",
    image: "/images/work_johnnie_walker_revibe.png",
  },
  {
    title: "Kamasutra Condoms: AI Chat & NFT",
    category: "Web3 & Conversational AI Innovation",
    tools: "Generative AI conversational chatbot & NFT brand activation, youth digital engagement & creative PR.",
    image: "/images/work_kamasutra.png",
  },
  {
    title: "Crompton Search Games",
    category: "Search Marketing & SEO Innovation",
    tools: "Gamified interactive search experience, organic SEO dominance, high-intent discovery & performance optimization.",
    image: "/images/work_crompton.jpeg",
  },
  {
    title: "ESCP Consultancy Projects",
    category: "L'Oréal, Chanel & Ferrari",
    tools: "Ferrari London flagship GTM strategy, Chanel omnichannel journey & smart glasses, Ralph Lauren fragrance launch via L'Oréal.",
    image: "/images/work_escp.png",
  },
];

const Work = () => {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const calculateDistance = () => {
        const screenW = window.innerWidth;
        const boxW = 500;
        // Distance needed to place the 5th card (index 4) right in the center of the screen
        const centerLastCard = 4 * boxW + boxW / 2 - screenW / 2;
        const travel = Math.max(centerLastCard, 5 * boxW - screenW + 80);
        return Math.max(travel, 1200);
      };

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".work-section",
          start: "top top",
          end: "+=3600",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          id: "work-pin",
        },
      });

      // 1. Horizontally glide all cards from 01 through 05 until Card 05 is centered
      timeline.to(".work-flex", {
        x: () => -calculateDistance(),
        ease: "power1.inOut",
        duration: 0.65,
      });

      // 2. Generous pause on the 5th card so the viewer fully sees and reads Card 5 before unpinning
      timeline.to({}, { duration: 0.35 });

      return () => {
        timeline.kill();
        ScrollTrigger.getById("work-pin")?.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
              </div>
              <WorkImage image={project.image} alt={project.title} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;

