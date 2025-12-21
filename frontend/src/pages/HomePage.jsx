// import React, { useEffect } from 'react'
// import { useMutation, useQuery,useQueryClient } from '@tanstack/react-query'
// import { useState } from 'react'
// import { getUserFriends } from '../lib/api';
// import { getRecommendedUsers,getOutgoingFriendReqs,sendFriendRequest } from '../lib/api';
// import { CheckCircleIcon,  MapPinIcon, UserIcon, UserPlusIcon } from 'lucide-react';
// import { Link } from 'react-router';
// import FriendCard, { getLanguageFlag } from "../components/FriendCard";
// import NoFriendsFound from '../components/NoFriendsFound';
// import { capitialize } from '../lib/utils';

// const HomePage = () => {
  
//   const queryClient = useQueryClient();
//   const [outgoingRequestsIds,setOutgoingRequestsIds] = useState(new Set())

//   const {data: friends=[], isLoading:loadingFriends} = useQuery({
//     queryKey:["friends"],
//     queryFn:getUserFriends
//   })
//   const {data:recommendedUsers=[], isLoading:loadingUsers} = useQuery({
//     queryKey:["users"],
//     queryFn:getRecommendedUsers
//   })
 
//   const {data:  outgoingFriendReqs} = useQuery({

//     queryKey:["outgoingFriendReqs"],
//     queryFn:getOutgoingFriendReqs,
//   })
//   const {mutate: sendRequestMutation, isPending} = useMutation({
//     mutationFn: sendFriendRequest,
//     onSuccess:() => queryClient.invalidateQueries({queryKey:["outgoingFriendReqs"]}),
//   })


//   useEffect(()=>{
//     const outgoingIds =  new Set()
//     if(outgoingFriendReqs && outgoingFriendReqs.length>0){
//       outgoingFriendReqs.forEach((req) =>{
//         outgoingIds.add(req.recipient._id)
//       })
//       setOutgoingRequestsIds(outgoingIds)
//     }

//   },[outgoingFriendReqs])



//   return (
//     <div className='p-4 sm:p-6  lg:p-8 '>
//       <div className='container mx-auto  space-y-10'>
//         <div className='flex flex-col sm:flex-row  items-start sm:items-center justify-between gap-4'>
//           <h2 className=' text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
//           < Link to="/notifications" className="btn btn-outline btn-sm">
//           <UserIcon className='mr-2 size-4 '/>
//           Friend Requests
//           </Link>
//         </div>

//         {loadingFriends ?(
//           <div className='flex justify-center py-12'>
//             <span className='loading loading-spinner loading-lg'/>
//             </div>
//         ): friends.length ===0 ?(
//           <NoFriendsFound/>
//         ):(
//           <div className=' grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4'>
//             {friends.map((friend)=>(
//               <FriendCard key={friend._id} friend={friend} />
//             ))}
            
//       </div>
//         )}
//         <section >

//           <div className='mb-6  sm:mb-8'>
//             <div className='flex flex-col sm:flex-row  items-start  sm:items-center justify-between gap-4'>
//               <div>
//                 <h2 className=' text-2xl sm:text-3xl  font-bold tracking-tight'>Meet New Learners</h2>
//                 <p className='opacity-70'>
//                   Discover perfect language exchange partners based on your profile
//                 </p>
//               </div>
//             </div>
//           </div>

//           {loadingUsers ?(
//             <div className='flex justify-center py-12'>
//               <span className='loading loading-spinner loading-lg' />

//             </div>
//           ): recommendedUsers.length ===0 ?(
//             <div className='card bg-base-200 p-6  text-center'>
//               <h3 className='font-semibold text-lg mb-2 '>No recommendations available</h3>
//               <p className=' text-base-content opacity-70'>
//                 Check back later for new language partners!
//               </p>
//             </div>
//           ):(
//             <div className='grid grid-cols-1  md:grid-cols-2  lg:grid-cols-3 gap-6'>
//               {recommendedUsers.map((user)=>{
//                 const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
//                 return (
//                   <div key={user._id}
//                   className='card bg-base-200  hover:shadow-lg transition-all duration-300'
//                   >
//                     <div className='card-body p-5 space-y-4'>
//                       <div className='flex items-center gap-3'>
//                         <div className='avatar size-16 rounded-full'>
//                           <img src={user.profilePic} alt={user.fullName} />
//                         </div>
//                         <div> <h3 className='font-semibold text-lg'>{user.fullName}</h3>

