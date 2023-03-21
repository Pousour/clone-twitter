import Login from './components/login/login';
import Register from './components/register/register';
import Main from './components/main/main';
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

const App = () => {
  // get page url


  if (localStorage.getItem('user') === null && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
    window.location.href = "/login";
  } else if (localStorage.getItem('user') !== null && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
    window.location.href = "/";
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </BrowserRouter>
    )
};

export default App;