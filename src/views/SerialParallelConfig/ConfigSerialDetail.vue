<template>
  <div class="full-height">
    <div class="column">
      <div class="col">
        <q-splitter
            class="full-height"
            v-model="splitterModel"
            v-if="!isLoading"
        >

          <template v-slot:before>
            <q-tabs
                v-model="tab"
                vertical
                class="text-teal"
            >
              <q-tab name="general" icon="description" label="General"/>
              <q-tab name="next_failure" icon="settings_application" label="Next Failure"/>
              <q-tab name="c_logics" icon="settings_application" label="CLogics" v-if="selectedSerialConfig!= null"/>
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
                v-model="tab"
                animated
                swipeable
                vertical
                transition-prev="jump-up"
                transition-next="jump-up"
                style="height: 100%"

            >
              <q-tab-panel name="general">
                <div class="text-h4 q-mb-md">General</div>
                <q-select v-model="selectedConfigId" :options="configureOptions" label="Select Configuration Id"
                          style="max-width: 300px"/>
                <br/>
                <q-input
                    filled
                    v-model="alias"
                    label="Alias *"
                    hint="Config Alias"
                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                />
              </q-tab-panel>

              <q-tab-panel name="next_failure">
                <div class="text-h4 q-mb-md">Failure Response</div>
                <EditorRequestResponseConfig config-type="response"
                                             :prop-status-code="statusCode"
                                             :prop-transform="transform"
                                             :prop-log-after-modify="logAfterModify"
                                             :prop-log-before-modify="logBeforeModify"
                                             :prop-code-add-header="codeAddHeader"
                                             :prop-code-add-body="codeAddBody"
                                             :prop-code-modify-header="codeModifyHeader"
                                             :prop-code-modify-body="codeModifyBody"
                                             :prop-code-delete-header="codeDeleteHeader"
                                             :prop-code-delete-body="codeDeleteBody"
                                             @on-change-status-code-response="onChangeStatusCode"
                                             @on-change-transform-response="onChangeTransform"
                                             @on-change-log-before-modify-response="onChangeLogBeforeModify"
                                             @on-change-log-after-modify-response="onChangeLogAfterModify"
                                             @on-change-add-header-response="onChangeAddHeader"
                                             @on-change-add-body-response="onChangeAddBody"
                                             @on-change-modify-header-response="onChangeModifyHeader"
                                             @on-change-modify-body-response="onChangeModifyBody"
                                             @on-change-delete-header-response="onChangeDeleteHeader"
                                             @on-change-delete-body-response="onChangeDeleteBody"
                />

              </q-tab-panel>

              <q-tab-panel name="c_logics" v-if="selectedSerialConfig!= null">
                <q-btn @click="openDialogAddCLogic"> Add CLogic</q-btn>
                <q-table
                    style="height: 400px"
                    title="Your Projects"
                    :data="cLogics"
                    :columns="cLogicTableColumns"
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

                        <p>{{ col.value }}</p>

                        <q-icon
                            v-if="col.name==='action'"
                            size="xs"
                            name="edit"
                            @click="selectCLogic(props.row, props.rowIndex)"
                        />

                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>


            </q-tab-panels>
          </template>

        </q-splitter>
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

        <q-card-section class="q-pt-none">
          <div class="text-h6">CLogic</div>
          <CLogicItemDetail :prop-c-logic="selectedCLogic" @on-clogic-save="onCLogicSave" :prop-mode="mode"
                            :prop-index="selectedIndex" :prop-config-id="selectedSerialConfig.id" prop-request-type="serial"/>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-btn @click="onSaveClick">Confirm</q-btn>

  </div>
</template>

<script>
import EditorRequestResponseConfig from "../../components/common/EditorRequestResponseConfig";

import {mapActions} from "vuex";
import CLogicItemDetail from "./CLogicItemDetail";

