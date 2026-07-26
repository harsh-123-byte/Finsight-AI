import AuthLayout from "../../components/auth/AuthLayout";
import SignupForm from "../../components/auth/SignupForm";

const Signup = () => {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start managing your finances with AI."
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;