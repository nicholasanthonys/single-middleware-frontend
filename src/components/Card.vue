<template>

  <div class="card">
    <header class="card-header">
      <p class="card-header-title has-text-grey">
        {{ title }}
      </p>
      <div class="card-header-icon">
      <span class="icon">
        <b-icon
            :icon="icon"
            size="is-small">
        </b-icon>
      </span>
      </div>
    </header>
    <div class="card-content">
      <div class="content">
        <slot name="card-content"></slot>

      </div>
    </div>
    <footer class="card-footer">
      <slot name="card-footer-content"/>
    </footer>
  </div>

</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss">
.card {
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
}
</style>
