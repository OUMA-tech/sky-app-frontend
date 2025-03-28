'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // 从localStorage获取token
    const token = localStorage.getItem("token");

    // 如果没有token，说明用户没有登录，重定向到登录页
    if (!token) {
      router.push("/login");
      return;
    }
    console.log(token);

  }, [router]);

  const handleLogout = () => {
    // 清除用户的登录状态（例如，删除JWT token）
    localStorage.removeItem("token"); // 假设JWT存储在localStorage
    router.push("/login"); // 登出后跳转到登录页
  };

  const handlePayment = () => {
    router.push("/payment")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        
          <div>
            <p className="text-lg font-semibold">Welcome!</p>
            <div className="mt-4">
              
              {/* Add more user details as needed */}
            </div>
            <div className="mt-4">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
            <div>
            <button
                onClick={handlePayment}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Pay
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
