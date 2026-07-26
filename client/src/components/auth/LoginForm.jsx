import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

import Button from "../common/Button";
import PasswordInput from "./PasswordInput";
import { loginUser } from "../../services/authService";
import useAuth from "../../hooks/useAuth";

const LoginForm = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");

      const payload = {
        email: data.email,
        password: data.password,
      };

      const response = await loginUser(payload);

      // Save user & token using AuthContext
      login(response.user, response.token);

      // Redirect
      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      setServerError(
        error.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Email */}

      <div>
        <input
          type="email"
          placeholder="Email Address"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Enter a valid email",
            },
          })}
          className="
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-950
            px-4
            py-3
            outline-none
            focus:border-blue-500
          "
        />

        {errors.email && (
          <p className="mt-2 text-sm text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}

      <PasswordInput
        placeholder="Password"
        register={register}
        name="password"
        validation={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Minimum 6 characters",
          },
        }}
        error={errors.password}
      />

      {/* Server Error */}

      {serverError && (
        <p className="text-center text-red-500">
          {serverError}
        </p>
      )}

      {/* Button */}

      <Button
        className="w-full"
        disabled={loading}
      >
        {loading ? "Logging In..." : "Login"}
      </Button>

      <p className="text-center text-slate-400">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-blue-500 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;