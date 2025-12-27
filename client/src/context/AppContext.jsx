import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [credit, setCredit] = useState(0);

    const navigate = useNavigate();
    const backendUrl = https://phonix-backend.onrender.com;

    const loadCreditData = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/user/credits",
                { headers: { token } } // ✅ no Bearer, just token
            );

            if (data.success) {
                setCredit(data.credits);
                setUser(data.user);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (token) {
            loadCreditData();
        }
    }, [token]);

    const generateImage = async (prompt) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/image/generate-image",
                { prompt },
                { headers: { token } } // ✅ no Bearer
            );

            if (data.success) {
                loadCreditData();
                return data.resultImage;
            } else {
                toast.error(data.message);
                loadCreditData();
                if (data.creditBalance === 0) {
                    navigate("/buycredit");
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
        setCredit(0);
    };

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit,
        loadCreditData,
        logout,
        generateImage,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
