var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/test_tc1');

/*
Set-up schema
*/
var UserSchema = new Schema({
    nick     : { type: String, index: true, unique: true }
  , date      : { type: Date , 'default': function() {
			return new Date();
		}}
});

var DiscussionSchema = new Schema({
    tag     : { type: String }
  , msg_date:{type: Date,'default':function(){
  	return new Date();
  }}
});

var MessageSchema = new Schema({
	msg    : { type: String ,index: true, unique: true }
	, user_id      : { type: Number }
	, message_id      : { type: Number }
 	, msg_date:{type: Date,'default':function(){
	  	return new Date();
	  }}
	});	

mongoose.model('User', UserSchema);
mongoose.model('Discussion',DiscussionSchema),
mongoose.model('Message', MessageSchema);

/*
	Make database models publicly accessible
*/

var db = {
	User: mongoose.model('User'),
	Discussion: mongoose.model('Discussion'),
	Message: mongoose.model('Message')	

};

module.exports = db;
