import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:mehul.singh@edu.escp.eu" data-cursor="disable">
                mehul.singh@edu.escp.eu
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href="tel:+33749907022" data-cursor="disable">
                +33 749907022
              </a>
            </p>
            <h4>Location</h4>
            <p>Paris, France</p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://www.linkedin.com/in/mehul-singh-32b541180/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
            <a
              href="mailto:mehul.singh@edu.escp.eu"
              data-cursor="disable"
              className="contact-social"
            >
              Email <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Digital Marketing & Media Strategist <br /> <span>Mehul Singh</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
