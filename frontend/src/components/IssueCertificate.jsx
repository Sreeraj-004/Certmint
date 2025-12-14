import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function IssueCertificate() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          studentName,
          studentEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to issue certificate");
        return;
      }

      setSuccess("Certificate issued successfully 🎉");

      // optional redirect after success
      setTimeout(() => {
        navigate("/institution-dashboard");
      }, 1500);

    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-4"
      >
        <h2 className="text-xl font-bold text-center">
          Issue Certificate
        </h2>

        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}

        <input
          className="form-input"
          placeholder="Subject (e.g. Python Developer)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <input
          className="form-input"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />

        <input
          className="form-input"
          placeholder="Student Email (optional)"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
        />

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Issuing..." : "Issue Certificate"}
        </button>
      </form>
    </div>
  );
}
