import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import Cart from './pages/Cart'
import Home from './pages/Index'
import Login from './pages/Login'
import Register from './pages/Register'
import Categories from './pages/Categories'
import CategoryProducts from './pages/CategoryProducts'
import ProductDetails from './pages/ProductDetails'
import SearchResults from './pages/SearchResults'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import NotFound from './pages/NotFound'
import About from './pages/About'
import Contact from './pages/Contact'
import Delivery from './pages/Delivery'
import UserAccount from './pages/UserAccount'
import OrderDetails from './pages/OrderDetails'
import Offers from './pages/Offers'
import OfferDetails from './pages/OfferDetails'
import CategoryOffers from './pages/CategoryOffers'
import Fresh from './pages/Fresh'
import VendorLogin from './pages/VendorLogin'
import VendorSignup from './pages/VendorSignup'
import VendorDashboard from './pages/VendorDashboard'
import VendorAddProduct from './pages/VendorAddProduct'
import VendorProducts from './pages/VendorProducts'
import VendorOrders from './pages/VendorOrders'
import VendorReports from './pages/VendorReports'
import VendorSettings from './pages/VendorSettings'
import Vendors from './pages/Vendors'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Refund from './pages/Refund'
// @ts-ignore
import ApiTest from './components/ApiTest'
import SplashScreen from './components/ui/splash-screen'
import { useNavigationSplash } from './hooks/useNavigationSplash'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import SettingsService from './services/settingsService'

function App() {
  const { isVisible, onComplete, duration } = useNavigationSplash({
    enabled: true,
    duration: 1800,
    adminRoutesOnly: true,
    excludeRoutes: ['/', '/vendor/login', '/vendor/signup', '/vendor/dashboard', '/vendor/add-product', '/vendor/products', '/vendor/orders']
  });

  // Initialize settings service on app start
  useEffect(() => {
    const settingsService = SettingsService.getInstance();
    
    // تحقق من أن الخدمة لم يتم تهيئتها بالفعل
    if (settingsService.isInitialized()) {
      return;
    }

    const initializeSettings = async () => {
      try {
        await settingsService.initialize();
        console.log('✅ Settings service initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize settings service:', error);
      }
    };

    initializeSettings();
  }, []); // مصفوفة فارغة لضمان التشغيل مرة واحدة فقط

  return (
    <>
      <SplashScreen 
        isVisible={isVisible} 
        onComplete={onComplete} 
        duration={duration} 
      />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:slug" element={<CategoryProducts />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/offers/:id" element={<OfferDetails />} />
          <Route path="/offers/category/:id" element={<CategoryOffers />} />
          <Route path="/fresh" element={<Fresh />} />
          <Route path="/account" element={<UserAccount />} />
          <Route path="/profile" element={<UserAccount />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/vendor/signup" element={<VendorSignup />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/add-product" element={<VendorAddProduct />} />
          <Route path="/vendor/products" element={<VendorProducts />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />
          <Route path="/vendor/reports" element={<VendorReports />} />
          <Route path="/vendor/settings" element={<VendorSettings />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:id/products" element={<VendorProducts />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster 
        position="top-right"
        richColors
        closeButton
        expand
        duration={4000}
        toastOptions={{
          className: 'toast-custom',
          style: {
            fontFamily: 'Cairo, sans-serif',
          },
        }}
      />
    </>
  )
}

export default App
