<template>
  <div class="q-pa-md">
    <div class="column">
      <div class="col-4">

        <q-btn @click="$router.push({name : 'Configures.New', params : {projectId : $route.params.id}})"> Add New Configure</q-btn>

      </div>
      <br/>
      <div class="col">
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
                <div  v-if="col.name === 'action'">
                  <q-btn
                      class="q-mr-sm"
                      icon="edit"
                      size="sm"
                      color="primary"
                      label="Edit"
                      @click="$router.push({name : 'Configures.Detail', params : {
                      projectId : $route.params.id,
                      id : props.row.id
                    }})"
                  />

                  <q-btn
                      icon="delete"
                      size="sm"
                      color="negative"
                      label="Delete"
                      @click="onDeleteConfigure(props.row)"
                  />
                </div>


              </q-td>
            </q-tr>
          </template>
        </q-table>

      </div>


      <q-dialog v-model="dialogDeleteConfigure" persistent v-if="selectedConfig">
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="negative" text-color="white" />
            <span class="q-ml-sm">Are you sure want to delete configure with id {{selectedConfig.id}} ? </span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn flat label="Delete" color="primary" :loading="isDeletingConfigure" @click="deleteConfigure($route.params.id, selectedConfig.id)"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>


  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  props : {
   projectId : String,
    propConfigs : Array
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
      dialogDeleteConfigure : false,
      isDeletingConfigure : false,
    }
  },
  methods : {
    ...mapActions({
     actionDeleteConfigure : 'configures/deleteConfigure'
    }),
    onDeleteConfigure( configure) {
     this.dialogDeleteConfigure = true;
     this.selectedConfig = configure
    },
    async deleteConfigure(projectId, configureId){
     try{
       await this.actionDeleteConfigure({
         project_id : projectId,
         configure_id : configureId
       }),
       this.$q.notify({
         message: 'Delete Success.',
         color: 'secondary'
       })
       this.dialogDeleteConfigure = false;
     } catch (err){
       this.$q.notify({
         message: 'Somethings wrong when deleting condfigure.',
         color: 'negative'
       })
       console.log(err)
     }
    },
  }


}
</script>

<style scoped>

</style>
