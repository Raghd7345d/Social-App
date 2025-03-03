import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AvatarImage from "./AvatarImage";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
import Svg, { Path } from "react-native-svg";
import moment from "moment"; // Make sure to import moment

export default function MessageItem({ message, currentUser }) {
  const isCurrentUser = currentUser?.id === message?.senderId;
  const createdAt = moment(message?.created_at).format(" h:mm A");

  return (
    <View style={[styles.item, isCurrentUser ? styles.itemOut : styles.itemIn]}>
      <AvatarImage
        uri={isCurrentUser ? currentUser?.image : message?.sender?.image}
        size={hp(4.3)}
        rounded={theme.redius.xxl}
        style={styles.avatar}
      />

      <View
        style={[
          styles.textMessageContainer,
          isCurrentUser ? styles.textMessageWhite : styles.textMessageGrey,
        ]}
      >
        <Text style={isCurrentUser ? styles.textWhite : styles.textGrey}>
          {message?.message}
        </Text>

        {/* Display the timestamp */}
        <Text
          style={[
            isCurrentUser ? styles.timeWhite : styles.timeGrey,
            styles.timeText,
          ]}
        >
          {createdAt}
        </Text>

        <View
          style={[
            styles.arrowContainer,
            isCurrentUser
              ? styles.arrowRightContainer
              : styles.arrowLeftContainer,
          ]}
        >
          <Svg
            style={isCurrentUser ? styles.arrowRight : styles.arrowLeft}
            width={15.5}
            height={17.5}
            viewBox="32.485 17.5 15.515 17.5"
            enableBackground="new 32.485 17.5 15.515 17.5"
          >
            <Path
              d={
                isCurrentUser
                  ? "M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
                  : "M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
              }
              fill={isCurrentUser ? theme.colors.primary : "grey"}
              x="0"
              y="0"
            />
          </Svg>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    marginVertical: 7,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  itemIn: {
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  itemOut: {
    alignSelf: "flex-end",
    marginRight: 20,
    flexDirection: "row-reverse",
  },
  avatar: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  textMessageContainer: {
    maxWidth: 250,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 7,
    borderRadius: 20,
    position: "relative",
  },
  textMessageWhite: {
    backgroundColor: theme.colors.primary,
  },
  textMessageGrey: {
    backgroundColor: "grey",
  },
  textWhite: {
    color: "white",
    paddingTop: 5,
  },
  textGrey: {
    color: "white",
    paddingTop: 5,
  },
  timeText: {
    fontSize: 12,
    marginTop: 3,
  },
  timeWhite: {
    color: "white",
    textAlign: "right",
  },
  timeGrey: {
    color: "white",
    textAlign: "left",
  },
  arrowContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    flex: 1,
  },
  arrowLeftContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  arrowRightContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  arrowLeft: {
    left: -6,
  },
  arrowRight: {
    right: -6,
  },
});
