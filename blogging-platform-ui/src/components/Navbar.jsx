import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link
          to="/"
          className="text-2xl font-bold text-gray-900"
        >
          Blogging Platform
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-black transition"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/posts/new"
                className="text-gray-700 hover:text-black transition"
              >
                Create Post
              </Link>

              <Link
                to="/profile"
                className="text-gray-700 hover:text-black transition"
              >
                {user.username}
              </Link>

              <button
                onClick={handleLogout}
                className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-black transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar