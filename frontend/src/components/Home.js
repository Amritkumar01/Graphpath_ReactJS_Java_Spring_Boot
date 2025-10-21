import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateMap from "../components/CreateMap";
import ShowMap from "../components/ShowMap";
import { motion } from "framer-motion";
import "../style/styles.css";

function Home() {
  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", 
        background: "linear-gradient(135deg, #a8dadc, #f1faee)" }}>
        <Routes>
          {/* background: linear-gradient(135deg, #a8dadc, #f1faee); */}

          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                style={{ textAlign: "center" }}
              >
                <motion.h1
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  style={{ color: "black", fontSize: "3rem", marginBottom: "40px" }}
                >
                  Welcome to Graph Path
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                  style={{ display: "flex", gap: "20px", justifyContent: "center" }}
                >
                  <Link to="/create-map">
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "#ff7f50" }}
                      whileTap={{ scale: 0.95 }}
                      className="action-btn"
                    >
                      Create Map
                    </motion.button>
                  </Link>
                  <Link to="/show-map">
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "#1e90ff" }}
                      whileTap={{ scale: 0.95 }}
                      className="action-btn"
                    >
                      Show Map
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>
            }
          />
          <Route path="/create-map" element={<CreateMap />} />
          <Route path="/show-map" element={<ShowMap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Home;
