import React from "react";
import { FlatList } from "react-native";
import MessageItem from "./MessageItem";

export default function MessageList({ messages, currentUser }) {
  return (
    <FlatList
      data={messages}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <MessageItem message={item} currentUser={currentUser} />
      )}
      contentContainerStyle={{ paddingTop: 10 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
