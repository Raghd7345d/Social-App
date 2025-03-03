import React, { Component, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AvatarImage from "./AvatarImage";
import { theme } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import moment from "moment";
import Icon from "../assets/Icons";
import { Alert } from "react-native";
import { supabase } from "../lip/supabase";
import { getUserData } from "../sevices/userService";

export function CommentItem({
  item,
  canDelete = true,
  onDelete = () => {},
  highlight = false,
}) {
  const { user } = useAuth();
  const createdAt = moment(item?.created_at).format("MMM D");
  function deleteComment() {
    Alert.alert("Yikes!", "Nuke this comment? It vanishes like free pizza!", [
      { text: "Nah", onPress: () => console.log("Saved!") },
      { text: "Bye bye!", onPress: () => onDelete(item), style: "destructive" },
    ]);
  }

  return (
    <View style={styles.container}>
      <AvatarImage uri={item?.user?.image} rounded={theme.redius.xl} />
      <View style={[styles.content, highlight && styles.highlight]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={styles.contentName}>
            <Text style={styles.text}>{item?.user?.name}</Text>
            <Text>.</Text>
            <Text style={styles.texttime}>{createdAt}</Text>
          </View>
          {canDelete && (
            <TouchableOpacity onPress={deleteComment}>
              <Icon name="delete" size={20} color={theme.colors.rose} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.textComment, { fontWeight: "normal" }]}>
          {item?.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 7,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  content: {
    backgroundColor: "rgba(0,0,0,0.06)",
    flex: 1,
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.redius.md,
    borderCurve: "continuous",
  },
  contentName: {
    flexDirection: "row",
    gap: 5,
  },
  text: {
    color: theme.colors.textDark,
    fontWeight: "bold",
  },
  texttime: {
    color: theme.colors.darkgray,
  },
  highlight: {
    borderWidth: 0.2,
    backgroundColor: "white",
    borderColor: theme.colors.dark,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
