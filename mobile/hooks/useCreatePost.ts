import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useApiClient } from "@/utils/api";

export const useCreatePost = () => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const api = useApiClient();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string; imageUri?: string }) => {
      const formData = new FormData();

      if (postData.content) formData.append("content", postData.content);

      if (postData.imageUri) {
        // Get the filename and extension
        const uriParts = postData.imageUri.split("/");
        const fileName = uriParts[uriParts.length - 1];
        const fileExtension = fileName.split(".").pop() || "jpg";

        // Create proper file object for React Native
        const file = {
          uri: postData.imageUri,
          type: `image/${fileExtension}`,
          name: fileName || `image_${Date.now()}.${fileExtension}`,
        };

        formData.append("image", file as any);
      }

      console.log("Sending FormData with content:", postData.content);
      console.log("Image URI:", postData.imageUri);

      return api.post("/api/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (response) => {
      console.log("Post created successfully:", response.data);
      setContent("");
      setSelectedImage(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      Alert.alert("Success", "Post created successfully");
    },

    onError: (error: any) => {
      console.log(
        "Post creation failed:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        `Failed to create post: ${error.response?.data?.message || error.message}`
      );
    },
  });

  const handleImagePicker = async (useCamera: boolean = false) => {
    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.status !== "granted") {
      const source = useCamera ? "camera" : "media library";
      Alert.alert(
        "Permission Denied",
        `Permission to access ${source} is required!`
      );
      return;
    }

    const pickerOptions = {
      allowsEditing: true,
      aspect: [16, 9] as [number, number],
      quality: 0.8,
    };

    const result = useCamera
      ? await ImagePicker.launchCameraAsync(pickerOptions)
      : await ImagePicker.launchImageLibraryAsync({
          ...pickerOptions,
          mediaTypes: ["images"],
        });

    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const createPost = () => {
    if (!content.trim() && !selectedImage) {
      Alert.alert(
        "Your Post is empty",
        "Post cannot be empty please write something or add an image before posting"
      );
      return;
    }

    const postData: { content: string; imageUri?: string } = {
      content: content.trim(),
    };

    if (selectedImage) postData.imageUri = selectedImage;

    createPostMutation.mutate(postData);
  };

  return {
    content,
    setContent,
    selectedImage,
    setSelectedImage,
    handleImagePicker: () => handleImagePicker(false),
    createPost,
    isCreating: createPostMutation.isPending,
    takePhoto: () => handleImagePicker(true),
    removeImage: () => setSelectedImage(null),
  };
};
