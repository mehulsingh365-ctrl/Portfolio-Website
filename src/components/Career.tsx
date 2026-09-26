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
              <h3>NOW</h3>
            </div>
            <p>
              London & Paris (graduating Dec 2026). Strategic brand consulting for
              Ferrari (London flagship GTM), Chanel (Omnichannel CRM & Smart Glasses),
              and Ralph Lauren Fragrances via L'Oréal Big Picture.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Digital Marketing Manager</h4>
                <h5>Kinnect | Omnicom Media</h5>
              </div>
              <h3>'24-'25</h3>
            </div>
            <p>
              Led media & performance for Crompton Greaves, Adani Realty, and Century Ply.
              Delivered 60% lower CPA, achieved 140% of annual targets in 6 months, and
              managed P&L and a team of 4.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Planning Manager – Digital</h4>
                <h5>Madison World</h5>
              </div>
              <h3>'22-'24</h3>
            </div>
            <p>
              Coordinated Meta & Google Ads to 3.8x ROAS. Executed TV + DV360
              programmatic reaching 9M+ users (2.4% CTR), and led Raymond Group's
              festive campaign exceeding reach targets by 35%.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Senior Digital Planner</h4>
                <h5>PHD | Omnicom Media</h5>
              </div>
              <h3>'21-'22</h3>
            </div>
            <p>
              Directed digital strategy for Diageo’s premium alcohol portfolio
              (Johnnie Walker, Tanqueray, Smirnoff). Reached 7M+ unique users
              through premium Condé Nast content partnerships.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Visiting Faculty – Marketing</h4>
                <h5>Mumbai University</h5>
              </div>
              <h3>'25-NOW</h3>
            </div>
            <p>
              Founded 'Ignite Thinking' educational initiative. Delivered applied
              media strategy and creative marketing seminars to 200+ students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
