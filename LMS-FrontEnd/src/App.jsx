import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import ProtectedRoute from "./components/ProtectedRoute";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProfile from "./pages/admin/AdminProfile";

// Mentor
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorCourses from "./pages/mentor/MentorCourses";
import MentorAddCourse from "./pages/mentor/MentorAddCourse";
import MentorCourseDetails from "./pages/mentor/MentorCourseDetails";
import MentorEnrolled from "./pages/mentor/MentorEnrolled";
import MentorProfile from "./pages/mentor/MentorProfile";

// Student
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourseDetails from "./pages/student/StudentCourseDetails";
import StudentMyCourses from "./pages/student/StudentMyCourses";
import StudentProfile from "./pages/student/StudentProfile";
import StudentMaterialViewer from "./pages/student/StudentMaterialViewer";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminCategories />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/profile" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminProfile />
          </ProtectedRoute>
        } />

        {/* Mentor */}
        <Route path="/mentor" element={
          <ProtectedRoute allowedRoles={["Mentor"]}>
            <MentorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/mentor/courses" element={
          <ProtectedRoute allowedRoles={["Mentor"]}>
            <MentorCourses />
          </ProtectedRoute>
        } />
        <Route path="/mentor/add-course" element={
          <ProtectedRoute allowedRoles={["Mentor"]}>
            <MentorAddCourse />
          </ProtectedRoute>
        } />
        <Route path="/mentor/course/:id" element={
          <ProtectedRoute allowedRoles={["Mentor"]}>
            <MentorCourseDetails />
          </ProtectedRoute>
        } />
        <Route path="/mentor/enrolled" element={
          <ProtectedRoute allowedRoles={["Mentor"]}>
            <MentorEnrolled />
          </ProtectedRoute>
        } />
        <Route path="/mentor/profile" element={
          <ProtectedRoute allowedRoles={["Mentor"]}>
            <MentorProfile />
          </ProtectedRoute>
        } />

        {/* Student */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/course/:id" element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <StudentCourseDetails />
          </ProtectedRoute>
        } />
        <Route path="/student/mycourses" element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <StudentMyCourses />
          </ProtectedRoute>
        } />
        <Route path="/student/profile" element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <StudentProfile />
          </ProtectedRoute>
        } />
        <Route path="/student/material/:materialId" element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <StudentMaterialViewer />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}
