chrome.runtime.onMessage.addListener(
 function(request, sender, sendResponse)
 {
  if (request === 'get')
  {
   const mp = document.getElementById('movie_player');
   if (mp === null)
    sendResponse({message: false});
   else if (mp.classList.length > 0)
    sendResponse({message: mp.classList.toString()});
   else
    sendResponse({message: true});
  }
 }
);
