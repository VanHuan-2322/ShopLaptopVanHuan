import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import SearchResults from './pages/SearchResults';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Footer from './components/Footer';


const GOOGLE_CLIENT_ID = '897669238193-ci8hp9sn3b2qo5q77t0n4kij4fl6pjlr.apps.googleusercontent.com';


function App() {
  return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>

    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route
              path="/admin/products"
              element={<AdminRoute><AdminProducts /></AdminRoute>}
            />
            <Route
              path="/admin/users"
              element={<AdminRoute><AdminUsers /></AdminRoute>}
            />
            <Route
              path="/admin/orders"
              element={<AdminRoute><AdminOrders /></AdminRoute>}
            />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
            <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
        </GoogleOAuthProvider>

  );
}

export default App;