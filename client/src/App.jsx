import Navbar from "./components/navbar";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/home";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import SettingsPage from "./pages/settings";
import { authStore } from "./store/authStore";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

function App() {
  const { user, checkAuth, isLoading } = authStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(user, "user");

  if (isLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoaderCircle className="size-10 mb-3 animate-spin" />
        <h1 className="font-extralight tracking-wider">Please Wait...</h1>
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Home /> : navigate("/login")} />
        <Route
          path="/register"
          element={user ? navigate("/") : <RegisterPage />}
        />
        <Route path="/login" element={user ? navigate("/") : <LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : navigate("/login")}
        />
      </Routes>
    </>
  );
}
export default App;
