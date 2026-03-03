const ThinkingData = require('thinkingdata-node');

// Init SDK (using Factory Method)
const td = ThinkingData.initWithDebugMode(
    "65f9109c49d142ba873ffd539f3f85cb",
    "https://te-receiver-naver.thinkingdata.kr"
);

const EVENTS = {
    NAV_CLICK: 'nav_click',
    CONTACT_FORM_SUBMIT: 'contact_form_submit',
    CREATOR_APPLY_SUBMIT: 'creator_apply_submit',
    BRAND_APPLY_SUBMIT: 'brand_apply_submit',
    EXTERNAL_LINK_CLICK: 'external_link_click',
    PLATFORM_SELECT: 'platform_select'
};

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }
function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const distinctId = 'sample_user_' + randomInt(1000, 9999);

console.log(`Sending events for user: ${distinctId}`);

async function run() {
    // 1. nav_click
    const menus = ['Creators', 'Brands', 'Contact', 'About', 'Blog', 'How it works'];
    for (let i = 0; i < 10; i++) {
        td.track(distinctId, EVENTS.NAV_CLICK, {
            menu_name: randomItem(menus),
            location: Math.random() > 0.5 ? 'desktop_nav' : 'mobile_menu'
        });
    }
    console.log("Sent 10 nav_click");

    // 2. contact_form_submit
    const categories = ['General', 'Creator', 'Brand', 'Other'];
    for (let i = 0; i < 10; i++) {
        td.track(distinctId, EVENTS.CONTACT_FORM_SUBMIT, {
            category: randomItem(categories),
            subject_length: randomInt(5, 50),
            message_length: randomInt(20, 500)
        });
    }
    console.log("Sent 10 contact_form_submit");

    // 3. creator_apply_submit
    const platforms = ['tiktok', 'threads'];
    const creatorCats = ['Beauty', 'Fashion', 'Food', 'Lifestyle', 'Tech'];
    for (let i = 0; i < 10; i++) {
        td.track(distinctId, EVENTS.CREATOR_APPLY_SUBMIT, {
            platform: randomItem(platforms),
            category: randomItem(creatorCats),
            has_channel_url: true
        });
    }
    console.log("Sent 10 creator_apply_submit");

    // 4. brand_apply_submit
    const goals = ['sales', 'branding', 'traffic'];
    const budgets = ['under_5m', '5m_10m', '10m_30m', 'over_30m'];
    for (let i = 0; i < 10; i++) {
        td.track(distinctId, EVENTS.BRAND_APPLY_SUBMIT, {
            campaign_goal: randomItem(goals),
            budget_range: randomItem(budgets),
            website_provided: Math.random() > 0.1
        });
    }
    console.log("Sent 10 brand_apply_submit");

    // 5. external_link_click
    for (let i = 0; i < 10; i++) {
        td.track(distinctId, EVENTS.EXTERNAL_LINK_CLICK, {
            link_name: 'kakao_channel',
            location: 'contact_page'
        });
    }
    console.log("Sent 10 external_link_click");

    // 6. platform_select
    for (let i = 0; i < 10; i++) {
        td.track(distinctId, EVENTS.PLATFORM_SELECT, {
            platform: randomItem(platforms)
        });
    }
    console.log("Sent 10 platform_select");

    // Debug mode sends immediately, but let's give it a moment
    if (td.flush) {
        td.flush();
    }
    console.log("All events queued. Exiting...");
}

run();
