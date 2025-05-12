import { BsBookmark } from "react-icons/bs"

const DonationCard = ({donationDetails}) => {
  const  { title, date, donationsCount, description, imgUrl } = donationDetails;

  return (
    <div className="donation-card">
      <img loading="lazy" src={imgUrl} alt={title} className="card-image" />
      <div className="card-content">
        <div className="card-header">
          <span className="date">{date}</span>
          <span className="donation-count">{donationsCount} donations</span>
        </div>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="card-actions">
          <button className="bookmark-btn">
            <BsBookmark />
          </button>

          {/* the padding too much for mobile-screen, fix am */}
          <button className="donate-btn">Donate now</button>
        </div>
      </div>
    </div>
  )
}

export default DonationCard