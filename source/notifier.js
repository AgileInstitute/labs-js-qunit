Notifier = function() {
	this.emailService = new EmailService();
};

Notifier.prototype = {
    trigger: function(message) {
		this.emailService.sendEmail(message);
    }
};
