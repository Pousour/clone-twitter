import React from 'react'
import "./tweetinfos.css"
import Axios from 'axios'

const Tweetinfos = ({id}) => {

  const user = JSON.parse(localStorage.getItem('user'));

  const getAllTweets = () => {
    localStorage.setItem('tweetId', -1);
    Axios.get('https://apitwitter.emilienpons.com/api/getTweets')
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err));
  }


  // function to delete tweet
  const deleteTweet = () => {
    // request to delete tweet
    Axios.delete(`https://apitwitter.emilienpons.com/api/tweet`, {params: {tweetId: id}, headers: {'Authorization': `Bearer ${user.accessToken}`}})
      // if successful, reload the page
      .then(function (response) {
        if (response.data.success) {
          getAllTweets();
          window.location.reload();
        } else {
          alert('Error');
        }
      }
    )
  }


  return (
    <div className="t-infos">
        <div className="t-infos-item">
            <div className="t-infos-icones">
                <i className="fa-solid fa-trash"></i>
            </div>
            <div className="t-infos-text">
              <p onClick={deleteTweet}>Supprimer</p>
            </div>
        </div>
    </div>
  )
}

export default Tweetinfos