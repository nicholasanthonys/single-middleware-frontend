<template>
  <div class="q-pa-md">
    <div class="column" style="height: 150px">
      <div class="col-4">
        <q-btn @click="$router.push({name : 'Containers.New'})">Add Container</q-btn>
      </div>

      <div class="col-4">
        <q-table
            style="height: 400px"
            title="Your Containers"
            :data="data"
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

                <p v-if="col.name !=='description' && col.name !== 'action' ">{{ col.value }}</p>
                <div v-if="col.name === 'description'">
                  <p>{{ col.value }}
                    <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]">
                      {{ props.row.description }}
                    </q-tooltip>
                  </p>
                </div>
                <q-icon
                    v-if="col.name==='action'"
                    size="xs"
                    name="preview"
                    @click="$router.push({name : 'Containers.Detail', params : {id : props.row.id}})"
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
import {mapActions} from "vuex";

export default {
  data() {
    return {
      data: [],
      pagination: {
        rowsPerPage: 1000
      },

      columns: [
        {
          name: 'index',
          label: '#',
          field: 'index',
          align: 'left',
        },
        {
          name: 'id',
          label: 'Id',
          field: 'id',
          align: 'left',
        },
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: row => row.name,
        },
        {
          name: 'containerCreated',
          required: true,
          label: 'Is Docker Container Created',
          align: 'left',
          field: row => row.container_id,
          format: val => `${val ? 'Yes' : 'No'}`,
        },
        {
          name: 'description',
          required: false,
          label: 'Description',
          align: 'left',
          field: row => row.description,
          format: val => `${val ? val.substring(0, 30) + '...' : '-'}`,
        },
        {
          name: 'action',
          required: true,
          label: 'Action',
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      actionFetchContainers: 'containers/fetchContainers'
    }),

    async fetchContainers() {
      try {
        let response = await this.actionFetchContainers();
        this.data = response.data;
        this.data.forEach((row, index) => {
          row.index = index
        })
      } catch (err) {
        console.log(err)
      }

    }
  },
  async mounted() {
    await this.fetchContainers();
  }
}
</script>

<style scoped>

</style>