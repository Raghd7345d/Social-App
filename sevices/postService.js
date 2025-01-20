import { supabase } from "../lip/supabase";
import { uploadfile } from "./imageService";

export async function CreatePost(post) {
  try {
    // Check if a file is provided and is an object
    if (post.file && typeof post.file == "object") {
      const isImage = post?.file?.type == "image";
      const folderName = isImage ? "postImage" : "postVideo";

      // Upload file
      const fileResult = await uploadfile(folderName, post.file.uri, isImage);

      if (fileResult.success) {
        post.file = fileResult.data;
      } else {
        console.error("File upload failed:", fileResult.error); // Log the error in more detail
        return {
          success: false,
          msg: "File upload failed",
          error: fileResult.error,
        };
      }
    }

    // Upsert the post into the database
    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .maybeSingle();

    return { success: true, data };
  } catch (error) {
    console.error("Error creating post:", error.message);
    return {
      success: false,
      msg: "Could not create your post",
      error: error.message,
    };
  }
}
export async function fetchPosts(limit = 10) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(`*, user :users(id, name, image)`)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      throw new Error(error.message);
    }
    return { success: true, data: data };
  } catch (error) {
    console.error("Error Fetching post:", error.message);
    return {
      success: false,
      msg: "Could not fetch your post",
      error: error.message,
    };
  }
}
