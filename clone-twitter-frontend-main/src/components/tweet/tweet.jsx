import React, { useEffect } from 'react'
import "./tweet.css"
import Axios from 'axios'
import { useState } from 'react'
import Tweetinfos from '../tweetinfos/tweetinfos'

const Tweet = ({name, content, nb, id, date, img1, img2, img3}) => {

    // const user = localStorage.getItem('user');
    const user = JSON.parse(localStorage.getItem('user'));

    // store user profile picture
    const [profilePic, setProfilePic] = useState([]);



    // calculate the time difference between the tweet and the current time
    const timeDifference = (dateTweet) => {
        const maintenant = new Date();
        const dateTweetConvertie = new Date(dateTweet);
        const differenceEnSecondes = Math.round((maintenant - dateTweetConvertie) / 1000);

        if (differenceEnSecondes < 60) {
          return `${differenceEnSecondes} s`;
        } else if (differenceEnSecondes < 3600) {
          const differenceEnMinutes = Math.round(differenceEnSecondes / 60);
          return `${differenceEnMinutes} min`;
        } else if (differenceEnSecondes < 86400) {
          const differenceEnHeures = Math.round(differenceEnSecondes / 3600);
          return `${differenceEnHeures} h`;
        } else {
          const differenceEnJours = Math.round(differenceEnSecondes / 86400);
          return `${differenceEnJours} j`;
        }
    }

    // function to get userpp in database
    const getProfilePic = () => {
      Axios.get(`https://apitwitter.emilienpons.com/api/pp`, { params: { username: name}})
        .then(res => {
          setProfilePic(res.data);
        })
        .catch(err => {
          console.log(err);
        })
    }

    // check if actual user is same a tweet user
    const isActualUser = () => {
      const temp = name;
      if (temp == user.username) {
        const ti = document.getElementsByClassName('t-infos')[parseInt(nb) - 1];
        if (ti.style.display === 'none') {
          ti.style.display = 'block';
        } else {
          ti.style.display = 'none';
        }
      } else {
        console.log("Not your tweet");
      }
    }

    // function to change number next to reaction
    const changeNumber = (tweetId, reactName, nb) => {
      var button = document.getElementById(`${tweetId}-${reactName}`);
      if(nb === 1) {
        button.classList.add('reaction-active');
      } else {
        button.classList.remove('reaction-active');
      }
      var divParent = document.getElementById(tweetId + '-' + reactName);
      var number = parseInt(divParent.getElementsByTagName('p')[0].innerHTML);
      divParent.getElementsByTagName('p')[0].innerHTML = number + nb;
    }


  // function to insert new table with tweet reactions
  const insertReaction = (tweetId, reaction) => {
    const userReacted = JSON.parse(localStorage.getItem('reactions' + tweetId));
    var reactName = null;
    if (reaction === 1) {
      reactName = "comments";
    } else if (reaction === 2) {
      reactName = "retweets";
    } else if (reaction === 3) {
      reactName = "likes";
    }

    var button = document.getElementById(`${tweetId}-${reactName}`);
    const token = user.accessToken;
    const userid = user.userid;

    if (userReacted[reactName]){
      // remove reaction from database
      Axios.delete(`https://apitwitter.emilienpons.com/api/reactions`, {
        params: {
          userid: userid,
          tweetid: tweetId,
          reaction: reaction
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        if (reactName === "likes"){
          button.classList.remove("reaction-active-like");
        } else {
          button.classList.remove("reaction-active");
        }
        changeNumber(tweetId, reactName, -1);
        userReacted[reactName] = false;
        localStorage.setItem('reactions' + tweetId, JSON.stringify(userReacted));
      })
      .catch(err => {
        console.log(err);
      })
    } else {
      Axios.post(`https://apitwitter.emilienpons.com/api/reactions`, {
        userid,
        tweetId,
        reaction
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.data.success) {
           // add class to the button
          if (reactName === "likes") {
            button.classList.add("reaction-active-like");
          } else {
            button.classList.add('reaction-active');
          }
          changeNumber(tweetId, reactName, 1);
          userReacted[reactName] = true;
          localStorage.setItem('reactions' + tweetId, JSON.stringify(userReacted));
        } else if (res.data.error === "User already reacted to tweet") {
          console.log(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      })
    }
  }

  // function to set classname for each reaction given a tweet id
  const setReactionClassName = (tweetId) => {
    var test = (parseInt(nb) * 3) - 3;
    const comments = document.getElementsByClassName('reaction')[test];
    const retweet = document.getElementsByClassName('reaction')[test + 1];
    const likes = document.getElementsByClassName('reaction')[test + 2];

    comments.id = (tweetId + '-comments');
    retweet.id = (tweetId + '-retweets');
    likes.id = (tweetId + '-likes');
  }

  // add background color to reaction already reacted
  const setReactionColor = (tweetId, data) => {
    var button = document.getElementById(`${tweetId}-likes`);

    if (data.userReacted.likes) {
      button = document.getElementById(`${tweetId}-likes`);
      button.classList.add('reaction-active-like');
    }
    if (data.userReacted.retweets) {
      button = document.getElementById(`${tweetId}-retweets`);
      button.classList.add('reaction-active');
    }
    if (data.userReacted.comments) {
      button = document.getElementById(`${tweetId}-comments`);
      button.classList.add('reaction-active');
    }
  }

  // function to set reaction number
  const setReactionNumber = (tweetId, data) => {
    var comment = document.getElementById(tweetId + '-comments')
    var retweet = document.getElementById(tweetId + '-retweets')
    var like = document.getElementById(tweetId + '-likes')
    comment.getElementsByTagName('p')[0].innerHTML = data.nbComments;
    retweet.getElementsByTagName('p')[0].innerHTML = data.nbRetweets;
    like.getElementsByTagName('p')[0].innerHTML = data.nbLikes;
  }


  // get number of reactions of tweet
  const setReactions = (tweetId) => {
    Axios.get(`https://apitwitter.emilienpons.com/api/reactions`, { params: {tweetid: tweetId, userid: user.userid}, headers: { Authorization: `Bearer ${user.accessToken}` } })
      .then(res => {
        localStorage.setItem('reactions' + tweetId, JSON.stringify(res.data.userReacted));
        setReactionColor(tweetId, res.data);
        setReactionNumber(tweetId, res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  // display imgs in tweet
  const displayImgs = () => {
    const imgs = [img1, img2, img3];
    const parent = document.getElementsByClassName('m-tweet-media-img')[nb];

    if (imgs[0] === 'none') {
      document.getElementsByClassName('m-tweet-media')[nb].style.display = `none`;
    } else{
      for (let i = 0; i < imgs.length; i++) {
        if (imgs[i] !== "none") {
          // create a img element with src
          const img = document.createElement('img');
          img.src = imgs[i];

          img.classList.add('imgOfTweet');
          // create a div element to contain img
          const div = document.createElement('div');
          div.classList.add('m-tweet-img-container');
          div.style.position = "relative";
          div.style.padding = "0 1px 0 1px";
          div.style.flex = "2";
          div.appendChild(img);

          // append div to parent
          parent.appendChild(div);
        }
      }
    }
  }


  useEffect(() => {
    displayImgs();
    setReactionClassName(id)
    getProfilePic()
    setReactions(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //get date


  return (
      <div className="t">
        <div className="t-img-wrapper">
            <img src={profilePic.map(pp => pp['userpp'])} alt="profile" className="t-img"></img>
        </div>
        <div className="t-main">
            <div className="t-header-name">
              <p>{name}</p>
              <p>@{name}</p>
              <i className="fa-solid fa-circle-dot"></i>
              <p>{timeDifference(date)}</p>
              <div className="deleteTweet" onClick={isActualUser}>
                <i className="fa-solid fa-ellipsis" ></i>
              </div>
            </div>
            <div className="t-content">
              <p>{content}</p>
            </div>
            <div className="m-tweet-media">
              <div className="m-tweet-media-img">
              </div>
            </div>
            <div className="t-reacts">
              <div className="t-reacts-item reaction" onClick={function () {insertReaction(id, 1)}}>
                <i className="fa-solid fa-comment"></i>
                <p id='nbComments'></p>
              </div>
              <div className="t-reacts-item reaction" onClick={function () {insertReaction(id, 2)}}>
                <i className="fa-solid fa-retweet"></i>
                <p id='nbRetweets'></p>
              </div>
              <div className="t-reacts-item reaction" onClick={function () {insertReaction(id, 3)}}>
                <i className="fa-solid fa-heart"></i>
                <p id='nbLikes'></p>
              </div>
              <div className="t-reacts-item">
                <i className="fa-solid fa-share-from-square"></i>
              </div>
            </div>
        </div>
        <Tweetinfos id={id} key={id}/>
      </div>

  )
}

export default Tweet