import React, {useContext, useEffect, useState} from "react";
import {User} from "@/lib/types";
import api from "@/lib/api";
import {useRouter} from "next/navigation";

interface AuthContextType {
    user: User|null;
    loading: boolean;
    hydrated: boolean;
    login: (accessToken: string,refreshToken:string,userData:User) => void;
    updateUser:(userData:User) => void;
    logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}:{children:React.ReactNode}) {
    const [user,setUser]=useState<User|null>(null)
    const [loading,setLoading]=useState<boolean>(false);
    const [hydrated,setHydrated]=useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            setHydrated(true);

            const access_token = localStorage.getItem("access_token");
            if (access_token) {
                setLoading(true);
                try {
                    const res = await api.get<User>("/v1/auth/profile/")
                    setUser(res.data);
                }catch(err){
                    console.log("Error loading user data:", err);
                    localStorage.clear()
                }finally{
                    setLoading(false);
                }
            }
        }
        loadUser();
    }, []);

    const login = (accessToken: string, refreshToken: string, userData: User) => {
        localStorage.setItem("access_token", accessToken)
        localStorage.setItem("refresh_token", refreshToken)
        localStorage.setItem("user_data", JSON.stringify(userData))
        setUser(userData)
    }

    const updateUser = (userData: User) => {
        setUser(userData)
        localStorage.setItem("user_data", JSON.stringify(userData))
        console.log("Update user:", userData)
    }

    const logout = () => {
        localStorage.clear()
        setUser(null)
        router.push("/login")
    }

    return <AuthContext.Provider value={{user,loading,hydrated,login,updateUser,logout}}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within useAuthProvider");
    }
    return context;
}




