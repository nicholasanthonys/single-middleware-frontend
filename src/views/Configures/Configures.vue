<template>
  <div class="q-pa-md">
    <div class="column">
      <div class="col-4">

        <q-btn @click="$router.push({name : 'Configures.New', params : {projectId : $route.params.id}})"> Add New Configure</q-btn>

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

                <p v-if="col.name !== 'action' && col.name !== 'description' " >{{ col.value }} </p>
                <div v-if="col.name === 'description'">
                  <p>{{ col.value }}
                    <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]">
                      {{ props.row.description }}
                    </q-tooltip>
                  </p>
                </div>
                <q-icon
                    v-if="col.name === 'action'"
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
export default {
  props : {
   projectId : String,
    propConfigs : Array
  },
  components : {

  },
  computed : {
  },
  data() {
    return {
      configs : this.propConfigs,
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
      ],

    }
  },


}
</script>

<style scoped>

</style>
