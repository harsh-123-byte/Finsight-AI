import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";
import { toast } from "react-hot-toast";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/auth/me");
        setProfile(response.data.user);
        reset({
          name: response.data.user.name,
          email: response.data.user.email,
          currency: response.data.user.currency || "INR",
          monthlyBudget: response.data.user.monthlyBudget || 0,
          savingsGoal: response.data.user.savingsGoal || 0,
        });
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.put("/auth/me", data);
      toast.success("Settings saved successfully.");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Failed to update settings."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="mt-2 text-slate-400">
            Manage your account preferences and financial goals.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 text-center text-lg">Loading settings...</div>
      ) : error ? (
        <div className="mt-10 text-center text-red-500">{error}</div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 space-y-8 rounded-3xl border border-slate-800 bg-slate-900 p-10 shadow-xl"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              <span>Name</span>
              <input
                {...register("name", { required: true })}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 outline-none"
              />
              {errors.name && (
                <span className="text-sm text-red-400">
                  Name is required.
                </span>
              )}
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Email</span>
              <input
                {...register("email", {
                  required: true,
                  pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                })}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 outline-none"
              />
              {errors.email && (
                <span className="text-sm text-red-400">
                  Enter a valid email.
                </span>
              )}
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-300">
              <span>Currency</span>
              <input
                {...register("currency", { required: true })}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 outline-none"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Monthly Budget</span>
              <input
                type="number"
                {...register("monthlyBudget", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 outline-none"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Savings Goal</span>
              <input
                type="number"
                {...register("savingsGoal", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 outline-none"
              />
            </label>
          </div>

          <button className="rounded-2xl bg-blue-600 px-6 py-4 font-semibold transition hover:bg-blue-700">
            Save Settings
          </button>
        </form>
      )}
    </DashboardLayout>
  );
};

export default Settings;
