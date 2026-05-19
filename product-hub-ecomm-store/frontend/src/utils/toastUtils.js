import { toast, Slide } from "react-toastify";

export const addtocartToast = () => {
  toast.success("Product Added to Cart!", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    theme: "dark",
    transition: Slide,
  });
};

export const saveToast = () => {
  toast.success("Product Saved!", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    theme: "dark",
    transition: Slide,
  });
};

export const unsaveToast = () => {
  toast.success("Product Removed!", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    theme: "dark",
    transition: Slide,
  });
};

export const FillAllFieldsToast = () => {
  toast.error("Please fill in all fields", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    transition: Slide,
  });
};

export const EnterValidEmailToast = () => {
  toast.error("Please enter a valid Email", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    transition: Slide,
  });
};

export const DeleteRecordToast = () => {
  toast.success("Record deleted successfully", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    transition: Slide,
  });
};

export const Welcometoast = (user) => {
  toast.success(`Welcome, ${user.fullName}!`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    transition: Slide,
  });
};

export const PasswordLengthToast = () => {
  toast.error("Password must be at least 6 characters", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    transition: Slide,
  });
};

export const PasswordNotMatchToast = () => {
  toast.error("Passwords do not match", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    transition: Slide,
  });
};

export const LogoutToast = () => {
  toast.success("You have been signed out.", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    transition: Slide,
  });
};

export const DeleteOrderToast = () => {
  toast.success("Order deleted successfully", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    transition: Slide,
  });
};

export const FailedToLoadOrdersToast = () => {
  toast.error("Failed to load orders", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    transition: Slide,
  });
};

export const SessionExpiredToast = () => {
  toast.error("Session expired. Please login again.", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    transition: Slide,
  });
};
