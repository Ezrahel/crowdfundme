import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { BsBookmark } from "react-icons/bs";
import DonationCard from "./donationCard";

// u fit just export these data to a seperate file 'data.json/js'
const categories = [
  'All', 'Disaster', 'Children', 'Food Crisis', 'Health', 'Education', 'Homeless', 'Animal', 'Pandemic', 'War Crisis'
]

const donationDetails = [
  {
    title: "Flood in Lamboa",
    date: "June 27, 2021",
    donationsCount: 230,
    description: "Lamboa community needs your help for crisis management from 3 days of non-stop flooding.",
    imgUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5",
  },
  {
    title: "Tsunami in Malika",
    date: "June 27, 2021",
    donationsCount: 1099,
    description: "Emergency! A tsunami has just hit Malika, Tarasudi District. Help our affected brothers and sisters.",
    imgUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5",
  },
  { 
    title: 'Help African Children',
    date: 'June 27, 2021',
    donationsCount: 748,
    description: 'African children need your help to get proper food and water. Prolonged crisis is a real urgency.',
    imgUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5",
  },
  { 
    title: 'Sianka Forest Fire',
    date: 'June 27, 2021',
    donationsCount: 320,
    description: "The Sianka forest has caught fire and affected the surrounding community. Let's help buy their health facilities!",
    imgUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578'
  },
  { 
    title: 'Soporo Earthquake',
    date: 'June 27, 2021',
    donationsCount: 769,
    description: "A magnitude 7.3 earthquake has shaken Saporo sub-district, help them recover with food and medicine.",
    imgUrl: 'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf'
  },
  { 
    title: 'Lidu Land Drought',
    date: 'June 27, 2021',
    donationsCount: 748,
    description: "The people of Tanah Lidu are currently suffering from drought, help them get clean water!",
    imgUrl: 'https://images.unsplash.com/photo-1504297050568-910d24c426d3'
  },
]

const Donations = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categoryTabs = () => {
    return categories.map((category, index) => (
      <button onClick={() => setActiveCategory(category)} key={index} className={`category-btn ${activeCategory === category ? 'active' : ''}`}>
        {category}
      </button>
    ))
  }

  const donationCards = () => {
    return donationDetails.map((donationDetail) => (
      <DonationCard key={donationDetail.title} donationDetails={donationDetail} />
    )) 
  }
  
  return ( 
    <section className='secondPhase'>
      <div className="topic">
        <h1>
          Open <span style={{color:'#13ADB7'}}>donations</span>
        </h1>
        
        <div className="search-container">
          <input type="search" className='searchCrises' placeholder='Find donations...' />
          <IoIosSearch className="search-icon" />
        </div>

        <div className="categories">
          {categoryTabs()}  
        </div>

        <div className="donation-cards">
          {/* First row of cards */}
          {donationCards()}

        </div>

        {/* There is a react package for this to make everything easier for you when you want to make it functional  */}
        <div className="pagination">
          <button className="pagination-btn prev">
            <span className="arrow">‹</span>
          </button>
          <button className="pagination-btn">1</button>
          <button className="pagination-btn active">2</button>
          <button className="pagination-btn">3</button>
          <span className="pagination-ellipsis">...</span>
          <button className="pagination-btn">49</button>
          <button className="pagination-btn">50</button>
          <button className="pagination-btn next">
            <span className="arrow">›</span>
          </button>
          <a href="#" className="view-all">Lihat semua <span className="arrow">→</span></a>
        </div>
      </div>
    </section>
  )
}

export default Donations