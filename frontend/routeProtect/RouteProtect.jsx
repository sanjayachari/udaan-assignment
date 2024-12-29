"use client";

import { UserContext } from "@/app/context/Context";
import Loading from "@/components/ui/loading";
import { BACKEND } from "@/constant/constant";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const ProtectedRoute = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { setUserInfo } = useContext(UserContext);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const res = await axios.get(`${BACKEND}/get-user`, {
            withCredentials: true,
          });
          if (res.status === 200) {
            setUserInfo(res.data);
            setLoading(false); 
          } else {
            router.push("/login"); // Redirect to login
          }
        } catch (error) {
          router.push("/login"); // Redirect to login on error
        }
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return <Loading />; // Show a spinner or placeholder
    }

    return <WrappedComponent {...props} />;
  };
};

export default ProtectedRoute;
