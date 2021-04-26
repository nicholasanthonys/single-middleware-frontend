<template>
  <q-layout view="lHh Lpr lFf">
    <q-header >
      <q-toolbar>
        <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            aria-label="Menu"
            icon="menu"
        />

      </q-toolbar>
      <div class="q-px-lg q-pt-xl q-mb-md">
       <div class="text-h3">Welcome</div>
        <div class="text-subtitle1"> {{todaysDate}}</div>
      </div>
      <img :src="require('../assets/images/bridge.jpg')" class="header-image absolute-top">
    </q-header>

    <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        :width="250"
        :breakpoint="600"
    >
      <q-scroll-area style="height: calc(100% - 192px); margin-top: 192px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item clickable v-ripple :active="false " :to="{name :'Home.Containers'}" exact>
            <q-item-section avatar>
              <q-icon name="inbox" />
            </q-item-section>

            <q-item-section>
              Container
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :active="$route.name==='Home.Projects'" :to="{name : 'Home.Projects'}"  exact>
            <q-item-section avatar>
              <q-icon name="star" />
            </q-item-section>

            <q-item-section>
              Projects
            </q-item-section>
          </q-item>


        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 192px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div class="text-weight-bold">{{user.name}}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
        <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import {date} from 'quasar'
import {decodeToken, getToken} from "../services/common/jwt.service";
import {mapGetters} from "vuex";
export default {
  name: 'LayoutDefault',
  computed : {
    ...mapGetters({
     user : 'auth/currentUser'
    }),
   todaysDate() {
     let timeStamp = Date.now()
     return  date.formatDate(timeStamp, 'dddd D MMMM')
   }
  },
  components: {
  },

  data () {
    return {
      leftDrawerOpen:true
    }
  },
  mounted() {
    let token = getToken()
    let decode = decodeToken(token)
  }
}
</script>

<style lang="scss" scoped>
.header-image {
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.4;
  filter: grayscale(20%);
}
</style>
