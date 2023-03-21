import React from 'react'
import "./main.css";
import Left from '../left/left';
import Middle from '../middle/middle';
import Right from '../right/right';

const Main = () => {
  return (
    <div className="parent">
      <div className="div1"> <Left/></div>
      <div className="div2"> <Middle/></div>
      <div className="div3">< Right/></div>
    </div>
  )
}

export default Main