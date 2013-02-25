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

var notifier = AeroGear.Notifier({
    name: "stompClient",
    settings: {
        connectURL: "http://localhost:8080/eventbus",
        onConnect: function() {
            console.log('Connected');
        },
        onDisconnect: function() {
            console.log('Disconnected');
        },
        onConnectError: function() {
            console.log('Connect Error');
        },
        channels: [{
            address: "org.aerogear.messaging",
            callback: function( msg, replyTo ) {
                console.log( "mmmmm" + msg.text );
                $("#listview").append("<li data-icon='delete'><a href='#'>" + msg.text + "</a></li>").listview("refresh");
            }
        }]
    }
});

$( "#listview" ).on( "click", "li", function( event ) {
    $( this ).remove();
    $("#listview").listview("refresh");
});
