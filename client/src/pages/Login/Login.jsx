import AuthLayout from "../../components/auth/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

const Login = () => {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue managing your finances."
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;