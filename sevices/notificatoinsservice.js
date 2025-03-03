import { supabase } from "../lip/supabase";
export async function CreateNotification(notification) {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .maybeSingle();
  } catch (error) {
    console.error("Error in createNotifaction", error.message, postLike);
    return {
      success: false,
      msg: "Could not Like your Notification",
      error: error.message,
    };
  }
}
export async function fetchNotifications(receiverId) {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(`*, sender: senderId(id, name, image)`)

      .order("created_at", { ascending: false })
      .eq("receiverId", receiverId);
    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data: data };
  } catch (error) {
    console.error("Error in fetch notifications:", error);
    return {
      success: false,
      msg: "Could not fetch the notification",
      error: error.message,
    };
  }
}
