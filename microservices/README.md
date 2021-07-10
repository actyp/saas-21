
# Implementation with Microservices

Our microservices communicate with the orchestrator via separate
RabbitMQ Queues, as the latter sends the appropriate messages to
the microservices, for each HTTP Request it receives.

![Task screenshot](screenshots/rabbitmq.png)

Below are the API docs for our HTTP endpoints:

## Indices

* [API](#API)

  * [answers-per-question](#1-answers-per-question)
  * [create-answer](#2-create-answer)
  * [create-question](#3-create-question)
  * [login](#4-login)
  * [logout](#5-logout)
  * [my-answer-per-date-count](#6-my-answer-per-date-count)
  * [my-answers](#7-my-answers)
  * [my-question-per-date-count](#8-my-question-per-date-count)
  * [my-questions](#9-my-questions)
  * [question-per-date-count](#10-question-per-date-count)
  * [question-per-keyword-count](#11-question-per-keyword-count)
  * [questions](#12-questions)
  * [refresh](#13-refresh)
  * [signup](#14-signup)


--------


## API



### 1. answers-per-question



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://snf-16615.ok-kno.grnetcloud.net/api/provide/answers-per-question?id=
```



***Query:***

| Key | Description |
| --- |-------------|
| id | id of the question |


***More example Requests/Responses:***


##### I. Example Request: get answers to a specified question



***Query:***

| Key | Value |
| --- | ------|
| id | Z2RvbWFuZ2UxaUBhcnN0ZWNobmljYS5jb21bMjAxOS0wOS0wMSAyMTozOTowN10= |



##### I. Example Response: get answers to a specified question
```js
[
    {
        "text": "Test text",
        "id": "amthY2hlbGxlcjI3QG5hdGlvbmFsZ2VvZ3JhcGhpYy5jb21bMjAyMS0wNy0xMCAxNTo0ODozMV0=",
        "username": "jkacheller27@nationalgeographic.com",
        "date": "2021-07-10 15:48:31"
    },
    {
        "text": "Personnel's intruding spontaneous brutality dipping swore humming convalesce entrust eulogizes impetuous sears. Hobbling mesh's juncture's pact phenomenons tinsel foreign heckle rang bluff progressively tremor's.",
        "id": "Y2Zyb21vbnRzQG1lZXR1cC5jb21bMjAyMC0wNi0yOCAyMTozOTowN10=",
        "username": "cfromonts@meetup.com",
        "date": "2020-06-28 21:39:07"
    },
    {
        "text": "Affectations trashy pants token's ravish c enumerate indulged anchovies shimmer's rogue bountiful madhouse's amnesty's concatenated quavers pretence's.",
        "id": "amFudHVrMjZAbnltYWcuY29tWzIwMjAtMDUtMjQgMjE6Mzk6MDdd",
        "username": "jantuk26@nymag.com",
        "date": "2020-05-24 21:39:07"
    },
    {
        "text": "Scorer fluffing dough reduces narrator's currency extroverts acrobatics gazelle simplified bureaucratic querying.",
        "id": "aWRlbGFwcmVsbGUxY0BpbWd1ci5jb21bMjAyMC0wNS0yNCAyMTozOTowN10=",
        "username": "idelaprelle1c@imgur.com",
        "date": "2020-05-24 21:39:07"
    }
]
```


***Status Code:*** 200

<br>



### 2. create-answer



***Endpoint:***

```bash
Method: POST
Type: URLENCODED
URL: https://snf-16615.ok-kno.grnetcloud.net/api/manage/create-answer
```



***Headers:***

| Key | Description |
| --- | -------------|
| Authorization | short-lived token to authenticate the user with |


***Body:***


| Key | Description |
| --- | -------------|
| question_id |  id of question to add the answer to |
| text | body of the answer |



***More example Requests/Responses:***


##### I. Example Request: successful answer creation


***Headers:***

| Key | Value |
| --- | ------|
| Authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprYWNoZWxsZXIyN0BuYXRpb25hbGdlb2dyYXBoaWMuY29tIiwiaWF0IjoxNjI1OTMyMDYyLCJleHAiOjE2MjU5MzI5NjJ9.kKI5qGDYEY1De4qBfq3kar2HOArvHsplo9_nsfGB7ZY |



***Body:***


| Key | Value |
| --- | ------|
| question_id | Z2RvbWFuZ2UxaUBhcnN0ZWNobmljYS5jb21bMjAxOS0wOS0wMSAyMTozOTowN10= |
| text | Test text |



##### I. Example Response: successful answer creation
```js
{
    "date": "2021-07-10 15:48:31"
}
```


***Status Code:*** 200

<br>



### 3. create-question



***Endpoint:***

```bash
Method: POST
Type: URLENCODED
URL: https://snf-16615.ok-kno.grnetcloud.net/api/manage/create-question
```


***Headers:***

| Key | Description |
| --- | -------------|
| Authorization | short-lived token to authenticate the user with |



***Body:***


| Key | Description |
| --- | -------------|
| title | title of the question |
| text | body of the question |
| keywords[0] | keywords corresponding to the question |



***More example Requests/Responses:***


##### I. Example Request: successful question creation


***Headers:***

| Key | Value |
| --- | ------|
| Authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprYWNoZWxsZXIyN0BuYXRpb25hbGdlb2dyYXBoaWMuY29tIiwiaWF0IjoxNjI1OTI5ODY0LCJleHAiOjE2MjU5MzA3NjR9.8dXuIF1wjlmDzej8rtShiB3h4ZdQqkdsOMuJ63XZdk4 |



***Body:***


| Key | Value |
| --- | ------|
| title | Test title |
| text | Test text |
| keywords[0] | Test keyword |



##### I. Example Response: successful question creation
```js
{
    "date": "2021-07-10 15:11:57"
}
```


***Status Code:*** 200

<br>



### 4. login



***Endpoint:***

```bash
Method: POST
Type: URLENCODED
URL: https://snf-16615.ok-kno.grnetcloud.net/api/authenticate/login
```



***Body:***


| Key | Description |
| --- | -------------|
| username | username to login as |
| password | password corresponding to the username |



***More example Requests/Responses:***


##### I. Example Request: successful login



***Body:***


| Key | Value |
| --- | ------|
| username | jkacheller27@nationalgeographic.com |
| password | Qvnbvd7K9 |



##### I. Example Response: successful login
***Headers:***

| Key | Value |
| --- | -------------|
| Set-Cookie | refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprYWNoZWxsZXIyN0BuYXRpb25hbGdlb2dyYXBoaWMuY29tIiwiaWF0IjoxNjI1OTQ0MDMyLCJleHAiOjE2MjYzNzYwMzJ9.sHZtbNsujjENLbUhINZwex9EHrtPaYEJxlrzsngSD4o; Path=/; HttpOnly; |
```js
{
    "username": "jkacheller27@nationalgeographic.com",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprYWNoZWxsZXIyN0BuYXRpb25hbGdlb2dyYXBoaWMuY29tIiwiaWF0IjoxNjI1OTMyMDYyLCJleHAiOjE2MjU5MzI5NjJ9.kKI5qGDYEY1De4qBfq3kar2HOArvHsplo9_nsfGB7ZY",
    "access_token_expiry": 1625932962516
}
```


***Status Code:*** 200

<br>



### 5. logout



***Endpoint:***

```bash
Method: POST
Type: 
URL: https://snf-16615.ok-kno.grnetcloud.net/api/authenticate/login
```


***Cookie:***


| Key | Description |
| --- | ------|
| refresh_token | long-lived token used to issue the access_token with |


***More example Requests/Responses:***


##### I. Example Request: successful logout


***Cookie:***


| Key | Value |
| --- | ------|
| refresh_token | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprYWNoZWxsZXIyN0BuYXRpb25hbGdlb2dyYXBoaWMuY29tIiwiaWF0IjoxNjI1OTQ0MDMyLCJleHAiOjE2MjYzNzYwMzJ9.sHZtbNsujjENLbUhINZwex9EHrtPaYEJxlrzsngSD4o |

##### I. Example Response: successful logout

***Status Code:*** 200

<br>



### 6. my-answer-per-date-count



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://snf-16615.ok-kno.grnetcloud.net/api/provide/my-answer-per-date-count
```


***Headers:***

| Key | Description |
| --- | -------------|
| Authorization | short-lived token to authenticate the user with |



***More example Requests/Responses:***


##### I. Example Request: get number of answers per date


***Headers:***

| Key | Value |
| --- | ------|
| Authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprYWNoZWxsZXIyN0BuYXRpb25hbGdlb2dyYXBoaWMuY29tIiwiaWF0IjoxNjI1OTMyMDYyLCJleHAiOjE2MjU5MzI5NjJ9.kKI5qGDYEY1De4qBfq3kar2HOArvHsplo9_nsfGB7ZY |



##### I. Example Response: get number of answers per date
```js
{
    "Mon Mar 11 2019": 1,
    "Wed Apr 17 2019": 1,
    "Tue May 21 2019": 1,
    "Wed Jun 05 2019": 1,
    "Tue Jun 18 2019": 1,
    "Mon Jul 08 2019": 1,
    "Thu Jul 25 2019": 1,
    "Mon Aug 05 2019": 1,
    "Wed Aug 21 2019": 1,
    "Fri Aug 23 2019": 1,
    "Sun Aug 25 2019": 1
}
```


***Status Code:*** 200

<br>



### 7. my-answers



***Endpoint:***

```bash
Method: GET
Type: 
URL: 
```



***Headers:***

| Key | Description |
| --- | -------------|
| Authorization | short-lived token to authenticate the user with |


***More example Requests/Responses:***


##### I. Example Request: get answers of the user authenticated by the bearer auth header


***Headers:***

| Key | Value |
| --- | ------|
| Authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprYWNoZWxsZXIyN0BuYXRpb25hbGdlb2dyYXBoaWMuY29tIiwiaWF0IjoxNjI1OTMyMDYyLCJleHAiOjE2MjU5MzI5NjJ9.kKI5qGDYEY1De4qBfq3kar2HOArvHsplo9_nsfGB7ZY |



##### I. Example Response: get answers of the user authenticated by the bearer auth header
```js
[
    {
        "question": {
            "title": "Matriarchs concord's integrated soloing scourge prototype's demagogue's flagpole's thesis's regaling infuriates materializes urinated bumping tryouts",
            "text": "Heroes takeoff's threes unconventional knowings amendments ligaments receding inspire. Cartwheel's map twittered kiwi's vatting potter yodel glorification dangling tale's injection's freeway's witchcraft.",
            "id": "ZGJhcnN0b2NraUBnb29nbGUuY2FbMjAxOS0xMS0yMyAwMzoxNzo1NV0=",
            "username": "dbarstocki@google.ca",
            "date": "2019-11-23 03:17:55",
            "keywords": [
                "winforms",
                "ggplot2"
            ]
        },
        "answers": [
            {
                "question_id": "ZGJhcnN0b2NraUBnb29nbGUuY2FbMjAxOS0xMS0yMyAwMzoxNzo1NV0=",
                "text": "Spaniels dumfounded irritated faking. Regional etymologies flints reiterations immaturity's spunk's cheeriest aspirin pond's blossom's culturally irresistible elitist counselled appreciable woody's.",
                "id": "amthY2hlbGxlcjI3QG5hdGlvbmFsZ2VvZ3JhcGhpYy5jb21bMjAyMC0xMC0wMiAwMzoxNzo1NV0=",
                "username": "jkacheller27@nationalgeographic.com",
                "date": "2020-10-02 03:17:55"
            }
        ]
    }
]
```


***Status Code:*** 200

<br>



### 8. my-question-per-date-count



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://snf-16615.ok-kno.grnetcloud.net/api/provide/my-question-per-date-count
```



***Headers:***

| Key | Description |
| --- | -------------|
| Authorization |  short-lived token to authenticate the user with |


***More example Requests/Responses:***


##### I. Example Request: get number of questions per date


***Headers:***

| Key | Value |
| --- | ------|
| Authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprYWNoZWxsZXIyN0BuYXRpb25hbGdlb2dyYXBoaWMuY29tIiwiaWF0IjoxNjI1OTMyMDYyLCJleHAiOjE2MjU5MzI5NjJ9.kKI5qGDYEY1De4qBfq3kar2HOArvHsplo9_nsfGB7ZY |



##### I. Example Response: get number of questions per date
```js
{
    "Wed Jan 23 2019": 1,
    "Tue Apr 23 2019": 1,
    "Mon Jun 17 2019": 1,
    "Sat Jul 20 2019": 1,
    "Wed Jul 24 2019": 1,
    "Wed Jul 31 2019": 1,
    "Sun Aug 18 2019": 1,
    "Tue Aug 20 2019": 1,
    "Thu Aug 29 2019": 1,
    "Wed Oct 23 2019": 1,
    "Sat Nov 02 2019": 1,
    "Sat Jul 10 2021": 1
}
```


***Status Code:*** 200

<br>



### 9. my-questions



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://snf-16615.ok-kno.grnetcloud.net/api/provide/my-questions
```



***Headers:***

| Key | Description |
| --- | -------------|
| Authorization |  short-lived token to authenticate the user with |

***More example Requests/Responses:***


##### I. Example Request: get questions of the user authenticated by the bearer auth header


***Headers:***

| Key | Value |
| --- | ------|
| Authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprYWNoZWxsZXIyN0BuYXRpb25hbGdlb2dyYXBoaWMuY29tIiwiaWF0IjoxNjI1OTMyMDYyLCJleHAiOjE2MjU5MzI5NjJ9.kKI5qGDYEY1De4qBfq3kar2HOArvHsplo9_nsfGB7ZY |



##### I. Example Response: get questions of the user authenticated by the bearer auth header
```js
[
    {
        "title": "Test title",
        "text": "Test text",
        "id": "amthY2hlbGxlcjI3QG5hdGlvbmFsZ2VvZ3JhcGhpYy5jb21bMjAyMS0wNy0xMCAxNToxMTo1N10=",
        "username": "jkacheller27@nationalgeographic.com",
        "date": "2021-07-10 15:11:57",
        "keywords": [
            "Test keyword"
        ]
    },
    {
        "title": "Dealer destroys scrolled modification transitions spine politician's aliened germinate footing's obstinate pedestals swindle founder tomcats",
        "text": "Poppies architectural acuter piano evangelists opt incubates caressing intercoms.",
        "id": "amthY2hlbGxlcjI3QG5hdGlvbmFsZ2VvZ3JhcGhpYy5jb21bMjAxOS0xMS0wMiAxODoxMjoyNl0=",
        "username": "jkacheller27@nationalgeographic.com",
        "date": "2019-11-02 18:12:26",
        "keywords": [
            "android"
        ]
    },
    {
        "title": "Eluded looneyies slam's toweled hammering saintlier eleventh's bland fabricates dullest correspondingly uppermost callings grove's",
        "text": "Thickness migrates ampler runaways faithful avoiding tamest manipulates healer's mustaches gratifications barge attributed sustenance's.",
        "id": "amthY2hlbGxlcjI3QG5hdGlvbmFsZ2VvZ3JhcGhpYy5jb21bMjAxOS0xMC0yMyAxNDo1MDozNl0=",
        "username": "jkacheller27@nationalgeographic.com",
        "date": "2019-10-23 14:50:36",
        "keywords": [
            "go",
            "iphone"
        ]
    },
    {
        "title": "Morasses turnpikes oks golfs fascist's technicality capability's",
        "text": "Amputates sites oxidation. Raspberry skeins courage hover textual communities ramble schooled unemployment's vestibules apathetic binder showdown's persecuting darkly mercilessly.",
        "id": "amthY2hlbGxlcjI3QG5hdGlvbmFsZ2VvZ3JhcGhpYy5jb21bMjAxOS0wOC0yOSAyMjoyNzoyOF0=",
        "username": "jkacheller27@nationalgeographic.com",
        "date": "2019-08-29 22:27:28",
        "keywords": [
            "loops",
            "angularjs",
            "pandas"
        ]
    }
]
```


***Status Code:*** 200

<br>



### 10. question-per-date-count



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://snf-16615.ok-kno.grnetcloud.net/api/provide/question-per-date-count
```



***More example Requests/Responses:***


##### I. Example Request: get number of questions per date



##### I. Example Response: get number of questions per date
```js
{
    "Tue Jan 01 2019": 4,
    "Wed Jan 02 2019": 3,
    "Thu Jan 03 2019": 3,
    "Fri Jan 04 2019": 3,
    "Sat Jan 05 2019": 3,
    "Sun Jan 06 2019": 3,
    "Mon Jan 07 2019": 4,
    "Tue Jan 08 2019": 4,
    "Wed Jan 09 2019": 3,
    "Thu Jan 10 2019": 2,
    "Fri Jan 11 2019": 6,
    "Sat Jan 12 2019": 10
}
```


***Status Code:*** 200

<br>



### 11. question-per-keyword-count



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://snf-16615.ok-kno.grnetcloud.net/api/provide/question-per-keyword-count
```



***More example Requests/Responses:***


##### I. Example Request: get number of questions per keyword



##### I. Example Response: get number of questions per keyword
```js
{
    "maven": 18,
    "selenium": 11,
    "laravel": 15,
    "android": 12,
    "cordova": 13,
    "git": 8,
    "xamarin": 19,
    "dataframe": 11,
    "scala": 13,
    "datetime": 9,
    "testing": 14,
    "dart": 7,
    "npm": 11,
    "linq": 14,
    "tkinter": 14,
    "sorting": 11,
    "kotlin": 9,
    "sockets": 12,
    "apache-spark": 8,
    "python-2.7": 10,
    "macos": 11,
    "css": 14,
    "oop": 14,
    "multithreading": 10,
    "image": 15,
    "object": 8,
    "wcf": 5,
    "ubuntu": 10
}
```


***Status Code:*** 200

<br>



### 12. questions



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://snf-16615.ok-kno.grnetcloud.net/api/provide/questions?start=&stop=
```


***Query:***

| Key | Description |
| --- | -------------|
| start | index of the first question to return |
| stop | index of the last question to return |


***More example Requests/Responses:***


##### I. Example Request: get questions within a specific range



***Query:***

| Key | Value |
| --- | ------|
| start | 380 |
| stop | -1 |



##### I. Example Response: get questions within a specific range
```js
[
    {
        "title": "Workouts toad's unities onset's booties elopes attempt beggared mixture's recollection elbowing autographs dark cadet battleship embalmed otter bothering",
        "text": "Commentator rook's dung canter stagecoaches barrage affair's fend cubic assents sterling spearmint's remembers. Abnormalities entrench cider's capillary's cognitive tile's ouster inhabitant obliterates onerous retrospects decapitates ameers lumbering unkind deprivation grits prescription's proficient's whinnied.",
        "id": "Z2RvbWFuZ2UxaUBhcnN0ZWNobmljYS5jb21bMjAxOS0wOS0wMSAyMTozOTowN10=",
        "username": "gdomange1i@arstechnica.com",
        "date": "2019-09-01 21:39:07",
        "keywords": [
            "wordpress",
            "google-apps-script",
            "svg"
        ]
    },
    {
        "title": "Awakens tiptoe's commercial's",
        "text": "Débutante's tacked weep's daunted priestesses smuggler baled nether graduating.",
        "id": "aWRlbGFwcmVsbGUxY0BpbWd1ci5jb21bMjAxOS0wOS0wMSAxODo1MDoyOF0=",
        "username": "idelaprelle1c@imgur.com",
        "date": "2019-09-01 18:50:28",
        "keywords": [
            "postgresql",
            "amazon-s3",
            "github"
        ]
    },
    {
        "title": "Unseating triangle chute's egos banister foresight's bumblebees nitrogen's judicially crucially orchestra's redistribute",
        "text": "Armadillo dapperest creak's quarter's sedimentary nest t's tooth perturb quorum's wagon earthworm exuberance's stifling. Original kitchenette's teetotallers skulls concessions list's slacker banners creation's papaya's demolition's coos volcanos allay pockmarking adherent monkey's recoils project web's.",
        "id": "anRydWludkBsYXRpbWVzLmNvbVsyMDE5LTA4LTMxIDIyOjUxOjAyXQ==",
        "username": "jtruinv@latimes.com",
        "date": "2019-08-31 22:51:02",
        "keywords": [
            "api",
            "delphi"
        ]
    },
    {
        "title": "Staffed calm's cartilage's seedy hustle's pawn's pathetically wafer's bigger sieges prisoner fallacious calcium's conduct's watercolors ricksha's forest's",
        "text": "Capitalize misfitting nipples chattering beech excise registering lemonade derailment's blindfolding pulse's narrows livened.",
        "id": "bWdvdWRnZTJkQHByd2ViLmNvbVsyMDE5LTA4LTMxIDIxOjMzOjE1XQ==",
        "username": "mgoudge2d@prweb.com",
        "date": "2019-08-31 21:33:15",
        "keywords": [
            "reactjs"
        ]
    },
    {
        "title": "Phoney's ritual football irresponsibility needling trapeze's slobber turntables suspension grounded appalling invasions gruelling planar statutes revels pledged agent",
        "text": "Shrill acutely kerosene checkers's commissioned reconfigured horns aviation's.",
        "id": "ZHN0b2dnZWxsMm1AcHJpbnRmcmllbmRseS5jb21bMjAxOS0wOC0zMSAxMzoxMjowMl0=",
        "username": "dstoggell2m@printfriendly.com",
        "date": "2019-08-31 13:12:02",
        "keywords": [
            "qt",
            "oop"
        ]
    },
    {
        "title": "Exporting accidentally petition's cove apparitions lowering premising adroitly demotions levity's projection",
        "text": "Industrious drudge's vagary's spoil linguistics's radiators magnesium symbolized obituary's complement's rared. Twines triples venison's megaphoned perplexes tendon tutor's pulls snare's. Daises recuperation's wearily volatile matchbook's lumberjack's plaids promulgates practicalities handlebar lyric menu's matts redundancy's paring.",
        "id": "YWxlc3NtYXJlMXJAYmlibGVnYXRld2F5LmNvbVsyMDE5LTA4LTMxIDExOjA3OjMwXQ==",
        "username": "alessmare1r@biblegateway.com",
        "date": "2019-08-31 11:07:30",
        "keywords": [
            "session",
            "wpf",
            "facebook"
        ]
    },
    {
        "title": "Circuit machining paws embassy surrendered lunchtime deducted copperheads sentience cancellation squelch's marginal flu crinkle",
        "text": "Evaporate sniffles predictor flaking fiancé mesdames sensationalism clings fiesta's adept's tinkers.",
        "id": "Y3RlbmNocUBpbnRlbC5jb21bMjAxOS0wOC0zMCAxNzoyODoxOV0=",
        "username": "ctenchq@intel.com",
        "date": "2019-08-30 17:28:19",
        "keywords": [
            "iphone"
        ]
    }
]
```


***Status Code:*** 200

<br>



### 13. refresh



***Endpoint:***

```bash
Method: GET
Type: 
URL: https://snf-16615.ok-kno.grnetcloud.net/api/authenticate/refresh
```


***Cookie:***


| Key | Description |
| --- | ------|
| refresh_token | long-lived token used to issue the access_token with |

***More example Requests/Responses:***


##### I. Example Request: successful refresh



***Cookie:***


| Key | Value |
| --- | ------|
| refresh_token | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprYWNoZWxsZXIyN0BuYXRpb25hbGdlb2dyYXBoaWMuY29tIiwiaWF0IjoxNjI1OTQ0MDMyLCJleHAiOjE2MjYzNzYwMzJ9.sHZtbNsujjENLbUhINZwex9EHrtPaYEJxlrzsngSD4o |


##### I. Example Response: successful refresh
```js
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprYWNoZWxsZXIyN0BuYXRpb25hbGdlb2dyYXBoaWMuY29tIiwiaWF0IjoxNjI1OTM2MDM4LCJleHAiOjE2MjU5MzY5Mzh9.JEFQGwYwJw9VFKuUWkf3rO3g8Uias6ikjzc1dKFqQEY",
    "access_token_expiry": 1625936938115
}
```


***Status Code:*** 200

<br>



### 14. signup



***Endpoint:***

```bash
Method: POST
Type: URLENCODED
URL: https://snf-16615.ok-kno.grnetcloud.net/api/authenticate/signup
```



***Body:***


| Key | Description |
| --- | -------------|
| username | username to sign up with |
| password | password corresponding with the username |



***More example Requests/Responses:***


##### I. Example Request: successful signup



***Body:***


| Key | Value |
| --- | ------|
| username | jkacheller28@nationalgeographic.com |
| password | Qvnbvd7K9!$ |


##### I. Example Response: successful signup
***Status Code:*** 201

<br>



---
[Back to top](#Implementation with Microservices)
