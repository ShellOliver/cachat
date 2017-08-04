 
    function addMessage(data) {
        dt = new Date();
time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
        $('#messages').append(`<div class="media msg">
                    <a class="pull-left" href="#">
                        <img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 32px; height: 32px;" src="">
                    </a>
                    <div class="media-body">
                        <small class="pull-right time"><i class="fa fa-clock-o"></i> `+time+`</small>
                            <h5 class="media-heading">Some one</h5>

                            <small class="col-lg-10">`+ data + `</small>
                        </div>
                    </div>`);
    }
    $(function () {
        var socket = io.connect();
        $('#editor').keypress(function (event) {
            if (event.which == 13) {
                socket.emit('sendForAll', $('#m').val());
                $('#m').val('');


                return false;
            }
        });

        socket.on('forAll', function (data) {
            console.log(data);
            addMessage(data);
        });

        socket.on('userEnter', function(){
            $('#messages').append(`<div class="alert msg-date">
                    <strong>Some one is with us..</strong>
                </div>`);
        });

        socket.on('userOut', function(){
            $('#messages').append(`<div class="alert msg-date">
                    <strong>Some one is not between us..</strong>
                </div>`);
        });

    });
