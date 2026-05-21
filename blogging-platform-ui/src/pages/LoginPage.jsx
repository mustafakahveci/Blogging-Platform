import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', formData)
      login(response.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <section className="bg-black text-white p-10 md:p-12 flex flex-col justify-between">
          <div>
            <span className="inline-flex bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium">
              Welcome back
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight">
              Continue reading and writing with the community.
            </h1>

            <p className="mt-5 text-gray-300 leading-8">
              Login to manage your profile, create posts, edit your articles
              and keep sharing your ideas with readers.
            </p>
          </div>

          <div className="mt-10 rounded-3xl bg-white/10 p-6">
            <p className="text-sm text-gray-300">
              Blogging Platform
            </p>

            <p className="mt-2 text-2xl font-bold">
              Write. Share. Learn.
            </p>
          </div>
        </section>

        <section className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-950">
            Login
          </h2>

          <p className="text-gray-500 mt-2">
            Enter your credentials to access your account.
          </p>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Username
              </label>

              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Password
              </label>

              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3.5 rounded-2xl font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-8">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-black font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}

export default LoginPage