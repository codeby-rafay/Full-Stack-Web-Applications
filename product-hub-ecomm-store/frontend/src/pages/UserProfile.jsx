import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";
import { User, Mail, Phone, Trash2, Save, AlertTriangle } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { toast, Slide } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

// Zod Schema
const profileSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length === 0 || /^(?:\+92\d{10}|0\d{10})$/.test(val),
      {
        message:
          "Phone number must be either +92 followed by 10 digits or 0 followed by 10 digits",
      },
    ),
  gender: z.enum(["male", "female", "other"]).optional().or(z.literal("")),
});

// Convert Zod errors to Formik errors
const validate = (values) => {
  try {
    profileSchema.parse(values);
    return {};
  } catch (error) {
    const errors = {};
    error.issues.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return errors;
  }
};

function UserProfile() {
  const { currentUser, authReady, logout, login } = useShop();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (!currentUser) {
      navigate("/login");
    }
  }, [authReady, currentUser, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/auth/profile");
        setProfileData(res.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Could not load profile. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          transition: Slide,
        });
      } finally {
        setLoading(false);
      }
    };

    if (authReady && currentUser) {
      fetchProfile();
    }
  }, [authReady, currentUser]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = { fullName: values.fullName.trim() };
      if (values.phone && values.phone.trim().length > 0) {
        payload.phone = values.phone.trim();
      }
      if (values.gender) {
        payload.gender = values.gender;
      }

      const res = await axiosInstance.put("/auth/profile", payload);

      // Update localStorage so navbar reflects the new name immediately
      const updatedUser = { ...currentUser, fullName: res.data.user.fullName };
      login(updatedUser, null, { refreshFromCookie: false });

      // Also update local state so avatar letter updates
      setProfileData((prev) => ({
        ...prev,
        fullName: res.data.user.fullName,
        phone: res.data.user.phone,
        gender: res.data.user.gender,
      }));

      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      // If backend returned validation errors array, show them concisely
      const validationErrors = error.response?.data?.errors;
      const message =
        (validationErrors && validationErrors.map((e) => e.msg).join(", ")) ||
        error.response?.data?.message ||
        "Error updating profile.";

      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await axiosInstance.delete("/auth/delete-account");

      await logout();

      toast.info("Your account has been deleted.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });

      navigate("/signup");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.response?.data?.message || "Error deleting account.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (!authReady || !currentUser) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-500">
            {" "}
            <span className="text-black">My</span> Profile
          </h1>
          <p className="text-md text-gray-500 mt-1">
            Manage your personal information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Avatar Section */}
          <div className="bg-linear-to-r from-orange-400 to-orange-500 px-6 py-8 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white text-orange-500 flex items-center justify-center font-bold text-2xl uppercase shadow">
              {profileData?.fullName?.charAt(0) ||
                currentUser.fullName?.charAt(0) ||
                "?"}
            </div>
            <div>
              <p className="text-white font-semibold text-lg leading-tight">
                {profileData?.fullName || currentUser.fullName || "Loading..."}
              </p>
              <p className="text-white text-sm">
                {profileData?.email || currentUser.email}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-6">
            {loading ? (
              // Skeleton loader while fetching profile
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <Formik
                initialValues={{
                  fullName: profileData?.fullName || "",
                  phone: profileData?.phone || "",
                  gender: profileData?.gender || "",
                }}
                validate={validate}
                onSubmit={handleSubmit}
                enableReinitialize // re-populate form if profileData loads after mount
              >
                {({ isSubmitting, isValid, dirty }) => (
                  <Form className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="fullName-input"
                        className="block text-sm font-medium text-gray-900 mb-1"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <User
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <Field
                          type="text"
                          name="fullName"
                          id="fullName-input"
                          placeholder="Your full name"
                          className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                        />
                      </div>
                      <ErrorMessage
                        name="fullName"
                        component="p"
                        className="text-red-500 text-xs mt-2 ml-1"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email-input"
                        className="block text-sm font-medium text-gray-900 mb-1"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                        />
                        <input
                          type="email"
                          id="email-input"
                          value={profileData?.email || currentUser.email || ""}
                          readOnly
                          className="w-full pl-9 pr-4 py-3 border border-gray-100 rounded-xl text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Phone Number (optional) */}
                    <div>
                      <label
                        htmlFor="phone-input"
                        className="block text-sm font-medium text-gray-900 mb-1"
                      >
                        Phone Number
                        <span className="ml-2 text-xs text-gray-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <div className="relative">
                        <Phone
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <Field
                          type="tel"
                          name="phone"
                          id="phone-input"
                          placeholder="e.g. +92 300 1234567"
                          autoComplete="tel"
                          className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                        />
                      </div>
                      <ErrorMessage
                        name="phone"
                        component="p"
                        className="text-red-500 text-xs mt-2 ml-1"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Adding a phone number is optional
                      </p>
                    </div>

                    {/* Gender*/}
                    <div>
                      <label
                        htmlFor="gender-input"
                        className="block text-sm font-medium text-gray-900 mb-3"
                      >
                        Gender
                        <span className="ml-2 text-xs text-gray-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Field
                            type="radio"
                            name="gender"
                            value="male"
                            id="gender-input"
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className="text-sm text-gray-700">Male</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Field
                            type="radio"
                            name="gender"
                            value="female"
                            id="gender-input"
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className="text-sm text-gray-700">Female</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Field
                            type="radio"
                            name="gender"
                            value="other"
                            id="gender-input"
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className="text-sm text-gray-700">Other</span>
                        </label>
                      </div>
                      <ErrorMessage
                        name="gender"
                        component="p"
                        className="text-red-500 text-xs mt-2 ml-1"
                      />
                    </div>

                    {/* Save Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !(isValid && dirty)}
                      className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>

        {/* Delete Account */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
          <div className="px-6 py-5">
            <div className="flex items-start gap-3">
              <div className="bg-red-100 p-2 rounded-lg mt-0.5">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  Delete Account
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Once deleted, you will be logged out and won't be able to
                  login with this account. You can register again with the same
                  email to create a new account.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="mt-4 w-full flex items-center justify-center gap-2 border border-red-500 text-red-500 hover:bg-red-50 font-bold py-2.5 rounded-xl text-sm transition-all active:scale-95 cursor-pointer"
            >
              <Trash2 size={15} />
              Delete My Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 px-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-scale-in">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="bg-red-100 p-3 rounded-full">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Delete Account?
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Are you sure you want to delete your account? You will be logged
                out immediately. You can register again with the same email
                anytime.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg text-white border bg-orange-500 border-gray-200 text-sm font-bold hover:bg-orange-600 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all active:scale-95 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
