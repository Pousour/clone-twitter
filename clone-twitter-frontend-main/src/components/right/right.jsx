import React from 'react'
import "./right.css"
import Trend from '../trend/trend'
import { trends } from '../../trend'

const Right = () => {
  return (
    <div className="r">
      <div className="r-search-bar">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Recherche twitter" />
      </div>

      <div className="r-trending">
        <div className="r-trending-title">
            <h2>Tendances pour vous</h2>
        </div>
        {trends.map((item) => (
          <Trend key={item.id} category={item.category} name={item.name} nb={item.nb}/>
        ))}
        <div className="r-trending-title">
          <span>Voir plus</span>
        </div>
      </div>
    </div>
  )
}

export default Right