import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import EditorPage from './pages/EditorPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/editor/:roomId" element={<EditorPage/>}/>
      </Routes>
      <Toaster/>
    </Router>
  );
}

export default App;
