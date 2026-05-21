import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'

function ProfilePage() {
  const { user, fetchCurrentUser } = useAuth()

  const [formData, setFormData] = useState({
    bio: '',
    profileImageUrl: '',
  })

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [currentPage, setCurrentPage] = useState(0)
  const postsPerPage = 5

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        profileImageUrl: user.profileImageUrl || '',
      })

      fetchUserPosts()
    }
  }, [user])

  async function fetchUserPosts() {
    setLoading(true)
    setError('')

    try {
      const response = await api.get(`/users/${user.username}/posts`)

      setPosts(
        (response.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      )
      setCurrentPage(0)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your posts.')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await api.put('/users/me', formData)
      await fetchCurrentUser()

      setSuccess('Profile updated successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  function formatDate(dateString) {
    if (!dateString) return ''

    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  function getPreview(content) {
    if (!content) return ''

    return content.length > 120
      ? `${content.substring(0, 120)}...`
      : content
  }

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Please login to view your profile.
        </h1>
      </div>
    )
  }

  const totalPages = Math.ceil(posts.length / postsPerPage)

  const paginatedPosts = posts.slice(
    currentPage * postsPerPage,
    currentPage * postsPerPage + postsPerPage
  )

  function handlePreviousPage() {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-gray-950 via-gray-800 to-gray-600" />

        <div className="px-8 pb-8">
          <div className="-mt-14 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex flex-col md:flex-row md:items-end gap-5">
              <div className="w-28 h-28 rounded-3xl bg-white p-1 shadow-md">
                <div className="w-full h-full rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center text-4xl font-bold text-gray-700">
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
              </div>

              <div className="pt-16 md:pt-16 pb-2">
                <h1 className="text-3xl font-bold text-gray-950">
                  {user.username}
                </h1>

                <p className="text-gray-500 mt-1">
                  {user.email}
                </p>
              </div>
            </div>

            <Link
              to="/posts/new"
              className="bg-black text-white px-5 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition text-center"
            >
              Create New Post
            </Link>
          </div>

          <p className="mt-6 text-gray-700 leading-7 max-w-3xl">
            {user.bio || 'No bio added yet. Update your profile and tell readers about yourself.'}
          </p>

          <div className="mt-6 grid grid-cols-1 max-w-xs">
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-2xl font-bold text-gray-950">
                {posts.length}
              </p>
              <p className="text-sm text-gray-500">
                Posts
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-950">
                  Edit Profile
                </h2>

                <p className="text-gray-500 mt-2 text-sm leading-6">
                  Customize how your public profile appears to other readers.
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center text-lg font-bold text-gray-700 shrink-0">
                {formData.profileImageUrl ? (
                  <img
                    src={formData.profileImageUrl}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.username?.charAt(0).toUpperCase()
                )}
              </div>
            </div>

            {error && (
              <div className="mt-5 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-5 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>

                  <span className="text-xs text-gray-400">
                    {formData.bio.length}/160
                  </span>
                </div>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="5"
                  maxLength="160"
                  placeholder="Write a short bio about yourself"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black resize-none text-gray-700 placeholder:text-gray-400"
                />

                <p className="mt-2 text-xs text-gray-400">
                  This bio will be shown on your profile page.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image URL
                </label>

                <input
                  name="profileImageUrl"
                  type="text"
                  value={formData.profileImageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/profile.jpg"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black text-gray-700 placeholder:text-gray-400"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Add an image URL or leave it empty to use your initial as avatar.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-black text-white py-3 rounded-2xl font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {saving ? 'Saving profile...' : 'Save Profile'}
              </button>
            </form>
          </div>
        </section>

        <section className="lg:col-span-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-950">
                My Posts
              </h2>

              <p className="text-gray-500 mt-1">
                Manage the articles you have published.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-600">
              Loading your posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <h3 className="text-2xl font-bold text-gray-950">
                No posts yet
              </h3>

              <p className="text-gray-600 mt-2">
                Start by publishing your first article.
              </p>

              <Link
                to="/posts/new"
                className="mt-6 inline-flex bg-black text-white px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition"
              >
                Create Post
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {paginatedPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    <div className="md:col-span-8">
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                          {post.category}
                        </span>

                        <span>
                          {formatDate(post.createdAt)}
                        </span>
                      </div>

                      <Link to={`/posts/${post.id}`}>
                        <h3 className="mt-4 text-2xl font-bold text-gray-950 group-hover:underline underline-offset-4">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="mt-3 text-gray-600 leading-7">
                        {getPreview(post.content)}
                      </p>

                      <div className="mt-5 flex items-center gap-4">
                        <Link
                          to={`/posts/${post.id}`}
                          className="text-sm font-semibold text-gray-950 hover:underline"
                        >
                          View
                        </Link>

                        <Link
                          to={`/posts/${post.id}/edit`}
                          className="text-sm font-medium text-gray-500 hover:text-gray-950 transition"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                    <div className="md:col-span-4">
                      <div className="h-32 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-300 overflow-hidden flex items-center justify-center">
                        {post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <span className="block text-3xl font-bold text-gray-400">
                              {post.category?.charAt(0)}
                            </span>
                            <span className="block text-xs font-medium text-gray-500 mt-1">
                              {post.category}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

          )}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className="border border-gray-300 bg-white px-5 py-2 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              <span className="text-gray-600 text-sm">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className="border border-gray-300 bg-white px-5 py-2 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default ProfilePage