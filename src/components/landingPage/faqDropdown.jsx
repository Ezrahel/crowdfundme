import { useState } from 'react'
import { BsChevronDown, BsChevronUp } from "react-icons/bs";



const FAQDropdown = ({title, details}) => {
  const [openQuestion, setOpenQuestion] = useState(false)

  return (
    <div className={`faq-item ${openQuestion ? 'active' : ''}`} onClick={() => setOpenQuestion(prevState => !prevState)}>
      <div className="faq-header">
        <h4>{title}</h4>
        <div>

        {openQuestion ? <BsChevronUp /> : <BsChevronDown />}
        </div>
      </div>
      {openQuestion && (
        <p>{details}</p>
      )}
    </div>
  )
}

export default FAQDropdown