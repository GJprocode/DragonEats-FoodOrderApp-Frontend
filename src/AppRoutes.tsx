import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import UserProfilePage from "./pages/UserProfilePage";
import ProtectedRoute from "./auth/ProtectedRoute";
import ManageRestaurantPage from "./pages/ManageRestaurantPage";
import SearchPage from "./pages/SearchPage";
import DetailPage from "./pages/DetailPage";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Layout from "./layouts/layout"; 
import AdminPanelPage from "./pages/AdminPanelPage";
import SignUpPage from "../src/pages/SignUpPage";  // Import your signup page
import OrderStatusPage from "./pages/OrderStatusPage";

const AppRoutes = () => {
  return (
    <Routes>

      <Route
        path="/"
        element={
          <Layout showMainPic>
            <HomePage />
          </Layout>
        }
      />
     
      <Route path="/auth-callback" element={<AuthCallbackPage />} />
      <Route
        path="/search/:city"
        element={
          <Layout showMainPic={false}>
            <SearchPage />
          </Layout>
        }
      />
      <Route
        path="/detail/:restaurantId"
        element={
          <Layout showMainPic={false}>
            <DetailPage />
          </Layout>
        }
      />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>

      <Route
        path="/order-status"
        element={
          <Layout >
            <OrderStatusPage />
          </Layout>
        }
      />
      
      <Route
          path="/user-profile"
          element={
            <Layout>
              <UserProfilePage />
            </Layout>
          }
        />
        
        <Route
          path="/manage-restaurant"
          element={
            <Layout>
              <ManageRestaurantPage />
            </Layout>
          }
        />

        <Route
          path="/admin-panel"
          element={
            <Layout>
              <AdminPanelPage />
            </Layout>
          }
        />
      </Route>

      {/* Add the signup route */}
      <Route
        path="/signup"
        element={
          <Layout>
            <SignUpPage />
          </Layout>
        }
      />

      <Route
        path="/terms-of-service"
        element={
          <Layout>
            <TermsOfService />
          </Layout>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <Layout>
            <PrivacyPolicy />
          </Layout>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
