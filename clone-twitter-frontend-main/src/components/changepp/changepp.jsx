import "./changepp.css"
import Axios from 'axios'

const Changepp = () => {

  const user = JSON.parse(localStorage.getItem('user'));
  // send new url to backend
  const sendNewUrl = (url) => {
    console.log(user.username)
    console.log(user.accessToken)

    // send a request to the server
    Axios.post('https://apitwitter.emilienpons.com/api/pp',{
        username: user.username,
        pp: url,
        usertoken: user.accessToken
      }, {headers: {
        'Authorization': `Bearer ${user.accessToken}`
      }})
      .then(function (response) {
        if (response.data) {
          user.userpp = url;
          localStorage.setItem('user', JSON.stringify(user));
          window.location.reload();
        } else {
          alert('Error');
        }
      })
  }

  return (
    <div className="pp">
        <div className="pp-text">
          <input type="text" placeholder="Entrez une url" id='newUrl'/>
          <button onClick={() => {
            // get value of input
            const newUrl = document.getElementById('newUrl').value;
            // if url is empty
            if (newUrl.length === 0) {
              alert("Url cannot be empty");
            }
            // if url is not empty
            else {
              console.log(newUrl);
              sendNewUrl(newUrl);
            }
          }}>Changer</button>
        </div>
    </div>
  )
}

export default Changepp
