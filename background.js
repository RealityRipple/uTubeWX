chrome.webRequest.onBeforeRequest.addListener(
 function(details)
 {
  let r = uTube.locationChange(details.url, details.tabId);
  //details.documentId
  //details.tabId
  if (r === false)
   return {};
  return {redirectUrl: r};
 },
 {
  urls: [
   '*://www.youtube.com/*',
   '*://m.youtube.com/*'
  ],
  types: ['main_frame']
 },
 ['blocking']
);

chrome.tabs.onUpdated.addListener(
 function(id, change, tab)
 {
  if (!change.url)
   return;
  let r = uTube.locationChange(change.url, tab.id);
  if (r === false)
   return;
  chrome.tabs.update(tab.id, {url: r}); // loadReplace support would be great
 }
);

chrome.runtime.onMessage.addListener(
 function(request, sender, sendResponse)
 {
  if (request === 'get')
  {
   chrome.tabs.sendMessage(sender.tab.id, request, {}, function(response)
    {
     if (typeof response === 'undefined')
      return;
     sendResponse(response.message);
    }
   );
   return true;
  }
  if (request === 'cfg')
  {
   uTube.loadPrefs();
   chrome.tabs.query({},
    function(tabs)
    {
     for(let i = 0; i < tabs.length; i++)
     {
      chrome.tabs.sendMessage(tabs[i].id, request);
     }
    }
   );
  }
 }
);

var uTube = {
 locationChange: function(sURL, tabID)
 {
  let aURI = new URL(sURL);
  let defU = uTube.hostedURL();
  let d = 'https://www.youtube-nocookie.com/embed/';
  if (!uTube.prefs.nocookie)
   d = 'https://www.youtube.com/embed/';
  if (!uTube.hasOwnProperty('tabs'))
   uTube.tabs = {};
  if (!uTube.tabs.hasOwnProperty(tabID))
   uTube.tabs[tabID] = {};
  if (aURI.hostname !== 'www.youtube.com' && aURI.hostname !== 'm.youtube.com')
  {
   if (uTube.tabs[tabID].hasOwnProperty('skipV'))
    delete uTube.tabs[tabID].skipV;
   if (uTube.tabs[tabID].hasOwnProperty('skipPL'))
    delete uTube.tabs[tabID].skipPL;
   return false;
  }
  let result = {};
  aURI.search.slice(1).split('&').forEach(
   function(part)
   {
    let item = part.split('=');
    result[item[0]] = decodeURIComponent(item[1]);
   }
  );
  if (aURI.hash.slice(1) === 'skipU')
  {
   if (result.hasOwnProperty('list'))
    uTube.tabs[tabID].skipPL = result.list;
   else if (result.hasOwnProperty('v'))
    uTube.tabs[tabID].skipV = result.v;
  }
  if (result.hasOwnProperty('embeds_referring_origin'))
  {
   if (result.hasOwnProperty('list'))
    uTube.tabs[tabID].skipPL = result.list;
   else if (result.hasOwnProperty('v'))
    uTube.tabs[tabID].skipV = result.v;
  }
  if (uTube.tabs[tabID].hasOwnProperty('skipPL'))
  {
   if (result.hasOwnProperty('list'))
   {
    if (uTube.tabs[tabID].skipPL === result.list)
     return false;
   }
   delete uTube.tabs[tabID].skipPL;
  }
  if (uTube.tabs[tabID].hasOwnProperty('skipV'))
  {
   if (result.hasOwnProperty('v'))
   {
    if (uTube.tabs[tabID].skipV === result.v)
     return false;
   }
   delete uTube.tabs[tabID].skipV;
  }
  let a = uTube.prefs.autoplay;
  if (aURI.pathname === '/watch')
  {
   if (!result.hasOwnProperty('v'))
    return false;
   //if (aRequest)
   // aRequest.cancel(Components.results.NS_BINDING_ABORTED);
   let u = false;
   if (!defU)
   {
    if (result.hasOwnProperty('list'))
    {
     u = d + result.v + '?list=' + result.list;
     if (a)
      u += '&autoplay=1';
    }
    else
    {
     u = d + result.v;
     if (a)
      u += '?autoplay=1';
    }
   }
   else
   {
    if (result.hasOwnProperty('list'))
     u = defU + '#' + result.v + '$' + result.list;
    else
     u = defU + '#' + result.v;
    if (a)
     u += '!';
    if (!uTube.prefs.nocookie)
     u += '@';
   }
   if (!u)
    return false;
   return u;
  }
  if (aURI.pathname === '/playlist')
  {
   if (!result.hasOwnProperty('list'))
    return false;
   //if (aRequest)
   // aRequest.cancel(Components.results.NS_BINDING_ABORTED);
   let pu = false;
   if (!defU)
   {
    pu = d + 'videoseries?list=' + result.list;
    if (a)
     pu += '&autoplay=1';
   }
   else
   {
    pu = defU + '#' + result.list;
    if (a)
     pu += '!';
    if (!uTube.prefs.nocookie)
     pu += '@';
   }
   if (!pu)
    return false;
   return pu;
  }
 },
 hostedURL: function()
 {
  if (uTube.prefs.hosted === false)
   return false;
  if (uTube.prefs.hostedURL !== null)
   return uTube.prefs.hostedURL;
  return 'https://utube.realityripple.com/';
 },
 loadPrefs: function()
 {
  chrome.storage.local.get(
   {autoplay: false, nocookie: true, hosted: true, hostedURL: 'https://utube.realityripple.com/'},
   function(items)
   {
    uTube.prefs = {};
    uTube.prefs.autoplay = items.autoplay;
    uTube.prefs.nocookie = items.nocookie;
    uTube.prefs.hosted = items.hosted;
    uTube.prefs.hostedURL = items.hostedURL;
   }
  );
 },
 init: function()
 {
  uTube.loadPrefs();
 }
};
uTube.init();
