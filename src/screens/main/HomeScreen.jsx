import React, { useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import { shadow } from "../../utils/shadow";
import { images } from "../../../assets";
import SimpleCardComic from "../../components/SimpleCardComic";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../apis/axiosInstance";
import ListComics from "../../components/ListComics";
import ListComicsDynamic from "../../components/ListComicsDynamic";
import Loading from "../../components/Loading";
import ListGenres from "../../components/ListGenres";
import { slug } from "../../utils/string";

export default function HomeScreen() {
  const [dataTopComic, setDataTopComic] = useState([]);
  // const [dataPopularComic, setDataPopularComic] = useState([]);
  const [dataNewComic, setDataNewComic] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const queryClient = useQueryClient();

  const { isLoading: isLoadTopComic, data: _dataTopComic } = useQuery({
    queryKey: ["top-comic"],
    queryFn: async () => {
      const res = await axiosInstance.get("/manhwa-top");
      setDataTopComic(res.data);

      return res.data || [];
    },
  });

  // const { isLoading: isLoadPopularComic, data: _dataPopularComic } = useQuery({
  //   queryKey: ["popular-comic"],
  //   queryFn: async () => {
  //     const res = await axiosInstance.get("/manhwa-popular");
  //     setDataPopularComic(res.data);

  //     return res.data || [];
  //   },
  // });

  const { isLoading: isLoadNewComic, data: _dataNewComic } = useQuery({
    queryKey: ["new-comic"],
    queryFn: async () => {
      const res = await axiosInstance.get("/manhwa-new");
      setDataNewComic(res.data);

      return res.data || [];
    },
  });

  if (isLoadTopComic || isLoadNewComic) return <Loading />;

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["top-comic", "new-comic"]);
    setRefreshing(false);
  };

  // console.log("dataPopularComic: ", dataPopularComic);

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      className="min-h-screen bg-dark p-4"
      nestedScrollEnabled={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text className="text-white text-2xl font-go">Top Komik</Text>
      {isLoadTopComic ? <Loading isHeightFull={false} /> : <PagerView
        style={{
          flex: 1,
          height: 145,
          //   backgroundColor: "red",
        }}
        initialPage={0}
        pageMargin={10}
      >
        {dataTopComic.map((item, index) => (
          <View key={`top-comic-${index}`}>
            <BannerCard comic={item} />
          </View>
        ))}
      </PagerView>}
      <ListComicsDynamic textTitle="Populer Komik" />

      <ListGenres />

      {dataNewComic.length > 0 && (
        <ListComics
          textTitle="Komik Baru"
          comics={dataNewComic}
          showRating={false}
        />
      )}
    </ScrollView>
  );
}

const BannerCard = ({ comic }) => {
  const navigate = useNavigation();

  const handleDetailComicNavigation = (comicId) => {
    navigate.navigate("ComicDetail", { comicId: slug(comicId) });
  };

  return (
    <TouchableOpacity
      onPress={() => handleDetailComicNavigation(comic?.title)}
      activeOpacity={0.95}
      className="bg-accent rounded-xl pl-2.5 pr-3 relative w-[100%] max-h-32 justify-center mt-4"
    >
      <View className="h-full flex-row justify-between items-center">
        <View className="w-2/3 gap-1">
          <Text numberOfLines={1} className="text-base font-go">
            {comic?.title}
          </Text>
          <Text numberOfLines={2} className="text-xs">
            {comic?.genres.join(", ")}
          </Text>
          <View className="flex-row justify-start items-center gap-1.5 mt-0.5">
            <TouchableOpacity className="bg-dark rounded p-0.5 w-1/2">
              <Text className="text-center text-white font-medium text-sm font-go">
                Baca Sekarang
              </Text>
            </TouchableOpacity>
            <Text className="text-sm font-go bg-white px-2 py-0.5 text-center rounded-l border-r border-gray">
              Rank: {comic?.rank}
            </Text>
          </View>
        </View>

        <Image
          source={{ uri: comic?.image }}
          className="w-1/3 min-h-36 rounded-lg"
          resizeMode="contain"
          style={shadow.xl5}
        />
      </View>
    </TouchableOpacity>
  );
};

{
  /* <View style={styles.overlay} className="bg-dark/65 pl-4 pr-3">
<View className="h-full flex-row justify-between items-center">
  <View className="w-2/3">
    <View className="flex-row justify-start items-center mb-1">
      <Text className="text-base font-go bg-white h-6 px-2 text-center rounded-l border-r border-gray">
        1
      </Text>
      <Text className="text-base font-go bg-white h-6 px-1 text-center rounded-r">
        Rank
      </Text>
    </View>
    <Text numberOfLines={2} className="text-base text-white font-go">
      Tales of Demons and Gods
    </Text>
  </View>

  <Image
    source={images.test}
    className="w-1/3"
    style={{ borderRadius: 10, height: 190 }}
    resizeMode="contain"
  />
</View>
</View>
</ImageBackground> */
}
