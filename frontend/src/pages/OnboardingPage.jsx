// import React from 'react'
// import useAuthUser from '../hooks/useAuthUser';
// import toast from "react-hot-toast";

// import { useState } from 'react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react';
// import { LANGUAGES } from '../constants';
// import { completeOnboarding } from "../lib/api";


// const OnboardingPage = () => {
  
//   const {authUser } = useAuthUser();
//   const queryClient = useQueryClient();

//   const [formState, setFormState] = useState({
//     fullName:authUser?.fullName || "",
//     bio:authUser?.bio || "",
//     nativeLanguage:authUser?.nativeLanguage || "",
//     location:authUser?.location || "",
//     profilePic: authUser?.profilePic || "",
//   });

//    const {mutate:onboardingMutation, isPending} = useMutation({
//     mutationFn:completeOnboarding,
//     onSuccess:() =>{
//       toast.success("Profile onboarded successfully");
//       queryClient.invalidateQueries({queryKey:["authUser"]});
//     },
//     onError:(error)=>{
//       toast.error(error.response.data.message);
//     },
    
//    })
//     const handleSubmit = (e) =>{
//       e.preventDefault();
//       onboardingMutation(formState);
//     }
//    const handleRandomAvatar =()=>{
//     const idx= Math.floor(Math.random()*100)+1; //1-100 included
//     const randomAvatar =`https://avatar.iran.liara.run/public/${idx}.png`;


//     setFormState({...formState, profilePic:randomAvatar});
//     toast.success("Random profile picture generated!");

//    };

//   return (
//     <div className='min-h-screen bg-base-100 flex items-center  justify-center p-4'>
//       <div className='card bg-base-200 w-full  max-w-3xl shadow-xl'>
//         <div className='card-body p-6  sm:p-8'>
//           <h1 className='text-2xl  sm:text-3xl  font-bold  text-center mb-6 '> Complete  Your Profile
//             </h1>
//           <form  onSubmit={handleSubmit} className='space-y-6'>
//             {/* PROFILE PIC CONTAINER */}

//             <div className='flex flex-col  items-center justify-center space-y-4'>
//               {/* IMAGE-PREVIEW*/}

//               <div className='size-32  rounded-full bg-base-300  overflow-hidden'>
//                 {formState.profilePic ?(
//                   <img 
//                   src={formState.profilePic}
//                   alt="Profile-Preview"
//                   className='w-full  h-full object-cover'
//                   />
//                 ):(
//                   <div className='flex items-center  justify-center h-full'>
//                     <CameraIcon className='size-12  text-base-content opacity-40' />
//                     </div>
                
//                 )}
//               </div>
//               {/*GENERATE RANDOM AVATAR BUTTON */}

//               <div className='flex items-center gap-2'>
//                 <button type='button' onClick={handleRandomAvatar} className='btn btn-accent'>
//                   <ShuffleIcon className='size-4 mr-2' />
//                   Generate Random Avatar
//                 </button>
//               </div>
              
//             </div>
//             {/*FULL-NAME*/}
//               <div className='form-control'>
//                 <label className='label'>
//                   <span className='label-text'>Full-Name</span>
//                 </label>
//                 <input type='text'
//                 name='fullName'
//                 value={formState.fullName}
//                 onChange={(e) => setFormState({...formState, fullName: e.target.value})}
//                 className='input input-bordered w-full'
//                 placeholder='Your full Name'/>
//               </div>

//               {/*BIO*/}

//               <div className='form-control'>
//                 <label className='label'>
//                   <span  className='label-text'>Bio</span>

//                 </label>
//                 <textarea
//                 name='bio'
//                 value={formState.bio}
//                 onChange={(e) => setFormState({...formState, bio: e.target.value})}
//                 className='textarea textarea-bordered h-24'
//                 placeholder='Tell others about yourself & your language learning goals'
//                 />
//               </div>
//               {/*Languages*/}
//               <div className='grid grid-cols-1  md:grid-cols-2 gap-4'>
//                 {/*NATIVE-LANGUAGE*/}

//                 <div className='form-control'>
//                   <label className='label'>
//                     <span className='label-text'>Native-Language</span>
//                   </label>
//                   <select 
//                   name="nativeLanguage"
//                   value={formState.nativeLanguage}
//                   onChange={(e) => setFormState({...formState, nativeLanguage: e.target.value})}
//                   className='select select-bordered w-full'
//                   >
//                     <option value ="">Select your native language</option>
//                     {LANGUAGES.map((lang)=>(
//                       <option key={`native-${lang}`} value={lang.toLowerCase()}>
//                         {lang}
//                       </option>
                    

//                     ))}
//                   </select>
//                 </div>
//                 {/*Learning Language*/}

