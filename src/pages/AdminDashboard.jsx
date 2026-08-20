import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import BackgroundMesh from '../components/BackgroundMesh'
import Toast from '../components/Toast'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inventory') // 'inventory' | 'profile'
  const [products, setProducts] = useState([])
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    affiliateLink: '',
    image: ''
  })

  const [profileUploading, setProfileUploading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    imageUrl: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    facebook: '',
    email: ''
  })

  useEffect(() => {
    fetchProducts()
    fetchProfile()
  }, [])

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  async function fetchProfile() {
    try {
      const { data } = await supabase.from('profile').select('*').eq('id', 1).single()
      if (data) {
        setProfileData({
          name: data.name || '',
          bio: data.bio || '',
          imageUrl: data.imageUrl || '',
          instagram: data.instagram || '',
          youtube: data.youtube || '',
          linkedin: data.linkedin || '',
          facebook: data.facebook || '',
          email: data.email || ''
        })
      }
    } catch (e) {
      console.error('Error fetching profile:', e)
    }
  }

  async function fetchProducts() {
    try {
      const { data } = await supabase.from('products').select('*').order('createdAt', { ascending: false })
      if (data) setProducts(data)
    } catch (e) {
      console.error('Error fetching products:', e)
    }
  }

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.value]: e.target.value })
  }

  const handleProfileImageUpload = async (e) => {
    try {
      setProfileUploading(true)
      const file = e.target.files[0]
      if (!file) return
      const fileExt = file.name.split('.').pop()
      const fileName = `profile_${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
      setProfileData({ ...profileData, imageUrl: data.publicUrl })
      triggerToast('Profile image uploaded!')
    } catch (error) {
      triggerToast('Error uploading profile image!')
    } finally {
      setProfileUploading(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('profile').update({
        name: profileData.name,
        bio: profileData.bio,
        imageUrl: profileData.imageUrl,
        instagram: profileData.instagram,
        youtube: profileData.youtube,
        linkedin: profileData.linkedin,
        facebook: profileData.facebook,
        email: profileData.email
      }).eq('id', 1)

      if (error) throw error
      triggerToast('Profile & Socials updated successfully!')
    } catch (error) {
      triggerToast('Error updating profile!')
    }
  }

  const handleProductChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (e) => {
    try {
      setUploading(true)
      const file = e.target.files[0]
      if (!file) return
      const fileName = `${Math.random()}.${file.name.split('.').pop()}`
      const { error } = await supabase.storage.from('product-images').upload(fileName, file)
      if (error) throw error
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
      setFormData({ ...formData, image: data.publicUrl })
      triggerToast('Product image uploaded!')
    } catch (error) {
      triggerToast('Error uploading image!')
    } finally {
      setUploading(false)
    }
  }

  const handleEditClick = (product) => {
    setEditingId(product.id)
    setFormData({
      title: product.title,
      category: product.category,
      affiliateLink: product.affiliateLink || product.affiliate_link || '',
      image: product.image
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ title: '', category: '', affiliateLink: '', image: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        const { error } = await supabase.from('products').update({
          title: formData.title,
          category: formData.category,
          affiliateLink: formData.affiliateLink,
          image: formData.image
        }).eq('id', editingId)

        if (error) throw error
        triggerToast('Product updated successfully!')
      } else {
        const { error } = await supabase.from('products').insert([{
          title: formData.title,
          category: formData.category,
          affiliateLink: formData.affiliateLink,
          image: formData.image
        }])

        if (error) throw error
        triggerToast('New product published!')
      }

      setEditingId(null)
      setFormData({ title: '', category: '', affiliateLink: '', image: '' })
      fetchProducts()
    } catch (error) {
      triggerToast('Error saving product!')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      setProducts(products.filter((product) => product.id !== id))
      triggerToast('Product deleted.')
    } catch (error) {
      triggerToast('Error deleting product.')
    }
  }

  const filteredProducts = products.filter(p =>
    searchQuery === '' ||
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categoriesCount = new Set(products.map(p => p.category)).size
  const activeSocialsCount = [
    profileData.instagram, profileData.youtube, profileData.linkedin, profileData.facebook, profileData.email
  ].filter(Boolean).length

  return (
    <div className="relative flex-1 min-h-screen bg-[#f4f7fb] text-slate-900 w-full overflow-y-auto pb-20">
      <BackgroundMesh />

      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
              Admin Control Hub
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage affiliate inventory, profile information, and social links.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center p-1.5 rounded-2xl bg-white border border-slate-200 shrink-0 shadow-sm">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'inventory'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inventory Management
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Profile & Socials
            </button>
          </div>
        </div>

        {/* Dashboard Statistics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-3xl bg-white/80 border border-slate-200 backdrop-blur-xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Products</p>
              <h3 className="text-2xl font-extrabold text-slate-900 font-heading">{products.length} Items</h3>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/80 border border-slate-200 backdrop-blur-xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Categories</p>
              <h3 className="text-2xl font-extrabold text-slate-900 font-heading">{categoriesCount} Active</h3>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/80 border border-slate-200 backdrop-blur-xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Social Links</p>
              <h3 className="text-2xl font-extrabold text-slate-900 font-heading">{activeSocialsCount} Linked</h3>
            </div>
          </div>
        </div>

        {/* Tab 1: Inventory Management */}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Form */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-3xl bg-white/80 border border-slate-200 backdrop-blur-xl shadow-lg">
                <h2 className="text-xl font-extrabold text-slate-900 mb-6 font-heading flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  {editingId ? 'Edit Product' : 'Publish Product'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Product Image
                    </label>
                    {formData.image && (
                      <div className="mb-3 p-2 rounded-2xl bg-slate-50 flex justify-center border border-slate-200">
                        <img src={formData.image} alt="Preview" className="h-24 object-contain mix-blend-multiply" />
                      </div>
                    )}

                    <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-500 file:text-white cursor-pointer"
                      />
                      {uploading && <p className="text-xs text-orange-600 font-bold mt-2 animate-pulse">Uploading image...</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g. Sony Alpha 7 IV"
                      value={formData.title}
                      onChange={handleProductChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      list="category-suggestions"
                      placeholder="e.g. Headphones, Mobiles, Tools"
                      value={formData.category}
                      onChange={handleProductChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm font-medium"
                    />
                    <datalist id="category-suggestions">
                      <option value="Headphones" />
                      <option value="Mobiles" />
                      <option value="Tools" />
                      <option value="Creator Gear" />
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Affiliate Destination Link</label>
                    <input
                      type="url"
                      name="affiliateLink"
                      placeholder="https://amazon.in/dp/..."
                      value={formData.affiliateLink}
                      onChange={handleProductChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm font-medium"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={uploading || !formData.image}
                      className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm transition-all shadow-md shadow-orange-500/25 disabled:opacity-40"
                    >
                      {editingId ? 'Save Changes' : 'Publish Product'}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all border border-slate-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Right List */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-3xl bg-white/80 border border-slate-200 backdrop-blur-xl shadow-lg flex flex-col max-h-[750px]">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl font-extrabold text-slate-900 font-heading">
                    Current Inventory ({filteredProducts.length})
                  </h2>

                  <input
                    type="text"
                    placeholder="Filter inventory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-orange-500 w-48"
                  />
                </div>

                <div className="space-y-3 overflow-y-auto pr-1">
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 transition-all gap-4 shadow-sm group"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 p-1 flex items-center justify-center shrink-0 border border-slate-100">
                            <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm truncate">{product.title}</h4>
                            <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
                              {product.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all border border-rose-200 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      <p className="text-sm font-medium">No items matching filter.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Profile */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/80 border border-slate-200 backdrop-blur-xl shadow-lg">
              <h2 className="text-xl font-extrabold text-slate-900 mb-6 font-heading flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Edit Profile & Social Links
              </h2>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <img
                    src={profileData.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt="Profile Avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-orange-500 shadow-md shrink-0"
                  />
                  <div className="flex-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Upload Avatar
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      disabled={profileUploading}
                      className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-500 file:text-white cursor-pointer"
                    />
                    {profileUploading && <p className="text-xs text-orange-600 font-bold mt-1">Uploading avatar...</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Creator Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Contact Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Bio / Tagline</label>
                  <textarea
                    name="bio"
                    rows="3"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm font-medium resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider">Social Platform URLs</h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Instagram URL</label>
                    <input
                      type="url"
                      name="instagram"
                      placeholder="https://instagram.com/username"
                      value={profileData.instagram}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">YouTube URL</label>
                    <input
                      type="url"
                      name="youtube"
                      placeholder="https://youtube.com/@channel"
                      value={profileData.youtube}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      name="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      value={profileData.linkedin}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Facebook URL</label>
                    <input
                      type="url"
                      name="facebook"
                      placeholder="https://facebook.com/username"
                      value={profileData.facebook}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileUploading}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold shadow-lg shadow-orange-500/25 transition-all transform active:scale-95 disabled:opacity-40"
                >
                  Save Profile & Social Links
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  )
}