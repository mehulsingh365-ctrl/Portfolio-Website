import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container" id="career">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>MSc Marketing & Creativity</h4>
                <h5>ESCP Business School</h5>
              </div>
              <h3>Sep 2024 – Dec 2026</h3>
            </div>
            <p>
              London & Paris. Strategic brand consulting for Ferrari (London flagship GTM),
              Chanel (Omnichannel Customer Journey & Smart Glasses), and Ralph Lauren
              Fragrances via L'Oréal Big Picture.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Visiting Faculty – Marketing</h4>
                <h5>Mumbai University</h5>
              </div>
              <h3>Sep 2025 – Present</h3>
            </div>
            <p>
              Founded 'Ignite Thinking' educational initiative. Delivered 4 applied
              media strategy and creative marketing seminars for 200+ undergraduate students.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Digital Marketing Manager</h4>
                <h5>Kinnect | Omnicom Media</h5>
              </div>
              <h3>Feb 2024 – Aug 2025</h3>
            </div>
            <p>
              Led media & performance for Crompton Greaves, Adani Realty, and Century Ply.
              Coordinated Google Ads, Meta, and DV360: 60% lower CPA, 140% target achievement
              in 6 months, and led team of 4.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Planning Manager – Digital</h4>
                <h5>Madison World</h5>
              </div>
              <h3>Dec 2022 – Feb 2024</h3>
            </div>
            <p>
              Coordinated Meta & Google Ads campaigns to 3.8x ROAS. Executed TV + DV360
              campaigns reaching 9M+ users (2.4% CTR), and led Raymond Group's festive campaign
              exceeding reach targets by 35%.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Senior Digital Planner</h4>
                <h5>PHD | Omnicom Media</h5>
              </div>
              <h3>Apr 2021 – May 2022</h3>
            </div>
            <p>
              Directed digital strategy for Diageo’s premium alcohol portfolio
              (Johnnie Walker, Tanqueray, Smirnoff, Gordon's). Reached 7M+ unique users
              through Condé Nast content partnerships.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Digital Marketing Executive</h4>
                <h5>Fulcro Consulting</h5>
              </div>
              <h3>Nov 2019 – Dec 2020</h3>
            </div>
            <p>
              Coordinated end-to-end campaign production for Bajaj Electricals and
              Morphy Richards content-led campaigns across YouTube, Meta, and LinkedIn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
