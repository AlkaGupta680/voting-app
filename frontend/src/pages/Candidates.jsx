import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Vote, User, Calendar, Users } from 'lucide-react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'

const Candidates = () => {
  const { user, isAdmin } = useAuth()
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      const response = await api.get('/candidate/candidate')
      setCandidates(response.data)
    } catch (error) {
      console.error('Failed to fetch candidates:', error)
      setMessage({ type: 'error', text: 'Failed to load candidates' })
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (candidateId) => {
    if (user?.isVoted) {
      setMessage({ type: 'warning', text: 'You have already voted!' })
      return
    }

    if (isAdmin) {
      setMessage({ type: 'error', text: 'Admins are not allowed to vote!' })
      return
    }

    setVoting(true)
    try {
      await api.post(`/candidate/vote/${candidateId}`)
      setMessage({ type: 'success', text: 'Vote cast successfully!' })
      
      // Update user's voting status locally
      user.isVoted = true
      
      // Refresh candidates to update vote counts
      fetchCandidates()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cast vote'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setVoting(false)
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600 mt-2">
            {isAdmin 
              ? 'View all registered candidates' 
              : user?.isVoted 
                ? 'Thank you for voting! View all candidates below.'
                : 'Choose your preferred candidate and cast your vote'
            }
          </p>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <Alert 
            type={message.type} 
            message={message.text} 
            onClose={() => setMessage({ type: '', text: '' })}
            className="mb-6"
          />
        )}

        {/* Voting Status Banner */}
        {!isAdmin && (
          <div className={`card mb-8 ${user?.isVoted ? 'border-success-200 bg-success-50' : 'border-primary-200 bg-primary-50'}`}>
            <div className="flex items-center space-x-3">
              <Vote className={`h-6 w-6 ${user?.isVoted ? 'text-success-600' : 'text-primary-600'}`} />
              <div>
                <h3 className={`font-semibold ${user?.isVoted ? 'text-success-800' : 'text-primary-800'}`}>
                  {user?.isVoted ? 'Vote Submitted' : 'Ready to Vote'}
                </h3>
                <p className={`text-sm ${user?.isVoted ? 'text-success-700' : 'text-primary-700'}`}>
                  {user?.isVoted 
                    ? 'Your vote has been recorded successfully.' 
                    : 'Click on "Vote" button next to your preferred candidate.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Candidates Grid */}
        {candidates.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Candidates Found</h3>
            <p className="text-gray-600">There are currently no candidates registered for voting.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <div key={candidate._id} className="card group hover:shadow-lg transition-all duration-200">
                {/* Candidate Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-primary-100 rounded-full group-hover:bg-primary-200 transition-colors duration-200">
                    <User className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                    <p className="text-primary-600 font-medium">{candidate.party}</p>
                  </div>
                </div>

                {/* Candidate Details */}
                <div className="space-y-3 mb-6">
                  {candidate.age && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Age: {candidate.age}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Vote className="h-4 w-4" />
                    <span className="text-sm">Votes: {candidate.voteCount}</span>
                  </div>
                </div>

                {/* Vote Button */}
                {!isAdmin && (
                  <button
                    onClick={() => handleVote(candidate._id)}
                    disabled={user?.isVoted || voting}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      user?.isVoted
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'btn-primary hover:shadow-md'
                    }`}
                  >
                    {voting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>Voting...</span>
                      </div>
                    ) : user?.isVoted ? (
                      'Already Voted'
                    ) : (
                      'Vote for this Candidate'
                    )}
                  </button>
                )}

                {/* Admin View */}
                {isAdmin && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 text-center">
                      Admin View - Voting Disabled
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        {!isAdmin && candidates.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              {user?.isVoted 
                ? 'You have successfully participated in the voting process.' 
                : 'Remember: You can only vote once. Choose wisely!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Candidates