//                         {user.location && (
//                           <div className='flex items-center text-xs opacity-70 mt-1'>
//                             <MapPinIcon className='size-3 mr-1' />
//                             {user.location}
//                             </div>
//                         )}
//                         </div>
//                       </div>
//                       {/*Languages with Flags*/}

//                       <div className='flex flex-wrap gap-1.5'>
//                         <span className='badge badge-secondary'>
//                           {getLanguageFlag(user.nativeLanguage)}
//                           Native:{capitialize(user.nativeLanguage)}
//                         </span>
//                         <span className='badge badge-outline'>
//                           {getLanguageFlag(user.learningLanguage)}
//                           Learning:{capitialize(user.learningLanguage)}
//                         </span>
//                     </div>
//                     {user.bio && <p className='text-sm opacity-70'>{user.bio}</p>}


//                     {/*ACTION-BTN*/}

//                     <button className={`btn w-full mt-2 ${
//                     hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`}

//                     onClick={() => sendRequestMutation(user._id)}
//                     disabled= {hasRequestBeenSent || isPending}
//                     >
//                       {hasRequestBeenSent ? (
//                         <>
//                         <CheckCircleIcon className='size-4 mr-2 ' />
//                         Request Sent</>
//                       ):(
//                         <>
//                         <UserPlusIcon className='size-4 mr-2' />
//                         Send Friend Request
//                         </>
                      
//                       )}
//                     </button>
//                     </div>
//                     </div>
//                 )
//               })}
//             </div>
//           )}



//         </section>
//     </div>
//     </div>
//   );
// };



// export default HomePage;

// import React, { useEffect, useState } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   getUserFriends,
//   getRecommendedUsers,
//   getOutgoingFriendReqs,
//   sendFriendRequest,
//   dismissSuggestedUser,
//   getAIRecommendations, // 🧠 new import
// } from "../lib/api";
// import {
//   CheckCircleIcon,
//   MapPinIcon,
//   UserIcon,
//   UserPlusIcon,
//   CodeIcon,
//   GlobeIcon,
//   GithubIcon,
//   XCircleIcon,
// } from "lucide-react";
// import { Link } from "react-router";
// import FriendCard from "../components/FriendCard";
// import NoFriendsFound from "../components/NoFriendsFound";

// const LANGUAGE_COLORS = {
//   javascript: "bg-yellow-400 text-black",
//   python: "bg-blue-400 text-white",
//   java: "bg-red-500 text-white",
//   cpp: "bg-indigo-500 text-white",
//   c: "bg-gray-500 text-white",
//   html: "bg-orange-400 text-white",
//   css: "bg-blue-500 text-white",
//   typescript: "bg-sky-400 text-black",
//   react: "bg-cyan-400 text-black",
//   go: "bg-teal-500 text-white",
//   ruby: "bg-rose-400 text-white",
//   php: "bg-purple-400 text-white",
//   default: "bg-base-300 text-white",
// };

// const getLangBadgeClass = (lang) => {
//   if (!lang) return LANGUAGE_COLORS.default;
//   return LANGUAGE_COLORS[lang.toLowerCase()] || LANGUAGE_COLORS.default;
// };

// const HomePage = () => {
//   const queryClient = useQueryClient();
//   const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
//   const [aiSuggestions, setAISuggestions] = useState([]);
//   const [loadingAI, setLoadingAI] = useState(false);

//   const { data: friends = [], isLoading: loadingFriends } = useQuery({
//     queryKey: ["friends"],
//     queryFn: getUserFriends,
//   });

//   const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
//     queryKey: ["users"],
//     queryFn: getRecommendedUsers,
//   });

//   const { data: outgoingFriendReqs } = useQuery({
//     queryKey: ["outgoingFriendReqs"],
//     queryFn: getOutgoingFriendReqs,
//   });

//   const { mutate: sendRequestMutation, isPending } = useMutation({
//     mutationFn: sendFriendRequest,
//     onSuccess: () =>
//       queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
//   });

