<template>
<v-autocomplete
  v-model="selectedTags"  
  :items="tags"
  chips
  color="primary"
  label="Ingredientes"
  item-text="name"
  item-value="id"
  multiple
  return-object
  dense
  required
  :rules="ingredientsRules"
  ref="buscador"
  @change="clear"
>
  <template v-slot:selection="data">
    <v-chip
      :selected="data.selected"
      close
      @input="removeSelected(data.item)"
    >
      {{ data.item.name }}
    </v-chip>
  </template>
  <template v-slot:item="data">
    <template>
      <v-list-tile-content>
        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
      </v-list-tile-content>
    </template>
  </template>
</v-autocomplete>
</template>

<script>
import TagService from '@/services/tag'
import { mapGetters } from 'vuex'

export default {
  name: 'TagSelector',

  data: () => ({
    ingredientsRules: [
      v => !!v || 'Campo requerido'
    ]
  }),

  computed: {
    ...mapGetters({
      tags: 'tag/tags',
      status: 'tag/status'
    }),

    selectedTags: {
      get() {
        return this.$store.getters['tag/selected']
      },
      set(items) {
        this.$store.commit('tag/set', items)
      }
    },
  },

  created() {
    this.getTags()
  },

  methods: {
    async getTags() {
      try {
        await this.$store.dispatch('tag/getTags')
      }
      catch (error) {
        console.error(error)
      }
    },

    clear() {
      this.$refs.buscador.lazySearch = ''
    },

    removeSelected(item) {
      this.$store.commit('tag/remove', item)
    }
  }
}
</script>
