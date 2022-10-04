import UserAuthProvider from "context/userContext";
import useAuth from "hooks/useAuth";
import Account from 'pages/Account';
import AccountSettings from "pages/AccountSettings";
import Explore from 'pages/Explore';
import Home from 'pages/Home';
import Loading from 'pages/Loading';
import Login from 'pages/Login';
import Post from 'pages/Post';
import SignUp from 'pages/SignUp';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter> 
      <UserAuthProvider>
        <Load>
          <Routes>
            <Route path='/' element={
              <PrivateRoute/>
            }/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/:username' element={<Account/>}/>
            <Route path="/p/:postId" element={<Post/>}/>
            <Route path="/accounts/edit" element={<AccountSettings/>} />
            <Route path="/accounts/password/change/" element={<AccountSettings/>} />
            <Route path="/explore" element={<Explore/>} />
          </Routes>
        </Load>
      </UserAuthProvider>
    </BrowserRouter>
  );
}

function PrivateRoute() {
  const { user } = useAuth()
  if (!user) {
    return <Login/>;
  }
  return <Home/>;
}

function Load({children}){
  const {isLoading} =  useAuth();
  if(isLoading) return (<Loading/>)
  return children
}

export default App;
