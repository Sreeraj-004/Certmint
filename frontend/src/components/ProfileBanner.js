import { useNavigate } from "react-router-dom";

export default function ProfileBanner({
  title,
  subtitle,
  logoUrl,
  role
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // change if your login route is different
  };

  return (
    <div className="h-[28vh] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b-4 border-blue-700 flex items-center">
      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">

        {/* Left: Logo + Info */}
        <div className="flex items-center gap-5">
          {/* Logo */}
          {role === "INSTITUTION" && (
          <div className="w-24 h-24 rounded-full border-2 border-blue-500 overflow-hidden bg-gray-700 flex items-center justify-center">
            {logoUrl && logoUrl !== "undefined" && logoUrl !== "null" ? (
              <img
                src={`http://localhost:5000${logoUrl}`}
                alt="Institution Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm text-center px-2">
                No Logo
              </span>
            )}
          </div>
          )}

          {/* Text */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-400 tracking-wide">
              {title}
            </h1>

            {subtitle && (
              <p className="text-gray-300 text-sm md:text-base mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-3">
          {role === "INSTITUTION" && (
            <button
              onClick={() => navigate("/institute/setup")}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 transition rounded-md text-white font-semibold shadow-lg"
            >
              Edit Profile
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 transition rounded-md text-white font-semibold shadow-lg"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
