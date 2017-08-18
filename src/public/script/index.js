
function addMessage(id) {
    $('#messages').append(`<div class="media msg">
                    <a class="pull-left" href="#">
                        <img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 32px; height: 32px;" src="">
                    </a>
                    <div class="media-body">
                        <small id="time`+id+`" class="pull-right time"><i class="fa fa-clock-o"></i></small>
                            <h5 class="media-heading">Some one</h5>

                            <pre id="msg`+id+`" class="col-lg-10"></pre>
                        </div>
                    </div>`);
}
$(function () {
    var id = 0;
    var socket = io.connect();
    var shift = false;
    $('#editor').keydown(function (event) { if (event.which == 16) shift = true });
    $('#editor').keyup(function (event) { if (event.which == 16) shift = false });
    $('#editor').keypress(function (event) {
        if (event.which == 13 && !shift) {
            socket.emit('sendForAll', { text: $('#m').val() });
            $('#m').val('');
            return false;
        }
    });

    socket.emit('getAllUsersIn');
    socket.on('allUsersIn', function(data){
        console.log('usersIN: ',data.usersIn);
    });

    socket.on('newUserIn', function(data){
        console.log('mais um logado: ',data);
    });

    socket.on('forAll', function (data) {
        id++;
        addMessage(id);
        $('#msg'+id).text(data.msg);
        dt = new Date(data.time);
        $('#time'+id).text(dt.getHours() + ":" + dt.getMinutes()+"h");
        boxMessages = document.querySelector('#boxMessages');
        boxMessages.scrollTop = boxMessages.scrollHeight;
    });

    socket.on('userEnter', function (data) {
        console.log(data);
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
