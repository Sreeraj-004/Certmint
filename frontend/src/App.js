import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import StudentDashboard from "./components/Student-dashboard.jsx";
import InstitutionDashboard from "./components/Institution-dashboard.jsx";
import IssueCertificate from "./components/IssueCertificate.jsx";
import VerifyCertificate from "./components/VerifyCertificate.jsx";
import "./App.css";
import logo from "./logo.svg";

function App() {
  return (
    <Router>
      <Routes>

        {/* Default home page */}
        <Route
          path="/"
          element={
            <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                </a>
              </header>
            </div>
          }
        />

        {/* Login page route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/institution-dashboard" element={<InstitutionDashboard />} />
        <Route path="/issue-certificate" element={<IssueCertificate />} />
        <Route path="/verify/:tokenId" element={<VerifyCertificate />} />

      </Routes>
  
    </Router>
  );
}

export default App;
