import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const ProtectedAdminRoute = ({ children }) => {
  const { currentUser } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    // no user
    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }

    // optional extra safety (role check)
    if (currentUser.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== "admin") return null;

  return children;
};

export default ProtectedAdminRoute;
