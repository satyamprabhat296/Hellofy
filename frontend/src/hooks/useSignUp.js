import React from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from '../lib/api';

const useSignUp = () => {
  const queryClient =  useQueryClient();

 const {
  mutate,
  isLoading,
  error,
 } =useMutation ({
   mutationFn:signup,
   onSuccess:()=> queryClient.invalidateQueries({queryKey:["authUser"]}),

 });

 return {isLoading,error,signupMutation:mutate};
};

export default useSignUp
