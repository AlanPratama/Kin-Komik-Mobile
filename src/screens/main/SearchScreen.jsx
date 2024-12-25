import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axiosInstance from "../../apis/axiosInstance";
import SimpleCardComic from "../../components/SimpleCardComic";
import Loading from "../../components/Loading";
import { slug } from "../../utils/string";
import NoData from "../../components/NoData";

export default function SearchScreen() {
  const navigate = useNavigation();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [comics, setComics] = useState([]);
  // const [isPrev, setIsPrev] = useState(false);
  // const [isNext, setIsNext] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleSubmit = async (resetPage = false) => {
    try {
      if (resetPage) setPage(1);
      setIsButtonDisabled(true);

      const res = await axiosInstance.get(`/search/${search || ""}/page/${page}`);

      // console.log(
      //   parseInt(res?.data?.pagination[0]?.pageNumber) - 1 === page || false
      // );

      // setIsPrev(
      //   parseInt(res?.data?.pagination[0]?.pageNumber) - 1 === page || false
      // );
      // setIsNext(
      //   parseInt(res?.data?.pagination[1]?.pageNumber) + 1 === page || false
      // );

      setComics(res?.data?.seriesList);
    } catch (error) {
      console.log("ERR: ", error.response.data);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, [page]);

  const handleDetailComicNavigation = (comicId) => {
    navigate.navigate("ComicDetail", { comicId: slug(comicId) });
  };

  return (
    <ScrollView
      className="p-4 min-h-screen bg-dark"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="flex-row justify-between items-center gap-4">
        <View className="flex-row justify-start items-center bg-[#262626] rounded-l-full h-12 w-[73%]">
          <View className="justify-center items-center h-12 w-12 bg-[#262626] rounded-l-full">
            <Ionicons name="search-outline" size={18} color={"#fff"} />
          </View>
          <TextInput 
            value={search}
            onChange={(e) => setSearch(e.nativeEvent.text)}
            onSubmitEditing={() => {
              handleSubmit(true);
            }}
            className="text-white w-full bg-[#262626] rounded-r-full placeholder:text-white"
            placeholder="Search..."
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            setSearch("");
            handleSubmit(true);
          }}
          className="justify-center items-center h-10 w-10 rounded-full bg-[#262626]"
        >
          <Ionicons name="close-outline" size={24} color={"#fff"} />
        </TouchableOpacity>
      </View>

      <View className="mt-2">
        <Text className="text-white text-base font-medium font-go mb-6">
          Result: {search ?? "-"}
        </Text>

        {isButtonDisabled ? (
          <Loading isHeightFull={false} />
        ) : comics.length > 0 ? (
          <View className="flex-row flex-wrap justify-stretch items-center gap-3">
            {comics.length > 0 &&
              comics.map((item, index) => (
                <SimpleCardComic
                  key={`popular-comic-${index}`}
                  comic={item}
                  handleNavigate={() => handleDetailComicNavigation(item.title)}
                />
              ))}
          </View>
        ) : (
          <NoData message="Tidak Ada Komik" />
        )}

        {comics.length > 0 && (
          <View className="flex-row justify-between items-center mt-5">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setPage(page - 1)}
              className={`${
                page === 1 ? "bg-neutral-500" : "bg-accent"
              } w-[42%] py-2 rounded-lg`}
              disabled={page === 1}
            >
              <Text className="text-lg text-center text-dark font-semibold">
                Prev
              </Text>
            </TouchableOpacity>
            <Text className="text-xl text-center bg-accent text-dark font-medium py-2 rounded-xl w-[10%]">
              {page}
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setPage(page + 1)}
              className={`${
                comics?.pagination?.length < 0 ? "bg-neutral-500" : "bg-accent"
              } w-[42%] py-2 rounded-lg`}
              disabled={comics?.pagination?.length < 0}
            >
              <Text className="text-lg text-center text-dark font-semibold">
                Next
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
