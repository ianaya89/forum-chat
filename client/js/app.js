$(function() {

  var host = window.location.host.split(':')[0];
  var connection = new WebSocket('ws://' + host + ':9090', ['soap', 'xmpp']);
  var count = 0;

  var username = sessionStorage.getItem('username');
  if (!username) {
    $('#initModal').foundation('reveal', 'open');

    $('#btnUsername').click(function(){
      var $txtUsername = $('#txtUsername');

      if ($txtUsername.val()) {
        sessionStorage.setItem('username', $txtUsername.val());
        username = $txtUsername.val();
        $('#lblUsername').text($txtUsername.val());

        $('#initModal').foundation('reveal', 'close');
      }
    });
  }
  else {
    $('#lblUsername').text(username);
  }

  $('#btnSend').click(function(e) {
    e.preventDefault();

    var $txtMessage = $('#txtMessage');
    if (!$txtMessage.val()) {
      return;
    }

    connection.send(JSON.stringify({
      username: username,
      message: $txtMessage.val()
    }));

    $txtMessage.val('');
  });

  connection.onopen = function() {
    $('#lblStatus').text('[online]');
    $('#lblStatus').css('color', 'green');
  };

  connection.onerror = function(error) {
    console.error('WebSocket Error: ' + error);
  };

  connection.onmessage = function(e) {
    if (e.data === 'on') {
      return;
    }

    count++;

    data = JSON.parse(e.data);
    console.info(e);
    
    var color =  data.username === username ? 'success' : 'info';
    var align =  data.username === username ? 'rigth' : 'left';

    $('#chats').append('<div class="row '+ align +'"><div style="top:'+ count * 55 +'px" class="alert-box '+ color +' round">' +
    '<b>'+ data.username +': </b>' +
    data.message + "</div></div><br>");

    
  };

});