import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import UserAuthProvider from "./userContext";
import { useAuth } from "./userContext";

function App() {
  return (
    <BrowserRouter> 
      <UserAuthProvider>
        <Routes>
          
          <Route path='/' element={
            <PrivateRoute/>
          }/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/:userName' element={<Account/>}/>
        </Routes>
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

export default App;
