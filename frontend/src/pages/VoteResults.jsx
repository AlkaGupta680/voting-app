import React, { useState, useEffect } from 'react'
import { BarChart3, Trophy, Users, TrendingUp } from 'lucide-react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const VoteResults = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalVotes, setTotalVotes] = useState(0)

  useEffect(() => {
    fetchResults()
    // Set up polling for real-time updates
    const interval = setInterval(fetchResults, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchResults = async () => {
    try {
      const response = await api.get('/candidate/vote/count')
      setResults(response.data)
      const total = response.data.reduce((sum, candidate) => sum + candidate.count, 0)
      setTotalVotes(total)
    } catch (error) {
      console.error('Failed to fetch results:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPercentage = (votes) => {
    if (totalVotes === 0) return 0
    return ((votes / totalVotes) * 100).toFixed(1)
  }

  const getPositionIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 1:
        return <Trophy className="h-6 w-6 text-gray-400" />
      case 2:
        return <Trophy className="h-6 w-6 text-amber-600" />
      default:
        return <div className="h-6 w-6 flex items-center justify-center bg-gray-200 rounded-full text-sm font-bold text-gray-600">{index + 1}</div>
    }
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
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary-100 rounded-2xl">
              <BarChart3 className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Live Voting Results</h1>
          <p className="text-xl text-gray-600">Real-time vote counts and standings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Votes Cast</p>
            <p className="text-3xl font-bold text-gray-900">{totalVotes}</p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Leading Candidate</p>
            <p className="text-3xl font-bold text-gray-900">
              {results.length > 0 ? results[0].party : 'N/A'}
            </p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Candidates</p>
            <p className="text-3xl font-bold text-gray-900">{results.length}</p>
          </div>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Available</h3>
            <p className="text-gray-600">Voting results will appear here once votes are cast.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Standings</h2>
            
            {results.map((candidate, index) => (
              <div key={index} className={`card ${index === 0 ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getPositionIcon(index)}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{candidate.party}</h3>
                      <p className="text-gray-600">
                        {candidate.count} votes ({getPercentage(candidate.count)}%)
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{candidate.count}</div>
                    <div className="text-sm text-gray-600">{getPercentage(candidate.count)}%</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-amber-600' : 'bg-primary-500'
                      }`}
                      style={{ width: `${getPercentage(candidate.count)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Auto-refresh Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Results update automatically every 30 seconds
          </p>
        </div>
      </div>
    </div>
  )
}

export default VoteResults