import React, { useEffect, useState } from "react";
import { StickyNavbar } from "./Navbar";

/**
 * InstitutionDashboard
 *
 * - Expects token in localStorage.token
 * - GETs: /api/institutions/dashboard?includeMonthly=true
 * - POSTs new certs to: /api/institutions  (your existing POST route)
 *
 * Tailwind styling matches your login page.
 */

function AddCertificateModal({ open, onClose, onCreated }) {
  const [subject, setSubject] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open) {
      setSubject("");
      setStudentName("");
      setStudentEmail("");
      setErr("");
      setLoading(false);
    }
  }, [open]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/institutions", {
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

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(data.message || "Failed to create certificate");
        setLoading(false);
        return;
      }

      // Normalize certificate shape for the UI
      const created = data.certificate || data;
      const normalized = {
        id: created._id || created.id,
        subject: created.subject,
        studentName: created.studentNameSnapshot || created.studentName || null,
        studentEmail: created.studentEmailSnapshot || created.studentEmail || null,
        dateOfIssue: created.dateOfIssue || new Date().toISOString(),
      };

      onCreated(normalized);
      onClose();
    } catch (err) {
      console.error("Create cert error:", err);
      setErr("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-lg bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Add Certificate</h3>
        {err && <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">{err}</div>}
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700">Subject</label>
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              placeholder="e.g. NodeJS Bootcamp"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Student name</label>
            <input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Student email (optional)</label>
            <input
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              placeholder="student@example.com"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-primary-600 text-white disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InstitutionDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/institutions?includeMonthly=true", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.message || "Failed to load dashboard");
        setLoading(false);
        return;
      }
      setData(json);
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCertificateCreated = (newCert) => {
    // simple local update: add to top of recentCertificates and bump total
    setData((prev) => {
      if (!prev) return prev;
      const recent = [
        {
          id: newCert._id || newCert.id,
          subject: newCert.subject,
          studentName: newCert.studentName,
          studentEmail: newCert.studentEmail,
          dateOfIssue: newCert.dateOfIssue || new Date().toISOString(),
        },
        ...(prev.recentCertificates || []),
      ];
      return {
        ...prev,
        stats: { ...prev.stats, totalCertificates: (prev.stats.totalCertificates || 0) + 1 },
        recentCertificates: recent.slice(0, 50),
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <AddCertificateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCertificateCreated}
      />

      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{data.institution.name}</h1>
          <p className="text-sm text-gray-600">Manage certificates, view stats, and export data.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded bg-primary-600 text-white btn-primary"
          >
            Add Certificate
          </button>
          <button
            onClick={fetchDashboard}
            className="px-4 py-2 rounded border bg-white hover:bg-gray-100"
          >
            Refresh
          </button>
        </div>
      </header>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading dashboard...</div>
      ) : error ? (
        <div className="text-red-600 p-4 bg-red-50 rounded">{error}</div>
      ) : (
        <>
          {/* Top summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-sm text-gray-500">Institution</h3>
              <div className="mt-2">
                <div className="font-semibold text-lg">{data.institution.name}</div>
                <div className="text-sm text-gray-600">{data.institution.address || "—"}</div>
                <div className="text-xs text-gray-500 mt-1">{data.institution.contactNumber || ""}</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
              <div>
                <h3 className="text-sm text-gray-500">Certificates</h3>
                <div className="mt-2 text-2xl font-bold">{data.stats.totalCertificates ?? 0}</div>
                <div className="text-sm text-gray-600 mt-1">Total issued</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-sm text-gray-500">Students (unique)</h3>
              <div className="mt-2 text-2xl font-bold">{data.stats.totalUniqueStudents ?? 0}</div>
              <div className="text-sm text-gray-600 mt-1">Registered recipients</div>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: recent certificates */}
            <div className="lg:col-span-2">
              <div className="bg-white p-4 rounded shadow mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Recent Certificates</h2>
                  <div className="text-sm text-gray-500">Showing {data.recentCertificates.length}</div>
                </div>

                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="py-2">Subject</th>
                        <th className="py-2">Student</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(!data.recentCertificates || data.recentCertificates.length === 0) ? (
                        <tr><td colSpan="4" className="py-6 text-center text-gray-500">No certificates</td></tr>
                      ) : (
                        data.recentCertificates.map((c) => (
                          <tr key={c.id} className="border-t">
                            <td className="py-3">{c.subject}</td>
                            <td className="py-3">{c.studentName || "—"}</td>
                            <td className="py-3">{c.studentEmail || "—"}</td>
                            <td className="py-3">{new Date(c.dateOfIssue).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* students list */}
              <div className="bg-white p-4 rounded shadow">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Students</h3>
                  <div className="text-sm text-gray-500">{(data.students || []).length}</div>
                </div>

                <ul className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                  {(!data.students || data.students.length === 0) ? (
                    <li className="text-gray-500">No students yet</li>
                  ) : (
                    data.students.map((s) => (
                      <li key={s.id} className="flex items-center justify-between border rounded p-2">
                        <div>
                          <div className="font-medium">{s.name || "—"}</div>
                          <div className="text-xs text-gray-500">{s.email || "—"}</div>
                        </div>
                        <div className="text-xs text-gray-400">ID: {String(s.id).slice(0, 6)}</div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* Right: subject breakdown + monthly */}
            <aside className="space-y-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">Top Subjects</h3>
                <ul className="mt-3 space-y-2">
                  {(!data.subjectBreakdown || data.subjectBreakdown.length === 0) ? (
                    <li className="text-gray-500">No data</li>
                  ) : (
                    data.subjectBreakdown.map((s, idx) => (
                      <li key={s.subject} className="flex justify-between items-center">
                        <div className="text-sm">{idx + 1}. {s.subject}</div>
                        <div className="text-sm font-semibold">{s.count}</div>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">Monthly Issuance (12m)</h3>
                <div className="mt-2 text-sm text-gray-600">
                  {(!data.monthlyIssuance || data.monthlyIssuance.length === 0) ? (
                    <div className="text-gray-500">Enable ?includeMonthly=true to populate</div>
                  ) : (
                    <ul className="space-y-1 text-sm">
                      {data.monthlyIssuance.map(m => (
                        <li key={m.period} className="flex justify-between">
                          <span>{m.period}</span>
                          <span className="font-medium">{m.count}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">Actions</h3>
                <div className="mt-3 flex flex-col gap-2">
                  <button onClick={() => setModalOpen(true)} className="py-2 px-3 rounded bg-primary-600 text-white">Add Certificate</button>
                  <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.href = "/"; }} className="py-2 px-3 rounded border">Logout</button>
                </div>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
