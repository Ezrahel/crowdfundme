
const PartnersSection=()=>{
    return(
        <section className="partners-section">
        <div className="partners-container">
          <span className="section-label">OUR PARTNERS</span>
          <h2 className="partners-title">
            More than 50 <span className="highlight">Companies</span> and <span className="highlight">Institutions</span> that trust us over the years
          </h2>

          <div className="partners-grid">
            <a href="#" className="partner-card">
              <img src="/partners/microsoft.svg" alt="Microsoft" />
            </a>
            <a href="#" className="partner-card">
              <img src="/partners/save-the-children.svg" alt="Save the Children" />
            </a>
            <a href="#" className="partner-card">
              <img src="/partners/conservation-international.svg" alt="Conservation International" />
            </a>
            <a href="#" className="partner-card">
              <img src="/partners/unicef.svg" alt="UNICEF" />
            </a>
            <a href="#" className="partner-card">
              <img src="/partners/river-island.svg" alt="River Island" />
            </a>
            <a href="#" className="partner-card">
              <img src="/partners/hello-wallet.svg" alt="HelloWallet" />
            </a>
            <a href="#" className="partner-card">
              <img src="/partners/american-red-cross.svg" alt="American Red Cross" />
            </a>
            <a href="#" className="partner-card">
              <img src="/partners/palang-merah.svg" alt="Palang Merah Indonesia" />
            </a>
            <a href="#" className="more-partners">
              <span>and 42 mores</span>
            </a>
          </div>
        </div>
      </section>
    )
}

export default PartnersSection;