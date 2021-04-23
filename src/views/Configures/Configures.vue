<template>
  <div class="q-pa-md">
    <div class="column">
      <div class="col-4">

        <q-btn @click="dialog = true"> Add New Project</q-btn>

      </div>
      <br/>
      <div class="col">
<!--    configs is {{configs}}-->
<!--        {{columns}}-->
        <q-table
            style="height: 600px"
            title="Your Configures"
            :data="configs"
            :columns="columns"
            row-key="index"
            virtual-scroll
            :pagination.sync="pagination"
            :rows-per-page-options="[0]"
        >

          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">

              <q-td
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
              >

                <p v-if="col.name !== 'action' " >{{ col.value }}</p>

                <q-icon
                    v-else
                    size="xs"
                    name="edit"
                    @click="$router.push({name : 'Configures.Detail', params : {
                      projectId : $route.params.id,
                      id : props.row.id
                    }})"
                />

              </q-td>
            </q-tr>
          </template>
        </q-table>

      </div>

    </div>


  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
export default {
  props : {
   projectId : String
  },
  components : {

  },
  computed : {
   ...mapGetters({
    configs:'configures/getConfigures'
   })
  },
  data() {
    return {
      data: [],
      selectedConfig : null,
      pagination: {
        rowsPerPage: 1000
      },
      columns: [
        {
          name: 'id',
          label: 'id',
          field: row => row.id,
          align: 'left',
        },
        {
          name: 'action',
          required: true,
          label: 'Action',
        }
      ],

    }
  },
  methods: {
    ...mapActions({
      actionFetchConfigures: 'configures/fetchConfigures'
    }),


    async fetchProjects(projectId) {
      try {
        await this.actionFetchConfigures(projectId);
        /*this.data.forEach((row, index) => {
          row.index = index
        })*/
      } catch (err) {
        console.log(err)
      }

    },

  },
  async mounted() {
    await this.fetchProjects(this.projectId);
  }
}
</script>

<style scoped>

</style>
