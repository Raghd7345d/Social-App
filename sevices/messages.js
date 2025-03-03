import { supabase } from "../lip/supabase";
export async function Creatmessage(message) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert([message]) // Ensure message is wrapped in an array
      .select(
        `*, 
        sender: senderId(id, name, image)`
      )
      .single(); // Use .single() only if you expect exactly one row

    if (error) {
      console.error("Error creating message:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data }; // Return the inserted message data
  } catch (error) {
    console.error("Error in Creatmessage:", error.message);
    return {
      success: false,
      msg: "Could not create message",
      error: error.message,
    };
  }
}
export async function fetchMessages(userId, receiverId) {
  if (!userId || !receiverId) {
    console.error("User ID or Receiver ID is undefined");
    return { success: false, msg: "User ID or Receiver ID is undefined" };
  }

  try {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `*, 
        sender: senderId(id, name, image), 
        receiver: receiverId(id, name, image)`
      )
      .or(
        `and(senderId.eq.${userId},receiverId.eq.${receiverId}),and(senderId.eq.${receiverId},receiverId.eq.${userId})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data }; // Return the fetched messages
  } catch (error) {
    console.error("Error in fetchMessages:", error);
    return {
      success: false,
      msg: "Could not fetch the messages",
      error: error.message,
    };
  }
}
