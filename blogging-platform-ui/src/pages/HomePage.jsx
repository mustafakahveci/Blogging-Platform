import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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

function HomePage() {
  const [posts, setPosts] = useState([])
  const [pageInfo, setPageInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts(page = 0, searchKeyword = keyword, selectedCategory = category) {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/posts', {
        params: {
          page,
          size: 5,
          sortBy: 'createdAt',
          direction: 'desc',
          keyword: searchKeyword || undefined,
          category: selectedCategory || undefined,
        },
      })

      setPosts(response.data.content || [])
      setCurrentPage(response.data.page)
      setPageInfo({
        page: response.data.page,
        size: response.data.size,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
        last: response.data.last,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts.')
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    fetchPosts(0, keyword, category)
  }

  function handleClear() {
    setKeyword('')
    setCategory('')
    fetchPosts(0, '', '')
  }

  function handlePreviousPage() {
    if (currentPage > 0) {
      fetchPosts(currentPage - 1, keyword, category)
    }
  }

  function handleNextPage() {
    if (pageInfo && !pageInfo.last) {
      fetchPosts(currentPage + 1, keyword, category)
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

    return content.length > 130
      ? `${content.substring(0, 130)}...`
      : content
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-8 space-y-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-950 leading-tight">
                Discover ideas, stories and perspectives.
              </h1>

              <p className="mt-4 text-gray-600 text-lg leading-8">
                Read and share stories on any topic that matters to you.
              </p>
            </div>

            <div className="hidden md:flex h-40 rounded-2xl bg-gray-100 items-center justify-center">
              <span className="text-5xl">✍️</span>
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-8 bg-gray-50 border border-gray-200 rounded-3xl p-4 shadow-sm"
          >
            <div className="flex flex-col xl:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search articles by title or content..."
                  className="w-full h-14 border border-gray-200 rounded-2xl px-5 focus:outline-none focus:ring-2 focus:ring-black bg-white"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="xl:w-56 h-14 border border-gray-200 rounded-2xl px-5 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">All Categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="h-14 px-8 bg-black text-white rounded-2xl font-medium hover:opacity-90 transition"
                >
                  Search
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="h-14 px-6 border border-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-white transition"
                >
                  Clear
                </button>
              </div>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-600">
            Loading posts...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <h3 className="text-2xl font-bold text-gray-950">
              No posts found
            </h3>

            <p className="text-gray-600 mt-2">
              Try changing your search keyword or category filter.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-8">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
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
                      <span>{formatDate(post.createdAt)}</span>
                    </div>

                    <Link to={`/posts/${post.id}`}>
                      <h2 className="mt-4 text-2xl font-bold text-gray-950 group-hover:underline underline-offset-4">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="mt-3 text-gray-600 leading-7">
                      {getPreview(post.content)}
                    </p>

                    <Link
                      to={`/posts/${post.id}`}
                      className="mt-5 inline-flex text-sm font-semibold text-gray-950 hover:underline"
                    >
                      Read article →
                    </Link>
                  </div>

                  <div className="md:col-span-4">
                    <div className="h-36 md:h-40 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-300 overflow-hidden flex items-center justify-center">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <span className="block text-4xl font-bold text-gray-400">
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

        {pageInfo && pageInfo.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className="border border-gray-300 bg-white px-5 py-2 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <span className="text-gray-600 text-sm">
              Page {currentPage + 1} of {pageInfo.totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={pageInfo.last}
              className="border border-gray-300 bg-white px-5 py-2 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </section>

      <aside className="lg:col-span-4 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-950">
            About Blogging Platform
          </h3>

          <p className="mt-3 text-gray-600 leading-7">
            A community-driven space for sharing ideas, stories, tutorials,
            opinions and experiences across all topics.
          </p>

          <p className="mt-3 text-gray-600 leading-7">
            Write about what you love and connect with readers through your
            own articles.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <h4 className="font-semibold text-gray-950">Write</h4>
              <p className="text-sm text-gray-500">Share your thoughts</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-950">Discover</h4>
              <p className="text-sm text-gray-500">Explore diverse perspectives</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-950">Connect</h4>
              <p className="text-sm text-gray-500">Build meaningful connections</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-950">
            Popular Categories
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setCategory(item)
                  fetchPosts(0, keyword, item)
                }}
                className={`px-3 py-2 rounded-full text-xs font-medium transition ${category === item
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-black text-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold">
            Start writing today
          </h3>

          <p className="mt-3 text-gray-300 leading-7">
            Join the community and share your own perspective with readers.
          </p>

          <Link
            to="/posts/new"
            className="mt-5 inline-flex bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition"
          >
            Create Post →
          </Link>
        </div>
      </aside>
    </div>
  )
}

export default HomePage