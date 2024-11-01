import React from "react";
import { AuthProvider } from "../context/AuthContext";
import SignInForm from "./SignInForm";

const SignInPage = () => (
  <AuthProvider>
    <SignInForm />
  </AuthProvider>
);

export default SignInPage;