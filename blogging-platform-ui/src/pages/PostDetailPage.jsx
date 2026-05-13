import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'

function PostDetailPage() {
  const { id } = useParams()
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
      setError(
        err.response?.data?.message || 'Failed to load post.'
      )
    } finally {
      setLoading(false)
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
      <div className="text-center text-gray-600">
        Loading post...
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
    <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-5">
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
          {post.category}
        </span>

        <span>
          By {post.authorUsername}
        </span>

        <span>•</span>

        <span>
          {formatDate(post.createdAt)}
        </span>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 leading-tight">
        {post.title}
      </h1>

      <div className="mt-8 text-gray-700 leading-8 whitespace-pre-line text-lg">
        {post.content}
      </div>

      <div className="mt-10 flex items-center justify-between border-t pt-6">
        <Link
          to="/"
          className="text-gray-700 hover:text-black font-medium transition"
        >
          ← Back to posts
        </Link>

        {isOwner && (
          <Link
            to={`/posts/${post.id}/edit`}
            className="bg-black text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
          >
            Edit Post
          </Link>
        )}
      </div>
    </article>
  )
}

export default PostDetailPage