import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

import Button from "../common/Button";
import PasswordInput from "./PasswordInput";
import { registerUser } from "../../services/authService";
import useAuth from "../../hooks/useAuth";

const SignupForm = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      const response = await registerUser(payload);

      // Save user and token in AuthContext
      login(response.user, response.token);

      // Redirect to Dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      setServerError(
        error.response?.data?.message || "Something went wrong."
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
      {/* Name */}
      <div>
        <input
          type="text"
          placeholder="Full Name"
          {...register("name", {
            required: "Full name is required",
            minLength: {
              value: 3,
              message: "Minimum 3 characters",
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

        {errors.name && (
          <p className="mt-2 text-sm text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

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

      {/* Confirm Password */}
      <PasswordInput
        placeholder="Confirm Password"
        register={register}
        name="confirmPassword"
        validation={{
          required: "Please confirm your password",
          validate: (value) =>
            value === password || "Passwords do not match",
        }}
        error={errors.confirmPassword}
      />

      {/* Backend Error */}
      {serverError && (
        <p className="text-center text-red-500">
          {serverError}
        </p>
      )}

      {/* Submit Button */}
      <Button
        className="w-full"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      <p className="text-center text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-500 hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;