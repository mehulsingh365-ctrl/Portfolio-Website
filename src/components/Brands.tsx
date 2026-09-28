import "./styles/Brands.css";

// Logos live in public/images/brands (trimmed so they all show at a similar size).
const brands = [
  { name: "Too Yumm!", logo: "tooyumm.png" },
  { name: "Diageo", logo: "diageo.png" },
  { name: "Kamasutra", logo: "kamasutra.png" },
  { name: "Crompton", logo: "crompton.png" },
  { name: "Adani Realty", logo: "adani.png" },
  { name: "Raymond", logo: "raymond.png" },
  { name: "Bandhan Bank", logo: "bandhan_bank.png" },
  { name: "Balaji Wafers", logo: "balaji_wafers.png" },
  { name: "Greenply", logo: "greenply.png" },
  { name: "Bajaj Electricals", logo: "bajaj_electricals.png" },
  { name: "Morphy Richards", logo: "morphy_richards.png" },
  { name: "Brinton", logo: "brinton_pharma.png" },
  { name: "Joy", logo: "joy.png" },
];

const half = Math.ceil(brands.length / 2);
const rows = [brands.slice(0, half), brands.slice(half)];

const Brands = () => {
  return (
    <div className="brands-section" id="brands">
      <div className="brands-heading section-container">

        <h2>
          Brands I've <span>worked with</span>
        </h2>
      </div>

      {rows.map((row, r) => (
        <div className="brands-marquee" key={r}>
          {/* the row is repeated so the loop is seamless, even on wide screens */}
          <div className={`brands-track ${r === 1 ? "brands-track-reverse" : ""}`}>
            {[...row, ...row, ...row, ...row].map((b, i) => (
              <div className="brand-tile" key={`${b.name}-${i}`} aria-hidden={i >= row.length}>
                <span className="brand-idx">
                  {String(brands.indexOf(b) + 1).padStart(2, "0")}
                </span>
                <img src={`/images/brands/${b.logo}`} alt={b.name} loading="lazy" />
                <span className="brand-name">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Brands;
