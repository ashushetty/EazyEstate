import { Route, Routes } from "react-router-dom";
import Navbar from "./component/Navbar";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./component/PrivateRoute";
import CreateListing from "./pages/CreateListing";



function App() {
  return (
   

    
     <div className="App"> 
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/about" element={<About/>}/>
        <Route element={<PrivateRoute/>}>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/create-listing" element={<CreateListing/>}/>
        </Route>
      </Routes>
      <Toaster position="bottom-center" reverseOrder={false} />
  </div>

 
)}

export default App;
