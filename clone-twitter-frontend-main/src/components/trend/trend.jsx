import React from 'react'
import "./trend.css"

const Trend = ({category,name,nb}) => {
  return (
    <div className="r-trending-item">
        <div className="r-trend-infos">
            <div className="r-trend-category">Tendance dans la catégorie <span>{category}</span></div>
            <div className="r-trend-name"><span>{name}</span></div>
            <div className="r-trend-nb-tweets"><span className="r-nb">{nb}</span>Tweets</div>
        </div>
        <div className="r-trend-more-icon">
            <i className="fa-solid fa-ellipsis"></i>
        </div>
    </div>
  )
}

export default Trend