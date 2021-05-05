import axios from 'axios';
import {useEffect} from "react";

// apiInstance of axios with optional
// token attachment on request and
// refresh and retry on unauthorized response
export function apiInstance({token, refreshTokenFn} = {}) {

  const apiInstance = axios.create({
    baseURL: `https://localhost:3000/`
  });

  if(token) {
    // attach token on requests
    apiInstance.interceptors.request.use(
      req => {
        req.headers['authorization'] = `Bearer ${token}`;
        return req;
      }, err => {
        return Promise.reject(err);
      }
    );
  }

  // check status on responses
  // if status === 401 then
  // refresh token and retry the request
  if(refreshTokenFn) {
    apiInstance.interceptors.response.use(
      resp => {
        return resp;
      }, err => {
        const originalReq = err.config;
        if (err.response.status === 401 && !originalReq._retry) {
          originalReq._retry = true;
          refreshTokenFn().then(token => {
            originalReq.headers['authorization'] = `Bearer ${token}`;
            return apiInstance(originalReq);
          }).catch(err => {
            return Promise.reject(err);
          });
        }
        return Promise.reject(err);
      }
    );
  }
  return apiInstance;
}

// keyword-page
export function questionsPerKeyword() {
  return apiInstance()
    .get('question-per-keyword-count')
    .then(resp => {
      let key_que = [];
      for(const key in resp.data) {
        key_que.push({
          'keyword': key,
          'questions': resp.data[key]
        });
      }
      return key_que;
    })
    .catch(err => {
      //log err if possible
      return null;
    });
}

// date-page
export function questionsPerDate() {
  return apiInstance()
    .get('question-per-date-count')
    .then(resp => {
      let date_que = [];
      for(const date in resp.data) {
        date_que.push({
          'date': date,
          'questions': resp.data[date]
        });
      }
      return date_que;
    })
    .catch(err => {
      //log err if possible
      return null;
    });
}

// ask-page
export function askQuestion(data, tokenObj) {
  return apiInstance(tokenObj)
    .post('create-question', data)
    .then(resp => resp.data.date)
    .catch(err => {
      //log err if possible
      return null;
    });
}

// browse-page
export function allQuestions() {
  return apiInstance()
    .get('questions')
    .then(resp => resp.data)
    .catch(err => {
      //log err if possible
      return null;
    });
}

// answer-page, personal/qna-page (my questions)
export function answersPerQuestionId(id) {
  return apiInstance()
    .get(`answers-per-question?id=${id}`)
    .then(resp => resp.data)
    .catch(err => {
      //log err if possible
      return null;
    });
}

// answer-page
export function submitAnswer(data, tokenObj) {
  return apiInstance(tokenObj)
    .post('create-answer', data)
    .then(resp => resp.data.date)
    .catch(err => {
      //log err if possible
      return null;
    });
}

// personal/qna-page (my questions)
export function myQuestions(tokenObj) {
  return apiInstance(tokenObj)
    .get('my-questions')
    .then(resp => resp.data)
    .catch(err => {
      //log err if possible
      return null;
    });
}

// personal/qna-page (my answers)
export function myAnswers(tokenObj) {
  return apiInstance(tokenObj)
    .get('my-answers')
    .then(resp => resp.data)
    .catch(err => {
      //log err if possible
      return null;
    });
}

// personal/contributions-page
export function myContributions(tokenObj) {
  const makeList = (questions, answers) => {
    console.log(questions);
    let qnaDict = {};
    for(const date in questions) {
      qnaDict[date] = { questions:  questions[date], answers: 0 }
    }
    for(const date in answers) {
      qnaDict[date] = {
        questions: qnaDict[date] ? qnaDict[date]['questions'] : 0,
        answers: answers[date]
      }
    }
    let qnaList = [];
    for(const date in qnaDict) {
      qnaList.push({
        'date': new Date(date).toDateString(),
        'questions': qnaDict[date]['questions'],
        'answers': qnaDict[date]['answers']
      });
    }
    return qnaList;
  }

  let questions = {};
  apiInstance(tokenObj)
    .get('my-question-per-date-count')
    .then(resp => questions = resp.data)
    .catch(err => {
      //log err if possible
      return null;
    });

  if(questions) {
    return apiInstance(tokenObj)
      .get('my-answer-per-date-count')
      .then(resp => makeList(questions, resp.data))
      .catch(err => {
        //log err if possible
        return null;
      });
  } else {
    return null;
  }
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
    if (!dataState || !dataState.length) {
      asyncFetch().then(data => {
        if (mounted) {
          setDataState(data);
          setLoading(false);
          if(afterFunc && data !== null) afterFunc(data);
        }
      });
    }
    return () => setMounted(false);
  }, []);
}