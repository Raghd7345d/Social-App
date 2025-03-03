import React from "react";
import { Text, View, FlatList } from "react-native";
import { ChatItem } from "./ChatItem";
import { useRouter } from "expo-router";

export function ChatList({ users }) {
  const router = useRouter();
  return (
    <View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 25 }}
        renderItem={({ item, index }) => (
          <ChatItem
            router={router}
            noBorder={index + 1 === users.length}
            item={item}
            index={index}
          />
        )}
      />
    </View>
  );
}
