import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import KYCForm from "./components/KYCForm";
import QRScanner from "./components/QRScanner";

function useAdminAuth() {
  const [isAuthed, setIsAuthed] = useState<boolean>(() => {
    return localStorage.getItem("kicko_admin_authed") === "true";
  });
  return { isAuthed, setIsAuthed };
}

function LoginPage() {
  const nav = useNavigate();
  const { isAuthed, setIsAuthed } = useAdminAuth(); // local instance; we'll also set localStorage

  useEffect(() => {
    if (isAuthed) {
      if (localStorage.getItem("kicko_kyc_status")) {
        nav("/admin", { replace: true });
      } else {
        nav("/kyc", { replace: true });
      }
    }
  }, [isAuthed, nav]);

  const handleSuccess = (admin: { name: string; email: string; mobile: string }) => {
    localStorage.setItem("kicko_admin_authed", "true");
    localStorage.setItem("kicko_admin_profile", JSON.stringify(admin));
    setIsAuthed(true);

    if (localStorage.getItem("kicko_kyc_status")) {
      nav("/admin", { replace: true });
    } else {
      nav("/kyc", { replace: true });
    }
  };
  return <Login onAdminLoginSuccess={handleSuccess} />;
}

function KYCPage() {
  const nav = useNavigate();
  const [isAuthed] = useState<boolean>(() => localStorage.getItem("kicko_admin_authed") === "true");

  useEffect(() => {
    if (!isAuthed) nav("/login", { replace: true });
  }, [isAuthed, nav]);

  if (!isAuthed) return null;
  return <KYCForm />;
}

function AdminPage() {
  const nav = useNavigate();
  const [isAuthed, setIsAuthed] = useState<boolean>(() => localStorage.getItem("kicko_admin_authed") === "true");

  useEffect(() => {
    if (!isAuthed) {
      nav("/login", { replace: true });
    } else if (!localStorage.getItem("kicko_kyc_status")) {
      nav("/kyc", { replace: true });
    }
  }, [isAuthed, nav]);

  const onLogout = () => {
    localStorage.removeItem("kicko_admin_authed");
    localStorage.removeItem("kicko_admin_profile");
    localStorage.removeItem("kicko_kyc_status");
    localStorage.removeItem("kicko_razorpay_account_id");
    setIsAuthed(false);
    nav("/login", { replace: true });
  };

  if (!isAuthed) return null;
  return <AdminDashboard onLogout={onLogout} />;
}

function ScanPage() {
  const nav = useNavigate();
  const [isAuthed] = useState<boolean>(() => localStorage.getItem("kicko_admin_authed") === "true");

  useEffect(() => {
    if (!isAuthed) {
      nav("/login", { replace: true });
    } else if (!localStorage.getItem("kicko_kyc_status")) {
      nav("/kyc", { replace: true });
    }
  }, [isAuthed, nav]);

  if (!isAuthed) return null;
  return <QRScanner />;
}

export default function App() {
  // Temporary fix to force log out the user so they can see the Turf Owner Login screen
  localStorage.clear();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/kyc" element={<KYCPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/scan" element={<ScanPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
