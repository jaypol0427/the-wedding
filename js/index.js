var script_url = "https://script.google.com/macros/s/AKfycbxiJKbtSOuMZDUTLwEmWUveE-gq-qivxVLdrF4yFgE6dRb3-yMEP6KEBYV3tXu6DMPIiA/exec";

$(document).ready(function () {
    var searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("Code"))
        $("#code").val(searchParams.get("Code"));

    // Set the date we're counting down to
    var countDownDate = new Date("2024-12-07 17:00:00").getTime();

    // Update the countdown every second
    setInterval(function () {
        // Get the current date and time
        var now = new Date().getTime();

        // Calculate the time remaining
        var distance = countDownDate - now;

        // Calculate days, hours, minutes, and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        days = (String(days).length >= 2) ? days : '0' + days;
        hours = (String(hours).length >= 2) ? hours : '0' + hours;
        minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
        seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;

        $(".days").html(days);
        $(".hours").html(hours);
        $(".minutes").html(minutes);
        $(".seconds").html(seconds);

        // If the countdown is over, display a message
        if (distance < 0) {
            alert("This event is already completed!");
        }
    }, 1000);
});

function getName() {
    if ($("#code").val().trim() == "") {
        alert("Please input your invitation code");
        return;
    }

    $("#btnVerify").prop('disabled', true);
    $("#btnVerify").html("Wait a moment...");
    var url = script_url + "?action=getName&code=" + $("#code").val();
    $.getJSON(url, function (json) {
        if (json.records.length == 0) alert("Invalid invitation code");
        else {
            var guestName = json.records[0][0];
            var additionalHeadCount = json.records[0][2] == "" ? 0 : parseInt(json.records[0][2]);
            var additionalHeadNames = json.records[0][3] == "" ? [] : json.records[0][3].split(',');
            if (additionalHeadCount > 0) {
                var fields = new Array();
                for (var i = 0; i < additionalHeadCount; i++) {
                    fields.push('<div class="col-md-12 pt-2"><input type="text" placeholder="Name of additional person" class="form-control additional-person"></div>');
                }

                $('#additionalHeads').html(fields.join(''));

                var i = 0;
                additionalHeadNames.forEach(x => {
                    $('.additional-person').eq(i).val(x);
                    i++;
                });

                $('#additionalHeadDiv').show();
            }
            else $('#additionalHeadDiv').hide();

            $('#guestName').html(guestName);
            $('#additionalHeadCount').html(additionalHeadCount);
            $('#attendanceModal').modal("show");
        }

        $("#btnVerify").prop('disabled', false);
        $("#btnVerify").html("Confirm Attendance");
    });
}

function updateAttendance(e, response) {
    var label = $(e).html();
    $(e).prop("disabled", true);
    $(e).html("Wait a moment...");
    var additionalHeadNames = [];
    $('.additional-person').each(function () {
        if ($(this).val().trim() != "") additionalHeadNames.push($(this).val().trim());
    });

    var url = script_url + "?action=updateAttendance&attending=" + response
        + "&code=" + $("#code").val()
        + "&additionalHeads=" + additionalHeadNames.toString()
        + "&confirmHeadCount=" + additionalHeadNames.length;

    $.getJSON(url, function (json) {
        $(e).prop("disabled", false);
        $(e).html(label);
        alert("Thanks for your response!");
        $('#attendanceModal').modal("hide");
    });
}