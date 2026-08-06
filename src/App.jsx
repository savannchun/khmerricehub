import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import RiceDetails from "./pages/RiceDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import Faq from "./pages/Faq.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import NotFound from "./pages/NotFound.jsx";

import BuyerDashboard from "./pages/buyer/BuyerDashboard.jsx";
import Favorites from "./pages/buyer/Favorites.jsx";
import OrderHistory from "./pages/buyer/OrderHistory.jsx";
import Messages from "./pages/buyer/Messages.jsx";
import Notifications from "./pages/buyer/Notifications.jsx";
import Profile from "./pages/buyer/Profile.jsx";

import FarmerDashboard from "./pages/farmer/FarmerDashboard.jsx";
import ManageListings from "./pages/farmer/ManageListings.jsx";
import AddListing from "./pages/farmer/AddListing.jsx";
import EditListing from "./pages/farmer/EditListing.jsx";
import FarmerOrders from "./pages/farmer/FarmerOrders.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import FarmerApproval from "./pages/admin/FarmerApproval.jsx";
import ProductModeration from "./pages/admin/ProductModeration.jsx";
import OrderManagement from "./pages/admin/OrderManagement.jsx";
import Reports from "./pages/admin/Reports.jsx";
import SettingsPage from "./pages/admin/Settings.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/rice/:id" element={<RiceDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/buyer/orders" element={<OrderHistory />} />
        <Route path="/buyer/orders/:id" element={<OrderHistory />} />
        <Route path="/buyer/favorites" element={<Favorites />} />
        <Route path="/buyer/messages" element={<Messages role="buyer" />} />
        <Route path="/buyer/notifications" element={<Notifications role="buyer" />} />
        <Route path="/buyer/profile" element={<Profile role="buyer" />} />

        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/listings" element={<ManageListings />} />
        <Route path="/farmer/listings/add" element={<AddListing />} />
        <Route path="/farmer/listings/:id/edit" element={<EditListing />} />
        <Route path="/farmer/orders" element={<FarmerOrders />} />
        <Route path="/farmer/messages" element={<Messages role="farmer" />} />
        <Route path="/farmer/notifications" element={<Notifications role="farmer" />} />
        <Route path="/farmer/profile" element={<Profile role="farmer" />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/farmers" element={<FarmerApproval />} />
        <Route path="/admin/moderation" element={<ProductModeration />} />
        <Route path="/admin/orders" element={<OrderManagement />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/settings" element={<SettingsPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
