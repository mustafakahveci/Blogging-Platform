import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/axiosInstance'

function PublicProfilePage() {
  const { username } = useParams()

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [currentPage, setCurrentPage] = useState(0)
  const postsPerPage = 5

  useEffect(() => {
    fetchPublicProfile()
  }, [username])

  async function fetchPublicProfile() {
    setLoading(true)
    setError('')

    try {
      const response = await api.get(`/users/public/${username}`)

      setProfile(response.data)

      setPosts(
        (response.data.posts || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      )

      setCurrentPage(0)
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load profile.'
      )
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-600">
        Loading profile...
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-950">
          Profile not found
        </h1>

        <p className="text-gray-600 mt-2">
          The user profile you are looking for does not exist.
        </p>
      </div>
    )
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
                  {profile.profileImageUrl ? (
                    <img
                      src={profile.profileImageUrl}
                      alt={profile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile.username?.charAt(0).toUpperCase()
                  )}
                </div>
              </div>

              <div className="pt-16 md:pt-16 pb-2">
                <h1 className="text-3xl font-bold text-gray-950">
                  {profile.username}
                </h1>

                <p className="text-gray-500 mt-1">
                  Member since {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-gray-700 leading-7 max-w-3xl">
            {profile.bio || 'No bio added yet.'}
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

      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-950">
              Posts by {profile.username}
            </h2>

            <p className="text-gray-500 mt-1">
              Explore articles published by this author.
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <h3 className="text-2xl font-bold text-gray-950">
              No posts yet
            </h3>

            <p className="text-gray-600 mt-2">
              This user has not published any articles yet.
            </p>
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

                    <div className="mt-5">
                      <Link
                        to={`/posts/${post.id}`}
                        className="text-sm font-semibold text-gray-950 hover:underline"
                      >
                        View
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
              className="border border-gray-300 bg-white px-5 py-2 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              ← Previous
            </button>

            <span className="text-gray-600 text-sm">
              Page {currentPage + 1} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="border border-gray-300 bg-white px-5 py-2 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default PublicProfilePage