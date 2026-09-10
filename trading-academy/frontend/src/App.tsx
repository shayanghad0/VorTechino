import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/Layout'
import AdminLayout from './components/admin/AdminLayout'
import LoadingSkeleton from './components/LoadingSkeleton'

const Home = lazy(() => import('./pages/Home'))
const Lessons = lazy(() => import('./pages/Lessons'))
const LessonDetail = lazy(() => import('./pages/LessonDetail'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const Search = lazy(() => import('./pages/Search'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Profile = lazy(() => import('./pages/Profile'))
const Bookmarks = lazy(() => import('./pages/Bookmarks'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const ManageLessons = lazy(() => import('./pages/admin/ManageLessons'))
const LessonEditor = lazy(() => import('./pages/admin/LessonEditor'))
const ManageComments = lazy(() => import('./pages/admin/ManageComments'))
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const ActivityLog = lazy(() => import('./pages/admin/ActivityLog'))
const ManageCategories = lazy(() => import('./pages/admin/ManageCategories'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:slug" element={<LessonDetail />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="lessons" element={<ManageLessons />} />
          <Route path="subjects" element={<ManageCategories />} />
          <Route path="lessons/new" element={<LessonEditor />} />
          <Route path="lessons/edit/:id" element={<LessonEditor />} />
          <Route path="comments" element={<ManageComments />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="activity" element={<ActivityLog />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
