import { View, Text, Touchable, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import SimpleCardComic from "./SimpleCardComic";
import { useNavigation } from "@react-navigation/native";
import { slug } from "../utils/string";
import Loading from "./Loading";
import NoData from "./NoData";

export default function ListComics({
  textTitle = "Komik",
  comics,
  showRating = true,
  showTitle = true,
}) {
  const navigate = useNavigation();
  const [dataComic, setDataComic] = useState(comics.slice(0, 9));
  const [isShowMore, setIsShowMore] = useState(false);

  const handleDetailComicNavigation = (comicId) => {
    navigate.navigate("ComicDetail", { comicId: slug(comicId) });
  };

  const handleShowMore = () => {
    setIsShowMore(true);
    setDataComic(comics);
  };
  // const handleShowMore = () => {
  //   setIsShowMore(!isShowMore);
  //   if(isShowMore) setDataComic(comics);
  //   else setDataComic(comics.slice(0, 9));
  // }

  // console.log("dataComic: ", dataComic);

  return (
    <View className="mb-8">
      {showTitle && (
        <Text className="text-white text-2xl font-go my-3">{textTitle}</Text>
      )}
      {dataComic?.length > 0 ? (
        <>
          <View className="flex-row flex-wrap justify-stretch items-center gap-3">
            {dataComic.map((item, index) => (
              <SimpleCardComic
                key={`popular-comic-${index}`}
                showRating={showRating}
                comic={item}
                handleNavigate={() => handleDetailComicNavigation(item.title)}
              />
            ))}
          </View>
          {comics.length > 0 && !isShowMore && showTitle && (
            <TouchableOpacity onPress={handleShowMore} className="mt-3.5">
              <Text className="text-white/90 text-center font-go">
                - Show More -
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <NoData message="Tidak Ada Komik" />
      )}
    </View>
  );
}
