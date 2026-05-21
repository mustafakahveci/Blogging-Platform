import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from './layouts/MainLayout'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import CreatePostPage from './pages/CreatePostPage'
import EditPostPage from './pages/EditPostPage'
import PostDetailPage from './pages/PostDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import PublicProfilePage from './pages/PublicProfilePage'

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/posts/new" element={
            <ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
          <Route path="/posts/:id/edit" element={
            <ProtectedRoute><EditPostPage /></ProtectedRoute>} />

          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route
            path="/users/:username"
            element={<PublicProfilePage />}
          />

        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App