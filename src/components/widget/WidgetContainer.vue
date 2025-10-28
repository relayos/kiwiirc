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
                    <i class="fa fa-comments" />
                </div>
            </div>
        </div>
        <div v-else class="kiwi-widget-expanded">
            <div class="kiwi-widget-expanded-header">
                <div class="kiwi-widget-expanded-title">{{ title }}</div>
                <div class="kiwi-widget-expanded-controls">
                    <button class="kiwi-widget-expanded-minimize" @click="toggleMinimized">
                        <i class="fa fa-minus" />
                    </button>
                </div>
            </div>
            <div class="kiwi-widget-expanded-content">
                <slot />
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
            default: 'Chat with us',
        },
        initialState: {
            type: String,
            default: 'minimized',
            validator: (value) => ['minimized', 'expanded'].includes(value),
        },
        position: {
            type: String,
            default: 'bottom-right',
            validator: (value) => ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(value),
        },
    },

    data() {
        return {
            minimized: this.initialState === 'minimized',
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
        },
    },
};
</script>

<style>
/* Styles moved to src/styles/components/_widget-container.scss */
</style>
