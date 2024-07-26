import './App.css';
import Navbar from "./components/ui/Navbar";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from "./pages/SignUp";
import PrivateComponent from "./components/ui/PrivateComponent";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Explore from "./pages/Explore";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route element={<PrivateComponent />}>
            <Route path="/" element={ <Home /> } />
            <Route path="/explore-feed" element={ <Explore /> } />
            <Route path="/profile" element={<h1>Profile component</h1>} />
          </Route>
          <Route path="/signup" element={ <SignUp /> } />
          <Route path="/login" element={ <Login /> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
