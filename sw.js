// KRT Workspace service worker: device notifications only.
// It deliberately caches nothing, so a deploy is never hidden behind a stale copy.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
 let m={};try{m=event.data?event.data.json():{};}catch{m={title:'KRT Workspace',body:event.data?event.data.text():''};}
 const url=typeof m.url==='string'&&m.url.startsWith('https://kfupmkrt.site/')?m.url:'/';
 event.waitUntil(self.registration.showNotification(m.title||'KRT Workspace',{body:m.body||'',tag:m.tag||undefined,renotify:Boolean(m.tag),icon:'/icon-192.png',badge:'/icon-192.png',data:{url},lang:'en'}));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 const target=new URL(event.notification.data?.url||'/',self.location.origin);
 event.waitUntil((async()=>{
  const wins=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for(const w of wins){if(new URL(w.url).origin===target.origin){await w.focus();w.postMessage({type:'open',url:target.href});return;}}
  await self.clients.openWindow(target.href);
 })());
});
