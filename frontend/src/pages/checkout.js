// CheckoutPage.js
import React, { useContext, useState } from "react";
import "./checkout.css";
import { shopContext } from "../context/shopcontext";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const { allProduct, cartItem } = useContext(shopContext);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const getCartData = () => {
    return allProduct
      .filter((product) => {
        const quantity = cartItem[product.id] || 0;
        return quantity > 0;
      })
      .map((product) => ({
        id: product.id,
        name: product.name,
        email: product.email,
        quantity: cartItem[product.id],
        price: product.new_price,
        image: product.image,
      }));
  };

  const [orderDetails, setOrderDetails] = useState({
    user: localStorage.getItem("user-name"),
    name: "",
    lname: "",
    email: "",
    contact: "",
    payment: "",
    address: "",
    cartdata: getCartData(),
    status: false,
  });

  const changeHandler = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const addOrder = async () => {
    const order = { ...orderDetails, cartdata: getCartData() };

    try {
      const response = await fetch("http://127.0.0.1:5000/addorder", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();
      data.success ? alert("Order Added") : alert("Failed to add order");
    } catch (error) {
      console.error("Order upload failed:", error);
    }
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    if (Array.isArray(allProduct) && cartItem) {
      allProduct.forEach((product) => {
        const quantity = cartItem[product.id] || 0;
        if (quantity > 0) {
          subtotal += quantity * product.new_price;
        }
      });
    }
    return subtotal;
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setOrderDetails({ ...orderDetails, payment: method.name });
  };

  const handlePayment = () => {
    if (selectedPaymentMethod) {
      alert(`Proceeding with ${selectedPaymentMethod.name}`);
      return true;
    } else {
      alert("Please select a payment method and Save The Data");
      return false;
    }
  };

  return (
    <div className="checkout">
      <div className="checkout-header-left">
        <h1>Customer Information</h1>
      </div>
      <div className="checkout-details-left">
        <form>
          <div>
            <p>Enter First Name</p>
            <input
              type="text"
              name="name"
              value={orderDetails.name}
              onChange={changeHandler}
              required
            />
          </div>
          <div>
            <p>Enter Last Name</p>
            <input
              type="text"
              name="lname"
              value={orderDetails.lname}
              onChange={changeHandler}
              required
            />
          </div>
          <div>
            <p>Enter Email</p>
            <input
              type="email"
              name="email"
              value={orderDetails.email}
              onChange={changeHandler}
              required
            />
          </div>
          <div>
            <p>Enter Contact No</p>
            <input
              type="text"
              name="contact"
              value={orderDetails.contact}
              onChange={changeHandler}
              required
            />
          </div>
          <div>
            <p>Enter Permanent Address</p>
            <input
              type="text"
              name="address"
              value={orderDetails.address}
              onChange={changeHandler}
              required
            />
          </div>
        </form>
      </div>
      <div className="checkout-paymentInfo-left">
        <h1>Payment Information</h1>
        <br />
        <div className="checkout-data-left">
          <form>
            <div className="checkout-paymentoption-left">
              <input
                type="radio"
                id="credit-card"
                name="payment-method"
                onChange={() =>
                  handlePaymentMethodChange({
                    id: "credit-card",
                    name: "Credit/Debit Card",
                  })
                }
                required
              />
              <label htmlFor="credit-card">Credit/Debit Card</label>
              <br />
              <input
                type="radio"
                id="paypal"
                name="payment-method"
                onChange={() =>
                  handlePaymentMethodChange({ id: "paypal", name: "UPI Payments" })
                }
                required
              />
              <label htmlFor="paypal">UPI Payments</label>
              <br />
              <input
                type="radio"
                id="bank-transfer"
                name="payment-method"
                onChange={() =>
                  handlePaymentMethodChange({
                    id: "bank-transfer",
                    name: "Bank Transfer",
                  })
                }
                required
              />
              <label htmlFor="bank-transfer">Bank Transfer</label>
              <br />
              <input
                type="radio"
                id="cash-on-delivery"
                name="payment-method"
                onChange={() =>
                  handlePaymentMethodChange({
                    id: "cash-on-delivery",
                    name: "Cash on Delivery",
                  })
                }
                required
              />
              <label htmlFor="cash-on-delivery">Cash on Delivery</label>
              <br />
            </div>
          </form>
        </div>
      </div>
      <div className="checkout-amount-down">
        <h1>Order Summary</h1>
        <div className="checkout-format-down">
          <p>Products</p>
          <p>Title</p>
          <p>Quantity</p>
          <p>Total</p>
        </div>
        {Array.isArray(allProduct) &&
          allProduct.map((product) => {
            const quantity = cartItem[product.id] || 0;
            if (quantity > 0) {
              return (
                <div key={product.id} className="cartitems-format-down">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="carticon-product-icon"
                  />
                  <p>{product.name}</p>
                  <button className="cartitems-quantity-down">{quantity}</button>
                  <p>${(quantity * product.new_price).toFixed(2)}</p>
                </div>
              );
            }
            return null;
          })}
      </div>
      <br />
      <div className="checkout-downside">
        {selectedPaymentMethod ? (
          <Link
            to={{ pathname: "/payment", state: { subtotal: calculateSubtotal().toFixed(2) } }}
          >
            <button type="button" className="submit-button" onClick={addOrder}>
              Save And Pay ${calculateSubtotal().toFixed(2)}
            </button>
          </Link>
        ) : (
          <button type="button" className="submit-button" onClick={handlePayment}>
            Save And Pay ${calculateSubtotal().toFixed(2)}
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
