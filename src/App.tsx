import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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

export default function App() {
  return (
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
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
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
            </Suspense>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
