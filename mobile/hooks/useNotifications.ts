import { useApiClient } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const notifications = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/api/notifications/");
        return response;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
    },
    select: (res) => res.data.notifications || [],
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        return await apiClient.delete(`/api/notifications/${notificationId}`);
      } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      Alert.alert("Success", "Notification deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting notification:", error);
      Alert.alert("Error", "Failed to delete notification");
    },
  });

  const deleteNotification = (notificationId: string) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  return {
    notificationsData: notificationsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
    deleteNotification,
    isDeleting: deleteNotificationMutation.isPending,
  };
};
