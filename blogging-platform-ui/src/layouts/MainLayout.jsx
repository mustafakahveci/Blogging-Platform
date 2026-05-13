import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout