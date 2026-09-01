var langselectortoggle = document.getElementById('langSelectorOpener');
var langselectorpanel = document.getElementById('langSelectorPanel');
var langselectorpanelbg = document.getElementById('langSelectorPanelBg');  
var langselectorclose = document.getElementById('langSelectorCloseBtn'); 

if(langselectortoggle) {
  langselectortoggle.addEventListener('click', function() {
    langselectorpanel.classList.add('open');
    langselectorpanelbg.classList.add('open');
    event.preventDefault();
  });  
}

langselectorclose.addEventListener('click', function() {
  langselectorpanel.classList.remove('open');
  langselectorpanelbg.classList.remove('open');
  event.preventDefault();
});

langselectorpanelbg.addEventListener('click', function() {
  this.classList.remove('open');
  langselectorpanel.classList.remove('open');
});