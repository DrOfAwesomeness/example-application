import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Routes, Route, Link } from 'react-router-dom';
import ProductsPage from '../ProductsPage';
import OrderSuccess from '../OrderSuccess';
import OrderCancel from '../OrderCancel';

const theme = createTheme({
  palette: {
    background: {
      default: '#eee'
    }
  }
});

const App = () => {
  let logoUrl = new URL('logo.png?height=64', import.meta.url);
  return <React.Fragment>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position = "static"
        color = "default"
        elevation = {0}
      >
          <Toolbar sx={{flexWrap: 'wrap'}}>
            <Link to='/'>
              <img src={logoUrl.toString()} alt='Cofffeee Shop'></img>
            </Link>
          </Toolbar>
      </AppBar>
      <Container component='main'>
        <Routes>
          <Route path='/' element={<ProductsPage />} />
          <Route path='/order/:orderId/success' element={<OrderSuccess />} />
          <Route path='/order/:orderId/cancel' element={<OrderCancel />} />
        </Routes>
      </Container>
    </ThemeProvider>
  </React.Fragment>
}

export default App;