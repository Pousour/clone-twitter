import "./profileCard.css"
import Changepp from '../changepp/changepp'

const Profilecard = () => {

  const user = JSON.parse(localStorage.getItem('user'));

  // handle onclick show/hide comments
  const handleClick = () => {
    const pp = document.getElementsByClassName('pp')[0];
    if (pp.style.display === 'none') {
      pp.style.display = 'flex';
    } else {
      pp.style.display = 'none';
    }
  }

    // function to handle logout
  const handleLogout = () => {
    // remove user from local storage
    localStorage.removeItem('user');
    // redirect to login page
    window.location.href = "/login";

  }

  return (
    <div className="p-c">
      <Changepp/>
        <div className="p-c-wrapper">
          <div className="p-c-img" onClick={handleClick}>
            <img src={user.userpp} alt='profile'></img>
          </div>          
          <div className="p-c-infos">
            <p className="p-c-name">{user.username}</p>
            <p className="p-c-id">@{user.username}</p>
          </div>
        </div>
        <div className="p-c-move">
            <p className="p-c-item">
                Ajouter un compte existant
            </p>
            <p className="p-c-item" onClick={handleLogout}>
                Se déconnecter de Twitter
            </p>
        </div>
    </div>
  )
}

export default Profilecard