chrome.tabs.onUpdated.addListener(
 function(id, change, tab)
 {
  if (!change.url)
   return;
  const r = uTube.locationChange(change.url, tab.id);
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
   if (sender.tab.status !== 'complete')
    return;
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
      if (!tabs[i].hasOwnProperty('url'))
       continue;
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
  const aURI = new URL(sURL);
  const defU = 'https://utube.realityripple.com/';
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
  let time = false;
  if (result.hasOwnProperty('t'))
   time = result.t;
  if (aURI.pathname === '/watch')
  {
   if (!result.hasOwnProperty('v'))
    return false;
   let u = defU + '#' + result.v;
   if (result.hasOwnProperty('list'))
    u += '$' + result.list;
   if (time)
    u += '~' + time;
   if (uTube.prefs.autoplay)
    u += '!';
   if (!uTube.prefs.nocookie)
    u += '@';
   if (!u)
    return false;
   return u;
  }
  if (aURI.pathname === '/playlist')
  {
   if (!result.hasOwnProperty('list'))
    return false;
   let pu = defU + '#' + result.list;
   if (time)
    pu += '~' + time;
   if (uTube.prefs.autoplay)
    pu += '!';
   if (!uTube.prefs.nocookie)
    pu += '@';
   return pu;
  }
  return false;
 },
 loadPrefs: function()
 {
  chrome.storage.local.get(
   {autoplay: false, nocookie: true},
   function(items)
   {
    uTube.prefs = {};
    uTube.prefs.autoplay = items.autoplay;
    uTube.prefs.nocookie = items.nocookie;
   }
  );
 },
 init: function()
 {
  uTube.loadPrefs();
 }
};
uTube.init();
