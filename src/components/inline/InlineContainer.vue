<template>
  <div class="kiwi-inline-container">
    <div class="kiwi-inline-header">
      <div class="kiwi-inline-title">{{ title }}</div>
      <div class="kiwi-inline-controls">
        <button v-if="showSettings" class="kiwi-inline-settings" @click="toggleSettings">
          <i class="fa fa-cog"></i>
        </button>
      </div>
    </div>
    <div class="kiwi-inline-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InlineContainer',
  
  props: {
    title: {
      type: String,
      default: 'RelayOS IRC'
    },
    showSettings: {
      type: Boolean,
      default: true
    }
  },
  
  data() {
    return {
      settingsOpen: false
    };
  },
  
  methods: {
    toggleSettings() {
      this.settingsOpen = !this.settingsOpen;
      this.$emit('toggle-settings', this.settingsOpen);
    }
  }
};
</script>

<style>
.kiwi-inline-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 300px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

.kiwi-inline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: #2196F3;
  color: white;
}

.kiwi-inline-title {
  font-weight: bold;
}

.kiwi-inline-controls {
  display: flex;
}

.kiwi-inline-settings {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  font-size: 14px;
}

.kiwi-inline-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
