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
        SHOWCASE_CARD_CLICK: 'showcase_card_click',
        // Resume Flow Events
        RESUME_UPLOAD_START: 'resume_upload_start',
        RESUME_PARSED_SUCCESS: 'resume_parsed_success',
        RESUME_PARSED_ERROR: 'resume_parsed_error',
        RESUME_GENERATION_START: 'resume_generation_start',
        RESUME_GENERATION_SUCCESS: 'resume_generation_success',
        RESUME_GENERATION_ERROR: 'resume_generation_error',
        RESUME_DOWNLOAD_CLICK: 'resume_download_click',
        VIEW_DEMO_CLICK: 'view_demo_click',
        // Consulting Events
        CONSULTING_INQUIRE_OPEN: 'consulting_inquire_open',
        CONSULTING_INQUIRE_SUBMIT: 'consulting_inquire_submit',
        CONSULTING_PAYMENT_COMPLETE: 'consulting_payment_complete'
    }
};
