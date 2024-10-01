import axios from "axios";
import throttle from "lodash/throttle";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import QuestionList from "./components/questionList";
import SearchBar from "./components/seachBar";
import TrendingTags from "./components/trendingTags";
import { AppDispatch, RootState } from "./store/store";
import { setSelectedTag } from "./store/tagSlice";
import { Question, QuestionSearchParams, Tag } from "./types/types";
import { ClipLoader } from "react-spinners";

const App = () => {
  const isFirstRender = useRef(true);
  const pageRef = useRef(1);

  const dispatch = useDispatch<AppDispatch>();
  const selectedTag = useSelector((state: RootState) => state.tags.selectedTag);

  const [stateQuestions, setStateQuestions] = useState<Question[]>([]);
  const [stateTags, setTags] = useState<Tag[]>([]);

  const [stateIsFetchingQuestion, setStateIsFetchingQuestion] = useState<boolean>(false);
  const [stateIsFetchingTags, setStateIsFetchingTags] = useState<boolean>(true);

  const fetchQuestions = async ({ tag = "", page = 1 }: QuestionSearchParams) => {
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
      }, 2000);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setStateQuestions([]);
      setTimeout(() => {
        setStateIsFetchingQuestion(false);
      }, 2000);
    }
  };

  const fetchTags = async (value: string): Promise<string> => {
    try {
      const response = await axios.get(
        `https://api.stackexchange.com/2.3/tags?order=desc&sort=popular&inname=${value}&site=stackoverflow`
      );
      const tagName = response.data.items[0]?.name ?? "";
      setTags(response?.data?.items ?? []);
      dispatch(setSelectedTag(response.data.items[0]?.name ?? ""));
      setStateIsFetchingTags(false);
      return tagName;
    } catch (error) {
      console.error(error);
      setStateIsFetchingTags(false);
      return "";
    }
  };

  const initialLoadPage = async () => {
    const firstTag = await fetchTags("");
    fetchQuestions({ tag: firstTag, page: 1 });
  };

  useEffect(() => {
    if (isFirstRender.current) {
      initialLoadPage();
      isFirstRender.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeTag = (tag: string) => {
    setStateQuestions([]);
    pageRef.current = 1;
    dispatch(setSelectedTag(tag));
    fetchQuestions({ tag: tag, page: 1 });
  };

  const handleChangeSearch = useCallback(async (value: string) => {
    setStateIsFetchingTags(true);
    setStateQuestions([]);
    pageRef.current = 1;
    const tag = await fetchTags(value);
    dispatch(setSelectedTag(tag));
    fetchQuestions({ tag, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledHandleChangeSearch = useCallback(
    throttle(handleChangeSearch, 1000, { leading: false, trailing: true }),
    [selectedTag]
  );

  const handleScroll = () => {
    if (
      !stateIsFetchingQuestion &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
    ) {
      setStateIsFetchingQuestion(true);
      const newPage = pageRef.current + 1;
      pageRef.current = newPage;
      fetchQuestions({ tag: selectedTag, page: newPage });
    }
  };

  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 500);

    window.addEventListener("scroll", throttledScroll);
    return () => window.removeEventListener("scroll", throttledScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateIsFetchingQuestion, selectedTag]);

  return (
    <div className="app">
      <div className="header">
        {/* Search Bar Component */}
        <SearchBar searchInputValue={""} handleChangeSearch={throttledHandleChangeSearch} />
        {/* Trending Tags Component */}
        {stateQuestions.length} - {pageRef.current} - {stateIsFetchingQuestion.toString()} -{" "}
        {stateIsFetchingTags.toString()} - {selectedTag}
        <TrendingTags
          tags={stateTags}
          selectedTag={selectedTag}
          handleChangeTag={handleChangeTag}
          isFetchingTags={stateIsFetchingTags}
        />
      </div>
      <div className="content">
        {/* Question List Component */}
        <QuestionList questions={stateQuestions} />
        {stateIsFetchingQuestion && (
          <div className="skeleton">
            <ClipLoader
              loading={stateIsFetchingQuestion}
              size={64}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
