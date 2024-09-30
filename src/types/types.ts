import { Dispatch, SetStateAction } from "react";

export interface Owner {
  profile_image: string;
  display_name: string;
}

export interface Question {
  question_id: number;
  title: string;
  score: number;
  link: string;
  owner: Owner;
  answer_count: number;
  is_answered: boolean;
  view_count: number;
}

export interface SearchBarProps {
  searchInputValue: string;
  handleChangeSearch: (value: string) => void;
}

export interface QuestionListProps {
  questions: Question[];
}

export interface Tag {
  name: string;
}

export interface TrendingTagsProps {
  tags: Tag[];
  selectedTag: string;
  handleChangeTag: (tag: string) => void;
  isFetchingTags: boolean;
}

export interface FetchQuestionsParams {
  tag?: string;
  page?: number;
}
