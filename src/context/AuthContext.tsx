import { createContext, useEffect, useState } from "react";
import { getUser } from "../services/auth.service";
    
export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem("token");

        if(!token) {
            setLoading(false);
            return;
        }

        try {
            const userData = await getUser();
            setUser(userData.data);
        } catch (error) {
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    }

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{user,setUser,logout}}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

 