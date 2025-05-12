import FAQDropdown from "./faqDropdown"

const faqDetails = [
  {
    title: 'Is Open Data Open Source?',
    details: 'Yes, Open Data is a service with open source code for the public.'
  },
  {
    title: 'Why use Open Data services?',
    details: 'Open Data services provide transparent, accessible information that can be used to improve decision-making and foster innovation.'
  },
  {
    title: 'Can Open Data be accessed by the public?',
    details: 'Yes, Open Data is freely available to the public without any access restrictions.'
  },
  {
    title: 'How do I contribute to Open Data?',
    details: 'You can contribute to Open Data by sharing your datasets, providing feedback, and participating in the open data community.'
  }
]

const FAQ = () => {
  const faqList = () => { 
    return faqDetails.map((faq, index) => (
      <FAQDropdown key={index} title={faq.title} details={faq.details}/>
    ))
  }

  return (
    <div className="open-data-content">
      <h2>Open Data is the idea that some data should be freely available for everyone to use and republish as they see fit, without restrictions from copyright, patents, or other control mechanisms.</h2>
      <a href="#" className="read-more">Read more</a>

      <div className="faq-section">
        <h2>Frequently Asked Question</h2>
        
        <div className="faq-list">
          {faqList()}
        </div>
      </div>
    </div>
  )
}

export default FAQ