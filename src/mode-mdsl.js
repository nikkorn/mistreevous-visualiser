var ace = require('ace-builds/src-noconflict/ace');

ace.define('ace/mode/mdsl', function (require, exports, module) {
    var oop = require("ace/lib/oop");
    var TextMode = require("ace/mode/text").Mode;
    var ExampleHighlightRules = require("ace/mode/mdsl_highlight_rules").ExampleHighlightRules;

    var Mode = function () {
        this.HighlightRules = ExampleHighlightRules;
    };
    oop.inherits(Mode, TextMode);

    (function () {
        // Extra logic goes here. (see below)
    }).call(Mode.prototype);

    exports.Mode = Mode;
});

ace.define('ace/mode/mdsl_highlight_rules', function (require, exports, module) {
    var oop = require("ace/lib/oop");
    var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

    var ExampleHighlightRules = function () {
        this.$rules = new TextHighlightRules().getRules();
    }

    oop.inherits(ExampleHighlightRules, TextHighlightRules);

    exports.ExampleHighlightRules = ExampleHighlightRules;
});