import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity } from "react-native";
import axiosInstance from "../apis/axiosInstance";
import ListComics from "../components/ListComics";
import Loading from "../components/Loading";

export default function ComicByGenreScreen({ route }) {

  const { genre } = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigation();
  const querClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: ["comicsByGenre", genre],
    queryFn: async () => {
      const res = await axiosInstance.get(`/genre/${genre?.value}`);

      // console.log(res.data);

      return res.data.seriesList;
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await querClient.refetchQueries(["comicsByGenre", genre]);
    setRefreshing(false);
  };

  if (isLoading) return <Loading />;

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 50 }}
      className="min-h-screen bg-dark p-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigate.goBack()}
        className="flex flex-row justify-start items-center"
      >
        <MaterialCommunityIcons name="chevron-left" size={24} color={"#fff"} />
        <Text className={`text-xl font-medium font-go text-white`}>Kembali</Text>
      </TouchableOpacity>
      {data?.length > 0 && (
        <ListComics textTitle={`Genre ${genre.label}`} comics={data} />
      )}
    </ScrollView>
  );
}
