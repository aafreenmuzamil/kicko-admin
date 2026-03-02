import { useEffect, useMemo, useState } from "react";

interface AdminProfile {
  name: string;
  email: string;
  mobile: string;
}

interface LoginProps {
  onAdminLoginSuccess: (admin: AdminProfile) => void;
}

/**
 * Admin-only Login + OTP (demo OTP = 0502).
 * - Phone must be E.164 (e.g., +91XXXXXXXXXX)
 * - 4-digit OTP inputs (single box here, but keeps strict numeric + length)
 * NOTE: Replace the mock OTP send/verify with real Firebase Phone Auth when needed.
 */
export default function Login({ onAdminLoginSuccess }: LoginProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState(""); // E.164

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);

  const isValidEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const isValidPhoneE164 = useMemo(() => /^\+\d{10,15}$/.test(mobile), [mobile]); // + and 10-15 digits
  const isValidOtp = useMemo(() => /^\d{4}$/.test(otp), [otp]);

  const startTimer = () => {
    setTimer(30);
    setCanResend(false);
  };

  useEffect(() => {
    if (!otpSent) return;
    if (canResend) return;

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [otpSent, canResend]);

  const sendOtp = async () => {
    setError(null);

    if (!name.trim() || !email.trim() || !mobile.trim()) {
      setError("Please fill all details");
      return;
    }
    if (!isValidEmail) {
      setError("Invalid email address");
      return;
    }
    if (!isValidPhoneE164) {
      setError("Enter phone number in international format (e.g., +91XXXXXXXXXX)");
      return;
    }

    try {
      setLoading(true);
      // Mock API delay
      await new Promise((res) => setTimeout(res, 600));

      setOtp("");
      setOtpSent(true);
      setOtpAttempts(0);
      startTimer();
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!canResend) return;
    await sendOtp();
  };

  const verifyOtp = async () => {
    setError(null);

    if (otpAttempts >= 3) {
      setError("Too many wrong attempts. Please resend OTP.");
      return;
    }
    if (!isValidOtp) {
      setError("Enter the 4-digit OTP");
      return;
    }

    try {
      setLoading(true);
      // Mock API delay
      await new Promise((res) => setTimeout(res, 600));

      // ✅ Demo OTP
      if (otp !== "0502") {
        const next = otpAttempts + 1;
        setOtpAttempts(next);
        setError(next >= 3 ? "Too many wrong attempts. Please resend OTP." : "Wrong OTP. Try again.");
        return;
      }

      onAdminLoginSuccess({ name: name.trim(), email: email.trim(), mobile: mobile.trim() });
    } catch {
      setError("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-50 via-teal-50 to-indigo-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg rounded-3xl bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10">
        <div className="flex flex-col items-center gap-3 mb-10 text-center">
          <div className="h-16 w-16 rounded-2xl bg-teal-100/50 flex items-center justify-center mb-2 shadow-sm border border-teal-50">
            <div className="h-8 w-8 rounded-xl bg-teal-400/80" />
          </div>
          <h1 className="text-3xl font-serif text-slate-800 tracking-tight">Turf Owner Login</h1>
          <p className="text-slate-500 text-sm">Enter your credentials to access the workspace</p>
        </div>

        {!otpSent ? (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5 ml-1">Turf Owner Name</label>
              <input
                className="w-full rounded-2xl bg-white border border-slate-200 text-slate-800 px-4 py-3.5 outline-none focus:ring-2 focus:ring-rose-200 transition-all shadow-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter turf owner name"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5 ml-1">Email ID</label>
              <input
                className="w-full rounded-2xl bg-white border border-slate-200 text-slate-800 px-4 py-3.5 outline-none focus:ring-2 focus:ring-rose-200 transition-all shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@email.com"
                type="email"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5 ml-1">Phone (with country code)</label>
              <input
                className="w-full rounded-2xl bg-white border border-slate-200 text-slate-800 px-4 py-3.5 outline-none focus:ring-2 focus:ring-rose-200 transition-all shadow-sm"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/[^\d+]/g, ""))}
                placeholder="+91XXXXXXXXXX"
                inputMode="tel"
              />
            </div>

            {error && <p className="text-rose-500 text-sm mt-1 ml-1 font-medium">{error}</p>}

            <button
              className="mt-6 w-full rounded-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3.5 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:hover:shadow-md"
              onClick={sendOtp}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            <p className="text-xs text-center text-slate-400 mt-4">
              Demo OTP for testing: <span className="text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">0502</span>
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <label className="text-sm font-medium text-slate-600 block mb-3">Enter the 4-digit verification code</label>
              <input
                className="w-3/4 mx-auto block rounded-2xl bg-white border border-slate-200 text-slate-800 px-4 py-4 outline-none focus:ring-2 focus:ring-teal-200 transition-all shadow-sm tracking-[1em] text-center text-2xl font-semibold"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="0000"
                inputMode="numeric"
                maxLength={4}
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between px-2 text-sm">
              <p className="text-slate-500">
                {canResend ? "Didn't receive code?" : `Resend available in ${timer}s`}
              </p>
              <button
                className="text-teal-600 hover:text-teal-700 font-medium disabled:opacity-40 transition-colors"
                onClick={resendOtp}
                disabled={!canResend || loading}
              >
                Resend OTP
              </button>
            </div>

            {error && <p className="text-rose-500 text-sm mt-2 ml-1 text-center font-medium">{error}</p>}

            <div className="pt-4 space-y-3">
              <button
                className="w-full rounded-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3.5 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:hover:shadow-md"
                onClick={verifyOtp}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify and Continue"}
              </button>

              <button
                className="w-full rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-medium py-3.5 transition-all"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setError(null);
                  setTimer(30);
                  setCanResend(false);
                }}
                disabled={loading}
              >
                Back to Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
