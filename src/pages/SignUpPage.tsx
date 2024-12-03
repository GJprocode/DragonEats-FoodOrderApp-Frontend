import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    const redirectToSignup = async () => {
      try {
        await loginWithRedirect({
          appState: { targetUrl: isProduction ? "/" : "/local-home" }, // target URL after login
          authorizationParams: {
            screen_hint: "signup",
            redirect_uri: isProduction
              ? "https://dragoneats-foodorderapp-frontend.onrender.com"
              : "http://localhost:5173",
          }
        });
      } catch (error) {
        console.error("Error during signup redirect:", error);
        navigate("/error");  // Handle signup error if needed
      }
    };

    redirectToSignup();
  }, [loginWithRedirect, navigate, isProduction]);

  return <div>Redirecting to signup...</div>;
};

export default SignupPage;
