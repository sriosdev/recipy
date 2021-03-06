import axios from 'axios'

const apiURL = process.env.VUE_APP_API_URL

export const admin = {
  namespaced: true,

  state: {
    users: [],
    status: ''
  },

  getters: {
    users: state => state.users,
    status: state => state.status
  },

  actions: {
    async getUsers({ commit }) {      
      try {
        commit('loading')
        const response = await axios.get(`${apiURL}/user`)
        commit('okUsers', response.data)
      }
      catch (error) {
        commit('error')
        console.error(error.response)
      }
    },

    async enable({ commit }, params) {
      try {
        await axios.put(`${apiURL}/user/${params.id}`, {
          enabled: params.enable
        })
      }
      catch (error) {
        commit('error')
        console.error(error.response)
      }
    },
  },

  mutations: {
    loading(state) {
      state.status = 'loading'
    },

    okUsers(state, data) {
      state.users = data
      state.status = 'success'
    },

    error(state) {
      state.status = 'error'
    },

    // remove(state, item) {
    //   state.selected = state.selected.filter(tag => tag.id !== item.id)
    // },
  }
}