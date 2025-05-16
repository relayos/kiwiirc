<template>
    <div
        :class="{
            'kiwi-startup-common--closing': closing,
            'kiwi-startup-common--no-bg': !backgroundImage,
        }" :style="styleCommon" class="kiwi-startup-common"
    >
        <div class="kiwi-startup-common-section kiwi-startup-common-section-connection">
            <slot name="connection" />
        </div>
        <div
            :style="styleInfo"
            class="kiwi-startup-common-section kiwi-startup-common-section-info"
        >
            <div
                v-if="infoContent"
                class="kiwi-startup-common-section-info-content"
                v-html="infoContent"
            />
        </div>
        <div class="kiwi-fontawesome-preload">
            <i class="fa fa-spinner" aria-hidden="true" />
        </div>
    </div>
</template>

<script>
'kiwi public';

export default {
    data() {
        return {
            closing: false,
        };
    },
    computed: {
        styleCommon() {
            let style = {};
            let options = this.$state.settings.startupOptions;

            if (options.infoBackground && this.$state.ui.app_width <= 850) {
                style['background-image'] = `url("${options.infoBackground}")`;
            }
            return style;
        },
        styleInfo() {
            let style = {};
            let options = this.$state.settings.startupOptions;

            if (options.infoBackground && this.$state.ui.app_width > 850) {
                style['background-image'] = `url("${options.infoBackground}")`;
            }
            return style;
        },
        backgroundImage() {
            return this.$state.settings.startupOptions.infoBackground || '';
        },
        infoContent() {
            return this.$state.settings.startupOptions.infoContent || '';
        },
    },
    methods: {
        close() {
            this.closing = true;
            let startApp = (event) => {
                this.$el.removeEventListener('transitionend', startApp);
                this.$state.persistence.watchStateForChanges();
                // Hacky to be using $parent but this component should only be used in a sepcific
                // scope within startup screens
                this.$parent.$emit('start');
            };

            this.$el.addEventListener('transitionend', startApp, false);
        },
    },
};
</script>

<style>
/* Styles moved to src/styles/components/_common-layout.scss */
</style>
