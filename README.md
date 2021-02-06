# Vue Nodebird
Vue.js + Nuxt.js + Vuetify

## ch1
```command
npm init
npm i vue nuxt
npm i vuetify @nuxtjs/vuetify @nuxtjs/axios
npm i -D eslint eslint-plugin-vue
```
- nuxtjs 이해하기
- vuetify로 기본 페이지 화면 만들기
- eslint 설정

## ch2
- Vuex 모듈 시스템 설명 및 스토어 구조 잡기
  - Vuex 모듈 구조
```JavaScript (store/users.js)
export const state = () => ({
  me: null,
});

export const mutations = {
  setMe(state, payload) {
    state.me = payload;
  },
};

export const actions = {
  signUp({ commit, dispatch, state, rootState, getters, rootGetters }, payload) {
    // 서버에 회원가입 요청을 보내는 부분
    commit('setMe', payload);
  },
  logIn(context, payload) {

  },
  add({ commit }, payload) {
    commit('addMainPost', payload, { root: true }); // index 모듈의 addMainPost를 실행
  },
};
```
  - state는 함수, mutations는 객체안에 함수들이 존재
  - mutations는 단순한 동기적인 작업을 할 때 사용한다.
  - actions는 복잡한 작업(비동기 작업)을 할 때 사용한다.
    - actions 안에서 mutations를 실행할 수도 있고, 또다른 actions를 사용할 수 있다.
    - rootState, rootGetters는 index 모듈의 state, getters 이다.
    - mutations보다는 actions가 더 고차원적인 개념

- 더미 데이터로 개발하기
  - 로그인, 회원가입
  - 글 작성·삭제
  - 댓글 작성
  - 닉네임 수정

  - nuxt는 내부적으로 Vuex와 Vue Router를 사용한다.

  - vuex에서 state를 가져올 때
```vue
<script>
  import { mapState } from 'vuex';
  export default {
    computed: {
      // 1
      me() {
        return this.$store.state.users.me;
      },
      // 2
      ...mapState(['users/me'])

      // 3
      ...mapState('users', ['me'])      
    }
  }
</script>
```
  - 컴포넌트의 props는 최대한 자세하게 작성해주는 것이 좋다.
```vue
<script>
  export default {
    props: {
      post: {
        type: Object,
        required: true,
      },
    }
  }
</script>
```
## ch3
- 더미 데이터로 개발하기1
  - 팔로잉, 팔로워
- 라우팅 미들웨어
- watch 사용: 회원가입 페이지에서 로그인 했을 경우 메인 페이지로 보냄
- 더미 데이터로 개발하기2
  - 인피니티 스크롤링
  - 팔로잉, 팔로워 더보기
  - 해쉬태그 검색
