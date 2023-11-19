function textAreaUpdate() {
    const aboutmeText = document.getElementById("aboutmeText");
}
function sendEmail() {
	Email.send({
    SecureToken : "<your generated token>",
    To : 'recipient@example.com',
    From : "sender@example.com",
    Subject : "Test Email",
    Body : "<html><h2>Header</h2><strong>Bold text</strong><br></br><em>Italic</em></html>"
    }).then(
        message => alert("mail sent successfully")
    );
}