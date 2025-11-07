// frontend/src/pages/User/UserProfile/AddressManagement.jsx
import React, { useState } from 'react';
import { FiMapPin, FiPlus, FiSave, FiEdit, FiTrash2, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const initialAddressState = { name: '', phone: '', address: '', city: '', pincode: '', isDefault: false };

const AddressManagement = () => {
    const { user, fetchUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(null); // null for new, ID for editing existing
    const [currentAddress, setCurrentAddress] = useState(initialAddressState);

    const handleEdit = (address) => {
        setEditMode(address._id);
        setCurrentAddress(address);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        setLoading(true);
        try {
            const newAddresses = user.addresses.filter(addr => addr._id !== id);
            await updateAddresses(newAddresses);
            toast.success("Address deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete address.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleSetDefault = async (id) => {
        setLoading(true);
        try {
            const newAddresses = user.addresses.map(addr => ({
                ...addr,
                isDefault: addr._id === id
            }));
            await updateAddresses(newAddresses);
            toast.success("Default address set successfully!");
        } catch (error) {
            toast.error("Failed to set default address.");
        } finally {
            setLoading(false);
        }
    }

    const updateAddresses = async (addresses) => {
        const { data } = await axios.put('/api/users/profile', { addresses });
        // The fetchUser call re-fetches the user model which contains the addresses
        await fetchUser(localStorage.getItem('userToken'));
        return data;
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let newAddresses;

            if (editMode) {
                // Editing existing address
                newAddresses = user.addresses.map(addr => 
                    // addr._id === editMode ? currentAddress : addr
                    addr._id === editMode ? { ...currentAddress, _id: addr._id } : addr

                );
            } else {
                // Adding new address
                // newAddresses = [...user.addresses, { ...currentAddress, _id: Date.now().toString() }]; // Mock ID for frontend rendering
                newAddresses = [...user.addresses, { ...currentAddress }];

            }

            await updateAddresses(newAddresses);
            toast.success(editMode ? "Address updated!" : "New address added successfully!");
            setEditMode(null);
            setCurrentAddress(initialAddressState);
        } catch (error) {
            toast.error("Failed to save address.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
                    <FiMapPin className="w-6 h-6 text-primary-600" />
                    <span>Manage Shipping Addresses ({user.addresses?.length || 0})</span>
                </h1>
                <button onClick={() => navigate('/profile')} className="text-primary-600 flex items-center space-x-1 font-medium hover:text-primary-700">
                    <FiArrowLeft /> <span>Back to Profile</span>
                </button>
            </div>

            {/* Address Form (Add/Edit) */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 border-b pb-4 mb-4">
                    {editMode ? 'Edit Address' : 'Add New Address'}
                </h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className='grid md:grid-cols-2 gap-4'>
                        <input type="text" name="name" value={currentAddress.name} onChange={(e) => setCurrentAddress({...currentAddress, name: e.target.value})} placeholder="Recipient Name" required className="input-field" />
                        <input type="tel" name="phone" value={currentAddress.phone} onChange={(e) => setCurrentAddress({...currentAddress, phone: e.target.value})} placeholder="Recipient Phone" required className="input-field" />
                    </div>
                    <textarea name="address" value={currentAddress.address} onChange={(e) => setCurrentAddress({...currentAddress, address: e.target.value})} placeholder="Full Address Line" rows="2" required className="input-field"></textarea>
                    <div className='grid md:grid-cols-2 gap-4'>
                        <input type="text" name="city" value={currentAddress.city} onChange={(e) => setCurrentAddress({...currentAddress, city: e.target.value})} placeholder="City/Town" required className="input-field" />
                        <input type="text" name="pincode" value={currentAddress.pincode} onChange={(e) => setCurrentAddress({...currentAddress, pincode: e.target.value})} placeholder="Pincode" required className="input-field" />
                    </div>
                    
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" name="isDefault" checked={currentAddress.isDefault} onChange={(e) => setCurrentAddress({...currentAddress, isDefault: e.target.checked})} className="w-4 h-4 text-primary-600 rounded" />
                        <span className="text-gray-700">Set as Default Address</span>
                    </label>

                    <div className="flex justify-end space-x-3 pt-4">
                        {editMode && (
                            <button type="button" onClick={() => { setEditMode(null); setCurrentAddress(initialAddressState); }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium flex items-center space-x-2">
                                <FiX /> <span>Cancel Edit</span>
                            </button>
                        )}
                        <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2 disabled:opacity-50">
                            <FiSave />
                            <span>{editMode ? (loading ? 'Updating...' : 'Update Address') : (loading ? 'Adding...' : 'Add Address')}</span>
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Address List */}
            <h2 className="text-2xl font-semibold text-gray-900 border-b pb-4 mb-4">Saved Addresses</h2>
            <div className="space-y-4">
                {user.addresses?.length === 0 ? (
                    <p className="text-gray-500 p-4 bg-white rounded-xl shadow-md">No saved addresses found. Please add one above.</p>
                ) : (
                    user.addresses.map(addr => (
                        <div key={addr._id} className={`bg-white p-5 rounded-xl shadow-md flex justify-between items-center ${addr.isDefault ? 'border-2 border-primary-600' : 'border border-gray-200'}`}>
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-1">
                                    <p className="font-bold text-lg text-gray-900">{addr.name}</p>
                                    {addr.isDefault && (
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium flex items-center space-x-1">
                                            <FiCheckCircle className="w-3 h-3" /> <span>DEFAULT</span>
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-700">{addr.address}, {addr.city}, {addr.pincode}</p>
                                <p className="text-gray-500 text-sm">Phone: {addr.phone}</p>
                            </div>
                            
                            <div className="flex space-x-3">
                                {!addr.isDefault && (
                                    <button onClick={() => handleSetDefault(addr._id)} disabled={loading} className="text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-50">
                                        Set Default
                                    </button>
                                )}
                                <button onClick={() => handleEdit(addr)} disabled={loading} className="text-blue-600 hover:text-blue-700 disabled:opacity-50">
                                    <FiEdit className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDelete(addr._id)} disabled={loading} className="text-red-600 hover:text-red-700 disabled:opacity-50">
                                    <FiTrash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default AddressManagement;