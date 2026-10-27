import { chromium } from 'playwright'
import assert from 'node:assert/strict'
const base='http://127.0.0.1:3200'
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true})
try {
 const context=await browser.newContext({locale:'uk-UA',viewport:{width:1366,height:900}})
 const login=await context.request.post(base+'/api/users/login',{data:{email:process.env.SEED_ADMIN_EMAIL,password:process.env.SEED_ADMIN_PASSWORD}})
 assert.equal(login.status(),200)
 const page=await context.newPage()
 await page.goto(base+'/admin/collections/pages/1')
 const heading=page.locator('input[name="blocks.0.heading"]')
 await heading.waitFor({timeout:60000})
 const original=(await heading.inputValue()).replace(/ — CMS$/, '')
 if ((await heading.inputValue()) !== original) {
  await heading.fill(original)
  await Promise.all([page.waitForResponse(r=>r.request().method()==='PATCH' && r.url().includes('/api/pages/1') && r.status()===200),page.getByRole('button',{name:'Зберегти',exact:true}).click()])
 }
 const edited=original+' — CMS'
 await heading.fill(edited)
 await Promise.all([page.waitForResponse(r=>r.request().method()==='PATCH' && r.url().includes('/api/pages/1') && r.status()===200), page.getByRole('button',{name:'Зберегти',exact:true}).click()])
 await page.getByText('Успішно збережено').waitFor({timeout:3000}).catch(()=>{})
 await page.screenshot({path:'docs/screenshots/cms-editor.png',fullPage:true})
 const visitor=await context.newPage()
 await visitor.goto(base)
 await visitor.getByRole('button',{name:'UA',exact:true}).click()
 await visitor.getByRole('heading',{level:1,name:edited,exact:true}).waitFor({timeout:60000})
 await visitor.screenshot({path:'docs/screenshots/cms-visitor.png',fullPage:true})
 await heading.fill(original)
 await Promise.all([page.waitForResponse(r=>r.request().method()==='PATCH' && r.url().includes('/api/pages/1') && r.status()===200), page.getByRole('button',{name:'Зберегти',exact:true}).click()])
 console.log('PASS: authenticated editor changed hero; visitor displayed saved value; original restored')
 await visitor.route('**/api/landing/**',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({ok:false,error:{code:'server',status:503,message:'Unavailable'}})}))
 await visitor.reload()
 await visitor.getByRole('alert').waitFor()
 await visitor.screenshot({path:'docs/screenshots/cms-load-error.png',fullPage:true})
 await visitor.unrouteAll()
 await visitor.getByRole('button',{name:'Повторити',exact:true}).click()
 await visitor.getByRole('heading',{level:1,name:original,exact:true}).waitFor({timeout:60000})
 console.log('PASS: simulated API failure showed error; Retry restored live CMS content')
} finally {await browser.close()}
