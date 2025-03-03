import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { supabase } from "../lip/supabase";
import { supabaseUrl } from "../constants";

// Function to get user image source, if no image path, return default image
export function getUserImageSource(imagepath) {
  if (imagepath) {
    return getSupabaseFileUrl(imagepath);
  } else {
    return require("../assets/images/defaultImg.jpg");
  }
}

// Function to construct the URL to access the file from Supabase Storage
export const getSupabaseFileUrl = (filePath) => {
  if (filePath) {
    return {
      uri: `${supabaseUrl}/storage/v1/object/public/upload/${filePath}`,
    };
  }
  return null;
};

export async function downloadFile(url) {
  try {
    const { uri } = await FileSystem.downloadAsync(url, getLocalFilePath(url));
    return uri;
  } catch (error) {
    return null;
  }
}
export function getLocalFilePath(filePath) {
  const fileName = filePath.split("/").pop();
  return `${FileSystem.documentDirectory}${fileName}`;
}

// Function to upload file to Supabase Storage
export const uploadfile = async (folderName, fileUri, isImage = true) => {
  try {
    // Generate file path for storage
    let fileName = getFilePath(folderName, isImage);

    // Read file as base64
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Decode base64 string
    let imageData = decode(fileBase64);

    // Upload the file to Supabase storage
    let { data, error } = await supabase.storage
      .from("upload")
      .upload(fileName, imageData, {
        contentType: isImage ? "image/*" : "video/*",
        cacheControl: "3600", // Cache for 1 hour
        upsert: false, // Don't overwrite existing file
      });

    // Handle errors during the upload process
    if (error) {
      console.error("File upload error:", error.message || error);
      return { success: false, msg: "Could not upload media" };
    }

    // console.log("Upload successful:", data);

    return { success: true, data: data.path };
  } catch (error) {
    // Catching any unexpected errors
    console.error("Caught error during upload:", error.message || error);
    return { success: false, msg: "Could not upload media" };
  }
};

// Helper function to generate the file path for the upload
export const getFilePath = (folderName, isImage) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};
