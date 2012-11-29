//module.exports = function() {
//Get required modules
var util = require('util');
var Request = require('request');
var qs = require('querystring');
var xmlBuilder = require('xmlbuilder');   // added ...
var doc = xmlBuilder.create();

var plivo = {};

plivo.options = {};
plivo.options.host = 'api.plivo.com';
plivo.options.version = 'v1';
plivo.options.authId = '';
plivo.options.authToken = '';

var UserAgent = 'NodePlivo';

//Define a new error object - A string is not an error, thanks Guillermo: 
//http://www.devthought.com/2011/12/22/a-string-is-not-an-error/
function PlivoError (msg) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.message = msg;
  this.name = 'PlivoError';
};

PlivoError.prototype.__proto__ = Error.prototype;


//Main request function
var request = function (action, method, params, callback) {
  var err = null;
  var path = 'https://' + plivo.options.host + '/' +				  //https added
			plivo.options.version + '/Account/' + 
			plivo.options.authId + '/' + action ;

  var auth = 'Basic ' + new Buffer(plivo.options.authId + ':' + 
					plivo.options.authToken).toString('base64');

  var headers = {'Authorization': auth, 'User-Agent': UserAgent, 'Content-Type':'application/json'};

  if (method == 'POST') {
	  var body = JSON.stringify(params)

	  Request.post({
		uri: path,
		body: body,
		headers: headers,
		json: true,
		}, function(error, response, body) {
		if(response.statusCode != 201) {
		  err = new PlivoError(error);
		}
		callback(response.statusCode, body);
	  });
  }

  else if (method == 'GET') {
	  query_string = qs.stringify(params);
	  Request.get({
		uri: path,
		qs: query_string,
		headers: headers,
		}, function(error, response, body) {
		callback(response.statusCode,body);
		});
  }

  else if (method == 'DELETE') {
	  Request.del({
		uri: path,
		headers: headers,
		}, function(error, response, body) {
		callback(response.statusCode,body);
		});
  }

  else if (method == 'PUT') {
	  var body = JSON.stringify(params)
	  Request.put({
		uri: path,
		body: body,
		headers: headers,
		json: true,
		}, function(error, response, body) {
		callback(response.statusCode,body);
		});
  }
};


