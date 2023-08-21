
const onSubmit = (e) => {
  e.preventDefault();

  const { name, business, topic, email, message } = e.target;
 //console.log( name.value, business.value, topic.value, email.value, message.value )
	 //window.location = 'http://home.ejc-portfolio.com:3000/contactForm.html'
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://home.ejc-portfolio.com:3000/notify");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  const body = `{
    "name": "${name.value}",
    "business": "${business.value}",
    "topic": "${topic.value}",
    "email": "${email.value}",
    "message": "${message.value}"
  }`
// const body = `fake body ${name.value}`
  xhr.send(body);
}

document.addEventListener('DOMContentLoaded', () => {
  addEventListener('submit', onSubmit);
})



