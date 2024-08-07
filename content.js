const uTube = function()
{
 function $init()
 {
  uTube.loadPrefs();
  const aURI = window.location;
  const defU = 'https://utube.realityripple.com/';
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
      this.location.replace('https://www.youtube.com/playlist?list=' + h + '&embeds_referring_origin=');
     else
      this.location.replace('https://www.youtube.com/watch?v=' + h + '&embeds_referring_origin=');
    }
    else
    {
     let v = h.slice(0, h.indexOf('$'));
     let p = h.slice(h.indexOf('$') + 1);
     this.location.replace('https://www.youtube.com/watch?v=' + v + '&list=' + p + '&embeds_referring_origin=');
    }
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

 function $loadPrefs()
 {
  uTube.tErr = false;
  chrome.storage.local.get(
   {autoplay: false, nocookie: true},
   function(items)
   {
    uTube.prefs = {};
    uTube.prefs.autoplay = items.autoplay;
    uTube.prefs.nocookie = items.nocookie;
   }
  );
 }

 return {
  init: $init,
  checkForError: $checkForError,
  loadPrefs: $loadPrefs,
  prefs: {
   autoplay: false,
   nocookie: true
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