//   const { mutate: dismissUserMutation } = useMutation({
//     mutationFn: dismissSuggestedUser,
//     onSuccess: (_, dismissedUserId) => {
//       queryClient.setQueryData(["users"], (oldData) =>
//         oldData ? oldData.filter((u) => u._id !== dismissedUserId) : []
//       );
//     },
//   });

//   useEffect(() => {
//     const outgoingIds = new Set();
//     if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
//       outgoingFriendReqs.forEach((req) => {
//         outgoingIds.add(req.recipient._id);
//       });
//       setOutgoingRequestsIds(outgoingIds);
//     }
//   }, [outgoingFriendReqs]);

//   // 🧠 Fetch AI friend suggestions
//   const handleAISuggestions = async () => {
//     try {
//       setLoadingAI(true);
//       const res = await getAIRecommendations();
//       setAISuggestions(res);
//     } catch (err) {
//       console.error("AI Recommendation Error:", err);
//     } finally {
//       setLoadingAI(false);
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <div className="container mx-auto space-y-10">
//         {/* FRIENDS SECTION */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
//             Your Coding Partners
//           </h2>
//           <Link to="/notifications" className="btn btn-outline btn-sm">
//             <UserIcon className="mr-2 size-4" />
//             Friend Requests
//           </Link>
//         </div>

