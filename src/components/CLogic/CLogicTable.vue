<template>
  <div>
  <q-table
      style="height: 400px"
      title="CLogic Parallel"
      :data="cLogics"
      :columns="cLogicColumns"
      row-key="index"
      virtual-scroll
      :pagination.sync="cLogicPagination"
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

          <div v-if="col.name ==='action' ">
            <q-btn
                v-if="col.name==='action'"
                size="sm"
                color="primary"
                icon="edit"
                label="edit"
                @click="selectCLogic(props.row, props.rowIndex)"
                class="q-mr-sm"

            />

<!--            <q-btn color="negative" icon="delete" label="Delete" size="sm"-->
<!--                   @click="onDeleteCLogic( props.row, props.rowIndex)"-->
<!--            />-->
            <q-btn color="negative" icon="delete" label="Delete" size="sm"
                   @click="openDialogDelete(props.row, props.rowIndex)"
            />


          </div>


        </q-td>
      </q-tr>
    </template>
  </q-table>
    <q-dialog v-model="dialogDelete" persistent v-if="selectedCLogic != null">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white"/>
          <span class="q-ml-sm">Are you sure want to delete CLogic with id {{selectedCLogic.id}}? </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup/>
          <q-btn flat label="Delete" color="primary" v-close-popup @click="onDeleteCLogic"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name : "CLogicTable",
  props: {
    cLogics: Array,


  },
  data() {
    return {
      dialogDelete : false,
      cLogicColumns: [
        {
          name: 'id',
          label: 'Id',
          field: 'id',
          align: 'left',
        },

        {
          name: 'action',
          required: true,
          label: 'Action',
        }
      ],

      cLogicPagination: {
        rowsPerPage: 1000
      },
      selectedCLogic : null,
      selectedCLogicIndex : -1
    }
  },
  methods: {
    openDialogDelete(cLogic, cLogicIndex){
      this.selectedCLogic = cLogic
      this.selectedCLogicIndex = cLogicIndex
      this.dialogDelete = true;
    },
    selectCLogic(cLogic, cLogicIndex) {
      this.$emit('on-select-clogic', {cLogic, cLogicIndex})
    },
    onDeleteCLogic() {
      this.$emit('on-delete-clogic', {cLogic : this.selectedCLogic,
        index : this.selectedCLogicIndex})
    }
  }
}
</script>