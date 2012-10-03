Notifier = function(emailService) {
	this.emailService = emailService;
};

Notifier.prototype = {
    trigger: function(message) {
		this.emailService.sendEmail(message);
    }
};
