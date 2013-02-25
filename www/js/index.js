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
$("#bidButton").click(function (e) {
	var bidValue = $("#bidSlider").val();
    $.ajax({
    	url:"http://localhost:8080/details/david/" + bidValue
    });
});
var app = {
    createStompClient: function() {
        var url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus';
		eb = new vertx.EventBus(url); // does a connect;
		
        eb.onopen = function() {
			console.log('Connected');
			// subscribe and register 'handler':
			eb.registerHandler("org.aerogear.messaging", function(msg, replyTo) {
				console.log('mmmmm' + msg.text);
				//var output = app.insertPayload(msg.text);
				$('#currentBid').text(msg.text);
				//$('#listview').append(output).listview('refresh');
			});
        };
    },
	insertPayload: function(payload) {
		// I am sure there is a nicer way to get this shit done....:
	   return "<li data-icon='delete'><a href='#' onclick=\"javascript:this.parentNode.parentNode.parentNode.style.display='none';\">" + payload + "</a></li>";
	},
    // Application Constructor
    initialize: function() {
        this.createStompClient();
    }


};