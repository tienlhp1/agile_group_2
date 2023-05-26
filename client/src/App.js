import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import SnackbarProvider from 'react-simple-snackbar'
import ClientList from './components/Clients/ClientList'
import NavBar from './components/NavBar/NavBar';
import Login from './components/Login/Login'
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Invoice from './components/Style/Style.module.css';

function App() {

  const user = JSON.parse(localStorage.getItem('profile'))

  return (
    <div>
      <BrowserRouter>
      <SnackbarProvider>
     {user && <NavBar />} 
      <Header />
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login" exact component={Login} />
          <Route path="/customers" exact component={ClientList} />

        </Switch>
        <Footer />
        </SnackbarProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
