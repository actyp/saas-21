import BodyCards from "../../components/body-cards/BodyCards";

export default function PersonalPage() {
  const cardList = [
    {
      imgSource: "https://source.unsplash.com/Uq3gTiPlqRo/450x450",
      bodyTitle: "My Questions / Answers",
      bodyText: "Check out your asked questions and your provided answers.",
      footerHref: "/personal/qna",
      btnDisabled: false,
      btnText: "Show me my progress"
    },
    {
      imgSource: "https://source.unsplash.com/LPRrEJU2GbQ/450x450",
      bodyTitle: "My contributions per day",
      bodyText: "Check out your daily contributions in a graphical and in a tabular scheme.",
      footerHref: "/personal/contributions",
      btnDisabled: false,
      btnText: "Show me the statistics"
    },
    {
      imgSource: "https://source.unsplash.com/i--IN3cvEjg/450x450",
      bodyTitle: "Ask a Question",
      bodyText: "You are free to ask any question, anytime.",
      footerHref: "/ask",
      btnDisabled: false,
      btnText: "Ask a question"
    },
    {
      imgSource: "https://source.unsplash.com/_gEKtyIbRSM/450x450",
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