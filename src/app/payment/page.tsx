// app/payment/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import axios from "axios";

const stripePromise = loadStripe('pk_test_51R4XMeQOwHpTtH5M4Nx7cM5CPo9ijIIManQ3RcbJxrFoO0XY6buEtqlc7jrShCWDfT59iEET70X3yy5KTrTVAnK700aMF2KasM'); 

const PaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        'http://localhost:8080/user/payment/create-checkout-session',
        {
          orderNumber: "1741605018485",
          payMethod: 1,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      const { sessionId } = response.data;
      console.log(sessionId);
      // 检查 stripe 是否已加载
      const stripe = await stripePromise;
      if (!stripe) {
        console.error('Stripe failed to load.');
        return;
      }
  
      // 调用 redirectToCheckout
      const { error } = await stripe.redirectToCheckout({ sessionId });
  
      if (error) {
        console.error('Payment error:', error);
      }
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Checkout Page</h1>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default PaymentPage;
