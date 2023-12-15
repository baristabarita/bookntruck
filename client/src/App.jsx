import { BrowserRouter, Routes, Route } from 'react-router-dom'

import UserLogin from './pages/user/login/UserLogin.jsx'
import AdminLogin from './pages/admin/login/AdminLogin.jsx'
import TruckerLogin from './pages/trucker/login/TrkrLogin.jsx'
import UserRegister from './pages/user/register/UserRegister.jsx'
import TruckerRegister from './pages/trucker/register/TrkrRegister.jsx'
import LogoutPage from './pages/LogoutPage.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'

import UserLayout from './components/layouts/UserLayout.jsx'
import LandingPage from './pages/user/landing/LandingPage.jsx'
import AboutUsPage from './pages/user/about/AboutUs.jsx'
import ProfilePage from './pages/user/profile/UserProfile.jsx'
import ChoicesPage from './pages/user/bookingChoices/ChoicesPage.jsx'
import ChoiceDeets from './pages/user/bookingChoices/ChoiceDetails.jsx'
import BookingForm from './pages/user/bookingChoices/BookingForm.jsx'
import ConfirmBooking from './pages/user/bookingChoices/ConfirmBookingChoice.jsx'
import BookingSent from './pages/user/bookingChoices/BookingSent.jsx'
import BookingDetails from './pages/user/bookingChoices/BookingDetails.jsx'

import TruckerLayout from './components/layouts/TruckerLayout.jsx'
import TruckerDashboard from './pages/trucker/dashboard/Dashboard.jsx'
import BookingList from './pages/trucker/bookingManager/BookingList.jsx'
import AssetList from './pages/trucker/assetManager/AssetList.jsx'
import PaymentList from './pages/trucker/paymentManager/paymentList.jsx'
import TruckerRatings from './pages/trucker/ratings/TruckerRatings.jsx'
import TruckerSettings from './pages/trucker/settings/TruckerSettings.jsx'

import AdminLayout from './components/layouts/AdminLayout.jsx'
import AdminDashboard from './pages/admin/dashboard/AdminDashboard.jsx'
import UserList from './pages/admin/adminlogs/UserList.jsx'
import TruckerList from './pages/admin/truckerManager/TruckerList.jsx'
import BookingLogs from './pages/admin/adminlogs/BookingLogs.jsx'

//import TestComponent from './pages/admin/dontmind/AdminReg.jsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* General Pages */}
        <Route path="/usrlogin" element={<UserLogin />} />
        <Route path="/trkrlogin" element={<TruckerLogin />} />
        <Route path="/adlogin" element={<AdminLogin />} />
        <Route path="/usregister" element={<UserRegister />} />
        <Route path="/trkregister" element={<TruckerRegister />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/forgpass" element={<ForgotPassword />} />
        

        {/* Layouts */}
        <Route path="/" element={<UserLayout />} >
          <Route index element={<LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/userprofile" element={<ProfilePage />} />
          <Route path="/bookingchoices" element={<ChoicesPage />} />
          <Route path="/bookingchoices/view/" element={<ChoiceDeets />} />
          <Route path="/bookingchoices/book" element={<BookingForm />} />
          <Route path="/bookingchoices/confirm" element={<ConfirmBooking />} />
          <Route path="/bookingchoices/servicedetails" element={<BookingDetails />} />
          <Route path="/bookingsent" element={<BookingSent />} />
        </Route>

        <Route path="/trucker" element={<TruckerLayout />}>
          <Route index path="trkrdash" element={<TruckerDashboard />} />
          <Route path="bookinglist" element={<BookingList />} />
          <Route path="assetlist" element={<AssetList />} />
          <Route path="paymentlist" element={<PaymentList />} />
          <Route path="reviewlist" element={<TruckerRatings />} />
          <Route path="trkrsettings" element={<TruckerSettings />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index path="admindash" element={<AdminDashboard />} />
          <Route path="userlist" element={<UserList />} />
          <Route path="truckerlist" element={<TruckerList />} />
          <Route path="bookinglogs" element={<BookingLogs />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App
