import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Loading from "../../components/Loading";
import { convertTime } from "../../utils/dateTimeUtils";
import NoData from "../../components/NoData";

export default function HistoryComicsScreen() {
  const navigate = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);

  const handleDetailChapterNavigation = async (history) => {
    try {
      if (!history) return;

      navigate.navigate("ChapterDetail", {
        chapterId: history.chapterId,
        chapters: history?.comic?.chapters,
        comic: history?.comic,
      });
    } catch (error) {
      console.log("ERR: ", error);
    }
  };

  const handleDeleteHistory = async (history) => {
    try {
      const arrChapters = JSON.parse(
        (await AsyncStorage.getItem("chapters")) || "[]"
      );
      
      const filteredChapters = arrChapters.filter(
        (item) => item.title !== history.title
      );

      await AsyncStorage.setItem("chapters", JSON.stringify(filteredChapters));
      setData(filteredChapters);
    } catch (error) {
      console.log("ERR: ", error);
    }
  };

  const getHistoryComics = async () => {
    setIsLoading(true);
    const chapters = await JSON.parse(
      (await AsyncStorage.getItem("chapters")) || "[]"
    );

    if (chapters.length > 0) {
      const sortKomik = chapters.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setData(sortKomik);
    }

    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getHistoryComics()
    setRefreshing(false);
  };

  useEffect(() => {
    getHistoryComics();
  }, []);

  // console.log("chapters: ", data[1]?.chapters);

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
        <Text className="text-white text-2xl font-go my-3">
          History Chapter
        </Text>

        {isLoading ? (
          <Loading isHeightFull={false} />
        ) : data?.length > 0 ? (
          <View className="gap-5 mt-2">
            {data?.map((item, i) => (
              <View
                key={`comic-${i}-${item.title}`}
                className="flex-row justify-start items-center gap-2"
              >
                <Image
                  source={{ uri: item?.imageSrc }}
                  className="w-1/3 h-48 border border-white/20 rounded-md"
                  resizeMode="contain"
                />
                <View className="pr-1 w-2/3">
                  <Text
                    numberOfLines={2}
                    className="text-white text-xl font-go font-semibold mb-1 w-[90%]"
                  >
                    {item?.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="text-white/90 text-lg font-medium w-[90%]"
                  >
                    Chapter: {item?.chapterId?.split("chapter-")[1]}
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="bg-accent py-2 rounded mt-2"
                    onPress={() => handleDetailChapterNavigation(item)}
                  >
                    <Text className="text-dark text-center font-go">
                      Lanjut Baca
                    </Text>
                  </TouchableOpacity>

                  <View className="flex-row justify-between items-center w-full mt-0.5">
                    <Text className="text-white/90 text-base mt-1 w-[75%]">
                      {convertTime(item?.date)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteHistory(item)}
                      activeOpacity={0.7}
                      className="w-[22%]"
                    >
                      <Text className="text-red-400 text-base mt-1 text-right">
                        Hapus
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : <NoData message="Tidak Ada History" />}
      </View>
    </ScrollView>
  );
}
