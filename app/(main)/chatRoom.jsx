import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import AvatarImage from "../../components/AvatarImage";
import { hp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/Icons";
import { useLocalSearchParams } from "expo-router";
import MessageList from "../../components/MessageList";
import Input from "../../components/Input";
import { Creatmessage, fetchMessages } from "../../sevices/messages";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import { supabase } from "../../lip/supabase";

export default function ChatRoom() {
  const item = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(""); // Use useRef for the input value
  const { user } = useAuth();

  const handleSendMessage = async () => {
    const message = inputRef.current.trim(); // Access the ref value
    if (!message) return;

    const newMessage = {
      senderId: user?.id,
      receiverId: item?.id,
      message: message,
      created_at: new Date().toISOString(),
    };

    setLoading(true);
    try {
      const res = await Creatmessage(newMessage);

      // Clear the input field
      inputRef.current = ""; // Reset the ref value
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function getMessages() {
      try {
        const res = await fetchMessages(user?.id, item?.id);
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
  }, []);

  async function handleMessages(payload) {
    if (payload.eventType === "INSERT" && payload.new) {
      try {
        const res = await fetchMessages(user?.id, item?.id); // Fetch all messages again
        if (res.success && Array.isArray(res.data)) {
          setMessages(res.data);
        } else {
          console.error("Invalid messages data:", res);
        }
      } catch (error) {
        console.error("Error in handleMessages:", error);
      }
    }
  }

  useEffect(() => {
    let messageChannel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        handleMessages
      )
      .subscribe();
    return () => {
      supabase.removeChannel(messageChannel).catch(console.error);
    };
  }, []);

  return (
    <ScreenWrapper>
      <Header
        title={item?.name}
        avatar={
          <AvatarImage
            uri={item?.image}
            size={hp(5.3)}
            rounded={theme.redius.xxl}
            style={{ borderWidth: 2 }}
          />
        }
        headerRight={() => (
          <View style={styles.headerIcons}>
            <Icon
              name="video"
              size={hp(4)}
              fill={theme.colors.textLight}
              style={{ color: theme.colors.textLight }}
            />
            <Icon
              name="call"
              size={hp(9)}
              fill={theme.colors.textLight}
              style={{ color: theme.colors.textLight }}
            />
          </View>
        )}
      />
      <View style={styles.line} />
      <View style={styles.chatBackground}>
        <View style={styles.backgroundMessage}>
          <MessageList messages={messages} currentUser={user} />
        </View>
        <View style={styles.InputContainer}>
          <Input
            placeholder="Type a message !"
            placeholderTextColor={theme.colors.textLight}
            containerStyle={styles.Input}
            defaultValue={inputRef.current} // Use defaultValue instead of value
            onChangeText={(text) => (inputRef.current = text)} // Update the ref value
          />
          {loading ? (
            <View style={{ size: "small" }}>
              <Loading />
            </View>
          ) : (
            <TouchableOpacity style={styles.icon} onPress={handleSendMessage}>
              <Icon
                name="send"
                size={hp(9)}
                strokeWidth={1.6}
                style={{ color: theme.colors.textLight }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  line: {
    borderWidth: 0.4,
    borderColor: theme.colors.gray,
  },
  chatBackground: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: theme.colors.gray,
    overflow: "visible",
  },
  backgroundMessage: {
    flex: 1,
  },
  InputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.white,
  },
  Input: {
    flex: 1,
    height: hp(7),
    paddingHorizontal: 9,
    backgroundColor: "white",
    borderRadius: theme.redius.xs,
  },
  icon: {
    backgroundColor: theme.colors.gray,
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
