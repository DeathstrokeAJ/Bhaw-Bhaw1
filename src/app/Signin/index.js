// pages/signin/index.js
import { AuthProvider } from "../context/AuthContext";
import SignInForm from "./SignInForm";

const SignInPage = () => (
  <AuthProvider>
    <SignInForm />
  </AuthProvider>
);

export default SignInPage;
