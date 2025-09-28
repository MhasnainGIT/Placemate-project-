import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles = ['recruiter'] }) => {
    const { user } = useSelector(store => store.auth);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        if (roles && roles.length > 0 && !roles.includes(user.role)) {
            navigate("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <>
        {children}
        </>
    )
};
export default ProtectedRoute;