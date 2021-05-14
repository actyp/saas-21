import {BodyCards} from "../../components";
import {typewriter, clock, pen, library} from "../../images";

export default function PersonalPage() {
  const cardList = [
    {
      imgSource: typewriter,
      bodyTitle: "My Questions / Answers",
      bodyText: "Check out your asked questions and your provided answers.",
      footerHref: "/personal/qna",
      btnDisabled: false,
      btnText: "Show me my progress"
    },
    {
      imgSource: clock,
      bodyTitle: "My contributions per day",
      bodyText: "Check out your daily contributions in a graphical and in a tabular scheme.",
      footerHref: "/personal/contributions",
      btnDisabled: false,
      btnText: "Show me the statistics"
    },
    {
      imgSource: pen,
      bodyTitle: "Ask a Question",
      bodyText: "You are free to ask any question, anytime.",
      footerHref: "/ask",
      btnDisabled: false,
      btnText: "Ask a question"
    },
    {
      imgSource: library,
      bodyTitle: "Browse and Answer a Question",
      bodyText: "You are free to browse and answer any question.",
      footerHref: "/browse",
      btnDisabled: false,
      btnText: "Browse and Answer a question"
    }
  ];

  return(
    <BodyCards cardList={cardList}/>
  );
}