import { useState } from "react";
import runningCap from "../assets/merch/running-cap.png";
import hoodie from "../assets/merch/hoodie.png";
import featuredTee from "../assets/merch/ft.png";
import api from "../api/axios";
import { Toaster, toast } from "react-hot-toast";



export default function Merchandise() {
  const [selectedSize, setSelectedSize] = useState("M");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderData, setOrderData] = useState({
  name: "",
  email: "",
  phone: "",
});
const [loading, setLoading] = useState(false);
const [showSuccessModal, setShowSuccessModal] = useState(false);

const handlePayment = async () => {

  if (orderData.phone.length !== 10) {
  toast.error("Phone number must be exactly 10 digits.");
  return;
}
setLoading(true);   

  try {
    // Validate form
    if (!orderData.name || !orderData.email || !orderData.phone) {
     toast.error("Please fill in all details.");
      return;
    }

    // Create Razorpay order
 const { data: order } = await api.post(
  "/api/orders/create",
  {
    name: orderData.name,
    email: orderData.email,
    phone: orderData.phone,
    size: selectedSize,
    product: "Community Collection 01",
  }
);

    const options = {
  key: "rzp_test_TEwYR3CV4dUmLp",
  amount: order.amount,
  currency: order.currency,
  name: "IXG Run Club",
  description: "Community Collection 01",

  order_id: order.id,

  prefill: {
    name: orderData.name,
    email: orderData.email,
    contact: orderData.phone,
  },

  theme: {
    color: "#f97316",
  },
handler: async function (response) {
  try {
  const verify = await api.post(
    "/api/orders/verify",
    {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      orderId: order.orderId,
    }
  );

    if (verify.data.success) {
      setShowOrderModal(false);
      setShowSuccessModal(true);

      setOrderData({
        name: "",
        email: "",
        phone: "",
      });

      console.log("Payment Verified ✅");
    } else {
      toast.error("Payment verification failed.");
    }
  } catch (error) {
    console.error("Verification Error:", error.response?.data || error);
    toast.error("Payment verification failed.");
  }
},
}



const razorpay = new window.Razorpay(options);

razorpay.open();
setLoading(false);   
  } catch (error) {
    console.error(error);
    toast.error("Unable to start payment.");
    setLoading(false);   // ← add this line
  }
};

