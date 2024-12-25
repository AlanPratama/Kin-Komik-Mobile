import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Loading from "../../components/Loading";
import NoData from "../../components/NoData";

export default function FavoriteComicsScreen() {
  const navigate = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);

  const handleDetailComicNavigation = (comicId) => {
    navigate.navigate("ComicDetail", { comicId });
  };

  const getFavoriteComics = async () => {
    setIsLoading(true);
    const chapters = await JSON.parse(
      (await AsyncStorage.getItem("favorites")) || "[]"
    );
    setData(chapters);
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getFavoriteComics()
    setRefreshing(false);
  };

  useEffect(() => {
    getFavoriteComics();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      className="min-h-screen bg-dark p-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigate.goBack()}
        className="flex flex-row justify-start items-center"
      >
        <MaterialCommunityIcons name="chevron-left" size={24} color={"#fff"} />
        <Text className={`text-xl font-medium font-go text-white`}>Kembali</Text>
      </TouchableOpacity> */}

      <View>
        <Text className="text-white text-2xl font-go my-3">Komik Favorit</Text>

        {isLoading ? (
          <Loading isHeightFull={false} />
        ) : data?.length > 0 ? (
          <View className="gap-5 mt-2">
            {data?.map((item, i) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleDetailComicNavigation(item.comicId)}
                key={`comic-${i}-${item.title}`}
                className="flex-row justify-start items-start gap-2"
              >
                <Image
                  source={{ uri: item?.imageSrc }}
                  className="w-1/3 h-48 border border-white/20 rounded-md"
                  resizeMode="contain"
                />
                <View className="w-2/3">
                  <Text
                    numberOfLines={2}
                    className="text-white text-xl font-go font-semibold mb-1 w-[90%]"
                  >
                    {item?.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="text-white/90 text-base font-medium w-[90%]"
                  >
                    {item?.author}
                  </Text>

                  <View className="flex-row justify-start items-center mt-1.5">
                    <MaterialCommunityIcons
                      name="star"
                      size={24}
                      color={"#f9cb55"}
                      className="mr-1"
                    />
                    <Text className="text-white/90 text-base font-medium">
                      {item?.rating} ({item?.status})
                    </Text>
                  </View>

                  <Text
                    numberOfLines={3}
                    className="text-white/75 w-[90%] mt-1.5"
                  >
                    {item?.synopsis}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : <NoData message="Tidak Ada Komik Favorit" />}
      </View>
    </ScrollView>
  );
}
