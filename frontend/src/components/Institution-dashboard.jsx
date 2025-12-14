import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CertificateCard from "./Certificate.js";



export default function InstitutionDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/institutions?includeMonthly=true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const json = await res.json();

      if (!res.ok) {
        setError(json.message || "Failed to load dashboard");
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
  }, []);

  if (loading) return <pre>Loading...</pre>;
  if (error) return <pre style={{ color: "red" }}>{error}</pre>;

  return (
    // profile
    <>
      <div className="h-[30vh] flex flex-col bg-gray-900 border-b-blue-800 border-b-4" >
        <div className="flex flex-col h-full align-middle items-center justify-center" >
          {/* name */}
          <div>
            <h1 className=" flex flex-col  jus text-2xl text-blue-500 font-bold mb-4">{data.institution.name}</h1>
          </div>

          {/* details */}
            <div>
              <h3 className="flex flex-col  jus text-2xl text-white font-bold mb-4">{data.institution.contactNumber}</h3>
            </div>

            {/* button */}
            <div className="flex">
              <button className="btn-primary mx-1"onClick={() => navigate("/issue-certificate")}>Issue Certificate</button>
            </div>
        </div>
      </div>

      {/* 2nd block */}
      <div className=" bg-gray-900 h-screen flex flex-row justify-center ">
        <div className="text-white w-[85%] border-x-2 px-10 border-gray-600 justify-center">
          <h3 className="text-4xl pb-6">Certificates</h3>
          <div className="w-full">
            {data.recentCertificates.length === 0 ? (
              <p className="text-gray-400">No certificates issued yet</p>
            ) : (
              data.recentCertificates.map(cert => (
                <CertificateCard
                  key={cert.id}
                  cert={cert}
                />
              ))
            )}
          </div>


          </div>

      </div>
  </>
  );
}
