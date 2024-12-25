import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WebView from "react-native-webview";
import axiosInstance from "../apis/axiosInstance";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Loading from "../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChapterDetailScreen({ route }) {
  const { chapterId, chapters, comic } = route.params;
  const navigate = useNavigation();
  

  const [isLoading, setIsLoading] = useState(true);
  const [isVisibleInfo, setIsVisibleInfo] = useState(false);
  const [data, setData] = useState({});

  const handleHistoryChapters = async (chapterIdParam) => {
    const chapterObj = {
      date: new Date().toISOString(),
      imageSrc: comic?.imageSrc,
      title: comic?.title,
      chapterId: chapterIdParam,
      comic
    };

    const arrChapters = JSON.parse(
      (await AsyncStorage.getItem("chapters")) || "[]"
    );
    const existIndex = await arrChapters.findIndex(
      (item) => item.title === comic?.title
    );

    // console.log("existIndex: ", existIndex);

    if (existIndex !== -1) {
      arrChapters[existIndex] = chapterObj;
    } else {
      arrChapters.push(chapterObj);
    }

    await AsyncStorage.setItem("chapters", JSON.stringify(arrChapters));
    // console.log("arrChapters: ", arrChapters);
  };

  const getData = async (chapterIdParam = chapterId) => {
    setIsLoading(true);
    await handleHistoryChapters(chapterIdParam);
    const res = await axiosInstance.get(`/chapter/${chapterIdParam}`);
    setData(res.data);
    setIsVisibleInfo(false);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <WebView
        style={styles.container}
        source={{
          uri:
            "https://kin-komik-images.alanpratama.com/?images=" +
            data?.images?.join(","),
          // uri: "https://alanpratama.com/",
        }}
      />
      <View className="absolute bottom-0 w-full">
        <View className="w-full justify-center items-center bg-[#121212] py-0.5">
          <TouchableOpacity
            activeOpacity={0.5}
            className="bg-dark py-0.5 px-1 rounded"
            onPress={() => setIsVisibleInfo(!isVisibleInfo)}
          >
            <Text className="text-center text-white font-go font-medium">
              {isVisibleInfo ? "Sembunyikan" : "Tampilkan"} Informasi
            </Text>
          </TouchableOpacity>
        </View>
        {isVisibleInfo && (
          <ScrollView className="bg-dark h-[230px] border border-white/35">
            <View className="flex-row justify-start items-center gap-2 p-4">
              <Image
                source={{ uri: comic?.imageSrc }}
                className="w-1/3 h-44"
                resizeMode="contain"
              />
              <View className="w-2/3">
                <Text className="text-white text-xl font-go font-medium">
                  {comic?.title}
                </Text>
                {
                  <Text className="text-white text-base font-medium">
                    Chapter: {data?.title?.split("Chapter ")[1]}
                  </Text>
                }
                <View className="flex-row justify-start items-center gap-1 w-full mt-4">
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => getData(data?.prevChapter?.split("/")[3])}
                      className={`${data?.prevChapter ? 'bg-accent' : 'bg-neutral-500'} py-1 rounded w-[48%]`}
                      disabled={!data?.prevChapter}
                    >
                      <Text className="text-center text-dark font-medium">
                        Prev
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => getData(data?.nextChapter?.split("/")[3])}
                      className={`${data?.nextChapter ? 'bg-accent' : 'bg-neutral-500'} py-1 rounded w-[48%]`}
                      disabled={!data?.nextChapter}
                    >
                      <Text className="text-center text-dark font-medium">
                        Next
                      </Text>
                    </TouchableOpacity>
                </View>
              </View>
            </View>
            <View className="gap-3 p-4">
              {chapters?.map((item, i) => (
                <TouchableOpacity
                  key={`chapter-${i}-${item?.chapterNum}`}
                  //   onPress={() => handleDetailChapterNavigation(item?.chapterLink, item?.chapterNum)}
                  onPress={() => getData(item?.chapterLink?.split("/")[3])}
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
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