//         {loadingFriends ? (
//           <div className="flex justify-center py-12">
//             <span className="loading loading-spinner loading-lg" />
//           </div>
//         ) : friends.length === 0 ? (
//           <NoFriendsFound />
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {friends.map((friend) => (
//               <FriendCard key={friend._id} friend={friend} />
//             ))}
//           </div>
//         )}

//         {/* RECOMMENDED USERS SECTION */}
//         <section>
//           <div className="mb-6 sm:mb-8">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//               <div>
//                 <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
//                   Find New Programming Buddies
//                 </h2>
//                 <p className="opacity-70">
//                   Connect with developers to learn and teach languages together.
//                 </p>
//               </div>

//               {/* ✨ AI Suggestion Button */}
//               <button
//                 onClick={handleAISuggestions}
//                 className="btn btn-accent btn-sm"
//                 disabled={loadingAI}
//               >
//                 {loadingAI ? "Getting AI Suggestions..." : "✨ Get AI Suggestions"}
//               </button>
//             </div>
//           </div>

//           {/* 🧠 AI Suggestions Section */}
//           {aiSuggestions.length > 0 && (
//             <div className="mb-10">
//               <h3 className="text-xl font-semibold mb-3">🤖 AI-Recommended Matches</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {aiSuggestions.map((user) => (
//                   <FriendCard key={user._id} friend={user} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* NORMAL RECOMMENDATIONS */}
//           {loadingUsers ? (
//             <div className="flex justify-center py-12">
//               <span className="loading loading-spinner loading-lg" />
//             </div>
//           ) : recommendedUsers.length === 0 ? (
//             <div className="card bg-base-200 p-6 text-center">
//               <h3 className="font-semibold text-lg mb-2">
//                 No recommendations available
//               </h3>
//               <p className="text-base-content opacity-70">
//                 Check back later for new coding partners!
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {recommendedUsers.map((user) => {
//                 const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
//                 return (
//                   <div
//                     key={user._id}
//                     className="card bg-base-200 hover:shadow-lg transition-all duration-300"
//                   >
//                     <div className="card-body p-5 space-y-4">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <div className="avatar size-16 rounded-full">
//                             <img
//                               src={user.profilePic}
//                               alt={user.fullName}
//                               className="rounded-full"
//                             />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-lg">
//                               {user.fullName}
//                             </h3>
//                             {user.location && (
//                               <div className="flex items-center text-xs opacity-70 mt-1">
//                                 <MapPinIcon className="size-3 mr-1" />
//                                 {user.location}
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         {/* Dismiss Button */}
//                         <button
//                           onClick={() => dismissUserMutation(user._id)}
//                           className="btn btn-ghost btn-sm text-error"
//                           title="Dismiss suggestion"
//                         >
//                           <XCircleIcon className="size-5" />
//                         </button>
//                       </div>

//                       {/* LANGUAGES */}
//                       {user.languagesToTeach?.length > 0 && (
//                         <div>
//                           <p className="text-sm font-medium opacity-80 mb-1">
//                             🧑‍🏫 Teaches:
//                           </p>
//                           <div className="flex flex-wrap gap-2">
//                             {user.languagesToTeach.map((lang) => (
//                               <span
//                                 key={`teach-${lang}`}
//                                 className={`px-2 py-1 rounded-full text-xs font-semibold ${getLangBadgeClass(
//                                   lang
//                                 )}`}
//                               >
//                                 {lang}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {user.languagesToLearn?.length > 0 && (
//                         <div>
//                           <p className="text-sm font-medium opacity-80 mb-1">
//                             📚 Learning:
//                           </p>
//                           <div className="flex flex-wrap gap-2">
//                             {user.languagesToLearn.map((lang) => (
//                               <span
//                                 key={`learn-${lang}`}
//                                 className={`px-2 py-1 rounded-full text-xs font-semibold border border-base-300 ${getLangBadgeClass(
//                                   lang
//                                 )}`}
//                               >
//                                 {lang}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {user.techStack?.length > 0 && (
//                         <div>
//                           <p className="text-sm font-medium opacity-80 mb-1">
//                             💻 Tech Stack:
//                           </p>
//                           <div className="flex flex-wrap gap-2">
//                             {user.techStack.map((tech) => (
//                               <span
//                                 key={tech}
//                                 className="px-2 py-1 bg-base-300 rounded-full text-xs font-semibold"
//                               >
//                                 {tech}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {user.bio && (
//                         <p className="text-sm opacity-70 mt-2">{user.bio}</p>
//                       )}

//                       {/* LINKS */}
//                       <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
//                         {user.github && (
//                           <a
//                             href={user.github}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-1 text-blue-400 hover:underline"
//                           >
//                             <GithubIcon className="size-4" /> GitHub
//                           </a>
//                         )}
//                         {user.portfolio && (
//                           <a
//                             href={user.portfolio}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-1 text-yellow-400 hover:underline"
//                           >
//                             <CodeIcon className="size-4" /> Portfolio
//                           </a>
//                         )}
//                         {user.website && (
//                           <a
//                             href={user.website}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-1 text-green-400 hover:underline"
//                           >
//                             <GlobeIcon className="size-4" /> Website
//                           </a>
//                         )}
//                       </div>

//                       {/* CONNECT BUTTON */}
//                       <button
//                         className={`btn w-full mt-2 ${
//                           hasRequestBeenSent ? "btn-disabled" : "btn-primary"
//                         }`}
//                         onClick={() => sendRequestMutation(user._id)}
//                         disabled={hasRequestBeenSent || isPending}
//                       >
//                         {hasRequestBeenSent ? (
//                           <>
//                             <CheckCircleIcon className="size-4 mr-2" />
//                             Request Sent
//                           </>
//                         ) : (
//                           <>
//                             <UserPlusIcon className="size-4 mr-2" />
//                             Connect & Pair Code
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default HomePage;



import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserFriends,
  getRecommendedUsers,
  getOutgoingFriendReqs,
  sendFriendRequest,
  dismissSuggestedUser,
  getAIRecommendations, // 🧠 updated
} from "../lib/api";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserIcon,
  UserPlusIcon,
  CodeIcon,
  GlobeIcon,
  GithubIcon,
  XCircleIcon,
  SparklesIcon,
} from "lucide-react";
import { Link } from "react-router";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const LANGUAGE_COLORS = {
  javascript: "bg-yellow-400 text-black",
  python: "bg-blue-400 text-white",
  java: "bg-red-500 text-white",
  cpp: "bg-indigo-500 text-white",
  c: "bg-gray-500 text-white",
  html: "bg-orange-400 text-white",
  css: "bg-blue-500 text-white",
  typescript: "bg-sky-400 text-black",
  react: "bg-cyan-400 text-black",
  go: "bg-teal-500 text-white",
  ruby: "bg-rose-400 text-white",
  php: "bg-purple-400 text-white",
  default: "bg-base-300 text-white",
};

const getLangBadgeClass = (lang) => {
  if (!lang) return LANGUAGE_COLORS.default;
  return LANGUAGE_COLORS[lang.toLowerCase()] || LANGUAGE_COLORS.default;
};

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [aiSuggestions, setAISuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAIError] = useState("");

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  const { mutate: dismissUserMutation } = useMutation({
    mutationFn: dismissSuggestedUser,
    onSuccess: (_, dismissedUserId) => {
      queryClient.setQueryData(["users"], (oldData) =>
        oldData ? oldData.filter((u) => u._id !== dismissedUserId) : []
      );
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs?.length > 0) {
      outgoingFriendReqs.forEach((req) => outgoingIds.add(req.recipient._id));
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // 🧠 Fetch AI friend suggestions (Groq integrated)
  const handleAISuggestions = async () => {
    setAIError("");
    setLoadingAI(true);

    try {
      const res = await getAIRecommendations();

      if (!res || res.length === 0) {
        setAIError("No AI-based recommendations available right now.");
        setAISuggestions([]);
      } else {
        setAISuggestions(res);
      }
    } catch (err) {
      console.error("AI Recommendation Error:", err);
      setAIError("Failed to fetch AI recommendations. Try again later.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* FRIENDS SECTION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Coding Partners
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UserIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* RECOMMENDED USERS SECTION */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Find New Programming Buddies
                </h2>
                <p className="opacity-70">
                  Connect with developers to learn and teach languages together.
                </p>
              </div>

              {/* ✨ AI Suggestion Button */}
              <button
                onClick={handleAISuggestions}
                className="btn btn-accent btn-sm flex items-center gap-2"
                disabled={loadingAI}
              >
                {loadingAI ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Getting AI Suggestions...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="size-4" /> Get AI Suggestions
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 🧠 AI Suggestions Section */}
          {aiError && (
            <div className="alert alert-error text-sm mb-4">
              {aiError}
            </div>
          )}

          {aiSuggestions.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-3">
                🤖 AI-Recommended Matches
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiSuggestions.map((user) => (
                  <FriendCard key={user._id} friend={user} />
                ))}
              </div>
            </div>
          )}

          {/* NORMAL RECOMMENDATIONS */}
          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="text-base-content opacity-70">
                Check back later for new coding partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="avatar size-16 rounded-full">
                            <img
                              src={user.profilePic}
                              alt={user.fullName}
                              className="rounded-full"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {user.fullName}
                            </h3>
                            {user.location && (
                              <div className="flex items-center text-xs opacity-70 mt-1">
                                <MapPinIcon className="size-3 mr-1" />
                                {user.location}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dismiss Button */}
                        <button
                          onClick={() => dismissUserMutation(user._id)}
                          className="btn btn-ghost btn-sm text-error"
                          title="Dismiss suggestion"
                        >
                          <XCircleIcon className="size-5" />
                        </button>
                      </div>

                      {/* LANGUAGES */}
                      {user.languagesToTeach?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium opacity-80 mb-1">
                            🧑‍🏫 Teaches:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {user.languagesToTeach.map((lang) => (
                              <span
                                key={`teach-${lang}`}
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${getLangBadgeClass(
                                  lang
                                )}`}
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {user.languagesToLearn?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium opacity-80 mb-1">
                            📚 Learning:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {user.languagesToLearn.map((lang) => (
                              <span
                                key={`learn-${lang}`}
                                className={`px-2 py-1 rounded-full text-xs font-semibold border border-base-300 ${getLangBadgeClass(
                                  lang
                                )}`}
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {user.techStack?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium opacity-80 mb-1">
                            💻 Tech Stack:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {user.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-1 bg-base-300 rounded-full text-xs font-semibold"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {user.bio && (
                        <p className="text-sm opacity-70 mt-2">{user.bio}</p>
                      )}

                      {/* LINKS */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                        {user.github && (
                          <a
                            href={user.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-400 hover:underline"
                          >
                            <GithubIcon className="size-4" /> GitHub
                          </a>
                        )}
                        {user.portfolio && (
                          <a
                            href={user.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-yellow-400 hover:underline"
                          >
                            <CodeIcon className="size-4" /> Portfolio
                          </a>
                        )}
                        {user.website && (
                          <a
                            href={user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-green-400 hover:underline"
                          >
                            <GlobeIcon className="size-4" /> Website
                          </a>
                        )}
                      </div>

                      {/* CONNECT BUTTON */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Connect & Pair Code
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
