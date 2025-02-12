import { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import Login from './components/Login'
import Home from './components/Home'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPassword from './components/ForgotPassword';
import SignUp from './components/SignUp';
import ProductDetail from './components/ProductDetail';
import SearchResults from './components/SearchResults';
import Cart from './components/Cart';
import Account from './components/Account'
import './App.css'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/sign-up" component={SignUp} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute path="/products/:id" component={ProductDetail} />
        <ProtectedRoute path="/search" component={SearchResults} />
        <ProtectedRoute path="/carts" component={Cart} />
        <ProtectedRoute path="/Account" component={Account} />
        <Route path="/not-found" component={NotFound} />
        <Redirect to="not-found" />
      </Switch>
    )
  }
}

export default App
