import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import ResourceCard from "../components/ResourceCard";

const ResourcesPage = () => {
  const { data: resources, isLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const res = await axiosInstance.get("/resources");
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading resources...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Learning Resources</h1>

      {resources?.length === 0 ? (
        <p>No resources available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
