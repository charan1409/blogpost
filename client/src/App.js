import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

import MainPage from "./components/MainPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<MainPage page={"login"} />} />
        <Route path="/signup" element={<MainPage page={"signup"} />} />
        <Route path="/" element={<MainPage page={"home"} />} />
        <Route path="/create-blog" element={<MainPage page={"create"} />} />
        <Route path="/blog/:id" element={<MainPage page={"blog"} />} />
        <Route path="/edit-blog/:id" element={<MainPage page={"edit"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