const sizes = ["S", "M", "L", "XL"];
  const products = [
   
    {
      name: "IXG Running Cap",
      description: "Lightweight, adjustable, sweat-resistant.",
      price: 499,
      rating: 4,
      image: runningCap,
      isNew: false,
    },
    {
      name: "IXG Hoodie",
      description: "Soft fleece for post-run coffee runs.",
      price: 1299,
      rating: 5,
      image: hoodie,
      isNew: false,
    },
  ];


  return (
    <section
      id="merchandise"
      className="bg-white px-6 py-20 lg:px-8"
    >
      <Toaster position="top-right" />
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-800">
              Merchandise
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Wear The Community.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-gray-500 sm:text-lg">
            Represent IXG Run Club wherever you go. Designed for runners.
            Built for everyday comfort.
          </p>
        </div>

          {/* Featured Product */}
        <div className="mt-24 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Featured Image */}
          <div className="group relative overflow-hidden rounded-[32px] bg-gradient-to-br from-gray-100 to-white p-4 shadow-2xl transition-all duration-500 hover:shadow-blue-200/50">
            <img
              src={featuredTee}
              alt="Limited Edition Community Tee"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-2xl object-cover transition-all duration-700 group-hover:scale-110"
            />
          </div>

          {/* Featured Content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Featured
              </span>
            </div>
            <div className="mt-4 ml-2.5 inline-flex rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
  Community Collection 01
</div>

            <h3 className="mt-5 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Limited Edition Community Tee
            </h3>

           <div className="mt-6 space-y-4">

  <p className="text-lg leading-relaxed text-gray-600">
    Community Collection 01 is our first premium apparel drop,
    created exclusively for the IXG Run Club community.
  </p>

  <div className="space-y-3">

   <div className="mt-8 space-y-5 border-t border-gray-200 pt-8">

  <div className="flex justify-between">
    <span className="text-gray-500">Material</span>
    <span className="font-semibold text-gray-900">
      Heavyweight Cotton
    </span>
  </div>

  <div className="flex justify-between">
    <span className="text-gray-500">Fit</span>
    <span className="font-semibold text-gray-900">
      Oversized
    </span>
  </div>

  <div className="flex justify-between">
    <span className="text-gray-500">Collection</span>
    <span className="font-semibold text-gray-900">
      Community Collection 01
    </span>
  </div>

  <div className="flex justify-between">
    <span className="text-gray-500">Availability</span>
    <span className="font-bold text-blue-800">
      Limited First Drop
    </span>
  </div>

</div>
  </div>

</div>

            <p className="mt-6 text-3xl font-extrabold text-gray-900">
              ₹599
            </p>
            <div className="mt-8">
  <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
    Select Size
  </p>

  <div className="flex gap-3">
    {sizes.map((size) => (
      <button
        key={size}
        onClick={() => setSelectedSize(size)}
        className={`h-12 w-12 rounded-full border text-sm font-semibold transition ${
          selectedSize === size
            ? "border-blue-800 bg-blue-800 text-white"
            : "border-gray-300 bg-white text-gray-900 hover:border-blue-800"
        }`}
      >
        {size}
      </button>
    ))}
  </div>
</div>

           <button
  onClick={() => setShowOrderModal(true)}
  className=" mt-4 group inline-flex items-center gap-2 rounded-full bg-gray-700 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-gray-500"
>
 Buy Now

  <span className="transition-transform duration-300 group-hover:translate-x-1">
    →
  </span>
</button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.name}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/70"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {product.isNew && (
                  <span className="absolute left-4 top-4 rounded-full bg-blue-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
                    New
                  </span>
                )}

                
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col p-5">
               

                <h3 className="mt-2 text-base font-semibold text-gray-900">
                  {product.name}
                </h3>

                <p className="mt-6 text-xl font-black text-gray-400">
                  {product.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-gray-900">
                    ₹{product.price}
                  </span>
                </div>

                <button
                  type="button"
                  className="mt-4 inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Coming Soon
                </button>
              </div>
            </div>
          ))}
        </div>

              

       
      </div>

      {showOrderModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">
          Community Collection 01
        </h3>

        <button
          onClick={() => setShowOrderModal(false)}
          className="text-2xl text-gray-500 hover:text-black"
        >
          ×
        </button>
      </div>

      <p className="mt-3 text-gray-500">
        You're ordering:
      </p>

      <div className="mt-5 rounded-2xl bg-gray-100 p-4">
        <div className="flex justify-between">
          <span>Limited Edition Tee</span>

          <p className="mt-2 text-sm text-gray-500">
  Selected Size: <span className="font-semibold text-gray-900">{selectedSize}</span>
</p>
        </div>

        <div className="mt-3 flex justify-between text-xl font-bold">
          <span>Total</span>

          <span>₹599</span>
        </div>
      </div>
<div className="mt-8 space-y-4">

  <input
    type="text"
    placeholder="Full Name"
    value={orderData.name}
    onChange={(e) =>
      setOrderData({
        ...orderData,
        name: e.target.value,
      })
    }
    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-gray-500 focus:outline-none"
  />

  <input
    type="email"
    placeholder="Email Address"
    value={orderData.email}
    onChange={(e) =>
      setOrderData({
        ...orderData,
        email: e.target.value,
      })
    }
    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-gray-500 focus:outline-none"
  />

  <input
  type="tel"
  placeholder="Phone Number"
  maxLength={10}
  value={orderData.phone}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    setOrderData({
      ...orderData,
      phone: value,
    });
  }}
    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-gray-500 focus:outline-none"
  />

<button
  type="button"
  onClick={handlePayment}
  disabled={loading}
  className="inline-flex w-full items-center justify-center rounded-full bg-gray-500 px-8 py-4 font-semibold text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Processing..." : "Continue to Payment"}
</button>
</div>

    </div>
  </div>
)}
{showSuccessModal && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <span className="text-4xl text-green-600">✓</span>
      </div>

      <h2 className="mt-6 text-3xl font-bold text-gray-900">
        Order Confirmed
      </h2>

      <p className="mt-4 text-gray-500">
        Thank you for supporting
        <span className="font-semibold text-gray-900">
          {" "}IXG Run Club.
        </span>
      </p>

      <div className="mt-8 rounded-2xl bg-gray-100 p-5 text-left">

        <div className="flex justify-between">
          <span className="text-gray-500">Product</span>
          <span className="font-semibold">
            Community Collection 01
          </span>
        </div>

        <div className="mt-3 flex justify-between">
          <span className="text-gray-500">Size</span>
          <span className="font-semibold">
            {selectedSize}
          </span>
        </div>

        <div className="mt-3 flex justify-between">
          <span className="text-gray-500">Amount</span>
          <span className="font-bold">
            ₹599
          </span>
        </div>

      </div>

      <p className="mt-6 text-sm text-gray-500">
        We'll contact you shortly on WhatsApp with your order details.
      </p>

      <button
        onClick={() => setShowSuccessModal(false)}
        className="mt-8 w-full rounded-full bg-gray-900 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Continue to IXG 
      </button>

    </div>
  </div>
)}
    </section>
  );
}