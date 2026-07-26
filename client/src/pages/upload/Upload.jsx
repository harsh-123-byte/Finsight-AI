import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { uploadStatement } from "../../services/dashboardService";
import { toast } from "react-hot-toast";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    const selected = acceptedFiles[0];

    if (selected) {
      setFile(selected);
      setPreview(selected.name);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      toast.error("Please select a PDF or CSV file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("statement", file);

    try {
      setUploading(true);
      const response = await uploadStatement(formData);
      setTransactions(response.transactions || []);
      toast.success("Statement parsed successfully.");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to upload statement."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Upload Statement</h1>
          <p className="mt-2 text-slate-400">
            Upload a bank statement in PDF or CSV format and extract transactions.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-xl bg-slate-800 px-5 py-3 text-sm transition hover:bg-slate-700"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 shadow-xl">
          <div
            {...getRootProps()}
            className={`flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-10 text-center transition ${
              isDragActive
                ? "border-blue-500 bg-slate-950"
                : "border-slate-700 bg-slate-900"
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-xl font-semibold text-slate-100">
              {isDragActive
                ? "Drop your file here"
                : "Drag & drop a PDF or CSV file here"}
            </p>
            <p className="text-sm text-slate-500">
              Supported formats: PDF, CSV
            </p>
            {preview && (
              <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                {preview}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={uploading}
            className="mt-8 w-full rounded-2xl bg-blue-600 px-6 py-4 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload Statement"}
          </button>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <h2 className="text-2xl font-bold">Parsed Transactions</h2>
          <p className="mt-2 text-slate-400">
            Review the transactions extracted from the uploaded statement.
          </p>

          {transactions.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
              No transactions parsed yet.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {transactions.map((transaction, index) => (
                <div
                  key={`${transaction.description}-${index}`}
                  className="rounded-3xl border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-100">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-slate-500">
                        {transaction.date} • {transaction.category}
                      </p>
                    </div>
                    <div
                      className={`text-right font-semibold ${
                        transaction.type === "income"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}₹
                      {transaction.amount?.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Upload;