export default {
  props: {
    propSerialConfig: Object,
    configureOptions: Array,
    propIndex: Number,
    propMode: String,
    propConfigureId: String,
  },
  components: {
    CLogicItemDetail,
    EditorRequestResponseConfig
  },
  computed: {},
  watch : {
   propSerialConfig(val){
     this.selectedSerialConfig = val;
   }
  },
  data() {
    return {
      selectedSerialConfig : this.propSerialConfig,
      splitterModel: 10,
      tab: 'general',
      isLoading: false,
      isLoadConfigures: false,

      alias: null,
      selectedConfigId: null,
      options: [],

      id: null,
      /* Next Failure*/
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

      /* C Logics */
      cLogics: [],
      cLogicTableColumns: [
        {
          name: 'id',
          label: 'Id',
          field: row => row.id,
          align: 'left',
        },

        {
          name: 'action',
          required: true,
          label: 'Action',
        }
      ],

      pagination: {
        rowsPerPage: 1000
      },

      /* for dialog */
      selectedCLogic: null,
      mode: 'add',
      selectedIndex: -1,
      dialog: false,
      maximizedToggle: true,


    }
  },
  methods: {
    ...mapActions({
      actionFetchSerial: 'serial/fetchSerial',
      actionFetchConfigures: 'configures/fetchConfigures',
      actionStoreSerial: 'serial/storeSerial',
      storeSingleConfig: 'serial/storeSingleConfig',
      updateSpecificConfig: 'serial/updateSingleConfig',
    }),
    openDialogAddCLogic() {
      this.mode = 'add',
          this.dialog = true
    },
    async onSaveClick() {
      let data = {
        projectId: this.$route.params.id,
        configureId: this.selectedConfigId,
        alias: this.alias,
        nextFailure: {
          statusCode: this.statusCode,
          transform: this.transform,
          adds: {
            header: this.codeAddHeader,
            body: this.codeAddBody
          },
          modifies: {
            header: this.codeModifyHeader,
            body: this.codeModifyBody
          },
          deletes: {
            header: this.codeDeleteHeader,
            body: this.codeDeleteBody
          }
        },
        mode: this.propMode,
      }
      if (this.propMode === 'edit') {
        /* add id */
        try{
          data.id = this.id;
          await this.updateSpecificConfig(data);
          this.$q.notify({
            message: 'Update Config Serial Success.',
            color: 'secondary'
          })
          this.$emit('on-confirm-clicked')
        }catch (e) {
         console.log(e)
        }
      } else {
        try {
          await this.storeSingleConfig(data)
          this.$q.notify({
            message: 'Store Config Serial Success.',
            color: 'secondary'
          })
          this.$emit('on-confirm-clicked')
        } catch (e) {
          console.log(e)
        }
      }


    },

    onCLogicSave(val) {
      console.log(val)
      // const {mode, data, index} = val
      //
      // if (mode === 'edit') {
      //   let temp = [...this.cLogics];
      //   temp[index] = data
      //   this.cLogics = temp;
      // } else {
      //   try {
      //
      //
      //     this.cLogics.push(data)
      //   }catch (e) {
      //    console.log(e) ;
      //   }
      // }
      this.dialog = false
    },
    selectCLogic(cLogicItem, index) {
      this.selectedCLogic = cLogicItem
      this.selectedIndex = index
      this.mode = 'edit';
      this.dialog = true
    },
    async loadConfigures(projectId) {
      this.isLoadConfigures = true;
      try {
        await this.actionFetchConfigures(projectId)
        this.options = this.constructOptionsConfigId(this.configs)
      } catch (e) {
        console.log(e)
      }
      this.isLoadConfigures = false;
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

    onChangeStatusCode(val) {
      this.statusCode = val;
    },
    onChangeTransform(val) {
      this.transform = val;
    },
    onChangeLogBeforeModify(val) {
      this.logBeforeModify = val;
    },
    onChangeLogAfterModify(val) {
      this.logAfterModify = val;
    },
    onChangeAddHeader(val) {
      this.codeAddHeader = val;
    },
    onChangeAddBody(val) {
      this.codeAddBody = val;
    },
    onChangeModifyHeader(val) {
      this.codeModifyHeader = val
    },
    onChangeModifyBody(val) {
      this.codeModifyBody = val
    },
    onChangeDeleteHeader(val) {
      this.codeDeleteHeader = val
    },
    onChangeDeleteBody(val) {
      this.codeDeleteBody = val
    },

    fillDataFromProps(config) {
      const {alias, configure_id, c_logics, next_failure, id} = config
      this.id = id
      this.alias = alias
      this.selectedConfigId = configure_id

      /* Next Failure*/
      const {status_code, transform, adds, modifies, deletes, log_before_modify, log_after_modify} = next_failure
      this.statusCode = status_code,
          this.transform = transform,
          this.codeAddHeader = adds.header,
          this.codeAddBody = adds.body,
          this.codeModifyHeader = modifies.header
      this.codeModifyBody = modifies.body,
          this.codeDeleteHeader = deletes.header,
          this.codeDeleteBody = deletes.body,

          this.logBeforeModify = log_before_modify,
          this.logAfterModify = log_after_modify,

          /* C Logics */
          c_logics.forEach(clogic => {
            let id = clogic.id;
            let rule = clogic.rule;
            let alias = clogic.alias;
            let next_success = clogic.next_success;
            let response = null;
            if (clogic.response) {
              response = {
                status_code: clogic.response.status_code,
                transform: clogic.response.transform,
                adds: {
                  header: clogic.response.adds.header,
                  body: clogic.response.adds.body
                },
                modifies: {
                  header: clogic.response.modifies.header,
                  body: clogic.response.modifies.body
                },
                deletes: {
                  header: clogic.response.deletes.header,
                  body: clogic.response.deletes.body
                }
              }
            }
            this.cLogics.push({
              id,
              rule, alias, next_success, response
            })

          })
    }
  },
  mounted() {

    if (this.propMode === 'edit') {
      this.fillDataFromProps(this.selectedSerialConfig)
    }
  }
}
</script>

<style scoped>

</style>