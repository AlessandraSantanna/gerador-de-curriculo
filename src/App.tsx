import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Generator from "./pages/Generator";
import Visualizer from "./pages/Visualizer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generator" element={<Generator />} />
      <Route path="/visualizer" element={<Visualizer />} />
    </Routes>
  );
}

export default App;
