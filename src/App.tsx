import { Routes, Route, Link } from "react-router-dom";
import ClampPreview from "./components/ClampPreview";
import GradientDemo from "./components/GradientDemo";
import ClampCalculator from "./components/ClampCalculator";

function App() {
  return (
    <>
      <nav style={{ marginBottom: "2rem" }}>
        <Link to="/">Clamp Demo</Link> | <Link to="/gradients">Gradient Demo</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ClampPreview />} />
        <Route path="/gradients" element={<GradientDemo />} />
        <Route path="/clamp-calc" element={<ClampCalculator />} />
      </Routes>
    </>
  );
}

export default App;
