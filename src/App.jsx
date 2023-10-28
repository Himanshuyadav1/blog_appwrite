import { Outlet } from 'react-router-dom';
import './App.css';
import { Header, Footer } from './components';
import { useEffect, useState } from 'react';
import { login, logout } from "./store/authSlice";
import { useDispatch } from 'react-redux';
import authService from "./appwrite/auth";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    authService.getCurrentUser()
      .then(userData => {
        if(userData) {
          dispatch(login(userData));
        }else {
          dispatch(logout());
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setLoading(false));

  }, [])
  
  return !loading ? 
    (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className="w-full block">
        <Header />
          <main>
            TODO: <Outlet />
          </main>
        <Footer />
      </div>
    </div>
    )
  : 
  (
    <>
      
    </>
  )
}

export default App;
