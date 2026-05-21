import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${isActive
      ? 'text-gray-950'
      : 'text-gray-500 hover:text-gray-950'
    }`

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Blogging Platform"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
          />

          <div>
            <span className="block text-base sm:text-lg font-bold text-gray-950 leading-tight">
              Blogging Platform
            </span>

            <span className="hidden sm:block text-xs text-gray-500 mt-1">
              Write. Share. Learn.
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          {user ? (
            <>
              <NavLink to="/profile" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center text-sm font-bold text-gray-700 group-hover:border-gray-400 transition">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.username?.charAt(0).toUpperCase()
                  )}
                </div>

                <span className="hidden sm:inline text-sm font-medium text-gray-600 group-hover:text-gray-950 transition">
                  {user.username}
                </span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="text-xs sm:text-sm font-medium text-gray-500 hover:text-red-600 transition"              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>

              <Link
                to="/register"
                className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar