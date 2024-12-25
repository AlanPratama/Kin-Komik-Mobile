import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import axiosInstance from "../apis/axiosInstance";
import Loading from "./Loading";
import { useNavigation } from "@react-navigation/native";

export default function ListGenres() {
  const { isLoading, data } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/genres`);
      return res.data.genres || [];
    },
  });

  const navigate = useNavigation()

  const handleGenreNavigation = (genre) => {
    navigate.navigate("ComicByGenre", { genre })
  }

  if (isLoading) return <Loading />;

  return (
    <View className="mb-8">
      <Text className="text-white text-2xl font-go my-3">
        {"Kumpulan Genre"}
      </Text>

      <View className="flex-row flex-wrap justify-start items-center gap-2 mt-4">
        {data?.map((item, i) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleGenreNavigation(item)}
            key={`genre-${i}-${item?.value}`}
            className=" bg-accent rounded-md px-3 py-1.5"
          >
            <Text className="text-dark font-medium">{item?.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
