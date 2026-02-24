import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./css/style.css";
import "./charts/ChartjsConfig";

// Import pages
import Users from "./pages/users/Users";
import UserForm from "./pages/users/UserForm";
import Calendar from "./pages/Calendar";
import { Faqs } from "./pages/utility/Faqs";
import EmptyState from "./pages/utility/EmptyState";
import PageNotFound from "./pages/utility/PageNotFound";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import OTP from "./pages/OTP";
import BookingsCalendar from "./pages/BookingsCalendar";
import BookingsAnalytics from "./pages/BookingsAnalytics";
import Bookings from "./pages/bookings/Bookings";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsConditions } from "./pages/TermsConditions";
import { ContactUs } from "./pages/ContactUs";
import BookingOrderDetails from "./pages/bookings/BookingOrderDetails";
import BookingDetailsForm from "./pages/bookings/BookingDetailsForm";
import MyProfile from "./pages/profile/Profile";
import ProfileEdit from "./pages/profile/ProfileEdit";
import ProfileNew from "./pages/profile/ProfileNew";
import ServiceEdit from "./pages/profile/ServiceEdit";
import MediaEdit from "./pages/profile/MediaEdit";
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer } from "react-toastify";
import { PublicRoute } from "./components";
import { Signin } from "./pages";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Employees } from "./pages/employees/Employees";
import { NewProfile } from "./pages/NewProfile/NewProfile";
import { Profile } from "./pages/vendorProfile/Profile";
import { BookingsNew } from "./pages/bookings/BookingsNew";
import { BookingDetails } from "./pages/bookings/BookingDetails";

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/email-verification" element={<OTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/contact-support" element={<ContactUs />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/bookings" element={<BookingsNew />} />
          <Route path="/booking-details/:id" element={<BookingDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="new-profile" element={<NewProfile />} />
      </Routes>
      {/* <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/email-verification" element={<OTP />} />
      <Route path="/reset-password" element={<ResetPassword />} /> */}
      {/* <Routes>
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute>
              <BookingsAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/users/new"
          element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/bookings-calendar"
          element={
            <ProtectedRoute>
              <BookingsCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/bookings-analytics"
          element={
            <ProtectedRoute>
              <BookingsAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-order-details"
          element={
            <ProtectedRoute>
              <BookingOrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-details-form"
          element={
            <ProtectedRoute>
              <BookingDetailsForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/edit-profile"
          element={
            <ProtectedRoute>
              <ProfileEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/new-profile"
          element={
            <ProtectedRoute>
              <ProfileNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/edit-service"
          element={
            <ProtectedRoute>
              <ServiceEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/edit-media"
          element={
            <ProtectedRoute>
              <MediaEdit />
            </ProtectedRoute>
          }
        />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/utility/faqs" element={<Faqs />} />
        <Route path="/utility/empty-state" element={<EmptyState />} />
        <Route path="/utility/404" element={<PageNotFound />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/email-verification" element={<OTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes> */}
    </>
  );
}

export default App;
