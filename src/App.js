import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Results from "./components/Results";
import { useState } from "react";

function App() {
  const [image, setImage] = useState();
  return (
    <Routes>
      <Route path="/" element={<Home setFile={setImage} />} />
      <Route path="/results" element={<Results image={image} />} />
    </Routes>
  );
}

export default App;
