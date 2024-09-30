import { QuestionListProps } from "../types/types";
import "./questionList.css";

const QuestionList = ({ questions }: QuestionListProps) => {
  return (
    <div className="questions-list">
      {questions.map((q) => (
        <div key={`${q.question_id}`} className={`question-item ${q.score < 0 ? "low-score" : ""}`}>
          <div className="content-column">
            <a href={q.link} target="_blank" rel="noopener noreferrer" className="question-title">
              {q.title}
            </a>
            <div className="answer-row">
              <div className="answer-item">
                <div className="answer-item-title">Score</div>
                <div className={`answers ${q.score < 0 ? "bad-score" : ""}`}>{q.score}</div>
              </div>
              <div className="answer-item">
                <div className="answer-item-title">Answers</div>

                <div
                  className={`answers ${
                    q.answer_count > 1 ? (q.is_answered ? "accepted" : "not-accepted") : ""
                  }`}
                >
                  {q.answer_count}
                </div>
              </div>
              <div className="answer-item">
                <div className="answer-item-title">Viewed</div>

                <div className={`answers`}>{q.view_count}</div>
              </div>
            </div>
          </div>
          <div className="user-column">
            <img src={q.owner.profile_image} alt={q.owner.display_name} className="user-avatar" />

            <div className="user-info">{q.owner.display_name}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
