import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosInstance'

function HomePage() {
  const [posts, setPosts] = useState([])
  const [pageInfo, setPageInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/posts?page=0&size=10&sortBy=createdAt&direction=desc')

      setPosts(response.data.content || [])
      setPageInfo({
        page: response.data.page,
        size: response.data.size,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
        last: response.data.last,
      })
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load posts. Please try again.'
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

    return content.length > 180
      ? `${content.substring(0, 180)}...`
      : content
  }

  if (loading) {
    return (
      <div className="text-center text-gray-600">
        Loading posts...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Latest Posts
          </h1>

          <p className="text-gray-600 mt-2">
            Read the latest articles shared by the community.
          </p>
        </div>

        <Link
          to="/posts/new"
          className="bg-black text-white px-5 py-3 rounded-lg font-medium hover:opacity-90 transition text-center"
        >
          Create Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            No posts yet
          </h2>

          <p className="text-gray-600 mt-2">
            Be the first one to create a post.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
            >
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  {post.category}
                </span>

                <span>
                  By {post.authorUsername}
                </span>

                <span>
                  •
                </span>

                <span>
                  {formatDate(post.createdAt)}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                {post.title}
              </h2>

              <p className="text-gray-600 mt-3 leading-relaxed">
                {getPreview(post.content)}
              </p>

              <div className="mt-5">
                <Link
                  to={`/posts/${post.id}`}
                  className="text-black font-semibold hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {pageInfo && (
        <div className="mt-8 text-sm text-gray-500 text-center">
          Showing {posts.length} of {pageInfo.totalElements} posts
        </div>
      )}
    </div>
  )
}

export default HomePage