import React, { useEffect, useState } from "react";
import SearchBar from "./components/seachBar";
import TrendingTags from "./components/trendingTags";
import QuestionList from "./components/questionList";
import "./App.css";
import axios from "axios";
import { FetchQuestionsParams, Question, Tag } from "./types/types";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedTag = useSelector((state: RootState) => state.tags.selectedTag);

  const [stateQuestions, setStateQuestions] = useState<Question[]>([]);

  const [statePage, setStatePage] = useState<number>(1);
  const [stateTags, setTags] = useState<Tag[]>([]);

  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [stateSelectedTag, setStateSelectedTag] = useState<string>("");

  const [stateIsFetchingQuestion, setStateIsFetchingQuestion] = useState<boolean>(false);
  const [stateIsFetchingTags, setStateIsFetchingTags] = useState<boolean>(true);

  const fetchQuestions = async ({ tag = "", page = 1 }: FetchQuestionsParams) => {
    try {
      setStateIsFetchingQuestion(true);
      const response = await axios.get("https://api.stackexchange.com/2.3/questions", {
        params: {
          order: "desc",
          sort: "activity",
          site: "stackoverflow",
          tagged: tag,
          page: page,
          pagesize: 20,
        },
      });
      setStateQuestions((prev) => [...prev, ...response.data.items]);
      setTimeout(() => {
        setStateIsFetchingQuestion(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setStateQuestions([]);
      setTimeout(() => {
        setStateIsFetchingQuestion(false);
      }, 500);
    }
  };

  useEffect(() => {
    console.log("aa", stateIsFetchingQuestion.toString());
    console.log("bb", searchInputValue);
    if (!stateIsFetchingQuestion && searchInputValue !== "") {
      // Fetch questions from StackExchange API
      fetchQuestions({
        tag: stateSelectedTag,
        page: statePage,
      });
    }
  }, [statePage, stateSelectedTag]);

  const handleChangeTag = (tag: string) => {
    setStateQuestions([]);
    setStatePage(1);
    setStateSelectedTag(tag);
  };

  const handleChangeSearch = (value: string) => {
    setStateSelectedTag("");
    setSearchInputValue(value);
  };

  useEffect(() => {
    // Fetch trending tags from StackExchange API
    axios
      .get(
        `https://api.stackexchange.com/2.3/tags?order=desc&sort=popular&inname=${searchInputValue}&site=stackoverflow`
      )
      .then((response) => {
        console.log("pppppp", stateSelectedTag);
        setStateQuestions([]);
        setStateSelectedTag(response.data.items[0].name);
        setStatePage(1);
        setTags(response.data.items);
        setStateIsFetchingTags(false);
      })
      .catch((error) => {
        console.error(error);
        setStateIsFetchingTags(false);
      });
  }, [searchInputValue]);

  const handleScroll = () => {
    if (
      !stateIsFetchingQuestion &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
    ) {
      setStatePage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const throttledScroll = () => {
      if (!stateIsFetchingQuestion) {
        handleScroll();
      }
    };

    window.addEventListener("scroll", throttledScroll);
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [stateIsFetchingQuestion]);

  return (
    <div className="app">
      <div className="header">
        {/* Search Bar Component */}
        <SearchBar searchInputValue={searchInputValue} handleChangeSearch={handleChangeSearch} />
        {/* Trending Tags Component */}
        <TrendingTags
          tags={stateTags}
          selectedTag={stateSelectedTag}
          handleChangeTag={handleChangeTag}
          isFetchingTags={stateIsFetchingTags}
        />
      </div>
      <div className="content">
        {/* Question List Component */}
        <QuestionList questions={stateQuestions} />
        {stateIsFetchingQuestion && (
          <div className="skeleton">
            <Skeleton count={3} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
