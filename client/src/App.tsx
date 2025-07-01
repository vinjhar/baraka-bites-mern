
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useSearchParams
} from 'react-router-dom';

import ScrollToTop from './components/ScrollToTop'; // import the new component

import Layout from './components/Layout';

import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import SunnahFoodsPage from './pages/SunnahFoodsPage';
import BlogPage from './pages/BlogPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import CheckoutCancelPage from './pages/CheckoutCancelPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import EmailConfirmationPage from './pages/EmailConfirmationPage';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import GoogleCallback from './components/GoogleCallback';
import ResendVerificationPage from './pages/ResendVerificationPage';
import EmailVerified from './pages/EmailVerified';
import PaymentSuccess from './pages/PaymentSuccess';


const App = () => {
  return (
    <Router>
      <ScrollToTop />
      
         <Layout>
            <Routes>
              
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/SignIn" element={<SignIn />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              
              <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
              <Route path="/resend-verification" element={<ResendVerificationPage />} />
              <Route path="/email-verified" element={<EmailVerified />} />
              <Route path="/auth/google/callback" element={<GoogleCallback />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/dashboard" element={
             
                  <DashboardPage />
               
               } />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/sunnah-foods" element={<SunnahFoodsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/checkout/success" element={
                
                  <CheckoutSuccessPage />
                
              } />
              <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
            </Routes>
        </Layout>
      
    </Router>
  );
};

export default App;
