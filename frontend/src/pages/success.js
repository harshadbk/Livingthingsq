import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const [loading, setLoading] = useState(true);   // State to handle loading
  const [paymentStatus, setPaymentStatus] = useState(null); // State to store payment status
  const navigate = useNavigate();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const transactionId = localStorage.getItem('transactionId');
        const response = await fetch(`http://localhost:7000/status?id=${transactionId}`);
        const result = await response.json();

        if (response.ok) {
          setPaymentStatus(result?.success ? 'success' : 'failure');
        } else {
          setPaymentStatus('failure');
        }
      } catch (error) {
        console.error('Error checking payment status:', error.message);
        setPaymentStatus('failure');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, []);

  useEffect(() => {
    if (paymentStatus === 'failure') {
      navigate('/failure');
    }
  }, [paymentStatus, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      {loading ? (
        <h2 className="text-3xl font-bold text-blue-600">Checking Payment Status...</h2>
      ) : paymentStatus === 'success' ? (
        <h2 className="text-3xl font-bold text-green-600">Payment Successful!</h2>
      ) : (
        <h2 className="text-3xl font-bold text-red-600">Payment Failed!</h2>
      )}
    </div>
  );
};

export default Success;
