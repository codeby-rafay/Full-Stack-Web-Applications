import { useEffect, useState } from "react";
import { Users, UserPlus, Trash2 } from "lucide-react";
import { toast, Slide } from "react-toastify";
import { DeleteRecordToast } from "../utils/toastUtils";
import { useAuth } from "../redux/hooks";
import { AdminPageSkeletonLoader } from "../components/SkeletonLoader";
import axiosInstance from "../utils/axiosInstance";
import DeleteConfirmationModal from "../components/ModalComponents/DeleteConfirmationModal";
import UserSearchBar from "../components/SearchbarComponents/UserSearchBar";

function AdminPage() {
  const [userData, setUserData] = useState([]);
  const [loadingUser, setLoadingUser] = useState(false);
  const [errorUser, setErrorUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser, authReady } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const filteredUserData = userData.filter((record) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      (record.email || "").toLowerCase().includes(query) ||
      (record.fullName || "").toLowerCase().includes(query) ||
      (record.phone || "").toLowerCase().includes(query) ||
      (record.gender || "").toLowerCase().includes(query)
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // get user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingUser(true);
        setErrorUser(null);

        const response = await axiosInstance.get("/auth/signup");
        const data = response.data;
        const formattedData = data.signups.map((record) => ({
          ...record,
          createdAt: formatDate(record.createdAt),
        }));
        setUserData(formattedData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorUser(error.message);
      } finally {
        setLoadingUser(false);
      }
    };

    if (!authReady || !currentUser?.id || currentUser?.role !== "admin") {
      return;
    }

    fetchUserData();
  }, [authReady, currentUser]);

  const handleSignupDelete = (id) => {
    setRecordToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;

    try {
      await axiosInstance.delete(`/auth/signup/${recordToDelete}`);

      // Refresh the signup data after deletion
      const response = await axiosInstance.get("/auth/signup");

      const data = response.data;
      const formattedData = data.signups.map((record) => ({
        ...record,
        createdAt: formatDate(record.createdAt),
      }));
      setUserData(formattedData);
      DeleteRecordToast();
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error(`Failed to delete User record. Please try again.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    } finally {
      setShowDeleteModal(false);
      setRecordToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  if (loadingUser) return <AdminPageSkeletonLoader />;

  if (errorUser)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {errorUser}</p>
      </div>
    );

  return (
    <div className="w-full bg-linear-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-3 rounded-lg">
                <Users className="text-white" size={32} />
              </div>
              <div>
                <h1
                  className="text-4xl font-bold text-gray-900"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Admin <span className="text-orange-500">Dashboard</span>
                </h1>
                <p className="text-gray-500 mt-1">Manage Users Records</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 flex-wrap md:w-auto">
              <UserSearchBar
                onSearch={setSearchQuery}
                placeholder="Search by full name or email..."
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loadingUser ? "..." : userData.length}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <UserPlus className="text-green-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <div
              className={
                "flex-1 py-4 px-6 font-semibold flex items-center justify-center gap-2 transition-all text-orange-600 bg-orange-50 border-b-2 border-orange-500"
              }
            >
              <UserPlus size={20} />
              Users Records
            </div>
          </div>

          {/* Signup Records Table */}
          {userData && (
            <div className="overflow-x-auto">
              {loadingUser ? (
                <AdminPageSkeletonLoader />
              ) : errorUser ? (
                <div className="text-center py-12">
                  <p className="text-red-500">Error: {errorUser}</p>
                </div>
              ) : filteredUserData.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {searchQuery
                      ? "No matching user records found"
                      : "No user records found"}
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Full Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Gender
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Account Status
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUserData.map((record, index) => (
                      <tr
                        key={record._id}
                        className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap font-medium">
                          {record.fullName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {record.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {record.gender || (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {record.createdAt}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {record.phone || (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {record.deletedAccount ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              Deleted
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleSignupDelete(record._id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={18} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        showDeleteModal={showDeleteModal}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleConfirmDelete}
        title={"Delete User Record"}
        description={"Are you sure you want to delete this user record?"}
        buttonLabel="Delete"
      />
    </div>
  );
}
export default AdminPage;
