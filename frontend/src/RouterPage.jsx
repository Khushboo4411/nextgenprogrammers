import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./Login";
import Signup from "./Signup";
import Courses from "./Courses";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import WhyChooseUs from "./WhyChooseUs";
import Testimonials from "./Testimonials";
import CourseDetails from "./CourseDetails";

import UserDashboard from "./User/Dashboard";
import AdminDashboard from "./Admin/Dashboard";
import BrowseCourses from "./Courses";

import UserProtectedRoute from "./User/UserProtectedRoute";
import AdminProtectedRoute from "./Admin/AdminProtectedRoute";
import CourseForm from "./Admin/CourseForm";
import ManageCourses from "./Admin/ManageCourses";
import AdminProfile from "./Admin/Profile";
import Messages from "./Admin/Messages";
import Students from "./Admin/Students";
import Profile from "./User/Profile";
import MyCourses from "./User/MyCourses";
import Assignments from "./User/Assignments";
import UpcomingClasses from "./User/UpcomingClasses";
import Notification from "./User/Notification";
import AdminNotification from "./Admin/Notifications";
import AdminEnrollment from "./Admin/AdminEnrollment";
import ForgotPassword from "./ForgotPassword";

import Help from "./User/Help";

function RouterPage() {
  return (
    <Routes>
      {/* Public Routes */}

      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Courses" element={<Courses />} />
      <Route path="/About" element={<About />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/Testimonials" element={<Testimonials />} />
      <Route path="/WhyChooseUs" element={<WhyChooseUs />} />
      <Route path="/course/:id" element={<CourseDetails />} />
      <Route
        path="/admin/course-form"
        element={<CourseForm />}
      />

      <Route
        path="/admin/course-form/:courseId"
        element={<CourseForm />}
      />

      <Route
  path="/assignments"
  element={
    <UserProtectedRoute>
      <Assignments />
    </UserProtectedRoute>
  }
/>

<Route
  path="/Admin/AdminEnrollment"
  element={
    <AdminProtectedRoute>
      <AdminEnrollment />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/upcoming-classes"
  element={
    <UserProtectedRoute>
      <UpcomingClasses />
    </UserProtectedRoute>
  }
/>

<Route
  path="/notifications"
  element={
    <UserProtectedRoute>
      <Notification />
    </UserProtectedRoute>
  }
/>



<Route
  path="/admin/notifications"
  element={<AdminNotification />}
/>

 


      <Route
  path="/admin/messages"
  element={<Messages />}
/>

<Route
  path="/ForgotPassword"
  element={<ForgotPassword />}
/>


<Route
  path="/help"
  element={
    <UserProtectedRoute>
      <Help />
    </UserProtectedRoute>
  }
/>


 <Route path="/user/profile" element={<Profile />} />
<Route
  path="/Admin/Students"
  element={<Students />}
/>


      <Route
  path="/admin/manage-courses"
  element={
    <AdminProtectedRoute>
      <ManageCourses />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/mycourses"
  element={
    <UserProtectedRoute>
      <MyCourses />
    </UserProtectedRoute>
  }
/>

<Route
  path="/Admin/Profile"
  element={<AdminProfile />}
/>
      {/* User Routes */}

      <Route
        path="/User/Dashboard"
        element={
          <UserProtectedRoute>
            <UserDashboard />
          </UserProtectedRoute>
        }
      />

      <Route
        path="/User/Courses"
        element={
          <UserProtectedRoute>
            <BrowseCourses />
          </UserProtectedRoute>
        }
      />

      {/* Admin Routes */}

      <Route
        path="/Admin/Dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/Admin/Courses"
        element={
          <AdminProtectedRoute>
            <Courses />
          </AdminProtectedRoute>
        }
      />
    </Routes>


    
  );
}

export default RouterPage;