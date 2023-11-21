const uTube = function()
{
 function $init()
 {
  uTube.loadPrefs();
  let aURI = window.location;
  let defU = _hostedURL();
  if (defU)
  {
   if (aURI.href.slice(0, defU.length) === defU)
   {
    if (uTube.tErr)
     window.clearInterval(uTube.tErr);
    uTube.tErr = window.setInterval(uTube.checkForError, 500);
   }
   else
   {
    if (uTube.tErr)
     window.clearInterval(uTube.tErr);
    uTube.tErr = false;
   }
  }
  else
  {
   if (aURI.href.slice(0, 39) === 'https://www.youtube-nocookie.com/embed/')
   {
    if (uTube.tErr)
     window.clearInterval(uTube.tErr);
    uTube.tErr = window.setInterval(uTube.checkForError, 500);
   }
   else
   {
    if (uTube.tErr)
     window.clearInterval(uTube.tErr);
    uTube.tErr = false;
   }
  }
 }

 function _findPlayer()
 {
  const p = new Promise(
   function(resolve, reject)
   {
    chrome.runtime.sendMessage('get',
     function(response)
     {
      if (typeof response === 'undefined')
       return;
      if (response === false)
       return;
      resolve(response);
     }
    );
   }
  );
  return p;
 }

 async function $checkForError()
 {
  const r = await _findPlayer();
  if (r === false)
   return;
  if (r === true)
   return;
  const mp = r.split(' ');
  if (this.location.host === 'www.youtube.com' || this.location.host === 'm.youtube.com')
  {
   if (mp.includes('playing-mode'))
   {
    window.clearInterval(uTube.tErr);
    uTube.tErr = false;
    return;
   }
   return;
  }
  if (mp.includes('ytp-embed-error'))
  {
   window.clearInterval(uTube.tErr);
   uTube.tErr = false;
   if (this.location.hash)
   {
    let h = this.location.hash.slice(1);
    if (h.indexOf('$') === -1)
    {
     if (h.slice(0, 2) === 'PL' && h.length > 12)
      this.location.replace('https://www.youtube.com/playlist?list=' + h + '&feature=emb_imp_woyt');
     else
      this.location.replace('https://www.youtube.com/watch?v=' + h + '&feature=emb_imp_woyt');
    }
    else
    {
     let v = h.slice(0, h.indexOf('$'));
     let p = h.slice(h.indexOf('$') + 1);
     this.location.replace('https://www.youtube.com/watch?v=' + v + '&list=' + p + '&feature=emb_imp_woyt');
    }
   }
   else if (this.location.pathname.slice(0, 7) === '/embed/')
   {
    let v = this.location.pathname.slice(7);
    let result = {};
    if (this.location.search)
    {
     this.location.search.slice(1).split('&').forEach(
      function(part)
      {
       let item = part.split('=');
       result[item[0]] = decodeURIComponent(item[1]);
      }
     );
    }
    let p = null;
    if (result.hasOwnProperty('list'))
     p = result.list;
    if (v === 'videoseries')
     this.location.replace('https://www.youtube.com/playlist?list=' + p + '&feature=emb_imp_woyt');
    else if (p === null)
     this.location.replace('https://www.youtube.com/watch?v=' + v + '&feature=emb_imp_woyt');
    else
     this.location.replace('https://www.youtube.com/watch?v=' + v + '&list=' + p + '&feature=emb_imp_woyt');
   }
   return;
  }
  if (mp.includes('playing-mode'))
  {
   window.clearInterval(uTube.tErr);
   uTube.tErr = false;
   return;
  }
 }

 function _hostedURL()
 {
  if (uTube.prefs.hosted === false)
   return false;
  if (uTube.prefs.hostedURL !== null)
   return uTube.prefs.hostedURL;
  return 'https://realityripple.com/Software/XUL/uTube/play.html';
 }

 function $loadPrefs()
 {
  uTube.tErr = false;
  chrome.storage.local.get(
   {autoplay: false, hosted: true, hostedURL: 'https://realityripple.com/Software/XUL/uTube/play.html'},
   function(items)
   {
    uTube.prefs = {};
    uTube.prefs.autoplay = items.autoplay;
    uTube.prefs.hosted = items.hosted;
    uTube.prefs.hostedURL = items.hostedURL;
   }
  );
 }

 return {
  init: $init,
  checkForError: $checkForError,
  loadPrefs: $loadPrefs,
  prefs: {
   autoplay: false,
   hosted: true,
   hostedURL: 'https://realityripple.com/Software/XUL/uTube/play.html'
  }
 }
}();

chrome.runtime.onMessage.addListener(
 function(request, sender, sendResponse)
 {
  if (request === 'get')
   return;
  if (request === 'cfg')
   uTube.loadPrefs();
 }
);

window.onload = function() {
 uTube.init();
};
