import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 md:p-16 text-center">
        <div className="mx-auto w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center">
          <span className="text-5xl font-bold text-gray-300">
            404
          </span>
        </div>

        <h1 className="mt-8 text-4xl md:text-5xl font-bold text-gray-950 tracking-tight">
          Page not found
        </h1>

        <p className="mt-4 text-gray-600 text-lg leading-8 max-w-2xl mx-auto">
          The page you are looking for does not exist or may have been moved.
          You can return to the homepage and continue exploring articles.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="bg-black text-white px-6 py-3 rounded-2xl font-medium hover:opacity-90 transition"
          >
            Back to Home
          </Link>

          <Link
            to="/login"
            className="border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-medium hover:bg-gray-50 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage