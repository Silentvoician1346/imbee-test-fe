import { TrendingTagsProps } from "../types/types";
import "./trendingTags.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TrendingTags = ({
  tags,
  selectedTag,
  handleChangeTag,
  isFetchingTags,
}: TrendingTagsProps) => {
  return (
    <div className="trending-tags">
      <div className="tag-title">Trending</div>
      {isFetchingTags ? (
        <Skeleton />
      ) : (
        <div className="tags-list">
          {tags.slice(0, 10).map((tag) => (
            <div
              key={tag.name}
              onClick={() => handleChangeTag(tag.name)}
              className={`tag-item ${selectedTag === tag.name ? "selected" : ""}`}
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingTags;
