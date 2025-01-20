import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import Home from "./Home";
import { theme } from "../../constants/theme";
import Call from "./Call";
import Camera from "./Camera";
import Delete from "./Delete";
import Edit from "./Edit";
import Notifications from "./Notifications";
import Image from "./Image";
import Location from "./Location";
import Lock from "./Lock";
import Logout from "./Logout";
import Mail from "./Mail";
import Plus from "./Plus";
import Search from "./Search";
import Send from "./Send";
import Share from "./Share";
import ThreeDotsCircle from "./ThreeDotsCircle";
import ThreeDotsHorizontal from "./ThreeDotsHorizontal";
import User from "./User";
import Video from "./Video";
import Messages from "./Messages";
import ArrowLeft from "./ArrowLeft";
import Heart from "./Heart";
import Comment from "./Comment";

const icons = {
  heart: Heart,
  home: Home,
  arrowLeft: ArrowLeft,
  call: Call,
  camera: Camera,
  delete: Delete,
  edit: Edit,
  notifications: Notifications,
  image: Image,
  location: Location,
  lock: Lock,
  logout: Logout,
  mail: Mail,
  plus: Plus,
  search: Search,
  send: Send,
  share: Share,
  threeDotsCircle: ThreeDotsCircle,
  threeDotsHorizontal: ThreeDotsHorizontal,
  user: User,
  video: Video,
  messages: Messages,
  comment: Comment,
};

export default function Icon({ name, ...props }) {
  const IconsComponent = icons[name];

  return (
    <IconsComponent
      height={props.size || 24}
      Width={props.size || 24}
      color={theme.colors.darkLight}
      strokeWidth={props.strokeWidth || 1.9}
      {...props}
    />
  );
}
