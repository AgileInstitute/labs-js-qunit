UserInterface = function(commandName, commandParameter, target) {
    this.commandName = commandName;
    this.commandParameter = commandParameter;
    this.target = target;
};

UserInterface.prototype = {
    writeLine: function(message) {
        var paragraph = $("<p></p>");
        paragraph.text(message);
        $("#dialogue").append(paragraph);
    }
};
