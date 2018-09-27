if($("#position").val() == 'teacher'){
    document.getElementById('close-room').onclick = function() {
        document.location.href = "/manage_class/"+location.href.split('_')[1];
    };

    document.getElementById('reopen-room').onclick = function() {
        location.reload();
    };
}


$('#room-id').html(" "+location.href.split('_')[1]);

var connection = new RTCMultiConnection();

connection.socketURL = "http://192.168.100.22:9002/";

connection.socketMessageEvent = 'audio-plus-screen-sharing-demo';

connection.session = {
    audio: 'two-way',
    screen: true,
    oneway: true
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
};

connection.mediaConstraints.video = false;

connection.videosContainer = $('#videos-container');

connection.audiosContainer = document.getElementById('audios-container');

connection.onstream = function(event) {

    var mediaElement = getMediaElement(event.mediaElement, {
        title: event.userid,
        buttons: ['full-screen'],
        showOnMouseEnter: false
    });
    if(event.stream.isScreen) {
        connection.videosContainer.html(mediaElement);
    }
    else {
        connection.audiosContainer.appendChild(mediaElement);
    }
    setTimeout(function() {
        mediaElement.media.play();
    }, 5000);
    mediaElement.id = event.streamid;
    $('#videos-container .media-container').attr('style','width:100%');
    if($("#position").val() == 'teacher'){
        $('#videos-container .media-controls div:first-child').attr('style','opacity:0');
    };
};


connection.onstreamended = function(event) {
    var mediaElement = document.getElementById(event.streamid);
    if(mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
    }
};

connection.getScreenConstraints = function(callback) {
    getScreenConstraints(function(error, screen_constraints) {
        if (!error) {
            screen_constraints = connection.modifyScreenConstraints(screen_constraints);
            callback(error, screen_constraints);
            return;
        }
        throw error;
    });
};

//function showRoomURL(roomid) {
//    var roomHashURL = '#' + roomid;
//    var roomQueryStringURL = '?roomid=' + roomid;
//    var html = '<h2>Unique URL for your room:</h2><br>';
//    html += 'Hash URL: <a href="' + roomHashURL + '" target="_blank">' + roomHashURL + '</a>';
//    html += '<br>';
//    html += 'QueryString URL: <a href="' + roomQueryStringURL + '" target="_blank">' + roomQueryStringURL + '</a>';
//    var roomURLsDiv = document.getElementById('room-urls');
//    roomURLsDiv.innerHTML = html;
//    roomURLsDiv.style.display = 'block';
//}

(function() {
    var params = {},
        r = /([^&=]+)=?([^&]*)/g;
    function d(s) {
        return decodeURIComponent(s.replace(/\+/g, ' '));
    }
    var match, search = window.location.search;
    while (match = r.exec(search.substring(1)))
        params[d(match[1])] = d(match[2]);
    window.params = params;
})();

var roomid = '';
if (localStorage.getItem(connection.socketMessageEvent)) {
    roomid = localStorage.getItem(connection.socketMessageEvent);
} else {
    roomid = connection.token();
}
document.getElementById('room-id').value = roomid;

document.getElementById('room-id').onkeyup = function() {
    localStorage.setItem(connection.socketMessageEvent, this.value);
};
var hashString = location.hash.replace('#', '');
if(hashString.length && hashString.indexOf('comment-') == 0) {
  hashString = '';
}

var roomid = params.roomid;
if(!roomid && hashString.length) {
    roomid = hashString;
}

if(roomid && roomid.length) {
    document.getElementById('room-id').value = roomid;
    localStorage.setItem(connection.socketMessageEvent, roomid);
    // auto-join-room
    (function reCheckRoomPresence() {
        connection.checkPresence(roomid, function(isRoomExists) {
            if(isRoomExists) {
                connection.join(roomid);
                return;
            }
            setTimeout(reCheckRoomPresence, 5000);
        });
    })();
    disableInputButtons();
}

if($("#position").val() == 'teacher'){
    connection.openOrJoin($('#room-id').text());
}else{
    connection.join($('#room-id').text());
}


