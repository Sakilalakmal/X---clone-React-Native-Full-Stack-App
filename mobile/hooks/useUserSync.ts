import { useApi, useApiClient } from "@/utils/api";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export const useUserSync = () => {
  const { isSignedIn } = useAuth();
  const api = useApiClient();
  const hasAttemptedSync = useRef(false);

  const syncUserMutation = useMutation({
    mutationFn: () => useApi.syncUser(api),
    onSuccess: (response: any) => {
      console.log("user sync successfully", response.data);
      hasAttemptedSync.current = true;
    },
    onError: (error: any) => {
      console.log("user sync failed", error.response?.data || error.message);
      hasAttemptedSync.current = true;
    },
  });

  useEffect(() => {
    if (
      isSignedIn &&
      !hasAttemptedSync.current &&
      !syncUserMutation.isPending
    ) {
      console.log("Attempting to sync user...");
      syncUserMutation.mutate();
    }
  }, [isSignedIn, syncUserMutation.isPending]);

  return {
    isLoading: syncUserMutation.isPending,
    error: syncUserMutation.error,
    data: syncUserMutation.data,
  };
};
