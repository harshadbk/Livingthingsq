import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './payment.css';

const Payment = () => {
  const location = useLocation();
  const subtotal = location.state?.subtotal || 0;

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState(subtotal);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAmount(subtotal);
  }, [subtotal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      name,
      mobile,
      amount,
      MUID: `MUIDW${Date.now()}`,
      transactionId: `T${Date.now()}`,
    };

    try {
      const response = await fetch("http://localhost:7000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result?.data?.instrumentResponse?.redirectInfo?.url) {
        window.location.href = result.data.instrumentResponse.redirectInfo.url;
      }
    } catch (error) {
      console.error("Frontend Error Details: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between h-[600px] mx-20">
      <div className="w-1/2 border-2 max-w-3xl p-6 rounded-md border-dashed border-[#6739B7]">
        <form onSubmit={handleSubmit}>
          <h2 className="text-4xl font-bold mb-6 text-[#6739B7]">Make a Payment</h2>

          <div className="mb-6">
            <label htmlFor="Name" className="block text-sm font-medium leading-6 text-gray-900">
              Name
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                id="Name"
                name="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your Name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="Mobile" className="block text-sm font-medium leading-6 text-gray-900">
              Mobile
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                id="Mobile"
                name="Mobile"
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                placeholder="Enter your Mobile number"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="Amount" className="block text-sm font-medium leading-6 text-gray-900">
              Amount
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                id="Amount"
                name="Amount"
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="Enter the Amount"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <select
                  id="currency"
                  name="currency"
                  className="h-full py-0 pl-2 text-gray-500 bg-transparent border-0 rounded-md pr-7 focus:ring-2"
                >
                  <option>INR</option>
                  <option>CAD</option>
                  <option>EUR</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#6739B7] text-white font-semibold rounded-md hover:bg-primary-dark"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
