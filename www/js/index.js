/**
 * JBoss, Home of Professional Open Source
 * Copyright Red Hat, Inc., and individual contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var itemPipe =  AeroGear.Pipeline({name: "items"}).pipes.items

var notifier = AeroGear.Notifier({
    name: "stompClient",
    settings: {
        connectURL: window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/eventbus",
        onConnect: function() {
            itemPipe.read({
                success: function(data) {

                   var i=0;
                    for (tot=data.length; i < tot; i++) {
                        $("#listview").append("<li data-icon='delete'><a href='#'>" + data[i].title + "</a><div id='countdown"+i+"'></div></li>");
                        var currentDate = new Date();
                        var timeleft = data[i].timeleft
                        $('div#countdown'+i).countdown(timeleft * 60 * 1000 + currentDate.valueOf(), function(event) {
                                                    // Update every second
                            if(event.type != "seconds") return;
                            // Calculate the time left
                            var timeLeft = [
                              event.lasting.hours + event.lasting.days * 24,
                              event.lasting.minutes,
                              event.lasting.seconds
                            ];
                            // Convert the values to two digits strings
                            for(var i = 0; i < timeLeft.length; ++i) {
                              timeLeft[i] = (timeLeft[i] < 10 ? '0' : '') + timeLeft[i].toString();
                            }
                            // Concatenate the array and display at the tag
                            $(this).html(timeLeft.join(':'));
                        });
                        $("#listview").listview("refresh"); 
                    }
                }
            });

             
           
        },
        onDisconnect: function() {
            console.log('Disconnected');
        },
        onConnectError: function() {
            console.log('Connect Error');
        }
    }
});

function channelCallback( msg ) {
    console.log( "mmmmm" + msg.text );
    $("#listview").append("<li data-icon='delete' data-theme='" + msg.theme + "'><a href='#'>" + msg.text + "</a></li>").listview("refresh");
}

// Message removal
$( "#listview" ).on( "click", "li", function( event ) {
    $( this ).remove();
    $("#listview").listview("refresh");
});

// Subscribe to Channel
$( "#channel-list" ).on( "click", ".add", function( event ) {
    var $this = $( this ),
        addCount = $("#available-channels .ui-li-count"),
        subCount = $("#subscribed-channels .ui-li-count");

    notifier.clients.stompClient.subscribe({
        address: $.trim( $this.text() ),
        callback: channelCallback
    });
    $this
        .toggleClass("add remove")
        .buttonMarkup({ icon: "delete"})
        .insertBefore("#available-channels");
    addCount.text( +addCount.text() - 1 );
    subCount.text( +subCount.text() + 1 );
    $("#channel-list").listview("refresh");
});

// Unsubscribe from Channel
$( "#channel-list" ).on( "click", ".remove", function( event ) {
    var $this = $( this ),
        addCount = $("#available-channels .ui-li-count"),
        subCount = $("#subscribed-channels .ui-li-count");

    notifier.clients.stompClient.unsubscribe({
        address: $.trim( $this.text() ),
        callback: channelCallback
    });
    $this
        .toggleClass("add remove")
        .buttonMarkup({ icon: "plus"})
        .appendTo("#channel-list");
    addCount.text( +addCount.text() + 1 );
    subCount.text( +subCount.text() - 1 );
    $("#channel-list").listview("refresh");
});

