(function ($) {

    $.fn.MobileMenu = function (options) {

        var settings = $.extend({
            MenuLocation: "body", // the element that the menu will be appended to
            MenuContainerClass: "mobile-menu-container", // the css class that will be added to the menu container
            MenuToggleClass: "mobile-menu-toggle", // the css class that will be added to the menu launcher
            MenuOpenClass: "mobile-menu-open", // the css class that will be added to the body tag when the menu is open
            MenuClass: "mobile-menu", // the css class that will be added to each menu
            Expanding: false, // specifies whether the sub menus should expand
            ExpandClass: "dropdown", // the class that will be added to an expanding menu
            ExpandedClass: "open", // the class that will be added to an expanded menu
            ToggleOpenMarkup: "<a title='Show Menu'></a>", // the markup that will be displayed to open the menu
            ToggleCloseMarkeup: "<a title='Hide Menu'></a>", // the markup that will be displayed to close the menu
            TriggerWidth: "767" // the screen width below which the menu will be triggered
        }, options);

        //global variables
        var menuOpen = false;
        var resizeTimer = null;

        //toggles the menu state
        function toggleMenu() {

            //check whether menu is open
            if ($("body").hasClass(settings.MenuOpenClass)) {

                //close menu
                $("body").removeClass(settings.MenuOpenClass);
                $("." + settings.MenuToggleClass).html(settings.ToggleOpenMarkup);

                menuOpen = false;
            }
            else {

                //open menu
                $("body").addClass(settings.MenuOpenClass);
                $("." + settings.MenuToggleClass).html(settings.ToggleCloseMarkeup);

                menuOpen = true;
            }
        }

        //triggers the mobile menu
        function triggerMenu() {

            //check if window size is less than trigger size
            if ($(window).width() <= settings.TriggerWidth) {

                //show menu toggle
                $("." + settings.MenuToggleClass).show();
            }
            else {

                //hide menu toggle
                $("." + settings.MenuToggleClass).hide();
                
                //close menu
                if (menuOpen) {
                    toggleMenu();
                }
            }
        }

        //bind mobile menu trigger to window resize event
        $(window).resize(function () {

            //clear any existing timers
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }

            resizeTimer = setTimeout(handleResize, 500);
        });

        //trigger the mobile menu on resize
        function handleResize() {

            triggerMenu();
        }

        //builds the mobile
        function buildMobileMenu() {

            //add menu container
            $("body").prepend("<div class='" + settings.MenuContainerClass + "'><div class='" + settings.MenuToggleClass + "'>" + settings.ToggleOpenMarkup + "</a></div></div>");

            //set click function to toggle menu
            $("." + settings.MenuToggleClass).click(function (event) {

                event.preventDefault();

                toggleMenu();
            });

            //trigger the menu
            triggerMenu();
        }

        //build the menu
        buildMobileMenu();


        return this.each(function () {

            //clone menu items
            var menu = $("<nav class='" + settings.MenuClass + "'></nav>").append($("<ul>").append($(this).find("li").clone().off()));

            //strip extraneous attributes
            menu.find("*").each(function (i, e) {
                $(e).removeAttr("id").removeAttr("class").removeAttr("style");
            });

            //check whether expanding 
            if (settings.Expanding) {

                //hide all nested menus
                $(menu).find("li ul").hide();

                //add expanding class to parent
                $(menu).find("li ul").parent().addClass(settings.ExpandClass);

                //create dropdown trigger events
                $(menu).find("." + settings.ExpandClass).click(function(event){

                    //determine open state
                    var open = $(this).hasClass(settings.ExpandedClass);

                    //hide all open dropdowns and remove all selected states
                    $("." + settings.MenuClass + "  li ul").hide();
                    $("." + settings.MenuClass + " li").removeClass(settings.ExpandedClass);

                    //show selected dropdown
                    if (!open) {
                        $(this).children("ul").show();
                        $(this).addClass(settings.ExpandedClass);
                    }
                });

                //disable dropdown root link
                $(menu).find("." + settings.ExpandClass + " > a").click(function (e) {
                    e.preventDefault();
                });
            }

            //add menu to container
            $("." + settings.MenuContainerClass).append(menu);
        });
    };
}(jQuery));