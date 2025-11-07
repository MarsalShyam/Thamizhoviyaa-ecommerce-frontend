// frontend/src/pages/User/UserProfile/EditProfileForm.jsx
import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiEdit3, FiUpload, FiSave, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EditProfileForm = () => {
    const { user, fetchUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        password: '', // For changing password
        profileImage: user?.profileImage || '/images/default_user.png',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // MOCK UPLOAD: In a real app, upload this to Cloudinary/S3 and get the URL.
            // For now, we use a mock URL placeholder.
            const mockUrl = URL.createObjectURL(file);
            setFormData({ ...formData, profileImage: mockUrl });
            toast.info("Profile image set locally. (Real upload required in production)", { position: "bottom-left" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Prepare data for the API call (only send fields that were meant to be updated)
            const updateData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                profileImage: formData.profileImage,
            };
            if (formData.password) {
                // In a real app, you would require old password validation here
                updateData.password = formData.password;
            }

            const { data } = await axios.put('/api/users/profile', updateData);
            
            // Re-fetch user data to update AuthContext state across the app
            await fetchUser(localStorage.getItem('userToken')); 
            
            toast.success("Profile updated successfully!");
            navigate('/profile'); // Go back to the profile overview
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update profile.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
                    <FiEdit3 className="w-6 h-6 text-primary-600" />
                    <span>Edit Profile</span>
                </h1>
                <button onClick={() => navigate('/profile')} className="text-primary-600 flex items-center space-x-1 font-medium hover:text-primary-700">
                    <FiArrowLeft /> <span>Back to Overview</span>
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                
                {/* Image Upload Area */}
                <div className="flex items-center space-x-6 border-b pb-6">
                    <div className="relative">
                        <img 
                            src={formData.profileImage} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-primary-100 shadow-md"
                        />
                        {/* <label htmlFor="image-upload" className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                            <FiUpload className="w-4 h-4" />
                        </label> */}
                        {/* <input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} className="hidden" /> */}
                    </div>
                    <div>
                        <h3 className="font-semibold text-xl">{user?.name}</h3>
                        <p className="text-sm text-gray-500">Update your photo and personal details.</p>
                    </div>
                </div>

                {/* Profile Fields */}
                <div className='grid md:grid-cols-2 gap-6'>
                    <div>
                        <label className="input-label flex items-center mb-1"><FiUser className="w-4 h-4 mr-2 text-primary-600" /> Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field" />
                    </div>
                    <div>
                        <label className="input-label flex items-center mb-1"><FiMail className="w-4 h-4 mr-2 text-primary-600" /> Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" />
                    </div>
                    <div>
                        <label className="input-label flex items-center mb-1"><FiPhone className="w-4 h-4 mr-2 text-primary-600" /> Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="input-field" />
                    </div>
                    
                    {/* Password Change */}
                    <div>
                        <label className="input-label flex items-center mb-1"><FiLock className="w-4 h-4 mr-2 text-primary-600" /> New Password (Optional)</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" placeholder="Leave blank to keep current password" />
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2 disabled:opacity-50">
                        <FiSave />
                        <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default EditProfileForm;