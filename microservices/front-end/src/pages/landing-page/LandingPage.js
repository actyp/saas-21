import {BodyCards} from "../../components";
import {useAuth} from "../../services/auth";
import {keywords, hourglass, pen, library} from "../../images";

export default function LandingPage() {
  const auth = useAuth();

  const cardList = [
    {
      imgSource: keywords,
      bodyTitle: "Questions per Keyword",
      bodyText: "Check out questions per keyword in a graphical and in a tabular scheme.",
      footerHref: "/keyword",
      btnDisabled: false,
      btnText: "Show me the statistics"
    },
    {
      imgSource: hourglass,
      bodyTitle: "Questions per Day / Period",
      bodyText: "Check out questions per day or period in a graphical and in a tabular scheme.",
      footerHref: "/date",
      btnDisabled: false,
      btnText: "Show me the statistics"
    },
    {
      imgSource: pen,
      bodyTitle: "Ask a Question",
      bodyText: "You are free to ask any question, anytime.",
      footerHref: auth.user !== null ? "/ask" : "/",
      btnDisabled: !auth.user,
      btnText: auth.user ? "Ask a question" : "Sign in to ask a question"
    },
    {
      imgSource: library,
      bodyTitle: "Browse and Answer a Question",
      bodyText: "You are free to browse and answer any question.",
      footerHref: "/browse",
      btnDisabled: false,
      btnText: auth.user ? "Browse and Answer a question" : "Browse questions (sign in to answer)"
    }
  ];

  return(
    <BodyCards cardList={cardList}/>
  );
}
