import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'

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

function EditPostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [authorized, setAuthorized] = useState(true)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'BACKEND',
    imageUrl: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
  if (!authLoading && user) {
    fetchPost()
  }
}, [id, authLoading, user])

  async function fetchPost() {
    setLoading(true)
    setError('')
    setAuthorized(true)

    try {
      const response = await api.get(`/posts/${id}`)
      const post = response.data

      if (user && user.id !== post.authorId) {
        setAuthorized(false)
        return
      }

      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        imageUrl: response.data.imageUrl || '',
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load post.')
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
    setError('')
    setSaving(true)

    try {
      const requestBody = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        imageUrl: formData.imageUrl || null,
      }

      const response = await api.put(`/posts/${id}`, requestBody)
      navigate(`/posts/${response.data.id}`)
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).join(' '))
      } else {
        setError(err.response?.data?.message || 'Failed to update post.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-600">
        Loading post...
      </div>
    )
  }
  if (!authorized) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
        <h1 className="text-3xl font-bold text-gray-950">
          Access denied
        </h1>

        <p className="text-gray-600 mt-3">
          You can only edit posts that you created.
        </p>

        <button
          onClick={() => navigate(`/posts/${id}`)}
          className="mt-6 bg-black text-white px-6 py-3 rounded-2xl font-medium hover:opacity-90 transition"
        >
          Back to Post
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 md:p-10 border-b border-gray-100">
            <span className="inline-flex bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
              Edit Article
            </span>

            <h1 className="mt-5 text-4xl font-bold text-gray-950 tracking-tight">
              Update your post
            </h1>

            <p className="mt-3 text-gray-600 leading-7">
              Refine your title, category and content before publishing the latest version.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-7">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Title
              </label>

              <input
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Give your article a clear title"
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-black placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Cover Image URL
              </label>

              <input
                name="imageUrl"
                type="text"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/cover-image.jpg"
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-gray-400"
              />

              <p className="mt-2 text-xs text-gray-400">
                This is a frontend preview field for now. Backend support will be added later.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Content
                </label>

                <span className="text-xs text-gray-400">
                  {formData.content.length} characters
                </span>
              </div>

              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Start writing your article..."
                rows="14"
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-black resize-none text-gray-700 leading-7 placeholder:text-gray-400"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-black text-white px-6 py-3 rounded-2xl font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type="button"
                onClick={() => navigate(`/posts/${id}`)}
                className="border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>

      <aside className="lg:col-span-4 space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-950">
            Editing Tips
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">
                Improve clarity
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Make your title and opening paragraph easy to understand.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Keep structure clean
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Use short paragraphs and organize your thoughts clearly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Check your category
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Make sure your article appears in the right topic area.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-black text-white rounded-3xl shadow-sm p-6">
          <h2 className="text-lg font-bold">
            Cover Preview
          </h2>

          <p className="mt-3 text-gray-300 leading-7 text-sm">
            Add a cover image URL to preview how your article visual could look.
          </p>

          <div className="mt-5 h-40 rounded-2xl bg-white/10 overflow-hidden flex items-center justify-center">
            {formData.imageUrl ? (
              <img
                src={formData.imageUrl}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <span className="block text-4xl font-bold text-white/40">
                  {formData.category.charAt(0)}
                </span>
                <span className="block text-xs text-white/40 mt-1">
                  {formData.category}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}

export default EditPostPage