import Profilecard from '../profileCard/profileCard'
import "./left.css"

const Left = () => {

  const user = JSON.parse(localStorage.getItem('user'));

  // handle onclick show/hide comments
  const handleClick = () => {
    const pc = document.getElementsByClassName('p-c')[0];
    if (pc.style.display === 'none') {
      pc.style.display = 'block';
    } else {
      pc.style.display = 'none';
    }
  }

  return (
    <div className='l'>
      <div className="l-pages">
        <div className="l-pages-item">
          <div className="l-pages-icones">
            <i className="fa-brands fa-twitter" aria-hidden="true"></i>
          </div>
        </div>
        <div className="l-pages-item">
          <div className="l-pages-item-wrapper">
            <div className="l-pages-icones">
              <i className="fa-solid fa-house"></i>
            </div>
            <p>Accueil</p>
          </div>
        </div>
        <div className="l-pages-item">
          <div className="l-pages-item-wrapper">
            <div className="l-pages-icones">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <p>Explorer</p>
          </div>
        </div>
        <div className="l-pages-item">
          <div className="l-pages-item-wrapper">
            <div className="l-pages-icones">
              <i className="fa-solid fa-bell"></i>
            </div>
            <p>Notifications</p>
          </div>
        </div>
        <div className="l-pages-item">
          <div className="l-pages-item-wrapper">
            <div className="l-pages-icones">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <p>Messages</p>
          </div>
        </div>
        <div className="l-pages-item">
          <div className="l-pages-item-wrapper">
            <div className="l-pages-icones">
              <i className="fa-solid fa-bookmark"></i>
            </div>
            <p>Signets</p>
          </div>
        </div>
        <div className="l-pages-item">
          <div className="l-pages-item-wrapper">
          <div className="l-pages-icones">
            <i className="fa-solid fa-list"></i>
          </div>
          <p>Liste</p>
          </div>
        </div>
        <div className="l-pages-item">
          <div className="l-pages-item-wrapper">
          <div className="l-pages-icones">
            <i className="fa-solid fa-user"></i>
          </div>
          <p>Profil</p>
          </div>
        </div>
        <div className="l-pages-item">
          <div className="l-pages-item-wrapper">
          <div className="l-pages-icones">
            <i className="fa-solid fa-ellipsis"></i>
          </div>
          <p>Plus</p>
          </div>
        </div>
      </div>
      <button className="l-tweeter">
        <span>Tweeter</span>
        <i className="fa-solid fa-pen-fancy"></i>
      </button>

      <Profilecard/>
      <div className="l-profile-card" onClick={handleClick}>
        <div className="l-profile-card-wrapper">
          <div className="l-profile-card-img">
            <img src={user.userpp} alt="profile-pic" />
          </div>         
          <div className="l-profile-card-infos">
            <div className="l-profile-card-item-wrapper">
              <p className="l-profile-card-item">{user.username}</p>
              <p className="l-profile-card-item">@{user.username}</p>
            </div>
          </div>
          <div className="l-more-icon">
            <i className="fa-solid fa-ellipsis"></i>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Left