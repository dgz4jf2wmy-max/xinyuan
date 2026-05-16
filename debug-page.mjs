import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  page.on('request', request => {
    console.log('REQUEST:', request.url());
  });
  page.on('response', response => {
    if (!response.ok()) {
      console.log('RESPONSE KO:', response.url(), response.status());
    }
  });

  const response = await page.goto('http://localhost:3000/production/execution/monthly-dashboard');
  console.log('Status code:', response.status());
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const content = await page.$eval('#root', el => el.innerHTML);
  console.log("Root length:", content.length);
  if (content.length < 50000) {
    console.log("Root content:", content);
  }
  await browser.close();
})();
