import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'

function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPost()
  }, [id])

  async function fetchPost() {
    setLoading(true)
    setError('')

    try {
      const response = await api.get(`/posts/${id}`)
      setPost(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load post.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post?'
    )

    if (!confirmed) return

    try {
      await api.delete(`/posts/${id}`)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post.')
    }
  }

  function formatDate(dateString) {
    if (!dateString) return ''

    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-600">
        Loading post...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl">
        {error}
      </div>
    )
  }

  if (!post) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Post not found
        </h1>
      </div>
    )
  }

  const isOwner = user && user.id === post.authorId

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-950 transition"
        >
          ← Back to posts
        </Link>
      </div>

      <article className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-72 md:h-96 bg-gradient-to-br from-gray-100 to-gray-300 overflow-hidden flex items-center justify-center">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <span className="block text-7xl font-bold text-gray-400">
                {post.category?.charAt(0)}
              </span>

              <span className="block text-sm font-semibold tracking-wide text-gray-500 mt-2">
                {post.category}
              </span>
            </div>
          )}
        </div>

        <div className="p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-6">
            <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
              {post.category}
            </span>

            <Link
              to={`/users/${post.authorUsername}`}
              className="font-medium text-gray-600 hover:text-gray-950 hover:underline"
            >
              By {post.authorUsername}
            </Link>

            <span>•</span>

            <span>
              {formatDate(post.createdAt)}
            </span>

            {post.updatedAt && (
              <>
                <span>•</span>
                <span>
                  Updated {formatDate(post.updatedAt)}
                </span>
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-950 leading-tight tracking-tight">
            {post.title}
          </h1>

          <div className="mt-8 prose prose-lg max-w-none text-gray-700 leading-8 whitespace-pre-line">
            {post.content}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-gray-100 pt-6">
            <div>
              <p className="text-sm text-gray-500">
                Written by
              </p>

              <Link
                to={`/users/${post.authorUsername}`}
                className="font-medium text-gray-600 hover:text-gray-950 hover:underline"
              >
                By {post.authorUsername}
              </Link>
            </div>

            {isOwner && (
              <div className="flex items-center gap-3">
                <Link
                  to={`/posts/${post.id}/edit`}
                  className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition"
                >
                  Edit Post
                </Link>

                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-red-700 transition"
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}

export default PostDetailPage