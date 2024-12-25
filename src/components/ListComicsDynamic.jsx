import { View, Text, Touchable, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import SimpleCardComic from "./SimpleCardComic";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../apis/axiosInstance";
import { slug } from "../utils/string";
import Loading from "./Loading";
import NoData from "./NoData";

export default function ListComicsDynamic() {
  const navigate = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState({ key: "Populer", value: "manhwa-popular" });

  const [dataComic, setDataComic] = useState([]);
  const [backupData, setBackupData] = useState([]);

  const [isShowMore, setIsShowMore] = useState(false);

  const getDataComics = async () => {
    setIsLoading(true);

    const res = await axiosInstance.get(`/${type.value}`);
    if (!isShowMore) setDataComic(res.data.slice(0, 9));
    else setDataComic(res.data);

    setBackupData(res.data);

    setIsLoading(false);
  };

  const handleDetailComicNavigation = (comicId) => {
    navigate.navigate("ComicDetail", { comicId: slug(comicId) });
  };

  const handleShowMore = () => {
    setIsShowMore(true);
    setDataComic(backupData);
  };

  const handleChangeType = (data) => {
    setType(data);
  };

  useEffect(() => {
    getDataComics();
  }, []);

  useEffect(() => {
    getDataComics();
  }, [type]);

  return (
    <View className="mb-8">
      <Text className="text-white text-2xl font-go my-3">
        Komik - {type.key === "Berjalan" ? "Sedang Berjalan" : type.key}
      </Text>

      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity
          disabled={isLoading}
          onPress={() =>
            handleChangeType({ key: "Populer", value: "manhwa-popular" })
          }
          className={`${
            type.key === "Populer" && "bg-accent"
          } w-[31%] border border-accent rounded-lg px-4 py-2`}
        >
          <Text
            className={`${
              type.key === "Populer" ? "text-dark" : "text-accent"
            } text-center font-semibold`}
          >
            Populer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isLoading}
          onPress={() =>
            handleChangeType({ key: "Berjalan", value: "manhwa-ongoing" })
          }
          className={`${
            type.key === "Berjalan" && "bg-accent"
          } w-[31%] border border-accent rounded-lg px-4 py-2`}
        >
          <Text
            className={`${
              type.key === "Berjalan" ? "text-dark" : "text-accent"
            } text-center font-semibold`}
          >
            Berjalan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isLoading}
          onPress={() =>
            handleChangeType({
              key: "Disarankan",
              value: "manhwa-recommendation",
            })
          }
          className={`${
            type.key === "Disarankan" && "bg-accent"
          } w-[31%] border border-accent rounded-lg px-4 py-2`}
        >
          <Text
            className={`${
              type.key === "Disarankan" ? "text-dark" : "text-accent"
            } text-center font-semibold`}
          >
            Disarankan
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Loading isHeightFull={false} />
      ) : dataComic.length > 0 ? (
        <>
          <View className="flex-row flex-wrap justify-between gap-3">
            {dataComic.map((item, index) => (
              <SimpleCardComic
                key={`popular-comic-${index}`}
                comic={item}
                handleNavigate={() => handleDetailComicNavigation(item.title)}
              />
            ))}
          </View>
          {dataComic.length > 0 && !isShowMore && (
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
