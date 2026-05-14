import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/app/lib/supabase";

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (isAuthenticated) {
    navigate("/account", { replace: true });
    return null;
  }

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) { setError("Te rog introdu adresa de email."); return; }
    if (!password) { setError("Te rog introdu parola."); return; }
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/account", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "A apărut o eroare. Încearcă din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Sign Up ────────────────────────────────────────────────────────────────
  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) { setError("Te rog introdu adresa de email."); return; }
    if (!password) { setError("Te rog introdu parola."); return; }
    if (password.length < 6) { setError("Parola trebuie să aibă minim 6 caractere."); return; }
    if (password !== confirmPassword) { setError("Parolele nu coincid."); return; }

    setIsLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError("Există deja un cont cu acest email. Încearcă să te loghezi.");
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (data.session) {
        // Confirmare email dezactivată — redirect direct la cont
        navigate("/account", { replace: true });
      } else {
        // Confirmare email activată — afișăm mesaj
        setSuccess("Cont creat cu succes! Verifică emailul pentru a confirma contul, apoi loghează-te.");
        setEmail(""); setPassword(""); setConfirmPassword("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "A apărut o eroare. Încearcă din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
    setEmail(""); setPassword(""); setConfirmPassword("");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">

        {/* ── Left Side — Branding ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block"
        >
          <div className="bg-primary text-primary-foreground p-12 rounded-2xl h-full flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-4">Welcome to ProTools</h2>
            <p className="text-xl opacity-90 mb-8">
              Your trusted partner for professional-grade tools and equipment
            </p>
            <div className="space-y-4">
              {[
                "Access exclusive member pricing",
                "Track orders and manage warranties",
                "Save favorites and build wishlists",
              ].map((text) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                  <p className="opacity-90">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 aspect-video rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1745449064670-94bd0fc13df8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                alt="Workshop tools"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* ── Right Side — Form ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-border rounded-2xl p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? "Sign in to your account" : "Join ProTools today"}
            </p>
          </div>

          {/* Eroare */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Succes */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              role="alert"
            >
              <CheckCircle size={18} className="mt-0.5 shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={isLogin ? handleLogin : handleSignUp} noValidate>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="w-full pl-11 pr-11 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password — doar Sign Up */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Confirmă parola</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
                    className="w-full pl-11 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {/* Remember me + Forgot — doar Login */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-sm">Remember me</span>
                </label>
                <a href="#" className="text-sm text-accent hover:text-accent/80 transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 rounded-lg font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
                  {isLogin ? "Se verifică..." : "Se creează contul..."}
                </span>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </motion.button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={handleToggle} className="text-accent hover:text-accent/80 font-medium transition-colors">
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          {/* Social — UI only */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 border border-border rounded-lg hover:bg-secondary transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border border-border rounded-lg hover:bg-secondary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
