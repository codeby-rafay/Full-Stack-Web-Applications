import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../redux/hooks";

const ProtectedAdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
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
