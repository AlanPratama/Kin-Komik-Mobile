import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { images } from "../../../assets";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const links = [
  {
    link: "https://github.com/AlanPratama",
    iconName: "github",
    title: "Github",
  },
  // {
  //   link: "https://www.linkedin.com/in/alanpratama/",
  //   iconName: "linkedin",
  //   title: "Linkedin",
  // },
  {
    link: "https://alanpratama.com",
    iconName: "web",
    title: "Personal Website",
  },
];

export default function InfoScreen() {
  return (
    <View className="min-h-screen bg-dark p-4">
      <Text className="text-white text-2xl font-go my-3">Pengembang</Text>
      <View className="mt-4 justify-center items-center">
        <Image
          source={images.rei}
          className="border border-white/35 w-32 h-32 aspect-square rounded-full"
        />
        <Text className="text-white text-xl font-semibold mt-2">Alan Pratama</Text>

        <View className="mt-8 w-full gap-3">
          {/* <Text className='text-white text-xl text-left font-go mt-2'></Text> */}
          {links.map((link, index) => (
            <CardLink
              key={index}
              link={link.link}
              iconName={link.iconName}
              title={link.title}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const CardLink = ({ link, iconName, title }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => Linking.openURL(link)}
    className="flex-row justify-start items-center bg-[#262626] w-full rounded-full px-4 py-3"
  >
    <MaterialCommunityIcons name={iconName} size={26} color="white" />
    <Text className="text-white text-lg ml-2">{title}</Text>
  </TouchableOpacity>
);
