// frontend/src/pages/User/UserProfileLayout.jsx
import { useLocation } from "react-router-dom";
// import UserProfileSidebar from "../../components/User/UserProfileSidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserProfileSidebar from "../../components/User/UserProfileSidebar";
import UserProfileMobileDashboard from "../../components/User/UserProfileMobileDashboard";

const UserProfileLayout = () => {
    const { user, logout } = useAuth();
    const { pathname } = useLocation();

    const isRoot = pathname === "/profile";

    return (
        <div className="min-h-screen flex bg-gray-50">

            {/* --- DESKTOP SIDEBAR --- */}
            <div className="hidden lg:block w-80 bg-white shadow-md border-r">
                {/* <UserProfileSidebar user={user} logout={logout} /> */}
                <UserProfileSidebar user={user} logout={logout} />

            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 p-6">

                {/* ✅ If desktop → always show outlet */}
                {/* ✅ If mobile → show dashboard only when on /profile */}

                {isRoot ? (
                    <div className="lg:hidden">
                        {/* MOBILE DASHBOARD */}
                        {/* <UserProfileMobileDashboard user={user} logout={logout} /> */}
                        <UserProfileMobileDashboard user={user} logout={logout} />
                    </div>
                ) : null}

                {/* Nested pages (Orders, Edit, Addresses, Wishlist...) */}
                <div className="hidden lg:block">
                    <Outlet />
                </div>

                {/* Mobile nested routes */}
                <div className="lg:hidden">
                    <Outlet />
                </div>

            </div>
        </div>
    );
};

export default UserProfileLayout;
