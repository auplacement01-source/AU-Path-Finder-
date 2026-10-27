import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AssessmentPage } from "./pages/AssessmentPage";
import { CounselorPage } from "./pages/CounselorPage";
import { HomePage } from "./pages/HomePage";
import { ResultsPage } from "./pages/ResultsPage";

export function App() {
  return <BrowserRouter><Routes><Route element={<Layout />}><Route index element={<HomePage />} /><Route path="assessment" element={<AssessmentPage />} /><Route path="results" element={<ResultsPage />} /><Route path="counselor" element={<CounselorPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes></BrowserRouter>;
}
