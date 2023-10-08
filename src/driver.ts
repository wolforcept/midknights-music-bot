import puppeteer, { Browser, PuppeteerLaunchOptions } from 'puppeteer';
import UTIL from './Util';

// const pathToExtension = path.join(process.cwd(), 'adblock');
//adblocker
// const pathToExtension = 'C:\\Users\\Miguel\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\gighmmpiobklfepjocnamgkkbiglidom\\5.10.0_0'; 
// adblocker ultimate
// const pathToExtension = 'C:\\Users\\Miguel\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\ohahllgiabjaoigichmmfljhkcfikeof\\3.7.28_0';

export default class Driver {

    private browser: Browser | null;
    private nowPlaying: null | string = null;
    private options: PuppeteerLaunchOptions;

    constructor(
        private info: {
            pathToChrome: string,
            pathToAdblock: string,
        },
        private actions: {
            onVideoEnd: () => void,
            onVideoChanged: (current: string) => void,
        }
    ) {
        const args = [
            '--hide-crash-restore-bubble',
            // '--start-fullscreen',
            '--test-type',
            '--disable-infobars',
            // '--user-data-dir=%userprofile%\\AppData\\Local\\Chromium\\User Data\\Profile 1',
            `--disable-extensions-except=${this.info.pathToAdblock}`,
            `--load-extension=${this.info.pathToAdblock}`,
            // 'disable-gpu',
            // '--disable-extensions',
            // '--ignore-certificate-errors',
            // '--start-maximized',

            // '--no-sandbox',
            // '--disable-setuid-sandbox',
            // '--single-process',
            // '--no-zygote'
        ]

        const ignoreDefaultArgs = [
            "--disable-extensions",
            "--enable-automation",

            // '--disable-background-networking',
            // '--enable-features=NetworkService,NetworkServiceInProcess',
            // '--disable-background-timer-throttling',
            // '--disable-backgrounding-occluded-windows',
            // '--disable-breakpad',
            // '--disable-client-side-phishing-detection',
            // '--disable-component-extensions-with-background-pages',
            // '--disable-default-apps',
            // '--disable-dev-shm-usage',
            // '--disable-extensions',

            // '--disable-features=TranslateUI,BlinkGenPropertyTrees',
            // '--disable-hang-monitor',
            // '--disable-ipc-flooding-protection',
            // '--disable-popup-blocking',
            // '--disable-prompt-on-repost',
            // '--disable-renderer-backgrounding',
            // '--disable-sync',
            // '--force-color-profile=srgb',
            // '--metrics-recording-only',
            // '--no-first-run',
            // '--enable-automation',
            // '--password-store=basic',
            // '--use-mock-keychain',
        ]

        this.options = {
            args,
            headless: false,
            ignoreDefaultArgs,
            userDataDir: "./data/chrome_user_data",
            defaultViewport: null,
            // devtools: true,
            ignoreHTTPSErrors: true,
            executablePath: this.info.pathToChrome,
            // executablePath: "C:\\Program Files\\Vivaldi\\Application\\vivaldi.exe"
        };
    }

    getCurrent() {
        if (!this.browser || !this.browser.isConnected())
            return null;
        return this.nowPlaying;
    }

    isPlaying() {
        return this.nowPlaying !== null;
    }

    async start() {
        try {
            if (this.browser && this.browser.isConnected()) return;
            this.browser = await puppeteer.launch(this.options);
            await UTIL.sleep(2000)
            const [adblockerPage] = await this.browser.pages();
            await adblockerPage.close();
            const [page] = await this.browser.pages();
            page.on('error', (e: any) => {
                console.error(e);
            });
            // await page.setViewport({ width: 1920, height: 1080 });
            // await page.goto('https://www.youtube.com', { waitUntil: 'networkidle2' });
            setInterval(() => this.checkState(), 1000)
        } catch (e) {
            console.error("[DRIVER] " + e.message)
        }
    }

    async pauseUnpause() {
        try {
            const [page] = await this.browser.pages();
            await page.click('#movie_player')
        } catch (e) {
            console.error("[DRIVER] " + e.message)
        }
    }

    // async handleMessage(type: string, payload: string): Promise<any> {
    //     switch (type) {
    //         case "play": return await this.play(payload)
    //     }
    // }

    async stop() {
        try {
            // if (this.browser && this.browser.process() != null) this.browser.process().kill('SIGINT');
            // this.browser.disconnect();
            this.browser.close();
            this.browser = null;
            this.nowPlaying = null;
        } catch (e) {
            console.log("[DRIVER] " + e)
        }
    }

    async play(text: string) {
        try {
            if (!this.browser || !this.browser.isConnected())
                await this.start();
            if (!this.browser || !this.browser.isConnected())
                return;

            this.nowPlaying = text;

            const [page] = await this.browser.pages();

            if (text.startsWith("http")) {
                await page.goto(text, { waitUntil: 'networkidle2' })
            } else {
                const url = "https://www.youtube.com/results?search_query=" + text
                await page.goto(url, { waitUntil: 'networkidle2' })
                await page.click('.ytd-video-renderer #video-title')
            }

            // await page.click('.ytp-large-play-button')
            // this.queue.push(url)

            await page.bringToFront();
            this.actions.onVideoChanged(this.nowPlaying)

        } catch (e) {
            this.nowPlaying = null;
            console.error("[DRIVER] " + e.message)
        }
    }

    async checkState() {
        try {
            if (!this.isPlaying()) return;
            if (!this.browser || !this.browser.isConnected()) return;

            const [page] = await this.browser.pages();

            // const isPlaying = await page.$('.playing-mode') !== null
            // const isPaused = await page.$('.paused-mode') !== null
            const isEnded = await page.$('.ended-mode') !== null

            if (isEnded) {
                this.nowPlaying = null;
                this.actions.onVideoEnd();
            }
        } catch (e) {
            this.nowPlaying = null;
            console.error("[DRIVER] " + e.message)
        }
    }

}











// await page.type('#search', 'Hello')
// await page.$eval('#search', el => el.value = 'test@example.com');

// await page.screenshot({ path: 'example.png' });

// setInterval(async () => {
//     const found = await page.$$eval('ended-mode')
// }, 1000);

// browser.close();


// import puppeteer from 'puppeteer';
// import path from 'path';

// (async () => {
//     const browser = await puppeteer.launch({
//         headless: 'new',
//         args: [

//         ],
//     });
//     const backgroundPageTarget = await browser.waitForTarget(
//         target => target.type() === 'background_page'
//     );
//     const backgroundPage = await backgroundPageTarget.page();
//     // Test the background page as you would any other page.
//     await browser.close();
// })();

// (async () => {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();

//     await page.goto('https://www.youtube.com');

//     // example: get innerHTML of an element
//     // const someContent = await page.$eval('#selector', el => el.innerHTML);

//     // Use Promise.all to wait for two actions (navigation and click)
//     // await Promise.all([
//     //     page.waitForNavigation(), // wait for navigation to happen
//     //     page.click('a.some-link'), // click link to cause navigation
//     // ]);

//     // another example, this time using the evaluate function to return innerText of body
//     // const moreContent = await page.evaluate(() => document.body.innerText);

//     // click another button
//     // await page.click('#button');

//     // close brower when we are done
//     // await browser.close();
// })();