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
- 더미 데이터로 개발하기
  - 로그인, 회원가입
  - 글 작성·삭제
  - 댓글 작성
  - 닉네임 수정

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

## ch4
```command
npm init
npm i express
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

## ch5

## 공식문서
[Vue.js](https://kr.vuejs.org)
[Nuxt.js](https://ko.nuxtjs.org)

## 강좌
4-3