import { supabase } from "../lip/supabase";

export async function getUserData(userId) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return {
        success: false,
        msg: error.message || "Error fetching user data",
        data: null,
      };
    }

    return { success: true, data: data || null };
  } catch (err) {
    console.error("Unexpected error while fetching user data:", err);
    return { success: false, msg: "Unexpected error", data: null };
  }
}
export async function updateUser(userId, data) {
  if (!data || Object.keys(data).length === 0) {
    return { success: false, msg: "Update data cannot be empty" };
  }

  try {
    const { data: updatedData, error } = await supabase
      .from("users")
      .update(data)
      .eq("id", userId)
      .select(); // Get the updated data

    if (error) {
      console.error("Error updating user data:", error);
      return { success: false, msg: error.message };
    }

    if (!updatedData || updatedData.length === 0) {
      return { success: false, msg: "No rows were updated" };
    }

    return { success: true, data: updatedData };
  } catch (err) {
    console.error("Unexpected error while updating user data:", err);
    return { success: false, msg: "Unexpected error", data: null };
  }
}

export async function getAllUsers() {
  try {
    const { data, error } = await supabase.from("users").select("*"); // Fetch all users

    if (error) {
      console.error("Error fetching all users:", error);
      return {
        success: false,
        msg: error.message || "Error fetching all users",
        data: null,
      };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error("Unexpected error while fetching all users:", err);
    return { success: false, msg: "Unexpected error", data: null };
  }
}
