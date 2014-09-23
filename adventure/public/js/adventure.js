function AdventureBlock(runtime, element) {
    var id = $('.adventure', element).attr('id');

    // Create our application
    var app = new Backbone.Marionette.Application({
        'container': element,
        'channelName': id // communication channel for multiple xblocks
    });

    app.addInitializer(function(options) {
        // Create and add our app regions
        var StepRegion = Backbone.Marionette.Region.extend({
            el: $('.step-view', element)
        });

        var NavigationRegion = Backbone.Marionette.Region.extend({
            el: $('.navigation-view', element)
        });

        this.addRegions(function() {
            return {
                stepViewRegion: StepRegion,
                navigationViewRegion: NavigationRegion
            };
        });

        // create the application controller
        var controller = new AdventureController({
            app: app,
            runtime: runtime
        });

        // display current step and navigation
        controller.showCurrentStep();
        controller.showNavigation();
    });

    app.start();
}

function AdventureEditBlock(runtime, element) {
    var xmlEditorTextarea = $('.block-xml-editor', element),
        xmlEditor = CodeMirror.fromTextArea(xmlEditorTextarea[0], { mode: 'xml' });

    $('.save-button', element).bind('click', function() {
        var handlerUrl = runtime.handlerUrl(element, 'studio_submit'),
            data = {
                'xml_content': xmlEditor.getValue()
            };

        $('.error-message', element).html();
        $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
            if (response.result === 'success') {
                window.location.reload(false);
            } else {
                $('.error-message', element).html('Error: '+response.message);
            }
        });
    });

    $('.cancel-button', element).bind('click', function() {
        runtime.notify('cancel', {});
    });
}
