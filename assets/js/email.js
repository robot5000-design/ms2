// Normal Functions  ######################################################################
/**
 * Sends the feedback form values to the emailjs service template
 * @param { object } contactForm - feedback form values
 */
function sendMail(contactForm) {
    $("#resetModal").modal("toggle");
        emailjs.send("service_ceipqpk", "template_heeya0m", {
        "from_name": contactForm.name.value,
        "from_email": contactForm.emailaddress.value,
        "feed_back": contactForm.feedback.value
    })
    .then(
        function(response) {
            handleMailResponse(response, `Your message has been successfully delivered.`);
        },
        function(error) {
            handleMailResponse(error, `Sorry. There's been a problem and your mail has not been sent. Please try again later.`);
        }
    );
    return false;  // To block from loading a new page
}

/**
 * Sends the feedback form values to the emailjs service template
 * @param { object } responseObject - emailjs.send response object
 * @param { string } message - message to display to user on success or failure
 * 
 */
function handleMailResponse(responseObject, message) { 
    $("#resetModal").modal("toggle");
    $(".modal-content").html(
        `<div class="modal-div">
            <h5 class="reset-modal" id="resetModalLabel">Status: ${responseObject.status}</h5>
        </div>
        <div class="modal-body">
            ${message}
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-cancel" data-dismiss="modal">Ok</button>
        </div>`);
}

/**
 * Populates the feedback form into the bootstrap model
 */
function populateFeedbackModel() {
    $(".modal-content").html(
        `<div class="row modal-div">
            <h5 class="col reset-modal" id="resetModalLabel">Feedback Form</h5>
        </div>
        <div class="row center-form">
            <form  class="col" onsubmit="return sendMail(this)">
                <input type="text" name="name" class="form-control" id="fullname" placeholder="Name" required/>
                <input type="email" name="emailaddress" class="form-control" id="emailaddress" placeholder="email" required/>
                <div class="modal-body px-0">
                    <textarea rows="5" name="feedback" class="form-control" id="feedback" placeholder="We appreciate your feedback" required></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary modal-cancel" data-dismiss="modal">Dismiss</button>
                    <button type="submit" class="btn btn-primary center-block">Send Feedback</button>
                </div>
            </form>
        </div>`
    );
}

// Click Event Function calls  ######################################################################
// feedback form link calls model
$(".feedback-form").on("click", populateFeedbackModel);