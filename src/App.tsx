import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Protected from "./auth/Protected";
import LoadingAnimation from "./components/Animations/LoadingAnimation";
import { Toaster } from "react-hot-toast";
const Home = lazy(() => import("./pages/home/Home"));
const Signup = lazy(() => import("./forms/SignUp"));
const Login = lazy(() => import("./forms/Login"));
const JobLayout = lazy(() => import("./pages/Jobs/JobLayout"));
const JobDetail = lazy(() => import("./pages/Jobs/SingleJob"));
const ArchivedJobs = lazy(() => import("./pages/Jobs/ArchivedJobs"));
const Candidates = lazy(() => import("./pages/Candidates/AllCanditates"));
const CandidateDetail = lazy(() => import("./pages/Candidates/SingleCanditate"));
const AssessmentBuilder = lazy(() => import("./pages/Assessments/AssessmentBuilder"));
const AssessmentResponses = lazy(() => import("./pages/Assessments/AssessmentResponse"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>
        <LoadingAnimation />
      </div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jobs" element={<Protected Component={<JobLayout />} />} />
          <Route path="/jobs/:jobId" element={<Protected Component={<JobDetail />} />} />
          <Route path="/jobs/archive" element={<Protected Component={<ArchivedJobs />} />} />
          <Route path="/candidates" element={<Protected Component={<Candidates />} />} />
          <Route path="/candidate/:id" element={<Protected Component={<CandidateDetail />} />} />
          <Route path="/assessment/builder/:id" element={<AssessmentBuilder />} />
          <Route path="/assessment/responses/:id" element={<AssessmentResponses />} />
        </Routes>
      </Suspense>
      <Toaster
        position="top-right"
        />
    </BrowserRouter>
  );
}

export default App;
