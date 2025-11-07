// frontend/src/components/User/UserProfileMobileDashboard.jsx

import { Link } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiMapPin, FiHeart, FiShoppingBag, FiLogOut, FiEdit3 } from "react-icons/fi";

const UserProfileMobileDashboard = ({ user, logout }) => {

  const defaultAddress = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];

  return (
    <div className="space-y-6 hidden">

      {/* Header */}
      <h1 className="text-3xl font-bold flex items-center space-x-2">
        <FiUser className="text-primary-600" />
        <span>My Account</span>
      </h1>

      {/* Personal Info */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">Personal Details</h2>

        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>

        <Link to="/profile/edit" className="text-primary-600 mt-2 inline-flex items-center">
          <FiEdit3 className="mr-1" /> Edit Profile
        </Link>
      </div>

      {/* Default Address */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">Default Address</h2>

        {defaultAddress ? (
          <>
            <p>{defaultAddress.name} - {defaultAddress.phone}</p>
            <p>{defaultAddress.address}, {defaultAddress.city} - {defaultAddress.pincode}</p>

            <Link to="/profile/addresses" className="text-primary-600 mt-2 inline-block">
              Manage Addresses
            </Link>
          </>
        ) : (
          <Link to="/profile/addresses" className="text-primary-600">
            Add Address
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <Link className="block bg-primary-600 text-white p-4 rounded-xl" to="/profile/orders">
          <FiShoppingBag className="inline mr-2" /> My Orders
        </Link>

        <Link className="block bg-white p-4 rounded-xl border" to="/wishlist">
          <FiHeart className="inline mr-2 text-red-500" /> Wishlist
        </Link>

        <button className="block bg-red-100 text-red-700 p-4 rounded-xl w-full" onClick={logout}>
          <FiLogOut className="inline mr-2" /> Sign Out
        </button>
      </div>

    </div>
  );
};

export default UserProfileMobileDashboard;
