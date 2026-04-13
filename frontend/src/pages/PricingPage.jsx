import axios from "axios";
import useAuthUser from "../hooks/useAuthUser";

const PricingPage = () => {
  const { authUser } = useAuthUser();

  const loadRazorpay = async () => {
    const { data: order } = await axios.post("/api/payments/create-order");

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Hellofy Premium",
      description: "Unlock premium resources",
      order_id: order.id,
      handler: async (response) => {
        await axios.post("/api/payments/verify", response);
        window.location.reload();
      },
      theme: { color: "#6366f1" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="flex justify-center mt-20">
      {authUser?.isPremium ? (
        <button className="btn btn-success">Premium Active</button>
      ) : (
        <button className="btn btn-primary" onClick={loadRazorpay}>
          Upgrade ₹499 / month
        </button>
      )}
    </div>
  );
};

export default PricingPage;