//                 <div className='form-control'>
//                   <label className='label'>
//                     <span className='label-text'>Learning Language</span>
//                   </label>
//                   <select 
//                   name='learningLanguage'
//                   value={formState.learningLanguage}
//                   onChange={(e)=> setFormState({...formState,learningLanguage:e.target.value})}
//                   className='select select-bordered w-full'
//                   >
//                     <option value="">Select language you're learning</option>
//                     {LANGUAGES.map((lang)=>(
//                       <option key={`learning-${lang}`} value={lang.toLowerCase()}>
//                         {lang}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/*LOCATION*/}

//               <div className='form-control'>
//                 <label className='label'>
//                   <span className='label-text'>Location</span>
//                 </label>
//                 <div className='relative'>
//                   <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5
//                   text-base-content opacity-70' />
//                   <input 
//                   type="text"
//                   name="Location"
//                   value={formState.location}
//                   onChange={(e) => setFormState({...formState, location: e.target.value})}
//                   className='input input-bordered w-full pl-10'
//                   placeholder='City, Country'
//                   />
//                 </div>
//               </div>


//               {/*SUBMIT-BUTTON*/}

//               <button className='btn btn-primary w-full ' disabled={isPending} type='submit'>
//                 {!isPending ?(
//                 <>
//                 <ShipWheelIcon className='size-5 mr-2'/>
//                 Complete Onboarding

//                 </>
//                 ):(
//                   <>
//                   <LoaderIcon className='animate-spin size-5 mr-2'/>
//                   Onboarding...
//                   </>

//                 )}
//               </button>
//           </form>
          
//         </div>
         
//       </div>
     
//     </div>
//   )
// }

// export default OnboardingPage

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
  GithubIcon,
} from "lucide-react";
import { completeOnboarding } from "../lib/api";

// ✅ List of programming languages
const PROGRAMMING_LANGUAGES = [
  "JavaScript",
  "Python",
  "C++",
  "C#",
  "Java",
  "Go",
  "Rust",
  "Ruby",
  "TypeScript",
  "Kotlin",
  "Swift",
  "PHP",
];

// ✅ Tech stacks / domains
const TECH_STACKS = [
  "MERN",
  "MEAN",
  "Data Science",
  "AI/ML",
  "Blockchain",
  "Frontend",
  "Backend",
  "DevOps",
  "Game Dev",
  "Mobile Apps",
];

const OnboardingPage = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
    languagesToTeach: [],
    languagesToLearn: [],
    experienceLevel: "Beginner",
    techStack: [],
    github: authUser?.github || "",
    portfolio: authUser?.portfolio || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: (data) => {
      toast.success("Profile onboarded successfully 🚀");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      // ✅ Redirect after success
      setTimeout(() => navigate("/home"), 1000);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  const handleMultiSelect = (name, e) => {
    const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormState({ ...formState, [name]: values });
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            👩‍💻 Complete Your Developer Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleRandomAvatar}
                className="btn btn-accent flex items-center gap-2"
              >
                <ShuffleIcon className="size-4" />
                Generate Random Avatar
              </button>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about your coding journey or what you want to learn"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Languages to Teach */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Languages You Can Teach</span>
                </label>
                <select
                  multiple
                  value={formState.languagesToTeach}
                  onChange={(e) => handleMultiSelect("languagesToTeach", e)}
                  className="select select-bordered w-full h-32"
                >
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <option key={`teach-${lang}`} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Languages to Learn */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Languages You Want to Learn</span>
                </label>
                <select
                  multiple
                  value={formState.languagesToLearn}
                  onChange={(e) => handleMultiSelect("languagesToLearn", e)}
                  className="select select-bordered w-full h-32"
                >
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <option key={`learn-${lang}`} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* EXPERIENCE LEVEL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Experience Level</span>
              </label>
              <select
                value={formState.experienceLevel}
                onChange={(e) =>
                  setFormState({ ...formState, experienceLevel: e.target.value })
                }
                className="select select-bordered w-full"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            {/* TECH STACK */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tech Stack / Interests</span>
              </label>
              <select
                multiple
                value={formState.techStack}
                onChange={(e) => handleMultiSelect("techStack", e)}
                className="select select-bordered w-full h-32"
              >
                {TECH_STACKS.map((stack) => (
                  <option key={stack} value={stack}>
                    {stack}
                  </option>
                ))}
              </select>
            </div>

            {/* GITHUB / PORTFOLIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <GithubIcon className="size-4" /> GitHub Profile
                </span>
              </label>
              <input
                type="text"
                name="github"
                value={formState.github}
                onChange={(e) =>
                  setFormState({ ...formState, github: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="https://github.com/username"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Portfolio / Website</span>
              </label>
              <input
                type="text"
                name="portfolio"
                value={formState.portfolio}
                onChange={(e) =>
                  setFormState({ ...formState, portfolio: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="https://yourwebsite.com (optional)"
              />
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({ ...formState, location: e.target.value })
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
