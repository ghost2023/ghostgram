import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
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
        </Routes>
      </UserAuthProvider>
    </BrowserRouter>
  );
}

function PrivateRoute({  }) {
  const { user } = useAuth()
  console.log(user)
  if (!user) {
    return <Login/>;
  }
  return <Home/>;
}

export default App;
