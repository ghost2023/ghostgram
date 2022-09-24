import Account from 'pages/Account';
import Home from 'pages/Home';
import Loading from 'pages/Loading';
import Login from 'pages/Login';
import Post from 'pages/Post';
import SignUp from 'pages/SignUp';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserAuthProvider, { useAuth } from "./userContext";

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
          </Routes>
        </Load>
      </UserAuthProvider>
    </BrowserRouter>
  );
}

function PrivateRoute({  }) {
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
