import BodyCards from "../../components/body-cards/BodyCards";

export default function LandingPage(props) {
  const cardList = [
    {
      imgSource: "https://source.unsplash.com/7PYqjNzvrc4/450x450",
      bodyTitle: "Questions per Keyword",
      bodyText: "Check out questions per keyword in a graphical and in a tabular scheme.",
      footerHref: "/keyword",
      btnDisabled: false,
      btnText: "Show me the statistics"
    },
    {
      imgSource: "https://source.unsplash.com/BXOXnQ26B7o/450x450",
      bodyTitle: "Questions per Day / Period",
      bodyText: "Check out questions per day or period in a graphical and in a tabular scheme.",
      footerHref: "/date",
      btnDisabled: false,
      btnText: "Show me the statistics"
    },
    {
      imgSource: "https://source.unsplash.com/i--IN3cvEjg/450x450",
      bodyTitle: "Ask a Question",
      bodyText: "You are free to ask any question, anytime.",
      footerHref: props.isSignedIn ? "/ask" : "/",
      btnDisabled: !props.isSignedIn,
      btnText: props.isSignedIn ? "Ask a question" : "Sign in to ask a question"
    },
    {
      imgSource: "https://source.unsplash.com/_gEKtyIbRSM/450x450",
      bodyTitle: "Browse and Answer a Question",
      bodyText: "You are free to browse and answer any question.",
      footerHref: "/browse",
      btnDisabled: false,
      btnText: props.isSignedIn ? "Browse and Answer a question" : "Browse questions (sign in to answer)"
    }
  ];

  return(
    <BodyCards cardList={cardList}/>
  );
}
