const formSubmission = document.getElementById('#submit')

const onsubmit = (e) => setTimeout(function() {
    window.location.reload();
});

formSubmission.addEventListener('submit', onSubmit);




