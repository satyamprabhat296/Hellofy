import {
  LockIcon,
  ExternalLinkIcon,
  CrownIcon,
} from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import { loadRazorpay } from "../lib/utils";
import { axiosInstance } from "../lib/axios";

const ResourceCard = ({ resource }) => {
  const { authUser, refetch } = useAuthUser();

  const isLocked = resource.isPremium && !authUser?.isPremium;

  // 💳 Upgrade flow (Razorpay)
  const handleUpgrade = async () => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: 19900, // ₹199
      currency: "INR",
      name: "Hellofy",
      description: "Premium Access",
      handler: async () => {
        alert("🎉 Payment successful");

        // 🔁 Auto refresh user (premium unlock)
        await refetch();
      },
      theme: {
        color: "#6366f1",
      },
    };

    new window.Razorpay(options).open();
  };

  // 📊 Analytics: who unlocked what
  const handleOpenResource = async () => {
    try {
      await axiosInstance.post(
        `/resources/${resource._id}/access`
      );

      window.open(resource.url, "_blank", "noreferrer");
    } catch (error) {
      alert("Failed to track resource access");
    }
  };

  return (
    <div className="card bg-base-200 shadow-md border border-base-300">
      <div className="card-body space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="card-title text-lg">
            {resource.title}
          </h2>

          {resource.isPremium && (
            <span className="badge badge-warning gap-1">
              <CrownIcon size={14} />
              Premium
            </span>
          )}
        </div>

        <p className="text-sm opacity-80">
          {resource.description}
        </p>

        <div className="text-xs opacity-60">
          {resource.language} • {resource.type}
        </div>

        {/* ACTION */}
        <div className="pt-2">
          {isLocked ? (
            <button
              onClick={handleUpgrade}
              className="btn btn-outline btn-sm w-full gap-2"
            >
              <LockIcon size={16} />
              Upgrade to Access
            </button>
          ) : (
            <button
              onClick={handleOpenResource}
              className="btn btn-primary btn-sm w-full gap-2"
            >
              <ExternalLinkIcon size={16} />
              Open Resource
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
