import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './ThemeContext';
import CookieConsent from './components/CookieConsent';

const Home = React.lazy(() => import('./components/Home'));
const About = React.lazy(() => import('./components/About'));
const Blog = React.lazy(() => import('./components/Blog'));
const Contact = React.lazy(() => import('./components/Contact'));
const Careers = React.lazy(() => import('./components/Careers'));
const Press = React.lazy(() => import('./components/Press'));
const Status = React.lazy(() => import('./components/Status'));
const Login = React.lazy(() => import('./components/Login'));
const SignUp = React.lazy(() => import('./components/SignUp'));

function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/status" element={<Status />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Suspense>
      <Footer />
      <ScrollToTop />
      <CookieConsent />
    </ThemeProvider>
  );
}

export default App;