import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { uploadStatement } from "../../services/dashboardService";
import { toast } from "react-hot-toast";

const StatementUpload = ({ onUploaded }) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("statement", file);

    try {
      setUploading(true);
      const response = await uploadStatement(formData);
      onUploaded?.(response);
      toast.success("Statement uploaded successfully.");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  return (
    <div className="rounded-2xl border-2 border-dashed border-blue-500 bg-slate-900 p-10 text-center shadow-xl">
      <UploadCloud
        size={55}
        className="mx-auto text-blue-400"
      />

      <h2 className="mt-6 text-2xl font-bold">Upload Bank Statement</h2>

      <p className="mt-3 text-slate-400">Drag & Drop your PDF or CSV file here</p>

      <input
        id="dashboard-statement-file"
        type="file"
        accept=".pdf,.csv,application/pdf,text/csv,application/vnd.ms-excel"
        className="sr-only"
        onChange={handleFile}
      />

      <label
        htmlFor="dashboard-statement-file"
        className={`mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700 ${uploading ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
      >
        {uploading ? "Uploading..." : "Browse File"}
      </label>
    </div>
  );
};

export default StatementUpload;