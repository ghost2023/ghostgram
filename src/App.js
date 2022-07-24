import { BrowserRouter,Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UserAuthProvider from "./userContext";

function App() {
  return (
    <BrowserRouter> 
      <UserAuthProvider>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
        </Routes>
      </UserAuthProvider>
    </BrowserRouter>
  );
}

export default App;
