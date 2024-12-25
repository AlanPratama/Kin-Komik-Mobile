import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { use, useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { images } from "../../assets";
import { shadow } from "../utils/shadow";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../apis/axiosInstance";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/Loading";
import { slug } from "../utils/string";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ComicDetailScreen({ route }) {
  const navigate = useNavigation();
  const { comicId } = route.params;

  const { isLoading, error, data } = useQuery({
    queryKey: ["detail-comic", comicId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/manhwa-detail/${comicId}`);
      return res.data || [];
    },
  });

  // console.log("ERR QUERY: ", error);
  // console.log("comicId: ", comicId);
  
  const querClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [isReadMore, setIsReadMore] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleDetailChapterNavigation = async (link) => {
    try {
      if (!data) return;

      const chapterId = link.split("/")[3];

      navigate.navigate("ChapterDetail", {
        chapterId,
        chapters: data?.chapters,
        comic: data,
      });
    } catch (error) {
      console.log("ERR: ", error);
    }
  };

  const handleGenreNavigation = (genre) => {
    navigate.navigate("ComicByGenre", { genre });
  };

  const checkIsFavorite = async () => {
    try {
      const arrFav = JSON.parse(
        (await AsyncStorage.getItem("favorites")) || "[]"
      );

      const isFav = arrFav.some((item) => item?.title === data?.title);

      setIsFavorite(isFav);
    } catch (error) {
      console.log("ERR: ", error);
    }
  };

  const handleFavorite = async () => {
    try {
      const arrFav = JSON.parse(
        (await AsyncStorage.getItem("favorites")) || "[]"
      );

      if (isFavorite) {
        const filteredFav = arrFav.filter(
          (item) => item?.title !== data?.title
        );
        await AsyncStorage.setItem("favorites", JSON.stringify(filteredFav));
        setIsFavorite(false);
      } else {
        const newFav = { ...data, comicId };
        arrFav.push(newFav);
        await AsyncStorage.setItem("favorites", JSON.stringify(arrFav));
        setIsFavorite(true);
      }
    } catch (error) {
      console.log("ERR: ", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await querClient.refetchQueries(["detail-comic", comicId]);
    await checkIsFavorite();
    setRefreshing(false);
  };

  useEffect(() => {
    checkIsFavorite();
  }, []);

  useEffect(() => {
    if (error) navigate.goBack();
  }, [error])

  if (isLoading) return <Loading />;

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 50 }}
      className="min-h-screen bg-dark"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ImageBackground source={{ uri: data?.imageSrc }}>
        <View style={styles.overlay} className="bg-dark/85 px-4">
          <View className="flex-row justify-between items-center -mt-2 mb-4">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigate.goBack()}
              className="flex flex-row justify-start items-center"
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={24}
                color={"#fff"}
              />
              <Text className={`text-xl font-medium font-go text-white`}>Kembali</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5} onPress={handleFavorite}>
              <MaterialCommunityIcons
                name={isFavorite ? "heart" : "heart-outline"}
                size={28}
                color={"#fff"}
              />
            </TouchableOpacity>
          </View>

          <View style={shadow.xl10} className="w-[65%] mx-auto">
            <Image
              source={{ uri: data?.imageSrc }}
              className="w-full h-[300px]"
              resizeMode="contain"
            />
          </View>
        </View>
      </ImageBackground>

      <View className="p-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-accent border border-accent rounded-sm px-2 py-0.5 text-base">
            {data?.status}
          </Text>
          <View className="flex-row justify-start items-center gap-0.5">
            <MaterialCommunityIcons name="star" size={24} color="#f9cb55" />
            <Text className="text-white text-xl">
              {parseFloat(data?.rating)}
            </Text>
          </View>
        </View>
        <Text className="text-white text-4xl font-go">{data?.title}</Text>

        <View className="my-3">
          <View className="flex-row justify-start items-center gap-1 mt-1 w-[95%]">
            <MaterialCommunityIcons name="account" size={17.5} color="#fff" />
            {/* <Text className="text-white/65 text-sm">Author: </Text> */}
            <Text className="text-white/75 text-sm">{data?.author}</Text>
          </View>

          <View className="flex-row justify-start items-center gap-1 mt-1 w-[95%]">
            <MaterialCommunityIcons name="account" size={17.5} color="#fff" />
            {/* <Text className="text-white/65 text-sm">Artis: </Text> */}
            <Text className="text-white/75 text-sm">{data?.artist}</Text>
          </View>

          <View className="flex-row justify-start items-center gap-1 mt-1">
            <MaterialCommunityIcons name="eye" size={17.5} color="#fff" />
            <Text className="text-white/75 text-sm">{data?.followedBy}</Text>
          </View>
        </View>

        <View className="flex-row flex-wrap justify-start items-center gap-2 mt-4">
          {data?.genres?.map((item, i) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                handleGenreNavigation({
                  label: item.genreName,
                  value: item.genreName,
                })
              }
              key={`genre-${i}-${item}`}
              className=" bg-accent rounded-md px-3 py-1.5"
            >
              <Text className="text-dark font-medium">{item.genreName}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-4">
          <Text className="text-white text-lg font-medium">Sinopsis</Text>
          <Text numberOfLines={isReadMore ? 0 : 3} className="text-white/75">
            {data?.synopsis}
          </Text>
          <TouchableOpacity
            className="mt-1"
            onPress={() => setIsReadMore(!isReadMore)}
          >
            <Text className="capitalize text-accent">
              {isReadMore ? "lebih sedikit" : "selengkapnya"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6">
          <Text className="text-white text-2xl font-go mb-2.5">Chapter:</Text>

          <View className="gap-3">
            {data?.chapters?.map((item, i) => (
              <TouchableOpacity
                key={`chapter-${i}-${item?.chapterNum}`}
                onPress={() =>
                  handleDetailChapterNavigation(
                    item?.chapterLink,
                    item?.chapterNum
                  )
                }
                activeOpacity={0.82}
                className="flex-row justify-between items-center border border-accent/10 rounded-lg bg-[#262626] w-full p-2.5"
              >
                <View className="w-[90%]">
                  <Text className="text-white/90 font-medium mb-0.5">
                    {item?.chapterNum}
                  </Text>
                  <Text className="text-white/75">{item?.chapterDate}</Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={26}
                  color="#f8f8f8"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: 5.5,
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
});
