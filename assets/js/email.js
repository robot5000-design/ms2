/**
 * @function - Sends the feedback form values to the emailjs service template
 * @param { object } contactForm - feedback form values
 */
function sendMail(contactForm) {
    emailjs.send("servi ce_ceipqpk", "template_heeya0m", {
        "from_name": contactForm.name.value,
        "from_email": contactForm.emailaddress.value,
        "feed_back": contactForm.feedback.value
    })
    .then(
        function(response) {
            alert("SUCCESS", response);
        },
        function(error) {
            alert("FAILED. Please try again later.", error);
        }
    );
    $("#resetModal").modal("toggle");
    return false;  // To block from loading a new page
}

/**
 * @fires - When the feedback form link in the footer is clicked
 * @returns { object } representing the values of the form
 */
$(".feedback-form").on("click", function() {
    $(".modal-content").html(
        `<div class="row modal-div">
            <h5 class="col reset-modal" id="resetModalLabel">Feedback Form</h5>
        </div>
        <div class="row center-form">
            <form  class="col" onsubmit="return sendMail(this)";>
                <input type="text" name="name" class="form-control" id="fullname" placeholder="Name" required/>
                <input type="text" name="emailaddress" class="form-control" id="emailaddress" placeholder="email" required/>
                <div class="modal-body px-0">
                    <textarea rows="5" name="feedback" class="form-control" id="feedback" placeholder="We appreciate your feedback" required></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary modal-cancel" data-dismiss="modal" onclick="buttonPress.play()";>Dismiss</button>
                    <button type="submit" class="btn btn-primary center-block" onclick="buttonPress.play()";>Send Feedback</button>
                </div>
            </form>
        </div>`
    );
});