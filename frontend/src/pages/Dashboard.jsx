import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Vote, Users, BarChart3, Shield, CheckCircle, XCircle } from 'lucide-react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { user, isAdmin } = useAuth()
  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalVotes: 0,
    userVoted: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [candidatesRes, resultsRes] = await Promise.all([
        api.get('/candidate/candidate'),
        api.get('/candidate/vote/count')
      ])

      const totalVotes = resultsRes.data.reduce((sum, candidate) => sum + candidate.count, 0)
      
      setStats({
        totalCandidates: candidatesRes.data.length,
        totalVotes,
        userVoted: user?.isVoted || false
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'View Candidates',
      description: 'Browse all registered candidates',
      icon: Users,
      link: '/candidates',
      color: 'bg-blue-500',
      disabled: false
    },
    {
      title: 'Cast Vote',
      description: stats.userVoted ? 'You have already voted' : 'Vote for your preferred candidate',
      icon: Vote,
      link: '/candidates',
      color: stats.userVoted ? 'bg-gray-400' : 'bg-green-500',
      disabled: stats.userVoted
    },
    {
      title: 'View Results',
      description: 'Check live voting results',
      icon: BarChart3,
      link: '/results',
      color: 'bg-purple-500',
      disabled: false
    }
  ]

  if (isAdmin) {
    quickActions.push({
      title: 'Admin Panel',
      description: 'Manage candidates and system',
      icon: Shield,
      link: '/admin',
      color: 'bg-red-500',
      disabled: false
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {isAdmin ? 'Admin Dashboard' : 'Your voting dashboard'}
          </p>
        </div>

        {/* Voting Status */}
        <div className="mb-8">
          <div className={`card ${stats.userVoted ? 'border-success-200 bg-success-50' : 'border-warning-200 bg-warning-50'}`}>
            <div className="flex items-center space-x-3">
              {stats.userVoted ? (
                <CheckCircle className="h-8 w-8 text-success-600" />
              ) : (
                <XCircle className="h-8 w-8 text-warning-600" />
              )}
              <div>
                <h3 className={`text-lg font-semibold ${stats.userVoted ? 'text-success-800' : 'text-warning-800'}`}>
                  {stats.userVoted ? 'Vote Submitted' : 'Vote Pending'}
                </h3>
                <p className={`${stats.userVoted ? 'text-success-700' : 'text-warning-700'}`}>
                  {stats.userVoted 
                    ? 'Thank you for participating in the democratic process!' 
                    : 'You haven\'t voted yet. Make your voice heard!'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCandidates}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Vote className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Votes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVotes}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stats.userVoted ? 'bg-success-100' : 'bg-warning-100'}`}>
                {stats.userVoted ? (
                  <CheckCircle className="h-8 w-8 text-success-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-warning-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Your Status</p>
                <p className={`text-2xl font-bold ${stats.userVoted ? 'text-success-600' : 'text-warning-600'}`}>
                  {stats.userVoted ? 'Voted' : 'Not Voted'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`card group transition-all duration-200 ${
                  action.disabled 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:shadow-lg hover:-translate-y-1'
                }`}
                onClick={(e) => action.disabled && e.preventDefault()}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 ${action.color} rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity or Tips */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isAdmin ? 'Admin Tips' : 'Voting Guidelines'}
          </h3>
          <div className="space-y-3">
            {isAdmin ? (
              <>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Use the Admin Panel to add, edit, or remove candidates</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Monitor voting results in real-time</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Admins cannot vote to maintain neutrality</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">You can only vote once, so choose carefully</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Review all candidates before making your decision</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Your vote is anonymous and secure</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard