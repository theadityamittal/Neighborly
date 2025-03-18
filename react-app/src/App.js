import './App.css';
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import Test from './screens/Test';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Test />} />
        
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


