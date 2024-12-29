"use client"
import { createContext, useState } from "react";

export const UserContext = createContext({});

export function UserProvider({ children }) {
    const [userInfo, setUserInfo] = useState({});
    const [userGetAll, setUserGetAll] = useState([])
    const [currentKAM,setCurrKAM] = useState({});


    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, userGetAll, setUserGetAll , currentKAM,setCurrKAM}}>
            {children}
        </UserContext.Provider>
    )
}