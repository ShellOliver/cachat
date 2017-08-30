
function addUserInList(user){
    $('#list-user-item').append(`<li class="user-item">`+user.name+`</li>`);
}
$(function () {
    var idMsg = 0;
    var socket = io.connect();
    var shift = false;
    var boxMessages = document.querySelector('#messages');

    $('#editor').keydown(function (event) { if (event.which == 16) shift = true });
    $('#editor').keyup(function (event) { if (event.which == 16) shift = false });
    $('#editor').keypress(function (event) {
        if (event.which == 13 && !shift) {
            socket.emit('sendForAll', { text: $('#m').val() });
            $('#m').val('');
            return false;
        }
    });

    function addTemplateMessage(initial = false) {
        idMsg++;
        template = `
        <div id="msg`+idMsg+`" class="msg-item">
        <b id="`+idMsg+`user">User b</b><small id="time`+idMsg+`" class="pull-right time"><i class="fa fa-clock-o"></i></small>
        <div id="msg-text`+idMsg+`" class="msg-text"></div>
      </div>`;
        initial ? $('#messages').append(template) : $('#messages').prepend(template);
    }

    function addMessage(data, initial = false){
        addTemplateMessage(initial);
        $('#msg-text'+idMsg).text(data.message);
        //data.emitter._id == 
        //mine ? $('#msg'+idMsg).addClass('mine') : $('#msg'+idMsg).removeClass('mine');
        $('#'+idMsg+'user').text(data.emitter.name);
        dt = new Date(data.datetime);
        $('#time'+idMsg).text(dt.getHours() + ":" + dt.getMinutes()+"h");
    }

    function getMessages(){
        socket.emit('getOldMessages');
    }

    getMessages();

    boxMessages.onscroll=function(){
        if(boxMessages.scrollTop == 0){
            getMessages();
        }
    }
    
    socket.on('oldMessages', function(data){
        data.forEach(function(msg) {
            addMessage(msg, true);
        }, this);
    });

    socket.emit('getAllUsersIn');
    socket.on('allUsersIn', function(data){
        data.usersIn.forEach(function(user) {
            addUserInList(user);
        }, this);
    });

    socket.on('newUserIn', function(data){
    });

    socket.on('forAll', function (data) {
        addMessage(data);
        boxMessages.scrollTop = boxMessages.scrollHeight;
    });

    socket.on('userEnter', function (data) {
        $('#messages').append(`<div class="alert msg-date">
                    <strong>`+data.user.name+` is with us...</strong>
                </div>`);
    });

    socket.on('userOut', function () {
        $('#messages').append(`<div class="alert msg-date">
                    <strong>Some one is not between us..</strong>
                </div>`);
    });

});
