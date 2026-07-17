import React from 'react';
import ReactDOM from 'react-dom/client';
import Courses from './Courses';
import About from './About.jsx';
import Signup from './Signup';
import RouterPage from './RouterPage';
import WhyChooseUs from './WhyChooseUs.jsx';
import Contact from './Contact.jsx';
import Navbar from './Navbar.jsx';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
        <RouterPage />
    </BrowserRouter>
);


