import { Bot } from "./bot";

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

import puppeteer from 'puppeteer';

// const pathToExtension = path.join(process.cwd(), 'adblock');
//adblocker
// const pathToExtension = 'C:\\Users\\Miguel\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\gighmmpiobklfepjocnamgkkbiglidom\\5.10.0_0'; 
// adblocker ultimate
const pathToExtension = 'C:\\Users\\Miguel\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\ohahllgiabjaoigichmmfljhkcfikeof\\3.7.28_0';

const args = [
    '--hide-crash-restore-bubble',
    // '--start-fullscreen',
    '--test-type',
    '--disable-infobars',
    '--user-data-dir=%userprofile%\\AppData\\Local\\Chromium\\User Data\\Profile 1',
    `--disable-extensions-except=${pathToExtension}`,
    `--load-extension=${pathToExtension}`,
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

const options = {
    args,
    headless: false,
    ignoreDefaultArgs,
    userDataDir: "./user_data",
    defaultViewport: null,
    // devtools: true,
    ignoreHTTPSErrors: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    // executablePath: "C:\\Program Files\\Vivaldi\\Application\\vivaldi.exe"
};

export interface Driver {
    handleMessage: (type: string, payload: string) => Promise<any>
}

export async function startDriver(bot: Bot) {

    let nowPlaying: null | string = null;
    const queue: Array<string> = [];

    const browser = await puppeteer.launch(options);
    await sleep(2000)
    const [adblockerPage] = await browser.pages();
    await adblockerPage.close();
    const [page] = await browser.pages();
    page.on('error', (e: any) => {
        console.error(e);
    });
    // await page.setViewport({ width: 1920, height: 1080 });

    // await page.goto('https://www.youtube.com', { waitUntil: 'networkidle2' });

    var i = 0;
    async function updateQueue() {
        const isPlaying = await page.$('.playing-mode') !== null
        const isPaused = await page.$('.paused-mode') !== null
        const isEnded = await page.$('.ended-mode') !== null
        if ((isEnded || !nowPlaying) && !isPlaying && !isPaused && queue.length > 0) {
            nowPlaying = queue.shift() ?? null;
            if (!nowPlaying) return;
            try {
                let url = nowPlaying;
                if (url.startsWith("http")) {
                    await page.goto(url, { waitUntil: 'networkidle2' })
                } else {
                    url = "https://www.youtube.com/results?search_query=" + url
                    await page.goto(url, { waitUntil: 'networkidle2' })
                    await page.click('.ytd-video-renderer #video-title')
                }
                // await page.click('.ytp-large-play-button')
                console.log({ bot })
                bot.updateMessage({ nowPlaying, queue })
            } catch (e) { }
        }
    }

    setInterval(updateQueue, 1000)

    async function play(url: string) {
        queue.push(url)
        await updateQueue();
        return await getQueue()
    }

    async function getQueue() {
        return { nowPlaying, queue }
    }

    return {
        handleMessage: async function (type: string, payload: string) {
            switch (type) {
                case "play": return await play(payload)
                case "queue": return await getQueue();
            }
        }
    } as Driver;

    // await page.type('#search', 'Hello')
    // await page.$eval('#search', el => el.value = 'test@example.com');

    // await page.screenshot({ path: 'example.png' });

    // setInterval(async () => {
    //     const found = await page.$$eval('ended-mode')
    //     console.log({ found })
    // }, 1000);

    // browser.close();
};


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