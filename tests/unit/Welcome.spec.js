import Vue from 'vue';
import Welcome from '@/components/startups/Welcome';

jest.mock('@/components/Captcha', () => ({
    render(h) {
        return h('div');
    },
}));

jest.mock('@/components/startups/CommonLayout', () => ({
    render(h) {
        return h('div', this.$slots.connection);
    },
}));

Vue.mixin({
    computed: {
        $t() {
            return (key) => key;
        },
    },
});
Vue.component('input-text', {
    render(h) {
        return h('input');
    },
});
Vue.directive('focus', {});

function renderWelcome(settings) {
    Vue.prototype.$state = {
        settings,
        getNetworkFromAddress: () => null,
        setting: (key) => {
            if (key === 'startupOptions.nick_format') {
                return settings.startupOptions.nick_format;
            }
            return undefined;
        },
    };

    return new Vue({
        el: document.createElement('div'),
        render: (h) => h(Welcome),
    });
}

describe('Welcome.vue RelayOS upgrade path', () => {
    it('renders the configured persistent chat upgrade link', () => {
        const vm = renderWelcome({
            startupOptions: {
                server: 'irc.s.getrelayos.com',
                port: 6697,
                tls: true,
                direct: false,
                channel: '#kiwiirc-default',
            },
            relayosUpgradePath: {
                label: 'Use persistent chat',
                url: 'https://bnc.s.getrelayos.com/oauth/login',
                description: 'Sign in with RelayOS to keep your IRC session connected.',
            },
        });

        const link = vm.$el.querySelector('.kiwi-welcome-relayos-upgrade a');
        const description = vm.$el.querySelector('.kiwi-welcome-relayos-upgrade-description');

        expect(link.textContent.trim()).toBe('Use persistent chat');
        expect(link.getAttribute('href')).toBe('https://bnc.s.getrelayos.com/oauth/login');
        expect(description.textContent.trim()).toBe('Sign in with RelayOS to keep your IRC session connected.');
    });

    it('does not render an upgrade link without a configured url', () => {
        const vm = renderWelcome({
            startupOptions: {
                server: 'irc.s.getrelayos.com',
                port: 6697,
                tls: true,
                direct: false,
                channel: '#kiwiirc-default',
            },
        });

        expect(vm.$el.querySelector('.kiwi-welcome-relayos-upgrade')).toBeNull();
    });
});