//Calls
plivo.make_call = function (params, callback) {   // changed call to make_call
	var action = 'Call/';
	var method = 'POST';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.transfer_call = function (params, callback) {
	var action = 'Call/' + params['call_uuid'] + '/';
	delete params.call_uuid;
	var method = 'POST';

	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.hangup_all_calls = function (callback) {
	var action = 'Call/';
	var method = 'DELETE';

	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.hangup_call = function (params, callback) {
	var action = 'Call/' + params['call_uuid'] + '/';
	delete params.call_uuid;
	var method = 'DELETE';

	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.record = function (params, callback) {   // changed record_start to record
	var action = 'Call/' + params['call_uuid'] + '/Record/';
	delete params.call_uuid;
	var method = 'POST';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.record_stop = function (params, callback) {
	var action = 'Call/' + params['call_uuid'] + '/Record/';
	delete params.call_uuid;
	var method = 'DELETE';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.play = function (params, callback) {
	var action = 'Call/' + params['call_uuid'] + '/Play/';
	delete params.call_uuid;
	var method = 'POST';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.play_stop = function (params, callback) {
	var action = 'Call/' + params['call_uuid'] + '/Play/';
	delete params.call_uuid;
	var method = 'DELETE';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.speak = function (params, callback) {
	var action = 'Call/' + params['call_uuid'] + '/Speak/';
	delete params.call_uuid;
	var method = 'POST';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.send_digits = function (params, callback) {
	var action = 'Call/' + params['call_uuid'] + '/DTMF/';
	delete params.call_uuid;
	var method = 'POST';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

// Request.....

plivo.hangup_request = function (params, callback) {
	var action = 'Call/' + params['request_uuid'] + '/';
	delete params.call_uuid;
	var method = 'DELETE';
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

// Conferences......

plivo.get_live_conferences = function (params, callback) { // changed live_conferences to get_live_conferences
	var action = 'Conference/';
	var method = 'GET';

	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.get_live_conference = function (params, callback) {		// changed live_conferences to get_live_conference
	var action = 'Conference/' + params['conference_id'] + '/';
	delete params.conference_id;
	var method = 'GET';

	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.hangup_all_conferences = function (params, callback) { // changed hangup_all_conference to hangup_all_conferences
	var action = 'Conference/';
	var method = 'DELETE';

	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.hangup_conference = function (params, callback) {
	var action = 'Conference/' + params['conference_id'] + '/';
	delete params.conference_id;
	var method = 'DELETE';

	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.hangup_conference_member = function (params, callback) { // changed hangup_member_conference to hangup_conference_member
	var action = 'Conference/' + params['conference_id'] + '/Member/' +
					params['member_id'] + '/';
	delete params.conference_id;
	delete params.member_id;
	var method = 'DELETE';

	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.play_conference_member = function (params, callback) {   //  changed play_member_conference to play_conference_member
	var action = 'Conference/' + params['conference_id'] + '/Member/' +
					params['member_id'] + '/Play/';
	delete params.conference_id;
	delete params.member_id;
	var method = 'POST';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.stop_play_conference_member = function (params, callback) {	//	changed stop_play_member_conference to stop_play_conference_member
	var action = 'Conference/' + params['conference_id'] + '/Member/' +
					params['member_id'] + '/Play';
	delete params.conference_id;
	delete params.member_id;
	var method = 'DELETE';

	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.speak_conference_member = function (params, callback) { //  changed speak_member_conference to speak_conference_member
	var action = 'Conference/' + params['conference_id'] + '/Member/' +
					params['member_id'] + '/Speak/';
	delete params.conference_id;
	delete params.member_id;
	var method = 'POST';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.deaf_conference_member = function (params, callback) {  //  changed deaf_member_conference to deaf_conference_member
	var action = 'Conference/' + params['conference_id'] + '/Member/' +
					params['member_id'] + '/Deaf/';
	delete params.conference_id;
	delete params.member_id;
	var method = 'POST';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.undeaf_conference_member = function (params, callback) {	//	changed undeaf_member_conference to undeaf_conference_member
	var action = 'Conference/' + params['conference_id'] + '/Member/' +
					params['member_id'] + '/Deaf/';
	delete params.conference_id;
	delete params.member_id;
	var method = 'DELETE';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.mute_conference_member = function (params, callback) {  //  changed mute_member_conference to mute_conference_member
	var action = 'Conference/' + params['conference_id'] + '/Member/' +
					params['member_id'] + '/Mute/';
	delete params.conference_id;
	delete params.member_id;
	var method = 'POST';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.unmute_conference_member = function (params, callback) { //  changed unmute_member_conference to unmute_conference_member
	var action = 'Conference/' + params['conference_id'] + '/Member/' +
					params['member_id'] + '/Mute/';
	delete params.conference_id;
	delete params.member_id;
	var method = 'DELETE';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.kick_conference_member = function (params, callback) {  //  changed kick_member_conference to kick_conference_member
	var action = 'Conference/' + params['conference_id'] + '/Member/' +
					params['member_id'] + '/Kick/';
	delete params.conference_id;
	delete params.member_id;
	var method = 'POST';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.record_conference = function (params, callback) {
	var action = 'Conference/' + params['conference_id'] + '/Record/';
	delete params.conference_id;
	var method = 'POST';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.stop_record_conference = function (params, callback) {
	var action = 'Conference/' + params['conference_id'] + '/Record/';
	delete params.conference_id;
	var method = 'DELETE';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};


// Accounts

plivo.get_account = function (params, callback) {  // changed account to get_account
	var action = '';
	var method = 'GET';

	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.modify_account = function (params, callback) {
	var action = '';
	var method = 'POST';
	
	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.get_subaccounts = function (params, callback) {  // changed subaccounts to get_subaccounts
	var action = 'Subaccount/';
	var method = 'GET';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.get_subaccount = function (params, callback) {  // changed subaccount to get_subaccount
	var action = 'Subaccount/' + params['subauth_id'] + '/';
	delete params.subauth_id;
	var method = 'GET';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

// Adding create_subaccount function
plivo.create_subaccount = function (params, callback) {  
	var action = 'Subaccount/';
	var method = 'POST';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.modify_subaccount = function (params, callback) {
	var action = 'Subaccount/' + params['subauth_id'] + '/';
	delete params.subauth_id;
	var method = 'GET';

	request(action, method, params, function(err, response) {
		callback(err, response);
	});
};

plivo.delete_subaccount = function (params, callback) {
	var action = 'Subaccount/' + params['subauth_id'] + '/';
	delete params.subauth_id;
	var method = 'DELETE';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

// Applications

// adding get_applications
plivo.get_applications = function (params, callback) { 
	var action = 'Application/';
	var method = 'GET';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.get_application = function (params, callback) {  // changed application to get_application and added app_id
	var action = 'Application/' + params['app_id'] + '/';
	var method = 'GET';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.create_application = function (params, callback) {
	var action = 'Application/';
	var method = 'POST';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.modify_application = function (params, callback) {
	var action = 'Application/' + params['app_id'] + '/';
	var method = 'POST';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.delete_application = function (params, callback) {
	var action = 'Application/' + params['app_id'] + '/';
	var method = 'DELETE';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

// Recordings
plivo.get_recordings = function (params, callback) {
	var action = 'Recording/';
	var method = 'GET';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.get_recordings = function (params, callback) {
	var action = 'Recording/' + params['recording_id'] + '/';
	var method = 'GET';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

// Endpoints

plivo.get_endpoints = function (params, callback) {
	var action = 'Endpoint/';
	var method = 'GET';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.get_endpoint = function (params, callback) {
	var action = 'Endpoint/' + params['endpoint_id'] + '/';
	var method = 'GET';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.create_endpoint = function (params, callback) {
	var action = 'Endpoint/';
	var method = 'POST';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.modify_endpoint = function (params, callback) {
	var action = 'Endpoint/' + params['endpoint_id'] + '/';
	var method = 'POST';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.delete_endpoint = function (params, callback) {
	var action = 'Endpoint/' + params['endpoint_id'] + '/';
	var method = 'DELETE';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

// Numbers
plivo.get_numbers = function (params, callback) {
	var action = 'Number/';
	var method = 'GET';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.get_rented_number_details = function (params, callback) {
	var action = 'Number/' + params['number'] + '/';
	var method = 'GET';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.unrent_number = function (params, callback) {
	var action = 'Number/' + params['number'] + '/';
	var method = 'DELETE';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.get_number_group = function (params, callback) {
	var action = 'AvailableNumberGroup/';
	var method = 'GET';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.get_number_group_details = function (params, callback) {
	var action = 'AvailableNumberGroup/' + params['group_id'] + '/';
	var method = 'GET';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.rent_from_number_group = function (params, callback) {
	var action = 'AvailableNumberGroup/' + params['group_id'] + '/';
	var method = 'POST';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.edit_rented_number = function (params, callback) {
	var action = 'Number/' + params['number'] + '/';
	var method = 'POST';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

// Message
plivo.send_message = function (params, callback) {
	var action = 'Message/';
	var method = 'POST';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.get_messages = function (params, callback) {
	var action = 'Message/';
	var method = 'GET';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

plivo.get_message = function (params, callback) {
	var action = 'Message/' + params['record_id'] + '/';
	var method = 'GET';

	request(action, method, params, function (err, response) {
		callback(err, response);
	});
};

//TODO: Program XML response functions so that they can be chained
//var respxml = xml.begin('Response');

GLOBAL.Docs = doc.begin('Response');
//console.log(doc.toString({ pretty: true }));
// Decalaring a class Element
function Element() {
	nestables = [];
	valid_attributes = [];
	
};

Element.prototype = {

	init : function(name, body, attributes, valid_attributes) {
		this.attributes = [];
		this.name = name;
		this.body = body;
		var elem = Docs.ele(this.name);
		var keys = Object.keys(attributes);
		 
		for (var i=0; i<keys.length; i++) {
			if (this.valid_attributes.indexOf(keys[i]) == -1) {
				console.log('Error');
			return PlivoError('Not a valid attribute, %s', keys[i]);
			}
     		elem.att(keys[i],attributes[keys[i]])
     	}	
     	elem.text(body)
     	var nestelem = elem.ele('Test')
		nestelem.text('Hi in Test')
		console.log('In Element Function'+'\n'+elem);
    	return elem.toString({ pretty: true });
	},

	add: function(elem) {
		console.log('To XML');
	//	var element = ElementXml(name, body, valid_attributes,  params, nestables);
	//	console.log(element);
		return new Element;
	},
	addSpeak : function(body, attributes) {
		var speak = new Speak();
		return Element.prototype.add(speak.init(speak.element,body, attributes));
	},
	addPlay: function(body, params) {
		/*GLOBAL.xmlPlay = Play(body, params);
		console.log(xmlPlay+'\n'+'In addPlay');*/
		return Element.prototype;
	}
}

function Speak() {
	this.element = 'Speak';
	this.valid_attributes = ['voice', 'language', 'loop'];
    this.nestables = ['Play'];
     
}

Speak.prototype.init = function( body, attributes) {

	if (body == null) {
		PlivoError('No text set for %s', this.name);
	}
	
	Element.prototype.init(this.element, body, attributes, valid_attributes);
	
};

var Response = function() {
	this.nestables = ['Speak', 'Play', 'GetDigits', 'Record', 'Dial', 'Message',
			'Redirect', 'Wait', 'Hangup', 'PreAnswer', 'Conference', 'DTMF'];
	this.valid_attributes = [];

};

util.inherits(Response, Element);
util.inherits(Speak, Element);


exports.Response = function() {
	return Response;
}
exports.Plivo = function() {
	return plivo;
}

exports.Element = function() {
	return Element;
}
