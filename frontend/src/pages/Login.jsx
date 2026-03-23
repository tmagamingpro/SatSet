import { useState } from "react";
import { useApp } from "../context/AppContext";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import AppIcon from "../components/AppIcon";
import Register from "./Register";

const Login = () => {
  const { login, demoAccounts } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    try {
      await login({ email, password });
    } catch (loginError) {
      setError(loginError?.message || "Gagal login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1F3A] via-[#123A63] to-[#0E7490] p-5">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-9">
          <div className="inline-flex items-center justify-center w-18 h-18 rounded-2xl bg-sky-600 mb-3 shadow-[0_8px_24px_rgba(14,165,233,0.4)]"
            style={{ width: 72, height: 72 }}>
            <AppIcon name="zap" size={30} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">SatSet</h1>
          <p className="text-white/60 text-sm mt-1">Jasa Cepat, Tepat, Terpercaya</p>
        </div>

        {!showRegister ? (
          <Card>
            <h2 className="text-2xl font-bold mb-1">Masuk</h2>
            <p className="text-gray-400 text-sm mb-6">Selamat datang kembali</p>
            <div className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(value) => { setEmail(value); if (error) setError(""); }}
                placeholder="nama@email.com"
                icon={<AppIcon name="mail" size={16} />}
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(value) => { setPassword(value); if (error) setError(""); }}
                placeholder="********"
                icon={<AppIcon name="lock" size={16} />}
              />
              {error && (
                <div className="bg-red-50 border border-red-400 rounded-lg px-3.5 py-2.5 text-red-500 text-sm">{error}</div>
              )}
              <Button fullWidth onClick={handleLogin} size="lg" icon={<AppIcon name="arrowRight" size={16} />}>
                {isSubmitting ? "Memproses..." : "Masuk"}
              </Button>
            </div>
            <div className="text-center mt-5 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-400">Belum punya akun? </span>
              <button
                type="button"
                onClick={() => { setError(""); setShowRegister(true); }}
                className="bg-transparent border-none text-sky-600 font-semibold cursor-pointer text-sm"
              >
                Daftar Sekarang
              </button>
            </div>
            <div className="mt-5 p-3.5 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-400 font-semibold mb-2">AKUN DEMO</p>
              {(demoAccounts || []).map(a => (
                <button
                  type="button"
                  key={a.email}
                  onClick={() => { setError(""); setEmail(a.email); setPassword(a.pw); }}
                  className="block w-full text-left px-2.5 py-1.5 bg-transparent border-none cursor-pointer rounded text-xs text-sky-600 font-medium hover:bg-sky-50"
                >
                  {a.label} ({a.email})
                </button>
              ))}
            </div>
          </Card>
        ) : (
          <Register onBack={() => setShowRegister(false)} />
        )}
      </div>
    </div>
  );
};

export default Login;
