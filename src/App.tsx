import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

const ReceiptManagerPage = lazy(() => import("./pages/ReceiptManagerPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const MyPage = lazy(() => import("./pages/MyPage"));
const StatsPage = lazy(() => import("./pages/StatsPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const GuidePage = lazy(() => import("./pages/GuidePage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

// Suspense가 실제 페이지 청크 로딩까지 기다렸다가 함께 마운트하므로,
// 이 컴포넌트가 나타나는 시점이 곧 첫 페이지가 그려질 준비가 된 시점
function SplashRemover() {
  useEffect(() => {
    const splash = document.getElementById("splash");
    if (!splash) return;
    splash.classList.add("splash-hide");
    const timer = setTimeout(() => splash.remove(), 400);
    return () => clearTimeout(timer);
  }, []);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Header />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<ReceiptManagerPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/guide" element={<GuidePage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route
                  path="/mypage"
                  element={
                    <ProtectedRoute>
                      <MyPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/stats"
                  element={
                    <ProtectedRoute>
                      <StatsPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <SplashRemover />
            </Suspense>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
    </LanguageProvider>
  );
}
