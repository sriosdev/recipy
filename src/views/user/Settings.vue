<template>
<v-container fluid>
  <v-layout justify-center wrap>
    <v-flex xs10 sm5 md4 lg3 xl2>
      <v-form
        @submit.prevent="save"
        v-model="valid"
        lazy-validation
        ref="form"
      >
      <h2 class="text-xs-center my-4">{{ $text(4, 1, 1) }}</h2>
        <!-- <div class="container-avatar">
          <img :src="getUserImage" alt="avatar">          
        </div>
        <h4 class="text-xs-center mb-4">
          <a href="#" class="no-link" @click.prevent="">Cambiar</a>
        </h4> -->

        <div class="container-avatar">
          <ImageInput centered circle :defaultImage="getUserImage"/>
        </div>

        <v-text-field
          v-model="user.nick"
          :counter="20"
          :rules="nickRules"
          :label="$text(4, 1, 2)"
          prefix="@"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.name"
          :rules="nameRules"
          :counter="40"
          :label="$text(4, 1, 3)"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.email"
          :rules="emailRules"
          :label="$text(4, 1, 4)"
          type="email"
          required
        ></v-text-field>

        <div class="v-input v-text-field mb-4"> 
          <div class="v-input__control">
            <router-link to="/user/settings/password">Cambiar contraseña</router-link>
          </div>
        </div>

        <v-textarea
          v-model="user.description"
          :label="$text(4, 1, 5)"
          :counter="200"
          :rules="descriptionRules"
        ></v-textarea>

        <v-layout justify-space-around mt-4>
          <v-flex xs5>
            <button type="submit" class="btn btn1" :class="disabled" :disabled="!valid">
              {{ saveBtn }}
              <v-progress-circular
                v-if="loading"
                indeterminate
                size="20"
                width="2"
                color="white"
              ></v-progress-circular>
            </button>
          </v-flex>
          <v-flex xs5>
            <button @click.prevent="goBack" class="btn btn2">{{ $text(4, 1, 8) }}</button>
          </v-flex>
        </v-layout>
      </v-form>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import ImageInput from '@/components/ImageInput'
import { mapGetters } from 'vuex';

export default {
  name: 'Settings',

  components: {
    ImageInput
  },

  data: () => ({
    user: null,
    valid: true,
    nickRules: [
      v => !!v || 'Campo requerido.',
      v => (v && v.length <= 20) || 'El usuario no puede tener más de 20 caracteres',
      v => {
        const pattern = /^[A-Za-z0-9\._]+$/
        return pattern.test(v) || 'Solo se permiten letras, números, puntos y guiones bajos.'
      }
    ],
    nameRules: [
      v => !!v || 'Campo requerido.',
      v => (v && v.length <= 40) || 'El nombre no puede tener más de 40 caracteres',
      v => {
        const pattern = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/
        return pattern.test(v) || 'El campo solo puede contener letras'
      }
    ],
    emailRules: [
      v => !!v || 'Campo requerido.',
      v => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(v) || 'E-mail no válido'
      }
    ],
    descriptionRules: [
      v => (!v ||v.length <= 200) || 'La biografía no puede tener más de 200 caracteres',
    ],
  }),

  computed: {
    ...mapGetters({
      image: 'file/file'
    }),

    getUserImage() {
      return !!this.user.image
        ? this.user.image
        : '/img/user.svg'
    },

    disabled() {
      return {
        'btn-disabled': !this.valid
      }
    },

    loading() {
      return this.$store.state.data.status === 'loading'
    },

    saveBtn() {
      return this.loading
        ? this.$text(4, 1, 7)
        : this.$text(4, 1, 6)
    }
  },

  created() {
    this.user = Object.assign({}, this.$store.getters['auth/user'])
  },

  methods: {
    async save() {
      if(this.$refs.form.validate()) {
        try {
          this.user.image = this.image 
          const response = await this.$store.dispatch('data/update', {
            path: `user/${this.user.id}`,
            data: this.user
          })
          this.$store.commit('auth/userChange', response.data)
          this.goBack()
          this.$store.commit('alert/setAlert', {
            text: 'Perfil actualizado con éxito.',
            type: 'success'
          })
        }
        catch (error) {
          console.log(error)
        }
      }
    },

    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.container-avatar {
  border-radius: 100%;
  margin: auto;
  margin-bottom: 1.5rem;
}

button {
  width: 100%;
}
</style>

