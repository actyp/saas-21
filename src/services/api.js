import axios from 'axios';
import {useEffect} from "react";

// baseInstance of axios
export const baseInstance = axios.create({
  baseURL: `https://reqres.in/`
});

// keyword-page
export function questionsPerKeyword() {
  let data = [];
  for (let i=1; i<=200; i++) {
    data.push({
      'keyword': `k-${i}`,
      'questions': Math.ceil(Math.random()*1000)
    })
  }
  const fakeData = {key_que: data};

  return baseInstance
    .get('api/users/23')
    .then(resp => resp.data.key_que)
    .catch(err => {
      console.log(err);
      return fakeData.key_que;
      //return null;
    });
}

// date-page
export function questionsPerDate() {
  let data = [];
  const start=new Date('2021/01/01');
  const end=new Date('2021/01/02');

  for (let i=1; i<=200; i++) {
    data.push({
      'date': new Date(start.getTime() + i * (end.getTime() - start.getTime())).toDateString(),
      'questions': Math.ceil(Math.random()*1000)
    })
  }
  const fakeData = {date_que: data};

  return baseInstance
    .get('api/users/23')
    .then(resp => resp.data.date_que)
    .catch(err => {
      console.log(err);
      return fakeData.date_que;
      //return null;
    });
}

// ask-page
export function askQuestion(data) {
  return baseInstance
    .post('api/login', data)
    .then(() => true)
    .catch(err => {
      console.log(err);
      return false;
    });
}

// browse-page
export function allQuestions() {
  let questions = [];
  for(let id=1; id<=100; id++){
    questions.push(
      {
        id: id,
        title: "Question heading / title" + id,
        text: "Question text",
        keywords: id % 2 === 0 ? ["Question"] : ["related"],
        username: "username",
        date: "Jan 05 2021 04:20"
      },
      {
        id: (200-id),
        title: "Question heading / title" + (200-id),
        text: "Question text",
        keywords: (200-id) % 2 === 0 ? ["keywords"] : ["tags"],
        username: "username",
        date: "Jan 15 2021 04:20"
      }
    );
  }
  const fakeData = { questions: questions }

  return baseInstance
    .get('api/users/23')
    .then(resp => resp.data.questions)
    .catch(err => {
      console.log(err);
      return fakeData.questions;
      //return null;
    });
}

// answer-page, personal/qna-page (my questions)
export function answersPerQuestionId(id) {
  const fakeData = {
    answers:
      [
        {
          text: "Answer text for id: " + id,
          username: "username",
          date: "date"
        },
        {
          text: "Answer text for id: " + id,
          username: "username",
          date: "date"
        },
        {
          text: "Answer text for id: " + id,
          username: "username",
          date: "date"
        }
      ]};

  return baseInstance
    .post('api/login',{id: id})
    .then(resp => resp.data.answers)
    .catch(err => {
      console.log(err);
      return fakeData.answers;
      //return null;
    });
}

// answer-page
export function submitAnswer(data) {
  const fakeAnswer = {
    text:data.text,
    username: data.username,
    date:Date().slice(3,21)
  };

  return baseInstance
    .post('api/login', data)
    .then(resp => resp.data)
    .catch(err => {
      console.log(err);
      return fakeAnswer;
      //return null;
    });
}

// personal/qna-page (my questions)
export function questionsPerUserId(id) {
  let questions = [];
  for(let id=1; id<=100; id++){
    questions.push(
      {
        id: id,
        title: "Question heading / title" + id,
        text: "Question text",
        keywords: id % 2 === 0 ? ["Question"] : ["related"],
        username: "username",
        date: "Jan 05 2021 04:20"
      },
      {
        id: (200-id),
        title: "Question heading / title" + (200-id),
        text: "Question text",
        keywords: (200-id) % 2 === 0 ? ["keywords"] : ["tags"],
        username: "username",
        date: "Jan 15 2021 04:20"
      }
    );
  }
  const fakeData = { questions: questions }

  return baseInstance
    .post('api/login',{id: id})
    .then(resp => resp.data.questions)
    .catch(err => {
      console.log(err);
      return fakeData.questions;
      //return null;
    });
}

// personal/qna-page (my answers)
export function answerPerQuestionPerUserId(id) {
  let qnaL = [];
  for(let id=1; id<=50; id++){
    qnaL.push(
      {
        question: {
          id: id,
          title: "Question heading / title" + id,
          text: "Question text",
          keywords: id % 2 === 0 ? ["Question"] : ["related"],
          username: "username",
          date: "Jan 05 2021 04:20"
        },
        answer: {
          text: "Answer text for question: " + id,
          username: "me",
          date: "date"
        }
      }
    );
  }
  const fakeData = { qna: qnaL }

  return baseInstance
    .post('api/login',{id: id})
    .then(resp => resp.data.qna)
    .catch(err => {
      console.log(err);
      return fakeData.qna;
      //return null;
    });
}

// personal/contributions-page
export function dailyContributionsPerUserId(id) {
  let qna = [];
  const start=new Date('2021/01/01');
  const end=new Date('2021/01/02');

  for (let i=1; i<=200; i++) {
    qna.push({
      'date': new Date(start.getTime() + i * (end.getTime() - start.getTime())).toDateString(),
      'questions': Math.ceil(Math.random()*1000),
      'answers': Math.ceil(Math.random()*1000)
    })
  }
  const fakeData = {contributions: qna};

  return baseInstance
    .post('api/login',{id: id})
    .then(resp => resp.data.contributions)
    .catch(err => {
      console.log(err);
      return fakeData.contributions;
      //return null;
    });
}

// set mounted to true on mount and false on unmount
// fetch all data on mount, setState with data,
// set loading false and call afterFunc on response data
export function useFetchDataOnMount(
  {
    asyncFetch,
    mounted,
    setMounted,
    dataState,
    setDataState,
    setLoading,
    afterFunc
  })
{
  useEffect(() => {
    setMounted(true);
    if (dataState.length === 0) {
      asyncFetch().then(data => {
        if (mounted) {
          setDataState(data);
          setLoading(false);
          if(afterFunc) afterFunc(data);
        }
      });
    }
    return () => setMounted(false);
  }, [asyncFetch, mounted, setMounted, dataState.length, setDataState, setLoading, afterFunc]);
}