const puppeteer = require('puppeteer-extra');
const args = process.argv.slice(2);
const url = args[0]; // format: http://url
if (url === 'help') {
    console.log('- Usage:');
    console.log('- npm install');
    console.log('- node index.js <url> <proxy> <username> <password>');
    process.exit(1);
}
const proxy = args[1]; // format: http://proxy:port
const username = args[2];
const password = args[3];

if (!url) {
    throw "Please provide URL as a first argument";
}
async function run () {
    const args = [
        '--window-size=1920,1080' ,
        '--no-sandbox',
        '--headless',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--ignore-certificate-errors'
    ];
    if (proxy) {
        args.push('--proxy-server=' + proxy);
    }
    const browser = await puppeteer.launch({
        args
    });
    const page = await browser.newPage();
    if (username && password) {
        await page.authenticate({
            username,
            password,
        });
    }
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36';
    await page.setUserAgent(userAgent);
    await page.setViewport({ width: 1920, height: 1080 });

    const scanStartTime = Date.now();
    await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 60000
        });
    await page.screenshot({path: 'screenshot.png'});
    const scanEndTime = Date.now();
    const timeTaken = scanEndTime - scanStartTime;
    console.log('Time taken = ' + timeTaken + ' milliseconds');
    browser.close();
}
run();
