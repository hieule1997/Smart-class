$(document).ready(function(){
    var teacher_name = $('#teacher_name').text();
    var chatallSocket = new WebSocket(
        'ws://' + window.location.host +
        '/ws/' + teacher_name + 'chatall'+lop+'/');


    
    chatallSocket.onmessage = function(e) {
        var data = JSON.parse(e.data);
        var message = data['message'];
        var who = data['who'];
        var time = data['time'];
        if (time == 'None'){
            if (key == ''){
                chatallSocket.send(JSON.stringify({
                    'message' : 'No',
                    'who': userName,
                    'time' : 'key'
                }));
            }else{
            chatallSocket.send(JSON.stringify({
                'message' : key,
                'who': userName,
                'time' : 'key'
            }));
            }
        }else if (time != 'key'){
            insertChat(who, message, time);
        }
    };

    function reload(){
        $('body .list_group_all').html('');
        $.ajax({
            type:'GET',
            url: "/student/group_data/"+teacher_name,
            success: function(data){
                $('body .list_group_all').html(data);
                if ($('#group_class').length){
                    var group_chat_name = $('#group_class').children('p').text();
                    var chatgroup = new WebSocket(
                    'ws://' + window.location.host +
                    '/ws/' + group_chat_name + 'chatgroup/');
                    var group_name = $('#group_class').children('p').next('p').text();
                    $('#title-chat').html(group_name);
                    $("#chat-group-text").prop('disabled', false);
                    $(".frame2").children('ul').empty();
                    var me = {};
                    me.avatar = "https://cdn2.iconfinder.com/data/icons/perfect-flat-icons-2/512/User_man_male_profile_account_person_people.png";

                    var you = {};
                    you.avatar = "https://cdn2.iconfinder.com/data/icons/rcons-users-color/32/support_man-512.png";      

                    //-- No use time. It is a javaScript effect.
                    function insertChat2(who, text, time){
                        if (time === undefined){
                            time = 0;
                        }
                        var control = "";
                        var date = time;
                        
                        if (who == userName){
                        control = '<li style="padding-top: 15px;margin-left: 5em;width:75%;">' +
                                        '<div class="msj-rta macro" style="background-color: #BFE9F9;">' +
                                            '<div class="text text-r">' +
                                                '<p style="color: #444950;word-break: break-all;">'+text+'</p>' +
                                                '<p><small style="color: #444950;">'+date+'</small></p>' +
                                            '</div></div></li>';
                        }else{
                        control = '<li style="width:75%">' +
                            '<h4 style="margin-bottom: -3px;margin-left: 10%;font-size: 12px;">'+who+'</h4>'+
                            '<div class="avatar" style="padding:5px 0px 0px 10px !important"><img class="img-circle" style="width:90%;" src="'+me.avatar+'" /></div>'+
                            '<div class="msj-rta macro">' +
                                '<div class="text text-r">' +
                                    '<p style="color: #444950;word-break: break-all;">'+text+'</p>' +
                                    '<p><small style="color: #444950;">'+date+'</small></p>' +
                                '</div></div>' +
                            '</li>';
                        }
                        setTimeout(
                            function(){                        
                                $(".frame2").children('ul').append(control).scrollTop($(".frame2").children('ul').prop('scrollHeight'));
                            }, time);
                        
                    }

                    
                    chatgroup.onmessage = function(e) {
                    var data = JSON.parse(e.data);
                    var message = data['message'];
                    var who = data['who'];
                    var time = data['time'];
                    insertChat2(who, message, time);
                    };

                    $('body').on('click', '.zzz', function(){
                        $("body .mytext2").trigger({type: 'keydown', which: 13, keyCode: 13});
                    })
                    $("body .mytext2").focus();
                    $('body').on('keyup', '.mytext2', function(e){
                        if (e.keyCode === 13) {
                            $(this).parent().parent().next().children('span').click();
                        }
                    })
                    $('body').on('click', '.zzz', function(){
                        var message = $(this).parent().parent().children().children().children('input').val();
                        message = escapeHtml(message);
                        var date = formatAMPM(new Date());
                        if (message != ''){
                            chatgroup.send(JSON.stringify({
                                'message' : message,
                                'who' : userName,
                                'time' : date
                            }));
                        }
                        $(this).parent().parent().children().children().children('input').val('');
                        
                    })
                };
            }
        });
    }
    reload();


    $('body').on('click', '.xxx', function(){
        $("body .mytext").trigger({type: 'keydown', which: 13, keyCode: 13});
    })
    $("body .mytext").focus();
    $('body').on('keyup', '.mytext', function(e){
        if (e.keyCode === 13) {
            $(this).parent().parent().next().children('span').click();
        }
    })
    $('body').on('click', '.xxx', function(){
        var message = $(this).parent().parent().children().children().children('input').val();
        message = escapeHtml(message);
        var date = formatAMPM(new Date());
        if (message != ''){
          chatallSocket.send(JSON.stringify({
                'message' : message,
                'who' : userName,
                'time' : date
            }));
        }
        $(this).parent().parent().children().children().children('input').val(''); 
    })



    var socket_teacher;
    $('.mail_list').on('click',function(){
        var std = $(this).children('p').text();
        //  $("body .noti_chat"+std_username).hide();
            $('body #'+std).children('.frame_std').show();
        //  if (typeof(Storage) !== "undefined") {
        //     var herf = $(this).attr('href');
        //     var chat = herf.substring(herf.indexOf("(")+1, herf.indexOf(")")) + ',' + std_username;
        //     // Gán dữ liệu
        //     sessionStorage.setItem(std_username, chat);
                
        //     // Lấy dữ liệu
        // } else {
        //     document.write('Trình duyệt của bạn không hỗ trợ local storage');
        // }

        socket_teacher = new WebSocket(
                'ws://' + window.location.host +
                '/ws/' + userName +'chat11/');

            var me = {};
            me.avatar = "https://cdn2.iconfinder.com/data/icons/perfect-flat-icons-2/512/User_man_male_profile_account_person_people.png";

            var you = {};
            you.avatar = "https://cdn2.iconfinder.com/data/icons/rcons-users-color/32/support_man-512.png";      

            //-- No use time. It is a javaScript effect.
            function insertChat1(who, text, time){
                if (time === undefined){
                    time = 0;
                }
                var control = "";
                var date = time;
                
                if (who == userName){
                control = '<li style="padding-top: 15px;margin-left: 5em;width:75%;">' +
                        '<div class="msj-rta macro" style="background-color: #BFE9F9;">' +
                            '<div class="text text-r">' +
                            '<p style="color: #444950;line-height: 17px;word-break: break-all;">'+text+'</p>' +
                            '<p><small style="color: #444950;">'+date+'</small></p>' +
                            '</div></div></li>';
                }else{
                control = '<li style="width:75%">' +
                    '<h4 style="margin-bottom: -3px;margin-left: 10%;font-size: 12px;">'+who+'</h4>'+
                    '<div class="avatar" style="padding:5px 0px 0px 10px;width: 20%;margin-left: -12%;margin-top: 5%; !important"><img class="img-circle" style="width:90%;" src="'+me.avatar+'" /></div>'+
                    '<div class="msj-rta macro">' +
                    '<div class="text text-r">' +
                        '<p style="color: #444950;line-height: 17px;word-break: break-all;">'+text+'</p>' +
                        '<p><small style="color: #444950;">'+date+'</small></p>' +
                    '</div></div>' +
                    '</li>';
                }
                setTimeout(
                    function(){                        
                        $(".chat"+std).children('ul').append(control).scrollTop($(".chat"+std).children('ul').prop('scrollHeight'));
                    }, time);
                
            }

            
            socket_teacher.onmessage = function(e) {
            var data = JSON.parse(e.data);
            var message = data['message'];
            var who = data['who'];
            var time = data['time'];
            insertChat1(who, message, time);
            };

        });

    $('body').on('click', '.header-chat', function(){
    $(this).next().slideToggle(300, 'swing');
    })

    $('body').on('click', '.yyy', function(){
    $('body .mytext1').trigger({type: 'keydown', which: 13, keyCode: 13});
    })
    
    $("body .mytext1").focus();
    $('body').on('keyup', '.mytext1', function(e){
    if (e.keyCode === 13) {
        $(this).parent().parent().next().children('.yyy').click();
    }
    })
    

    $('body').on('click', '.yyy', function(){
    var message = $(this).parent().parent().children().children().children('.mytext1').val();
    message = escapeHtml(message);
    var date = formatAMPM(new Date());
    if (message != ''){
        socket_teacher.send(JSON.stringify({
        'message' : message,
        'who' : userName,
        'time' : date
        }));
    }
    $(this).parent().parent().children().children().children('input').val('');
    })



    $('body').on('click', '.chat-close', function(){
    var teacher_name = $(this).attr('id');
    socket_teacher.close();
    // sessionStorage.removeItem(tk_id);
    $("body #chat"+teacher_name+" .frame > ul").empty();
    })

});