<template>
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

            <q-btn color="negative" icon="delete" label="Delete" size="sm"
                   @click="onDeleteCLogic( props.row, props.rowIndex)"
            />

          </div>


        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
export default {
  props: {
    cLogics: Array,


  },
  data() {
    return {
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
    }
  },
  methods: {
    selectCLogic(cLogic, cLogicIndex) {
      this.$emit('on-select-clogic', {cLogic, cLogicIndex})
    },
    onDeleteCLogic(cLogic, index) {
      this.$emit('on-delete-clogic', {cLogic, index})
    }
  }
}
</script>