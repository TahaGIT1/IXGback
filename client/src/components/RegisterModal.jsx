import React, { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function RegisterModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    inviteCode: "",
  });

  const [runs, setRuns] = useState([]);
  const [selectedRunId, setSelectedRunId] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [checkingRegistration, setCheckingRegistration] = useState(true);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadRuns = async () => {
      try {
        setCheckingRegistration(true);

        const { data } = await api.get(
          "/api/runs"
        );

        const openRuns = data.filter((run) => run.registrationOpen);

        setRuns(openRuns);
        setRegistrationOpen(openRuns.length > 0);

        if (openRuns.length > 0) {
          setSelectedRunId(openRuns[0]._id);
        } else {
          setSelectedRunId("");
        }
      } catch (error) {
        console.error(error);
        toast.error("Could not load available runs.");
      } finally {
        setCheckingRegistration(false);
      }
    };

    loadRuns();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.inviteCode.trim()) {
  newErrors.inviteCode = "Invite code is required.";
}

    if (!selectedRunId) {
      newErrors.runId = "Please select a run.";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (
      !formData.age ||
      Number(formData.age) < 10 ||
      Number(formData.age) > 100
    ) {
      newErrors.age = "Age must be between 10 and 100.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!registrationOpen) {
      toast.error("Registrations are currently closed.");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data } = await api.post(
        "/api/register",
        {
          ...formData,
          runId: selectedRunId,
        }
      );

      const { registration, order } = data;

      const selectedRun = runs.find(
        (run) => run._id === selectedRunId
      );

      const options = {
        key: "rzp_test_TEwYR3CV4dUmLp",
        amount: order.amount,
        currency: order.currency,
        name: "IXG Run Club",
        description: selectedRun?.title || "Community Run",
        order_id: order.id,

        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },

        theme: {
          color: "#1E40AF",
        },

    handler: async function (response) {
  try {
    console.time("VERIFY REQUEST");

    console.log("1. Razorpay success");

    const verifyRes = await api.post("/api/register/verify", {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      registrationId: registration._id,
    });

    console.timeEnd("VERIFY REQUEST");

    console.log("2. Verify response");
    console.log(verifyRes.data);

    console.timeEnd("VERIFY REQUEST");

    console.log("2. Verify response");
    console.log(verifyRes.data);

    setConfirmation({
      name: formData.name,
      amount: order.amount / 100,
      runTitle: selectedRun?.title || "Community Run",
    });

    setFormData({
      name: "",
      phone: "",
      email: "",
      age: "",
      inviteCode: "",
    });

    console.log("SHOWING SUCCESS MODAL");
    setShowSuccessModal(true);
  } catch (error) {
    console.error(error);
    toast.error("Payment verification failed.");
  } finally {
    setLoading(false);
  }
},

        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.error("Payment cancelled. Registration not completed.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to start payment."
      );
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
    setConfirmation(null);
    onClose();
  };

  if (!isOpen) return null;

  if (showSuccessModal) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <span className="text-4xl text-green-600">✓</span>
          </div>

          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Registration Confirmed
          </h2>

          <div className="mt-8 rounded-2xl bg-gray-100 p-5 text-left">
            <div className="flex justify-between">
              <span className="text-gray-500">Run</span>
              <span className="font-semibold">
                {confirmation?.runTitle}
              </span>
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-semibold">
                {confirmation?.name}
              </span>
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold">
                ₹{confirmation?.amount}
              </span>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="mt-8 w-full rounded-full bg-gray-900 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue to IXG
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold">Join the Next Run</h2>

        {checkingRegistration ? (
          <div className="mt-10 py-10 text-center">
            <p className="text-gray-500">Checking registrations...</p>
          </div>
        ) : !registrationOpen ? (
          <div className="mt-8 text-center">
            <h3 className="mt-6 text-2xl font-bold text-gray-900">
              Registrations Closed
            </h3>
            <p className="mt-3 text-gray-600">
              There are no runs currently open for registration.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            

            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.age}
                </p>
              )}
            </div>

           <div>
  <input
    type="text"
    name="inviteCode"
    placeholder="Invite Code"
    value={formData.inviteCode}
    onChange={handleChange}
    className="w-full rounded-xl border p-3"
  />

  {errors.inviteCode && (
    <p className="mt-1 text-sm text-red-500">
      {errors.inviteCode}
    </p>
  )}
</div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-800 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Waiting for Confirmation..." : "Pay & Register"}
            </button>
          </form>
        )}

        <button
          onClick={onClose}
          className="mt-6 rounded-lg bg-gray-800 px-4 py-2 text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}