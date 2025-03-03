import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import AvatarImage from "./AvatarImage";
import { useAuth } from "../contexts/AuthContext";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import moment from "moment";
import { fetchMessages } from "../sevices/messages";

export function ChatItem({ item, noBorder, router }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const createdAt = moment(item?.created_at).format("MMM D");

  function onChatRoom() {
    router.push({ pathname: "/chatRoom", params: item });
  }

  useEffect(() => {
    async function getMessages() {
      try {
        const res = await fetchMessages(user?.id, item?.id);
        console.log(messages);

        if (res.success && Array.isArray(res.data)) {
          setMessages(res.data);
        } else {
          console.error("Invalid Messages data", res);
        }
      } catch (error) {
        console.error("Error fetching Messages:", error);
      }
    }

    if (user?.id && item?.id) {
      getMessages();
    } else {
      console.error("User ID or Item ID is undefined");
    }
  }, []); //

  function renderLastMessage() {
    if (messages.length === 0) {
      return "Salute like a penguin and say Hi! 🐧";
    }

    const lastMessage = messages[messages.length - 1];

    if (user?.id === lastMessage?.senderId) {
      return `You: ${lastMessage?.message}`;
    }

    return lastMessage?.message || "No message yet.";
  }

  return (
    <TouchableOpacity
      onPress={onChatRoom}
      style={[styles.chatList, noBorder && styles.noBorder]} // Corrected conditional styling
    >
      <AvatarImage
        uri={item?.image}
        size={hp(5.3)}
        rounded={theme.redius.xxl} // Corrected typo
        style={{ borderWidth: 2 }}
      />
      <View style={styles.contentContainer}>
        <View style={styles.TimeName}>
          <Text style={styles.Text}>{item?.name}</Text>
          <Text style={styles.Time}>{createdAt}</Text>
        </View>
        <Text style={styles.lastMessage}>{renderLastMessage()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chatList: {
    padding: 10,
    borderRadius: theme.redius.xl, // Corrected typo
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginHorizontal: 3,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray,
  },
  noBorder: {
    borderBottomWidth: 0, // Remove bottom border
  },
  contentContainer: {
    flex: 1,
  },
  TimeName: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Text: {
    flex: 1,
    fontWeight: theme.fonts.semibold,
  },
  Time: {
    color: theme.colors.textLight,
    fontSize: hp(1.4),
    marginLeft: 10,
    fontWeight: theme.fonts.medium,
  },
  lastMessage: {
    marginTop: 4,
    color: theme.colors.textLight,
    fontSize: hp(1.4),
    fontWeight: theme.fonts.medium,
  },
});
