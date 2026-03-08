import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminDashboard() {
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({ title: '', category: '', affiliateLink: '', image: '' })
  const [products, setProducts] = useState([])
  const [editingId, setEditingId] = useState(null)

  const [profileUploading, setProfileUploading] = useState(false)
  // NEW: Added social media fields to our state
  const [profileData, setProfileData] = useState({ 
    name: '', bio: '', imageUrl: '', instagram: '', youtube: '', linkedin: '', facebook: '', email: '' 
  })

  useEffect(() => {
    fetchProducts()
    fetchProfile()
  }, [])

  async function fetchProfile() {
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
  }

  const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value })

  const handleProfileImageUpload = async (e) => {
    try {
      setProfileUploading(true)
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `profile_${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
      setProfileData({ ...profileData, imageUrl: data.publicUrl })
    } catch (error) {
      alert('Error uploading profile image!')
    } finally {
      setProfileUploading(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      // NEW: Added social fields to the update payload
      const { error } = await supabase.from('profile').update({ 
        name: profileData.name, 
        bio: profileData.bio, 
        "imageUrl": profileData.imageUrl,
        instagram: profileData.instagram,
        youtube: profileData.youtube,
        linkedin: profileData.linkedin,
        facebook: profileData.facebook,
        email: profileData.email
      }).eq('id', 1)
      if (error) throw error
      alert('Profile & Socials updated!')
    } catch (error) {
      alert('Error updating profile!')
    }
  }

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('createdAt', { ascending: false })
    if (data) setProducts(data)
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleImageUpload = async (e) => {
    try {
      setUploading(true)
      const file = e.target.files[0]
      const fileName = `${Math.random()}.${file.name.split('.').pop()}`
      const { error } = await supabase.storage.from('product-images').upload(fileName, file)
      if (error) throw error
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
      setFormData({ ...formData, image: data.publicUrl })
    } catch (error) {
      alert('Error uploading image!')
    } finally {
      setUploading(false)
    }
  }

  const handleEditClick = (product) => {
    setEditingId(product.id)
    setFormData({ title: product.title, category: product.category, affiliateLink: product.affiliateLink, image: product.image })
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
          title: formData.title, category: formData.category, "affiliateLink": formData.affiliateLink, image: formData.image
        }).eq('id', editingId)
        if (error) throw error
        alert('Product updated!')
      } else {
        const { error } = await supabase.from('products').insert([{
          title: formData.title, category: formData.category, "affiliateLink": formData.affiliateLink, image: formData.image
        }])
        if (error) throw error
        alert('Product published!')
      }
      setEditingId(null)
      setFormData({ title: '', category: '', affiliateLink: '', image: '' })
      fetchProducts()
    } catch (error) {
      alert('Error saving product!')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      setProducts(products.filter(product => product.id !== id))
    } catch (error) {
      alert("Error deleting product.")
    }
  }

  const inputClass = "w-full p-3.5 rounded-xl bg-white/50 border border-white/80 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 text-slate-800 placeholder-slate-400 shadow-sm transition-all text-sm font-medium"
  const panelClass = "bg-white/40 backdrop-blur-2xl border border-white/60 p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative z-20"

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 w-full max-w-7xl mx-auto bg-[#faf9f8] relative min-h-screen">

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-orange-200/40 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] bg-blue-200/40 rounded-full blur-[150px] mix-blend-multiply" />
        <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[50px] z-10" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 relative z-20 lg:items-start pt-4">

        <div className="w-full lg:w-5/12 flex flex-col gap-6 lg:gap-8 shrink-0">
          
          {/* PROFILE & SOCIALS EDITOR */}
          <div className={panelClass}>
            <h2 className="text-xl font-black text-slate-800 mb-5 tracking-tight flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Profile & Socials
            </h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4 flex flex-col">
              <div className="flex items-center gap-4 bg-white/50 p-3 rounded-2xl border border-white/80 shadow-sm">
                {profileData.imageUrl && (
                  <img src={profileData.imageUrl} alt="Profile" className="w-12 h-12 rounded-full object-cover shadow-sm border border-white" />
                )}
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={handleProfileImageUpload} disabled={profileUploading} className="file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-white w-full text-xs text-slate-600 hover:file:bg-slate-700 transition-all cursor-pointer" />
                </div>
              </div>
              <input type="text" name="name" placeholder="Creator Name" value={profileData.name} onChange={handleProfileChange} required className={inputClass} />
              <textarea name="bio" placeholder="Bio..." value={profileData.bio} onChange={handleProfileChange} required className={`${inputClass} h-20 resize-none`} />
              
              {/* NEW: SOCIAL MEDIA INPUT SECTION */}
              <div className="pt-2 pb-2 space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Social Links <span className="text-slate-400 font-normal lowercase">(Leave blank to hide)</span></p>
                <input type="url" name="instagram" placeholder="Instagram URL" value={profileData.instagram} onChange={handleProfileChange} className={inputClass} />
                <input type="url" name="youtube" placeholder="YouTube URL" value={profileData.youtube} onChange={handleProfileChange} className={inputClass} />
                <input type="url" name="linkedin" placeholder="LinkedIn URL" value={profileData.linkedin} onChange={handleProfileChange} className={inputClass} />
                <input type="url" name="facebook" placeholder="Facebook URL" value={profileData.facebook} onChange={handleProfileChange} className={inputClass} />
                <input type="email" name="email" placeholder="Contact Email Address" value={profileData.email} onChange={handleProfileChange} className={inputClass} />
              </div>

              <button type="submit" disabled={profileUploading} className="bg-slate-800 text-white text-sm hover:bg-slate-700 font-black py-3 rounded-xl disabled:opacity-40 transition-all shadow-md shadow-slate-800/10 mt-2">Update Profile</button>
            </form>
          </div>

          <div className={panelClass}>
            <h2 className="text-xl font-black text-slate-800 mb-5 tracking-tight flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
              
              {editingId && formData.image && (
                <div className="flex justify-center mb-2">
                   <img src={formData.image} alt="Preview" className="w-20 h-20 object-contain bg-white rounded-2xl border border-slate-100 p-2 shadow-sm" />
                </div>
              )}

              <div className="bg-white/50 p-3 rounded-2xl border border-white/80 shadow-sm">
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white file:text-slate-800 file:shadow-sm w-full text-xs text-slate-600 cursor-pointer" />
                {formData.image && !editingId && <p className="text-[10px] text-emerald-600 mt-2 font-bold px-1 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Image uploaded</p>}
              </div>
              
              <input type="text" name="title" placeholder="Product Title" value={formData.title} onChange={handleChange} required className={inputClass} />
              
              <input 
                type="text" 
                name="category" 
                list="category-options"
                placeholder="Category (Type or Select)" 
                value={formData.category} 
                onChange={handleChange} 
                required 
                className={inputClass} 
              />
              <datalist id="category-options">
                <option value="Creator Gear" />
                <option value="Tech Gadgets" />
                <option value="Mobile Accessories" />
                <option value="PC Setup" />
              </datalist>
              
              <input type="url" name="affiliateLink" placeholder="Affiliate Link (Amazon, etc.)" value={formData.affiliateLink} onChange={handleChange} required className={inputClass} />
              
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={uploading || !formData.image} className="flex-1 bg-slate-800 text-white text-sm hover:bg-slate-700 font-black py-3 rounded-xl disabled:opacity-40 transition-all shadow-md shadow-slate-800/10">
                  {editingId ? 'Update Product' : 'Publish Product'}
                </button>
                {editingId && (
                  <button type="button" onClick={cancelEdit} className="bg-white text-slate-600 border border-white/80 text-sm hover:bg-slate-50 font-black px-5 rounded-xl transition-all shadow-sm">Cancel</button>
                )}
              </div>
            </form>
          </div>

        </div>

        <div className={`w-full lg:w-7/12 ${panelClass} flex flex-col max-h-[85vh]`}>
          <div className="flex items-center justify-between mb-6 shrink-0 border-b border-black/5 pb-4">
             <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                Manage Inventory
             </h2>
             <span className="bg-white/60 text-slate-600 text-xs font-bold px-3 py-1 rounded-full border border-white/80 shadow-sm">{products.length} Items</span>
          </div>
          
          <div className="space-y-3 overflow-y-auto pr-2 pb-4" style={{ scrollbarWidth: 'thin' }}>
            {products.map(product => (
              <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white/40 rounded-2xl border border-white/80 hover:bg-white/60 transition-all gap-4 shadow-sm group">
                
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl border border-slate-100 flex items-center justify-center shrink-0 p-1.5 shadow-sm">
                    <img src={product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{product.title}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate mt-0.5">{product.category}</p>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={() => handleEditClick(product)} className="bg-white hover:bg-slate-50 text-slate-600 px-4 py-2 text-xs rounded-xl font-bold transition-all shadow-sm border border-slate-200">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 text-xs rounded-xl font-bold transition-all shadow-sm border border-red-100">
                    Delete
                  </button>
                </div>

              </div>
            ))}
            {products.length === 0 && (
              <div className="text-center py-10">
                 <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-300 mb-3"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                 <p className="text-slate-400 font-bold text-sm">Your inventory is empty.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}