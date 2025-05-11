import { CgPlayButtonO } from "react-icons/cg";
import Navbar from "./navbar";


const HeroSection = () => {
  return (
    <section className='hero-section'>
      <Navbar />

      <div className="hero-content">
        <h1 className="hero-title">
          <span className="highlight">Happiness</span> comes from <br/> 
          <span className="highlight">your action</span>.
        </h1>
        <p className="hero-subtitle">
          Be a part of the breakthrough and make someone's dream come true.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary">
            Donate Now
          </button>
          <button className="btn btn-secondary">
            <CgPlayButtonO className="play-icon" />Watch Video
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection