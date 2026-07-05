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
        <div className="min-h-screen flex bg-gray-50 w-full">

            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="hidden lg:block w-72 xl:w-80 bg-white shadow-md border-r flex-shrink-0">
                <UserProfileSidebar user={user} logout={logout} />
            </aside>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 min-w-0 w-full overflow-hidden p-4 sm:p-6">

                {/* ✅ If desktop → always show outlet */}
                {/* ✅ If mobile → show dashboard only when on /profile */}

                {isRoot && (
                    <div className="lg:hidden w-full min-w-0">
                        <UserProfileMobileDashboard user={user} logout={logout} />
                    </div>
                )}

                {/* Nested pages (Orders, Edit, Addresses, Wishlist...) */}
                <div className="w-full min-w-0">
                    <Outlet />
                </div>


            </div>
        </div>
    );
};

export default UserProfileLayout;
