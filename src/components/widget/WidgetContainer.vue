<template>
  <div 
    class="kiwi-widget-container" 
    :class="{ 
      'kiwi-widget-container--minimized': minimized,
      'kiwi-widget-container--expanded': !minimized,
      [`kiwi-widget-container--position-${position}`]: true
    }"
  >
    <div v-if="minimized" class="kiwi-widget-minimized" @click="toggleMinimized">
      <div class="kiwi-widget-minimized-header">
        <div class="kiwi-widget-minimized-title">{{ title }}</div>
        <div class="kiwi-widget-minimized-icon">
          <i class="fa fa-comments"></i>
        </div>
      </div>
    </div>
    <div v-else class="kiwi-widget-expanded">
      <div class="kiwi-widget-expanded-header">
        <div class="kiwi-widget-expanded-title">{{ title }}</div>
        <div class="kiwi-widget-expanded-controls">
          <button class="kiwi-widget-expanded-minimize" @click="toggleMinimized">
            <i class="fa fa-minus"></i>
          </button>
        </div>
      </div>
      <div class="kiwi-widget-expanded-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WidgetContainer',
  
  props: {
    title: {
      type: String,
      default: 'Chat with us'
    },
    initialState: {
      type: String,
      default: 'minimized',
      validator: value => ['minimized', 'expanded'].includes(value)
    },
    position: {
      type: String,
      default: 'bottom-right',
      validator: value => ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(value)
    }
  },
  
  data() {
    return {
      minimized: this.initialState === 'minimized'
    };
  },
  
  methods: {
    toggleMinimized() {
      this.minimized = !this.minimized;
      this.$emit('state-change', this.minimized ? 'minimized' : 'expanded');
    },
    
    minimize() {
      if (!this.minimized) {
        this.minimized = true;
        this.$emit('state-change', 'minimized');
      }
    },
    
    expand() {
      if (this.minimized) {
        this.minimized = false;
        this.$emit('state-change', 'expanded');
      }
    }
  }
};
</script>

<style>
.kiwi-widget-container {
  position: fixed;
  z-index: 9999;
  font-family: Arial, sans-serif;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.kiwi-widget-container--position-bottom-right {
  right: 20px;
  bottom: 20px;
}

.kiwi-widget-container--position-bottom-left {
  left: 20px;
  bottom: 20px;
}

.kiwi-widget-container--position-top-right {
  right: 20px;
  top: 20px;
}

.kiwi-widget-container--position-top-left {
  left: 20px;
  top: 20px;
}

.kiwi-widget-container--minimized {
  width: 60px;
  height: 60px;
}

.kiwi-widget-container--expanded {
  width: 320px;
  height: 480px;
}

.kiwi-widget-minimized {
  width: 100%;
  height: 100%;
  background-color: #2196F3;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.kiwi-widget-minimized-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.kiwi-widget-minimized-title {
  display: none;
}

.kiwi-widget-minimized-icon {
  font-size: 24px;
}

.kiwi-widget-expanded {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
}

.kiwi-widget-expanded-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: #2196F3;
  color: white;
}

.kiwi-widget-expanded-title {
  font-weight: bold;
}

.kiwi-widget-expanded-controls {
  display: flex;
}

.kiwi-widget-expanded-minimize {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  font-size: 14px;
}

.kiwi-widget-expanded-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
