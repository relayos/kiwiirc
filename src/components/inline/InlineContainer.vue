<template>
    <div class="kiwi-inline-container">
        <div class="kiwi-inline-header">
            <div class="kiwi-inline-title">{{ title }}</div>
            <div class="kiwi-inline-controls">
                <button v-if="showSettings" class="kiwi-inline-settings" @click="toggleSettings">
                    <i class="fa fa-cog" />
                </button>
            </div>
        </div>
        <div class="kiwi-inline-content">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'InlineContainer',

    props: {
        title: {
            type: String,
            default: 'RelayOS IRC',
        },
        showSettings: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            settingsOpen: false,
        };
    },

    methods: {
        toggleSettings() {
            this.settingsOpen = !this.settingsOpen;
            this.$emit('toggle-settings', this.settingsOpen);
        },
    },
};
</script>

<style>
/* Styles moved to src/styles/components/_inline-container.scss */
</style>
