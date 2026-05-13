import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'

const categories = [
  'TECHNOLOGY',
  'PROGRAMMING',
  'BACKEND',
  'FRONTEND',
  'DATABASE',
  'DEVOPS',
  'CAREER',
  'GENERAL',
]

function CreatePostPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'BACKEND',
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
      const response = await api.post('/posts', formData)

      navigate(`/posts/${response.data.id}`)
    } catch (err) {
      if (err.response?.data?.errors) {
        const validationMessages = Object.values(err.response.data.errors).join(' ')
        setError(validationMessages)
      } else {
        setError(err.response?.data?.message || 'Failed to create post.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Create New Post
      </h1>

      <p className="text-gray-600 mt-2">
        Share your thoughts, tutorials, or experiences with the community.
      </p>

      {error && (
        <div className="mt-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>

          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-black"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>

          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content..."
            rows="10"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  )
}

export default CreatePostPage