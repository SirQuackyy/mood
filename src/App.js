import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './components/Index';
import Create from './components/Create';
import Error from './components/Error'
import MyCollections from './components/MyCollections';

const App = () => {
  const backgroundColorValue=0;
  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Index/>} />
        <Route path="/create" element={<Create/>} /> 
        <Route path="/mycollections" element={<MyCollections/> } /> 
        <Route path="*" element={Error} />
        </Routes>
    </BrowserRouter>
    )
}
export default App;