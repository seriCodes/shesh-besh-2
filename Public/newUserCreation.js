$Form = document.body.querySelector('form')
$Form.addEventListener('submit', (e) => {
    e.preventDefault();    
    const userName = e.target.elements.userName.value

const password = e.target.elements.password.value
//console.log(fetch('http://localhost:3000/user?name='+userName+'&password='+ password))
fetch('/user/creation?name='+userName+'&password='+ password)//{ method: 'POST'}
  .then((response) => {
  console.log(response.status)
  console.log(response)
  const regex = RegExp('4+');
  if (regex.test(response.status)){
            console.log('fail ')
            document.location.href = '/newUserCreation.html';
            alert("user wasn't created")
        } else {
          response.json().then((data) => {
          console.log('succeeded')
          console.log(data.token)
          document.location.href = '/joinRoom.html?token='+data.token;
          })
         }
        })
        .catch((e)=>{
          console.log('error')
             alert('user creation error')
             document.location.href = '/newUserCreation.html';
         })
  })