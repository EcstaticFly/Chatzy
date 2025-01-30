import Navbar from "./components/navbar.jsx";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import RegisterPage from "./pages/register.jsx";
import LoginPage from "./pages/login.jsx";
import ProfilePage from "./pages/profile.jsx";
import SettingsPage from "./pages/settings.jsx";
import { authStore } from "./store/authStore.js";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import HomePage from "./pages/home.jsx";
import { themeStore } from "./store/themeStore.js";

function App() {
  const { user, checkAuth, isLoading, onlineUsers } = authStore();
  const {theme} = themeStore();
  useEffect(() => {
     checkAuth();
  }, [checkAuth]);

  // console.log(user, "user");

  if (isLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoaderCircle className="size-10 mb-3 animate-spin" />
        <h1 className="font-extralight tracking-wider">Please Wait...</h1>
      </div>
    );
  }
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/register" />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/register" />}
        />
        <Route path="*" element={<h1 className="text-5xl font-extrabold mt-52">Oops!...Page Not found.</h1>} />
      </Routes>
    </div>
  );
}
export default App;
