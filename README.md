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
- 유용한 npm 명령어
```command
npm outdated
```
  - 패키지 중 오래된 목록이 뜬다.

```command
npm update
```
  - 업데이트 해준다.
  - found 0 vulnerabilities 가 아닐 경우 아래 명령어로 취약점을 고쳐주어야 한다.

```command
npm audit fix
```
  - 업데이트 이후 최약점이 있을때 자동으로 취약점을 고쳐준다.

```command
npm init
npm i express
npm i sequelize mysql2
npm i -D sequelize-cli
npm i -D nodemon
```
- sequelize는 db와 상관없이 같은 자바스크립트로 sql를 표현할 수 있다.
- mysql2는 노드와 mysql를 연결시켜주는 드라이버
- sequelize-cli가 쓰였다는 사실을 인지시켜준다. 반드시 명시해주어야함

```command
npx sequelize init
```
- npx는 명령어처럼 사용할 수 있게 만들어준다.
- 중요한 것은 sequelize init

- DB 설정을 마치고나서, MYSQL를 켜고나서
```command
npx sequelize db:create
```
- DB를 생성한다.

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
  - 500~: 서버 에러

[HTTP 상태 코드](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)

  - 헤더: 요청이나 응답에 대한 정보들
  - 바디: 아무거나 보내도 된다.

- DB에서는 테이블, 시퀄라이즈에서는 모델이라고 부른다.


- 프론트 서버와 백엔드 서버의 포트가 다른 경우 CORS 에러가 난다.
- 에러 문구: Access to XMLHttpRequest at 'http://localhost:3085/user' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.

```command
npm i cors
```
```JavaScript
const cors = require('cors');

app.use(cors('http://localhost:3000')); // 허용할 주소: http://localhost:3000
```

- 암호화 모듈 3가지: bcrypt, scrypt, pbkdf2
```command
npm i bcrypt
```

- bcrypt를 설치하다가 에러가 날 경우 아래 명령어 실행
```command
npm i -g -p windows-build-tools
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

- 로그인 처리
  - 사용자가 DB에 저장되어있는 이메일과 비밀번호를 서버로 보내줘서 서버가 확인을 하면 서버에서 세션(메모리)을 만든다.
  - 세션에 사용자 정보가 들어있음.
  - 필요할 때마다 프론트에서 서버로 요청을 보낼 때 세션을 검사해서 이 사람이 권한이 있는 사람인지 체크하고, 권한에 따라 게시글을 작성하거나 삭제하거나 할 수 있음
  - 서비스마다 정책이 다를 수 있음.
  - 세션 구현도 마음대로 할 수 있음. 패스포트를 사용해서 구현
```command
npm i passport passport-local
npm i express-session
npm i cookie-parser
npm i morgan
```

- 시퀄라이즈 관계 정의
  - 1:1 (hasOne, belongsTo)
  - 1:다 (hasMany, belongsTo)
  - 다:다 (belongsToMany)
    - 중간 테이블이 하나 생성된다. (PostHashtag)

```JavaScript
Post.associate = (db) => {
  db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
}
```
  - 관계를 정의하면 
    - add(추가) 예) addHashtags
    - get(조회) 예) getHashtags
    - set(수정) 예) setHashtags
    - remove(제거) 예) removeHashtags
    - 뒤에 모델명을 붙인 메서드들이 생긴다.
    - 단수형도 있고 복수형도 있다. 예) addHashtag, addHashtags

- 미들웨어 작성
```JavaScript
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send('로그인이 필요합니다.');
};
```
- next()
  - 인수에 아무것도 없을 때 다음 미들웨어로 넘어감
  - 인수가 있으면 에러 처리로 넘어감

- 파일 시스템
```command
npm i multer
```
```JavaScript (back/routes/post.js)
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext); // 히어로.png, basename = 히어로, ext = .png
      done(null, basename + Date.now() + ext);
    },
  }),
  limit: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

router.post('/images', isLoggedIn, upload.array('image'), (req, res) => {});
```
  - single (파일 하나)
  - array (같은 키로 여러개)
    - ex) image라는 키로 여러 개
  - fields (다른 키로 여러개)
    - ex) image1, image2로 여러 개
  - none (파일 업로드 X)

## ch5

## 공식문서
[Vue.js](https://kr.vuejs.org)
[Nuxt.js](https://ko.nuxtjs.org)

## 강좌
5-1, 6-1 까지 다 들음