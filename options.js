function cmdOK_Click()
{
 const chkAutoplay = document.getElementById('chkAutoplay');
 const chkNoCookie = document.getElementById('chkNoCookie');
 chrome.storage.local.set(
  {
   autoplay: chkAutoplay.checked,
   nocookie: chkNoCookie.checked
  }
 );
 chrome.runtime.sendMessage('cfg');
 window.close();
}

function cmdCancel_Click()
{
 window.close();
}

function cmdDefaults_Click()
{
 const chkAutoplay = document.getElementById('chkAutoplay');
 const chkNoCookie = document.getElementById('chkNoCookie');
 chkAutoplay.checked = false;
 chkNoCookie.checked = true;
}

function init()
{
 const chkAutoplay = document.getElementById('chkAutoplay');
 const chkNoCookie = document.getElementById('chkNoCookie');
 chrome.storage.local.get(
  {autoplay: false, nocookie: true},
  function(items)
  {
   chkAutoplay.checked = items.autoplay;
   chkNoCookie.checked = items.nocookie;
  }
 );
 document.getElementById('cmdDefaults').addEventListener('click', cmdDefaults_Click);
 document.getElementById('cmdOK').addEventListener('click', cmdOK_Click);
 document.getElementById('cmdCancel').addEventListener('click', cmdCancel_Click);
}

window.addEventListener('load', init);