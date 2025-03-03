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
export async function fetchPosts(limit = 10, userId) {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `*, user:users(id, name, image), postLikes(*), comments(count) )`
        )
        .order("created_at")

        .eq("userId", userId)
        .limit(limit);
      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data: data };
    } else {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `*, user:users(id, name, image), postLikes(*), comments(count) )`
        )
        .order("created_at")

        .limit(limit);
      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data: data };
    }
  } catch (error) {
    console.error("Error in fetchPosts:", error);
    return {
      success: false,
      msg: "Could not fetch the posts",
      error: error.message,
    };
  }
}
export async function fetchPostDetails(postId) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `*, user:users(id, name, image), postLikes(*), comments(*, user:users(id, name, image) )`
      )
      .order("created_at", { ascending: false, foreignTable: "comments" })
      .eq("id", postId)
      .maybeSingle(); // Use maybeSingle() instead of single()

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error("fetchPostdetails error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function createLike(postLike) {
  try {
    const { data, error } = await supabase
      .from("postLikes")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.error("Error liking post:", error.message);

      return { success: false, error };
    }
    return { success: true, data: data };
  } catch (error) {
    console.error("Error in createLike:", error.message, postLike); // Log the full context
    return {
      success: false,
      msg: "Could not Like your post",
      error: error.message,
    };
  }
}

export async function removeLike(userId, postId) {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);

    if (error) {
      throw new Error(error.message);
    }
    return { success: true, msg: "Like removed successfully" };
  } catch (error) {
    console.error("Could not remove the like ", error.message);
    return {
      success: false,
      msg: "Could not remove the like",
      error: error.message,
    };
  }
}

export async function creatComment(postComment) {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(postComment)
      .select()
      .single();
    if (error) {
      console.error("Error comment post:", error.message);

      return { success: false, error };
    }
    return { success: true, data: data };
  } catch (error) {
    console.error("Error in creatComment:", error.message, postLike); // Log the full context
    return {
      success: false,
      msg: "Could not Comment your post",
      error: error.message,
    };
  }
}
export async function removeComment(commentId) {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      throw new Error(error.message);
    }
    return { success: true, data: { commentId } };
  } catch (error) {
    console.error("Could not remove the comment ", error.message);
    return {
      success: false,
      msg: "Could not remove the comment",
      error: error.message,
    };
  }
}

export async function fetchPostDelete(postId) {
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.error("Error deleting post:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data: { postId } };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: err.message };
  }
}
export async function fetchPostsCommentsCount(postId) {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select("id") // Fetch only comment IDs
      .eq("postId", postId);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, count: data.length || 0 }; // Ensure it never returns undefined
  } catch (error) {
    console.error("Error Fetching comment count:", error.message);
    return {
      success: false,
      msg: "Could not fetch comment count",
      error: error.message,
    };
  }
}
