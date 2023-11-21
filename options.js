function chkHosted_Change()
{
 const chkHosted = document.getElementById('chkHosted');
 const txtHost = document.getElementById('txtHost');
 txtHost.disabled = !chkHosted.checked;
}

function cmdOK_Click()
{
 const chkAutoplay = document.getElementById('chkAutoplay');
 const chkHosted = document.getElementById('chkHosted');
 const txtHost = document.getElementById('txtHost');
 chrome.storage.local.set(
  {
   autoplay: chkAutoplay.checked,
   hosted: chkHosted.checked,
   hostedURL: txtHost.value
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
 const chkHosted = document.getElementById('chkHosted');
 const txtHost = document.getElementById('txtHost');
 chkAutoplay.checked = false;
 chkHosted.checked = true;
 txtHost.value = 'https://realityripple.com/Software/XUL/uTube/play.html';
 txtHost.disabled = false;
}

function init()
{
 const chkAutoplay = document.getElementById('chkAutoplay');
 const chkHosted = document.getElementById('chkHosted');
 const txtHost = document.getElementById('txtHost');
 chkHosted.addEventListener('change', chkHosted_Change);
 chrome.storage.local.get(
  {autoplay: false, hosted: true, hostedURL: 'https://realityripple.com/Software/XUL/uTube/play.html'},
  function(items)
  {
   chkAutoplay.checked = items.autoplay;
   chkHosted.checked = items.hosted;
   txtHost.value = items.hostedURL;
   txtHost.disabled = !chkHosted.checked;
  }
 );
 document.getElementById('cmdDefaults').addEventListener('click', cmdDefaults_Click);
 document.getElementById('cmdOK').addEventListener('click', cmdOK_Click);
 document.getElementById('cmdCancel').addEventListener('click', cmdCancel_Click);
}

window.addEventListener('load', init);