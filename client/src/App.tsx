
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
import ResetPasswordPage from './pages/ResetPasswordPage';
import EmailConfirmationPage from './pages/EmailConfirmationPage';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import RecipeCard from './components/RecipeCard';


const App = () => {
  return (
    <Router>
      <ScrollToTop />
      
         <Layout>
            <Routes>
              <Route path='/testCard' element={
                <div className="bg-gray-50 min-h-screen p-4">
                <RecipeCard />
                </div>
              } />
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/SignIn" element={<SignIn />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
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
