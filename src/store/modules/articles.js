import { api } from "../api";
export default {
  namespaced: true,
  state: {
    feed: [],
    count: 0,
  },
  mutations: {
    setArticles(state, { articles, articlesCount }) {
      state.feed = articles;
      state.count = articlesCount;
    },
  },
  actions: {
    async getGlobalFeed({ commit }, payload = { page: 1 }) {
      let route = "/articles";
      if (payload) {
        const {
          tag = null,
          author = null,
          favourited = null,
          page = 1,
        } = payload;
        route += tag ? `?tag=${tag}&` : "";
        route += author ? `?author=${author}&` : "";
        route += favourited ? `?favourited=${favourited}&` : "";
        route += page ? `?offset=${(page - 1) * 10}&limit=10` : "";
      }
      const response = await api.get(route);
      commit("setArticles", response.data);
    },
    async getUserFeed({ commit }, payload = { page: 1 }) {
      let route = "/articles/feed";
      if (payload) {
        const { page = 1 } = payload;
        route += page ? `?offset=${(page - 1) * 10}&limit=10` : "";
      }
      const response = await api.get(route);
      commit("setArticles", response.data);
    },
    async createArticle({ commit }, { title, description, body, tagList }) {
      let route = "/articles";
      let tagListArray = tagList.split(" ");
      let requestBody = {
        article: {
          title,
          description,
          body,
          tagListArray,
        },
      };
      console.log({ requestBody });
      const response = await api.post(route, requestBody);

      const articles = [response, ...this.state.feed];
      const articlesCount = this.state.count + 1;
      console.log({ articles });
      console.log({ articlesCount });
      commit("setArticles", { articles, articlesCount });
    },
  },
};
