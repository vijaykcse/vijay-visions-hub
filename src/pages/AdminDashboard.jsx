import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminDashboard() {
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({ title: '', category: '', affiliateLink: '', image: '' })
  const [products, setProducts] = useState([])
  const [editingId, setEditingId] = useState(null)

  const [profileUploading, setProfileUploading] = useState(false)
  const [profileData, setProfileData] = useState({ name: '', bio: '', imageUrl: '' })

  useEffect(() => {
    fetchProducts()
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const { data } = await supabase.from('profile').select('*').eq('id', 1).single()
    if (data) setProfileData({ name: data.name, bio: data.bio, imageUrl: data.imageUrl })
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
      const { error } = await supabase.from('profile').update({ name: profileData.name, bio: profileData.bio, "imageUrl": profileData.imageUrl }).eq('id', 1)
      if (error) throw error
      alert('Profile updated!')
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

  const inputClass = "p-3 rounded-xl bg-black/[0.04] border border-black/10 w-full text-black placeholder-black/30 focus:border-black/30 focus:outline-none transition-all text-sm"
  const panelClass = "bg-black/[0.02] backdrop-blur-xl p-6 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-black/10"

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 w-full max-w-7xl mx-auto bg-transparent relative">

      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-black/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-20 w-[400px] h-[400px] bg-black/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 relative z-10 lg:items-start">

        {/* LEFT COLUMN: FORMS */}
        <div className="w-full lg:w-5/12 flex flex-col gap-6">
          
          <div className={panelClass}>
            <h2 className="text-xl font-black text-black mb-4 tracking-tight">Profile</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-3 flex flex-col">
              <div className="flex items-center gap-4 bg-black/[0.03] p-3 rounded-xl border border-black/10">
                {profileData.imageUrl && (
                  <img src={profileData.imageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                )}
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={handleProfileImageUpload} disabled={profileUploading} className="file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-black file:text-white w-full text-xs" />
                </div>
              </div>
              <input type="text" name="name" placeholder="Name" value={profileData.name} onChange={handleProfileChange} required className={inputClass} />
              <textarea name="bio" placeholder="Bio..." value={profileData.bio} onChange={handleProfileChange} required className={`${inputClass} h-16 resize-none`} />
              <button type="submit" disabled={profileUploading} className="bg-black text-white text-sm hover:bg-black/80 font-black py-2.5 rounded-xl disabled:opacity-40 transition-all">Save Profile</button>
            </form>
          </div>

          <div className={panelClass}>
            <h2 className="text-xl font-black text-black mb-4 tracking-tight">
              {editingId ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3 flex flex-col">
              
              {editingId && formData.image && (
                <div className="flex justify-center mb-1">
                   <img src={formData.image} alt="Preview" className="w-16 h-16 object-contain bg-white rounded-lg border border-black/10 p-1" />
                </div>
              )}

              <div className="bg-black/[0.03] p-3 rounded-xl border border-black/10">
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-black/10 file:text-black w-full text-xs" />
                {formData.image && !editingId && <p className="text-[10px] text-black/60 mt-1 font-bold">✓ Image ready</p>}
              </div>
              
              <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className={inputClass} />
              
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
                <option value="Creator Products" />
                <option value="Tech Gadgets" />
                <option value="Mobile Accessories" />
                <option value="PC Setup" />
              </datalist>
              
              <input type="url" name="affiliateLink" placeholder="Amazon Link" value={formData.affiliateLink} onChange={handleChange} required className={inputClass} />
              
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={uploading || !formData.image} className="flex-1 bg-black text-white text-sm hover:bg-black/80 font-black py-2.5 rounded-xl disabled:opacity-40 transition-all">
                  {editingId ? 'Update' : 'Publish'}
                </button>
                {editingId && (
                  <button type="button" onClick={cancelEdit} className="bg-black/10 text-black text-sm hover:bg-black/20 font-black px-4 rounded-xl transition-all">Cancel</button>
                )}
              </div>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: MANAGE PRODUCTS */}
        <div className={`w-full lg:w-7/12 ${panelClass} flex flex-col max-h-[85vh]`}>
          <h2 className="text-xl font-black text-black mb-4 shrink-0">Manage Products</h2>
          
          <div className="space-y-3 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-black/[0.03] rounded-2xl border border-black/[0.06] hover:border-black/15 transition-all gap-3">
                
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-10 h-10 object-cover rounded-lg bg-white border border-black/5 p-0.5 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-black text-sm truncate">{product.title}</h3>
                    <p className="text-[10px] text-black/50 font-bold uppercase tracking-widest truncate">{product.category}</p>
                  </div>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => handleEditClick(product)} className="bg-black/5 hover:bg-black/10 text-black/60 hover:text-black px-3 py-1.5 text-xs rounded-lg font-bold transition-all border border-transparent hover:border-black/10">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600 px-3 py-1.5 text-xs rounded-lg font-bold transition-all border border-transparent hover:border-red-500/20">
                    Delete
                  </button>
                </div>

              </div>
            ))}
            {products.length === 0 && <p className="text-black/30 font-bold text-sm italic">No products found.</p>}
          </div>
        </div>

      </div>
    </div>
  )
}