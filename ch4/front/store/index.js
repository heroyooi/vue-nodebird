export const state = () => ({
  hello: 'vuex',
});

export const mutations = {
  BYE(state) {
    state.hello = 'goodbye';
  }
};