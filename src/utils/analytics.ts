declare global {
    interface Window {
        ta: {
            track: (eventName: string, properties?: Record<string, any>) => void;
            login: (userId: string) => void;
            identify: (distinctId: string) => void;
        };
    }
}

export const Analytics = {
    track: (eventName: string, properties?: Record<string, any>) => {
        if (typeof window !== 'undefined' && window.ta) {
            try {
                window.ta.track(eventName, properties);
            } catch (e) {
                console.error('ThinkingData track error:', e);
            }
        }
    },

    // Standard Events
    Events: {
        NAV_CLICK: 'nav_click',
        CTA_CLICK: 'cta_click',
        CONTACT_FORM_SUBMIT: 'contact_form_submit',
        CREATOR_APPLY_SUBMIT: 'creator_apply_submit',
        BRAND_APPLY_SUBMIT: 'brand_apply_submit',
        FAQ_EXPAND: 'faq_expand',
        EXTERNAL_LINK_CLICK: 'external_link_click',
        PLATFORM_SELECT: 'platform_select',
        // Funnel Events
        HOME_VIEW: 'home_view',
        HERO_CTA_CLICK: 'hero_cta_click',
        SECTION_VIEW: 'section_view',
        TAB_CLICK: 'tab_click',
        SHOWCASE_CARD_CLICK: 'showcase_card_click'
    }
};
