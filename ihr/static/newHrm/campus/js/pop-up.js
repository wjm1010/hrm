// close event delegated
var IS_IOS = !!window.navigator.platform &&
    /iPad|iPhone|iPod/.test(window.navigator.platform);
var EVENT_TOUCH = IS_IOS ? "touchstart" : "click";
// 封装弹窗的方法
function dialogSwitcher(id) {
    var installed = false;
    var $el = $("#" + id);

    var singleton = {
        hide: function hide() {
            $el.addClass("popover");
            $("body").removeClass("erflow");
            return singleton;
        },
        show: function show() {
            $el.removeClass("popover");
            $("body").addClass("erflow");
            return singleton;
        },
        toggle: function toggle() {
            $el.toggleClass("popover");
            return singleton;
        },
        install: function install(invoker, force) {
            if (!installed || force) {
                typeof invoker === "function" && invoker($el);
                installed = true;
            }
            return singleton;
        }
    };

    $el.data("__switcher", singleton);
    return singleton;
}
// 弹窗关闭
$(document.body).on(EVENT_TOUCH, ".close", function (e) {
    $("body").removeClass("erflow");
    var $dialog = $(e.target).closest(".content-dialog");
    if ($dialog && $dialog.data("__switcher")) {
        $dialog.data("__switcher").toggle();
    }
});
