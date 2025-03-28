"use client"; // 必须位于第一行
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface OrderData {
  number: string;
  currency: string;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  paymentTime: number;
}

const formatUnixTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000); // 将 Unix 时间戳转换为毫秒
  return date.toLocaleString(); // 格式化为本地日期时间
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const capitalizeFirstLetter = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Success = () => {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const token = localStorage.getItem("token");
      try {
        // 从 URL 获取支付会话 ID（客户端方式）
        const sessionId = new URLSearchParams(window.location.search).get('session_id');
        console.log(sessionId)
        if (!sessionId) {
          router.push('/payment-error?reason=no_session');
          return;
        }

        // 调用 API 验证支付
        const response = await fetch(
          `/api/user/payment/paymentDetails?session_id=${sessionId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        console.log(data.data.amount);
        if (data.code) {
          setOrder(data.data);
        } else {
          router.push(`/payment-error?reason=${data.error}`);
        }
      } catch (error) {
        router.push('/payment-error?reason=network_failure');
      }
    };

    verifyPayment();

    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      {order ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg space-y-4">
          {/* 成功图标 */}
          <div className="flex justify-center">
            <FaCheckCircle className="text-green-500 text-6xl" />
          </div>
          <h1 className="text-3xl font-semibold text-center text-gray-800">Payment success!</h1>
          <div className="space-y-2">
            {/* 使用 flexbox 对齐 */}
            <div className="flex justify-between text-lg text-gray-600">
              <span className="font-bold">Order Number:</span>
              <span>{order.number}</span>
            </div>
            <div className="flex justify-between text-lg text-gray-600">
              <span className="font-bold">Payment Status:</span>
              <span>{capitalizeFirstLetter(order.paymentStatus)}</span>
            </div>
            <div className="flex justify-between text-lg text-gray-600">
              <span className="font-bold">Payment Time:</span>
              <span>{formatUnixTimestamp(order.paymentTime)}</span>
            </div>
            <div className="flex justify-between text-lg text-gray-600">
              <span className="font-bold">Amount:</span>
              <span>{formatCurrency(order.amount, order.currency)}</span>
            </div>
            <div className="flex justify-between text-lg text-gray-600">
              <span className="font-bold">Payment Method:</span>
              <span>{capitalizeFirstLetter(order.paymentMethod)}</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-lg text-center text-gray-600">Processing Payment...</p>
      )}
    </main>
  );
}

export default Success;