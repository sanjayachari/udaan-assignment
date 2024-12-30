"use client"
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserProvider({ children }) {
    const [userInfo, setUserInfo] = useState({});
    const [userGetAll, setUserGetAll] = useState([])
    const [currentKAM,setCurrKAM] = useState({});
  const [leads, setLeads] = useState([]);




    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, userGetAll, setUserGetAll , currentKAM,setCurrKAM, leads, setLeads}}>
            {children}
        </UserContext.Provider>
    )
}