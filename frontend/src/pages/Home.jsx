import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Vote, Users, Shield, BarChart3, ArrowRight } from 'lucide-react'

const Home = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Vote,
      title: 'Secure Voting',
      description: 'Cast your vote securely with Aadhar-based authentication'
    },
    {
      icon: Users,
      title: 'View Candidates',
      description: 'Browse through all registered candidates and their details'
    },
    {
      icon: BarChart3,
      title: 'Live Results',
      description: 'View real-time voting results and statistics'
    },
    {
      icon: Shield,
      title: 'Admin Control',
      description: 'Comprehensive admin panel for candidate management'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-primary-100 rounded-2xl">
                <Vote className="h-16 w-16 text-primary-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Voice,
              <span className="text-primary-600"> Your Vote</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Participate in the democratic process with our secure, transparent, and user-friendly voting platform. 
              Every vote counts, every voice matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary inline-flex items-center space-x-2">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary inline-flex items-center space-x-2">
                    <span>Get Started</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link to="/login" className="btn-secondary">
                    Sign In
                  </Link>
                </>
              )}
              <Link to="/results" className="btn-secondary inline-flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>View Results</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with security, transparency, and user experience in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center group hover:shadow-lg transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary-100 rounded-xl group-hover:bg-primary-200 transition-colors duration-300">
                    <feature.icon className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Make Your Voice Heard?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of citizens who trust our platform for secure and transparent voting
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary inline-flex items-center space-x-2">
                <span>Create Account</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/login" className="btn-secondary">
                Already have an account?
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home