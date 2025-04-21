import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css'
import BSTVisualizer from './BSTVisualizer'
import BPlusTreeVisualizer from './BPlusTreeVisualizer'
import BTreeVisualizer from './BTreeVisualizer'
import LandingPage from './LandingPage'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/bst" element={<BSTVisualizer />} />
        <Route path="/bplus" element={<BPlusTreeVisualizer />} />
        <Route path="/btree" element={<BTreeVisualizer />} />
      </Routes>
    </Router>
  );
};

export default App;