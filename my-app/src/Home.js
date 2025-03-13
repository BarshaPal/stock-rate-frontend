import React from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import BoxList from './BoxList';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

const Home = () => {
  return (
    <div>
      <AppNavbar/>
      <Container fluid>
        <BoxList/>
      </Container>
    </div>
  );
}

export default Home;