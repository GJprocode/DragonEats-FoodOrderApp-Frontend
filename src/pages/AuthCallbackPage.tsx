import { useCreateMyUser } from "../api/MyUserApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error } = useAuth0(); // Capturing error for login failures
  const { createUser } = useCreateMyUser();
  const hasCreatedUser = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    // Handle login errors (such as when a user is not signed up)
    if (error) {
      console.error("Login error:", error);
      alert("Please sign up first."); // Alert the user to sign up
      navigate("/signup"); // Redirect to the signup page
      return;
    }

    // If the user is authenticated and hasn't been created in the DB, create them
    if (user?.sub && user?.email && !hasCreatedUser.current) {
      createUser({ auth0Id: user.sub, email: user.email });
      hasCreatedUser.current = true;
    }

    // Once authenticated, redirect based on the environment
    if (isAuthenticated) {
      const isProduction = process.env.NODE_ENV === "production";
      const redirectUrl = isProduction
        ? "https://dragoneats-foodorderapp-frontend.onrender.com" // Replace with your production URL
        : "http://localhost:5173";

      navigate(redirectUrl);
    }
  }, [createUser, navigate, user, isAuthenticated, isLoading, error]);

  return <>Loading...</>;
};

export default AuthCallbackPage;
