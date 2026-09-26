import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const projects = [
  {
    title: "Ferrari Flagship GTM",
    category: "Luxury Automotive",
    tools: "London Flagship GTM Strategy, Market Penetration, High-Net-Worth Positioning",
    image: "/images/project_ferrari.jpg",
  },
  {
    title: "Chanel Omnichannel CRM",
    category: "Luxury & Innovation",
    tools: "Customer Journey Mapping, Smart Glasses Strategy, CRM Architecture",
    image: "/images/project_chanel.jpg",
  },
  {
    title: "Ralph Lauren Fragrances",
    category: "L'Oréal Big Picture",
    tools: "UK Media Plan & Buying, Category Launch, Multi-Channel Execution",
    image: "/images/project_ralph_lauren.jpg",
  },
  {
    title: "Johnnie Walker x Condé Nast",
    category: "Diageo Premium Portfolio",
    tools: "7M+ Unique Reach, Condé Nast Content Partnerships, DV360 Programmatic",
    image: "/images/project_johnnie_walker.jpg",
  },
  {
    title: "Too Yumm! 'To Cheer'",
    category: "Silver Cannes Lion Winner 🏆",
    tools: "Outdoor & Ambient Media, High-Impact Festive Reach, Cannes Lions 2024",
    image: "/images/project_cannes_lion.jpg",
  },
  {
    title: "Performance & Programmatic",
    category: "Omnicom & Madison World",
    tools: "3.8x ROAS, 60% Lower CPA, Google Ads, Meta & DV360 Scaling",
    image: "/images/project_performance.jpg",
  },
];

const Work = () => {
  useGSAP(() => {
  let translateX: number = 0;

  function setTranslateX() {
    const box = document.getElementsByClassName("work-box");
    const rectLeft = document
      .querySelector(".work-container")!
      .getBoundingClientRect().left;
    const rect = box[0].getBoundingClientRect();
    const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
    let padding: number =
      parseInt(window.getComputedStyle(box[0]).padding) / 2;
    translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
  }

  setTranslateX();

  let timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".work-section",
      start: "top top",
      end: `+=${translateX}`, // Use actual scroll width
      scrub: true,
      pin: true,
      id: "work",
    },
  });

  timeline.to(".work-flex", {
    x: -translateX,
    ease: "none",
  });

  // Clean up (optional, good practice)
  return () => {
    timeline.kill();
    ScrollTrigger.getById("work")?.kill();
  };
}, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
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
