import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import Tweet from '../tweet/tweet';
import "./middle.css"

const Middle = () => {
  // import tweetList
  const [tweetList, setTweetList] = useState([]);
  //console.log tweetImg1 of last tweet


  // get user data
  const user = JSON.parse(localStorage.getItem('user'));
  var nbImages = 0;

  // function to get all tweets
  const getAllTweets = () => {
    localStorage.setItem('tweetId', -1);
    Axios.get('https://apitwitter.emilienpons.com/api/getTweets',{
      headers: {
        'Authorization': `Bearer ${user.accessToken}`
    }})
      .then(res => {
        setTweetList(res.data);
      })
      .catch(err => console.log(err));
  }


  // call getAllTweets function on page load
  useEffect(() => {
    getAllTweets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reversedTweetList = [...tweetList].reverse();

  // function to submit tweet and reload page
  const submitTweet = (tweetContent) => {
    // get the username and password
    const username = user.username;
    const token = user.accessToken;
    var imageSrc = ["none", "none", "none"];

    const divImgNewTweet = document.getElementsByClassName('m-tweet-media-img')[0];
    const nbNewImg = divImgNewTweet.childElementCount;
    const images = document.getElementsByClassName('imgOfTweet');
    for (let i = 0; i < nbNewImg; i++) {
      imageSrc[i] = images[i].src;
    }

    // send a request to the server
    Axios.post('https://apitwitter.emilienpons.com/api/insert', {
      tweetPoster: username,
      tweetContent: tweetContent,
      imageSrc: imageSrc,
      usertoken: token
    }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(function (response) {
        if (response.data.success) {
          document.getElementsByClassName('m-tweet-textarea-text')[0].value = '';
          // remove all elements with classname idImg
          var elements = document.getElementsByClassName('idImg');
          for (let i = 0; i < 3; i++) {
            elements[0].parentNode.removeChild(elements[0]);
          }
          setTweetList(reversedTweetList);
          getAllTweets();

        } else {
          alert('Error');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="m">
      <div className="m-header">
        <h2 className="m-page-name">Accueil</h2>
        <div className="m-header-icon">
          <i className="fa-regular fa-star"></i>
        </div>
      </div>
      <div className="m-content">
        <div className="m-tweet-writter">
          <div className="m-tweet-writter-text">
            <div className="m-tweet-writter-img">
              <img src={user.userpp} alt="profile-pic" />
            </div>
            <div className="m-tweet-writter-input">
              <div className="m-tweet-textarea">
                <textarea className="m-tweet-textarea-text" placeholder="Quoi de neuf?" maxLength={280}></textarea>
              </div>
              <div className="m-tweet-media">
                <div className="m-tweet-media-img">
                </div>
                <div className="m-enter-img-url">
                  <div className="m-input-div">
                    <input className="m-enter-img-url-input" placeholder="Entrez une URL"></input>
                  </div>
                  <div className="m-img-add-button">
                    <button className="m-enter-img-url-button" onClick={() => {
                      const urlEntered = document.getElementsByClassName('m-enter-img-url-input')[0].value;
                      // check if url is valid
                      if ((urlEntered.includes('https://') || urlEntered.includes('http://')) && nbImages < 3) {
                        const idImg = "idImg";
                        const idButton = "idButton";
                        document.getElementsByClassName('m-tweet-media-img')[0].insertAdjacentHTML("beforeend", `<div class=${idImg}><img src=${urlEntered} alt='tweetImg' class="imgOfTweet"></img><i class="fa-solid fa-circle-xmark ${idButton}"></i></div>`);
                        // add onclick event to the button that removes his parent
                        document.getElementsByClassName(idButton)[nbImages].onclick = function () {
                          this.parentElement.remove();
                          nbImages--;
                        }

                        // change position type of div
                        document.getElementsByClassName('m-tweet-media-img')[0].style.display = 'flex';
                        document.getElementsByClassName('m-enter-img-url-input')[0].value = '';
                        document.getElementsByClassName('m-enter-img-url')[0].style.display = 'none';

                        document.getElementsByClassName(idImg)[nbImages].style.position = "relative";
                        document.getElementsByClassName(idImg)[nbImages].style.padding = "0 1px 0 1px";
                        document.getElementsByClassName(idImg)[nbImages].style.flex = "2";
                        nbImages++;
                      } else {
                        if (nbImages >= 3)
                          alert('Vous ne pouvez pas ajouter plus de 3 images');
                        else
                          alert('L\'url n\'est pas valide');
                      }
                      // hide textarea
                    }}><p>+</p></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="m-tweet-writter-buttons">
            <div className="m-media-buttons">
              <div className="m-media-button" onClick={() => {
                const input = document.getElementsByClassName("m-enter-img-url")[0];
                if (input.style.display === "none") {
                  input.style.display = "flex";
                }
                else {
                  input.style.display = "none";
                }
              }}>
                <i className="fa-solid fa-image"></i>
              </div>
              <div className="m-media-button">
                <i className="fa-solid fa-video"></i>
              </div>
              <div className="m-media-button">
                <i className="fa-solid fa-smile"></i>
              </div>
              <div className="m-media-button">
                <i className="fa-solid fa-map-pin"></i>
              </div>
              <div className="m-media-button">
                <i className="fa-solid fa-chart-bar"></i>
              </div>
              <div className="m-media-button">
                <i className="fa-solid fa-calendar"></i>
              </div>
            </div>
            <div className="m-send-tweet">
              <button className="m-send-tweet-button" onClick={async () => {
                // get value of textarea
                const tweetContent = document.getElementsByClassName('m-tweet-textarea-text')[0].value;
                // if tweet is empty
                if (tweetContent.length === 0) {
                  alert("Tweet cannot be empty");
                } else {
                  submitTweet(tweetContent);
                  getAllTweets()
                }
              }}><p>Tweeter</p></button>
            </div>
          </div>
        </div>
        <div className="m-tweet-feed">
            {reversedTweetList.map((tweet, nb) => {
              return (
                <Tweet key={tweet.tweetId} id={tweet.tweetId} nb={nb+1} name={tweet.tweetPoster} content={tweet.tweetContent} date={tweet.tweetDate} img1={tweet.tweetImg1} img2={tweet.tweetImg2} img3={tweet.tweetImg3}/>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default Middle