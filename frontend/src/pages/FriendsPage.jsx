
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import PageLoader from "../components/PageLoader";

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get("/users/friends");
        setFriends(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (err) {
        console.error("Failed to fetch friends:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load friends. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Friends</h1>
        <p className="text-base-content/70 mt-1">
          Connect and practice with your friends.
        </p>
      </div>

      {error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : friends.length === 0 ? (
        <NoFriendsFound />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
