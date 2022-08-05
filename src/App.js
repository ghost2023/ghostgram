import { BrowserRouter, Route, Routes } from "react-router-dom";
import Account from './pages/Account';
import Home from './pages/Home';
import Loading from './pages/Loading';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
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
            <Route path='/:userName' element={<Account/>}/>
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