- 스크롤 위치 기억하는 메서드: scrollBehavior, scrollToTop
- 배열의 값을 바꾸는 경우 this.$set을 사용해야 한다.
```vue
<script>
export default {
  data() {
    return {
      abc: [1, 2, 3]
    }
  },
  mounted() {
    this.abc[0] = '5'; // X
    this.$set(this.abc, '0', '5'); // O
  }
}
</script>
```
[Vue.js 공식문서 | 반응형에 대해 깊이 알아보기](https://kr.vuejs.org/v2/guide/reactivity.html)

- 인피니티 스크롤링 구현해보기 (FE 입장)
  - 전체 게시글의 갯수를 모른다.
  - 10개씩 끊어서 다음 게시물을 가져온다. 그러다가 10개가 아니면 그때 더 이상 가져올 게시글이 없다고 예상할 수 있다.
```JavaScript (store/posts.js)
export const state = () => ({
  mainPosts: [],
  hasMorePost: true,
});

const totalPosts = 51;
const limit = 10;

export const mutations = {
  loadPosts(state) {
    const diff = totalPosts - state.mainPosts.length; // 아직 안 불러온 게시글 수
    const fakePosts = Array(diff > limit ? limit : diff).fill().map(v => ({
      id: Math.random().toString(),
      User: {
        id: 1,
        nickname: '제로초',
      },
      content: `Hello infinite scrolling~ ${Math.random()}`,
      Comments: [],
      Images: [],
    }));
    state.mainPosts = state.mainPosts.concat(fakePosts);
    state.hasMorePost = fakePosts.length === limit;
  },
};

export const actions = {
  loadPosts({ commit, state }, payload) {
    if (state.hasMorePost) {
      commit('loadPosts');
    }
  }
}
```

  - fetch는 처음 시작할 때 데이터를 넣어준다.
  - fetch는 보통 컴포넌트가 마운트 되기 전에 스토어에서 비동기적으로 데이터를 넣을 때 사용한다.
```vue (pages/index.vue)
<script>
  export default {
    computed: {
      mainPosts() {
        return this.$store.state.posts.mainPosts;
      },
      hasMorePost() {
        return this.$store.state.posts.hasMorePost;
      },
    },
    fetch({ store }) {
      store.dispatch('posts/loadPosts');
    },
    mounted() {
      window.addEventListener('scroll', this.onScroll)
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.onScroll)
    },
    methods: {
      onScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
          if (this.hasMorePost) {
            this.$store.dispatch('posts/loadPosts');
          }
        }
      },
    }
  }
</script>
```
  - 하지만 실무에서는 네트워크 상황으로 인해서 요청이 엄청나게 갈 수 있는 상황을 대비해서 쓰로틀링을 적용한다.
  - limit 기반으로 안하는 이유는 게시글을 중간에 삭제하고 새로 쓰고 할 수 있기 때문에 totalPosts가 자꾸 바뀐다.
  - 그래서 lastId 기반으로 개발 한다.

## ch4
```command
npm init
npm i express
npm i sequelize mysql2

npm i -D sequelize-cli
npx sequelize init

npm i -D nodemon

npx sequelize db:create
```
[MYSQL 다운로드](https://dev.mysql.com/downloads/mysql)

- 프론트 서버에서 DB 접속을 바로하면 보안에 취약해진다.(소스 코드 유출 가능성이 높다.)
- 프론트 서버에서 백엔드 서버를 통해서 DB 정보를 요청하고 다시 백엔드 서버를 거쳐서 프론트 서버로 가져온다.(요청 1번에 응답 1번)
- 프론트 → 백엔드 → DB (요청, request)
- DB → 백엔드 → 프론트 (응답, response)

- 프론트와 백엔드 언어가 다른 경우
  - 요청과 응답은 하나의 약속으로 정의가 되어있다. HTTP
  - HTTP를 잘 알아야 한다.
    - req(요청)
      - GET: 가져오다
      - POST: 생성하다
      - PUT: 전체 수정
      - PATCH: 부분 수정
      - DELETE: 삭제
      - OPTIONS: 찔러보기
    - res(응답)
- 포트 번호: https는 443, http는 80이 숨어있다.
- 서버를 실제로 배포할 때 이런 기본적인 지식이 없으면 배포를 할 수가 없다.

- 개발용 DB랑 배포용 DB는 보통 다르다.

- HTTP STATUS CODE
  - 200: 성공
  - 201: 성공적으로 생성됨
  - 400~: 클라이언트에서 잘못된 요청을 보냄
  - 401: 권한 없음
  - 403: 금지
  - 404: 페이지를 찾을 수 없음

[HTTP 상태 코드](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)

- 프론트 서버와 백엔드 서버의 포트가 다른 경우 cors 에러가 난다.
```command
npm i cors

```
```JavaScript
const cors = require('cors');

app.use(cors('http://localhost:3000')); // 허용할 주소: http://localhost:3000
```

- 암호화 모듈 3가지: bcrypt, scrypt, pbkdf2
```command
npm i -g -p windows-build-tools ??
npm i bcrypt
```
```JavaScript
const bcrypt = require('bcrypt');

app.post('/user', async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    const newUser = await db.User.create({
      email: req.body.email,
      password: hash,
      nickname: req.body.nickname
    });
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    next(err);
  }  
});
```

- 시퀄라이즈 기존 데이터를 포맷하고 새로 테이블을 만드는 법
- 실무에서는 마이그레이션 하는 방법을 따로 익혀야 한다.
```JavaScript
const db = require('./models');

db.sequelize.sync({ force: true });
```
- 백엔드 서버 재실행

## ch5

## 공식문서
[Vue.js](https://kr.vuejs.org)
[Nuxt.js](https://ko.nuxtjs.org)

## 강좌
- 이전에 여기까지 -> 4-8
- 다시 들음 3-9