import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { WebView } from "react-native-webview";
import { theme } from "../constants/theme";

export default function RichTextEditor({ editorRef, onChange }) {
  return (
    <View style={{ minHeight: 285 }}>
      <RichToolbar
        actions={[
          actions.insertImage,
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.keyboard,
          actions.setStrikethrough,
          actions.setUnderline,
          actions.removeFormat,
          actions.insertVideo,
          actions.checkboxList,
          actions.undo,
          actions.redo,
          actions.code,
          actions.alignCenter,
          actions.alignLeft,
          actions.alignFull,
          actions.alignRight,
          actions.heading1,
          actions.heading4,
          actions.insertImage,
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }) => (
            <Text style={{ color: tintColor }}>H1</Text>
          ),
          [actions.heading4]: ({ tintColor }) => (
            <Text style={{ color: tintColor }}>H4</Text>
          ),
        }}
        style={styles.richToolbar}
        flatContainerStyle={styles.flatStyle}
        editor={editorRef}
        disabled={false}
        selectedIconTint={theme.colors.primaryDark}
      />

      <RichEditor
        ref={editorRef}
        containerStyle={styles.rich}
        editorStyle={styles.containerStyle}
        placeholder={"what is on your mind?"}
        onChange={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  richToolbar: {
    borderTopRightRadius: theme.redius.xl,
    borderTopLeftRadius: theme.redius.xl,
    backgroundColor: theme.colors.gray,
  },
  rich: {
    minHeight: 240,
    flex: 1,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: theme.redius.xl,
    borderBottomRightRadius: theme.redius.xl,
    borderColor: theme.colors.gray,
    padding: 5,
  },
  containerStyle: {
    color: theme.colors.textDark,
    placeholderColor: "gray",
  },
  flatStyle: {
    paddingHorizontal: 8,
    gap: 5,
  },
});
