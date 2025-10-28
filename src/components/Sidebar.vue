<template>
    <div
        :class="[`kiwi-sidebar-section-${section}`]"
        class="kiwi-sidebar kiwi-theme-bg"
    >
        <span v-if="!sidebarState.isOpen" class="kiwi-sidebar-options">
            <div class="kiwi-sidebar-close" @click="sidebarState.close()">
                {{ $t('close') }}<i class="fa fa-times" aria-hidden="true" />
            </div>
        </span>

        <template v-if="sidebarState.activeComponent">
            <component
                :is="sidebarState.activeComponent"
                v-bind="sidebarState.activeComponentProps"
                :network="network"
                :buffer="buffer"
                :sidebar-state="sidebarState"
            />
        </template>
        <template v-else-if="buffer">
            <template v-if="buffer.isChannel()">
                <sidebar-section-settings
                    v-if="section === 'settings'"
                    :network="network"
                    :buffer="buffer"
                    :sidebar-state="sidebarState"
                />

                <div
                    v-else-if="section === 'user'"
                    class="kiwi-sidebar-userbox"
                    @click.stop=""
                >
                    <user-box
                        :network="network"
                        :buffer="buffer"
                        :user="sidebarState.sidebarUser"
                        :sidebar-state="sidebarState"
                    />
                </div>

                <nicklist
                    v-else-if="section === 'nicklist'"
                    :network="network"
                    :buffer="buffer"
                    :sidebar-state="sidebarState"
                />

                <sidebar-about-buffer
                    v-else-if="section === 'about'"
                    :network="network"
                    :buffer="buffer"
                    :sidebar-state="sidebarState"
                />
            </template>
            <template v-else-if="buffer.isQuery()">
                <div
                    v-if="section === 'user'"
                    class="kiwi-sidebar-userbox"
                    @click.stop=""
                >
                    <user-box
                        :network="network"
                        :buffer="buffer"
                        :user="sidebarState.sidebarUser"
                        :sidebar-state="sidebarState"
                    />
                </div>
            </template>
        </template>
        <template v-else>
            {{ $t('side_buffer') }}
        </template>
    </div>
</template>

<script>
'kiwi public';

import UserBox from '@/components/UserBox';
import SidebarState from './SidebarState';
import SidebarAboutBuffer from './SidebarAboutBuffer';
import SidebarSectionSettings from './SidebarSectionSettings';
import Nicklist from './Nicklist';

export { SidebarState as State };

export default {
    components: {
        SidebarAboutBuffer,
        SidebarSectionSettings,
        Nicklist,
        UserBox,
    },
    props: ['network', 'buffer', 'sidebarState'],
    computed: {
        section() {
            if (this.sidebarState.activeComponent) {
                return 'component';
            }

            return this.sidebarState.section();
        },
    },
    created() {
        this.listen(this.$state, 'sidebar.tab.show', (tabName) => {
            this.showTab(tabName);
        });
    },
    methods: {
        showTab(tabName) {
            this.$refs.tabs.setActiveByName(tabName);
        },
    },
};

</script>

<style lang="less">
/* Styles moved to src/styles/components/_sidebar.scss */
</style>
