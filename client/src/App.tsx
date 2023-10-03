import React, {useState} from 'react';
import {Container} from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Blogitekstit from './components/Blogitekstit';
import './App.css';


const App : React.FC = () : React.ReactElement => {

  const [token, setToken] = useState<string>(String(localStorage.getItem('token')));
  const[kirjautuminen, setKirjautuminen] = useState<boolean>(false);


  return (

    <Container>

    <Routes>
      <Route path="/" element={<Blogitekstit token={token} kirjautuminen={kirjautuminen} setKirjautuminen={setKirjautuminen}/>}/>
      <Route path="/login" element={<Login setToken={setToken} setKirjautuminen={setKirjautuminen}/>}/>
      <Route path="/register" element={<Register/>}/>
    </Routes>
    </Container>
  );
}

export default App;
