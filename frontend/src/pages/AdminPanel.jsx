import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Users, Shield } from 'lucide-react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'

const AdminPanel = () => {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    party: '',
    age: ''
  })
  const [submitting, setSubmitting] = useState(false)
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      const candidateData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined
      }

      if (editingCandidate) {
        // Update existing candidate
        await api.put(`/candidate/${editingCandidate._id}`, candidateData)
        setMessage({ type: 'success', text: 'Candidate updated successfully!' })
      } else {
        // Create new candidate
        await api.post('/candidate', candidateData)
        setMessage({ type: 'success', text: 'Candidate added successfully!' })
      }

      // Reset form and refresh data
      setFormData({ name: '', party: '', age: '' })
      setShowForm(false)
      setEditingCandidate(null)
      fetchCandidates()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Operation failed'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate)
    setFormData({
      name: candidate.name,
      party: candidate.party,
      age: candidate.age?.toString() || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (candidateId) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return
    }

    try {
      await api.delete(`/candidate/${candidateId}`)
      setMessage({ type: 'success', text: 'Candidate deleted successfully!' })
      fetchCandidates()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete candidate'
      setMessage({ type: 'error', text: errorMessage })
    }
  }

  const resetForm = () => {
    setFormData({ name: '', party: '', age: '' })
    setShowForm(false)
    setEditingCandidate(null)
    setMessage({ type: '', text: '' })
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Manage candidates and voting system</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Candidate</span>
          </button>
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

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Candidate Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="input-field"
                    placeholder="Enter candidate name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Party Name *
                  </label>
                  <input
                    type="text"
                    name="party"
                    required
                    className="input-field"
                    placeholder="Enter party name"
                    value={formData.party}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    min="18"
                    max="120"
                    className="input-field"
                    placeholder="Enter age (optional)"
                    value={formData.age}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    {submitting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <span>{editingCandidate ? 'Update' : 'Add'} Candidate</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 btn-secondary"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Candidates List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Registered Candidates</h2>
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="h-5 w-5" />
              <span>{candidates.length} candidates</span>
            </div>
          </div>

          {candidates.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Candidates</h3>
              <p className="text-gray-600 mb-4">Start by adding your first candidate to the system.</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add First Candidate</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Party</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Age</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Votes</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{candidate.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {candidate.party}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {candidate.age || 'N/A'}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">{candidate.voteCount}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(candidate)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                            title="Edit candidate"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(candidate._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                            title="Delete candidate"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Admin Guidelines */}
        <div className="card mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Guidelines</h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>You can add, edit, and delete candidates at any time</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Admins cannot vote to maintain system neutrality</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Vote counts are updated in real-time across the system</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Be careful when deleting candidates as this action cannot be undone</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel