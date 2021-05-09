<template>
  <div>
    <div id="serial">
      <div v-if="serial!= null">
        <div class="column" style="height: 500px">
          <div class="col-1">
            <q-btn @click="openDialogAddSerial">Add More Serial Config</q-btn>
          </div>
          <div class="col">
            <q-table
                style="height: 400px"
                title="Serial Projects Config File"
                :data="serial.configures"
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

                    <p v-if="col.name !=='action'">{{ col.value }} </p>

                    <div v-else>
                      <q-btn
                          class="q-mr-sm"
                          size="sm"
                          icon="edit"
                          label="Edit"
                          color="primary"
                          @click="selectConfigureSerial(props.rowIndex)"
                      />
                      <q-btn
                          size="sm"
                          icon="delete"
                          label="Delete"
                          color="negative"
                          @click="onDeleteConfigureFileSerial(props.row)"
                      />
                    </div>

                    <!--                    @click="$router.push(`/projects/${propProjectId}/serial/${props.row.id}`)"-->

                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>


      </div>
      <div v-else>
        <div class="column" style="height: 200px">
          <div class="col-3">
            <q-btn @click="openDialogAddSerial">Add Serial</q-btn>
            <br/>
          </div>
          <div class="col">
            <div class="flex justify-center items-center" style="height: 200px;background: #f3f3f3">
              <p>No Serial Config Found</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <q-dialog
        v-model="dialog"
        persistent
        :maximized="maximizedToggle"
        transition-show="slide-up"
        transition-hide="slide-down"
    >
      <q-card class="text-black">
        <q-bar>
          <q-space/>

          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary">Minimize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary">Maximize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-pt-none full-height">
          <div class="text-h6">Serial Config</div>
          <ConfigSerialDetail
              :prop-serial-config="selectedConfigureSerial"
              :configure-options="options"
              :prop-index="index"
              :prop-mode="mode"
              @on-confirm-clicked="onConfirmConfigSerial"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogDeleteConfig" persistent v-if="selectedConfigureSerial">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure want to delete config serial with id {{selectedConfigureSerial.id}} ? </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="primary" :loading="isDeletingConfig" @click="deleteConfigFileSerial($route.params.id, selectedConfigureSerial.id)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ConfigSerialDetail from "./ConfigSerialDetail";

export default {
  components: {ConfigSerialDetail},
  props: {
    propProjectId: String,
  },
  computed : {
   ...mapGetters({
     serial : 'serial/getSerial',
   })
  },
  data() {
    return {
      dialog: false,
      maximizedToggle: true,
      loop : null,
      codeAddHeader: {},
      codeAddBody: {},
      codeModifyHeader: {},
      codeModifyBody: {},
      codeDeleteHeader: [],
      codeDeleteBody: [],
      statusCode: null,
      transform: "ToJson",
      logBeforeModify: {},
      logAfterModify: {},
      isLoading: false,
      isLoadConfigures: false,
      pagination: {
        rowsPerPage: 1000
      },
      columns: [
        {
          name: 'id',
          label: 'Id',
          field: row => row.id,
          align: 'left',
        },
        {
          name: 'alias',
          required: false,
          label: 'Alias',
          align: 'left',
          field: row => row.alias,
          format: val => `${val ? val.substring(0, 30) + '...' : '-'}`,
        },
        {
          name: 'action',
          required: true,
          label: 'Action',
        }
      ],

      selectedConfigureSerial: null,
      mode: 'add',
      index: -1,

      options: [],

      dialogDeleteConfig : false,
      isDeletingConfig :false

    }
  },
  methods: {
    ...mapActions({
      actionFetchConfigures: 'configures/fetchConfigures',
      fetchSerial : 'serial/fetchSerial',
      actionDeleteConfigFileSerial : 'serial/deleteSpecificConfigFile'
    }),
    onDeleteConfigureFileSerial(config){
     this.selectedConfigureSerial = config
      this.dialogDeleteConfig = true;
    },
    async deleteConfigFileSerial(projectId, configFileId){
      this.isDeletingConfig = true;
      try{
        await this.actionDeleteConfigFileSerial({projectId,configFileId})
        this.$q.notify({
          message: 'Delete Success.',
          color: 'secondary'
        })
        this.dialogDeleteConfig= false;
      }catch (e) {
        this.$q.notify({
          message: 'Somethings wrong when deleting parallel config file',
          color: 'negative'
        })
        console.log(e)
      }
      this.isDeletingConfig = false;
    },
    openDialogAddSerial() {
      this.mode = 'add'
      this.dialog = true

    },
    onConfirmConfigSerial() {
      this.dialog = false;
    },
    selectConfigureSerial( index) {
       this.selectedConfigureSerial = this.serial.configures[index]

      this.mode = 'edit',
          this.dialog = true;
    },
    async loadConfigures(projectId) {
      this.isLoadConfigures = true;
      try {
        let response = await this.actionFetchConfigures(projectId)
        this.options = this.constructOptionsConfigId(response.data.configs)
      } catch (e) {
        console.log(e)
      }
      this.isLoadConfigures = false;
    },
    async loadSerial(projectId){
      this.isLoading = false;
      try {
         await this.fetchSerial(projectId)
      } catch (e) {
        console.log(e)
      }
      this.isLoading = true
    },
    constructOptionsConfigId(configures) {
      let options = []
      configures.forEach(e => {
        options.push(
            e.id,
        )
      });
      return options
    },
  },
  async mounted() {
    await this.loadSerial(this.$route.params.id)
    await this.loadConfigures(this.$route.params.id)
  }
}
</script>

<style scoped>

</style>