import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer';
import UTIL from './Util';

// const pathToExtension = path.join(process.cwd(), 'adblock');
//adblocker
// const pathToExtension = 'C:\\Users\\Miguel\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\gighmmpiobklfepjocnamgkkbiglidom\\5.10.0_0'; 
// adblocker ultimate
// const pathToExtension = 'C:\\Users\\Miguel\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\ohahllgiabjaoigichmmfljhkcfikeof\\3.7.28_0';

export default class DiscordAppClient {

    browser: Browser;

    constructor(
        private info: { pathToChrome: string }
    ) { }

    async init() {

        const args = [
            '--hide-crash-restore-bubble',
            //     // '--start-fullscreen',
            //     '--test-type',
            //     '--disable-infobars',
            //     '--user-data-dir=%userprofile%\\AppData\\Local\\Chromium\\User Data\\Profile 1',
            //     // 'disable-gpu',
            //     // '--disable-extensions',
            //     // '--ignore-certificate-errors',
            //     // '--start-maximized',

            //     // '--no-sandbox',
            //     // '--disable-setuid-sandbox',
            //     // '--single-process',
            //     // '--no-zygote'
        ]

        // const ignoreDefaultArgs = [
        //     "--disable-extensions",
        //     "--enable-automation",

        //     // '--disable-background-networking',
        //     // '--enable-features=NetworkService,NetworkServiceInProcess',
        //     // '--disable-background-timer-throttling',
        //     // '--disable-backgrounding-occluded-windows',
        //     // '--disable-breakpad',
        //     // '--disable-client-side-phishing-detection',
        //     // '--disable-component-extensions-with-background-pages',
        //     // '--disable-default-apps',
        //     // '--disable-dev-shm-usage',
        //     // '--disable-extensions',

        //     // '--disable-features=TranslateUI,BlinkGenPropertyTrees',
        //     // '--disable-hang-monitor',
        //     // '--disable-ipc-flooding-protection',
        //     // '--disable-popup-blocking',
        //     // '--disable-prompt-on-repost',
        //     // '--disable-renderer-backgrounding',
        //     // '--disable-sync',
        //     // '--force-color-profile=srgb',
        //     // '--metrics-recording-only',
        //     // '--no-first-run',
        //     // '--enable-automation',
        //     // '--password-store=basic',
        //     // '--use-mock-keychain',
        // ]

        const options = {
            args,
            headless: false,
            // ignoreDefaultArgs,
            userDataDir: "./data/discord_user_data",
            defaultViewport: null,
            // devtools: true,
            ignoreHTTPSErrors: true,
            executablePath: this.info.pathToChrome
            // executablePath: "C:\\Program Files\\Vivaldi\\Application\\vivaldi.exe"
        };

        this.browser = await puppeteer.launch(options);
        const [page] = await this.browser.pages();
        page.on('error', (e: any) => {
            console.error(e);
        });
        // await page.setViewport({ width: 1920, height: 1080 });
        await page.goto('https://discord.com/channels/98139728095776768/1152187044462858250', { waitUntil: 'networkidle2' });
        await UTIL.sleep(1000)
        await this.skipPopups(page)
        await this.skipPopups(page)
        await page.keyboard.press('Escape')
        await UTIL.sleep(1000)
    }

    async skipPopups(page: Page) {
        try {
            var gotit = (await page.$x(`//a[contains(., 'Got it')]`));
            if (gotit && gotit[0] && gotit[0] as ElementHandle<Element>)
                (gotit[0] as ElementHandle<Element>).click()
        } catch (e) {
            console.log("[DISCORD] " + e)
        }
    }

    async enterChannel(channelName: string) {
        try {
            const [page] = await this.browser.pages();
            const [link] = await page.$x(`//a[contains(., '${channelName}')]`);
            if (link) {
                const elem = (link as ElementHandle<Element>);
                await elem.hover();
                await 
                UTIL.sleep(1000)
                await elem.click();
            }
        } catch (e) {
            console.log("[DISCORD] " + e)
        }
    }

    async leaveChannel() {
        const [page] = await this.browser.pages();
        const [link] = await page.$x(`//button[contains(@aria-label, 'Disconnect')]`);
        if (link) {
            const elem = (link as ElementHandle<Element>);
            await elem.hover();
            await UTIL.sleep(1000)
            await elem.click();
        }
    }



}
