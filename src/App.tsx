import React from 'react';
import './App.css';
import Maze from './components/Maze';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/Maze-Generator' element={<Maze/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
