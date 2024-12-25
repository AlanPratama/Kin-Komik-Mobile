import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { images } from "../../assets";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SimpleCardComic({
  comic,
  handleNavigate,
  showRating = true,
}) {
  return (
    <TouchableOpacity
      onPress={handleNavigate}
      activeOpacity={0.80}
      style={styles.cardContainer}
    >
      <ImageBackground
        source={{ uri: comic?.image || comic?.imageSrc || comic?.imageUrl }}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        <View style={styles.overlay} className="bg-dark/25">
          {/* Event Badge */}
          {showRating && (
            <View style={styles.eventBadge} className="flex-row items-center">
              <MaterialCommunityIcons name="star" size={14} color="#121212" />
              <Text style={styles.eventText}>{parseFloat(comic?.rating)}</Text>
            </View>
          )}

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text numberOfLines={2} style={styles.title}>
              {comic?.title}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "31%",
    height: 140,
    borderRadius: 8,
    overflow: "hidden",
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  image: {
    borderRadius: 8,
  },
  overlay: {
    flex: 1,
    padding: 5.5,
    justifyContent: "space-between",
    // backgroundColor: "rgba(0,0,0,0.3)",
  },
  eventBadge: {
    position: "absolute",
    backgroundColor: "#f9cb55",
    padding: 5,
    borderBottomEndRadius: 8,
    alignSelf: "flex-start",
  },
  eventText: {
    color: "#121212",
    fontSize: 12,
    fontWeight: "bold",
  },
  titleContainer: {
    marginTop: "auto",
  },
  title: {
    color: "white",
    fontSize: 13.5,
    fontWeight: "bold",
  },
});
