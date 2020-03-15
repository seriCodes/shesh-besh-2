console.log("user profile html pre-loaded")


 window.onload =(async () => {
    console.log("user profile html loaded")
    const urlParams = new URLSearchParams(window.location.search);
    const myToken = urlParams.get('token');
    console.log( urlParams)
    console.log( myToken)
  const  userData= await getUserData(myToken);
  console.log( "userData from userProfile.js")
  console.log( userData)
  $spanUserData=document.body.querySelector('#userData')
               let text =  "name:"+userData.name +" user rating:"+ userData.rating;
                $spanUserData.insertAdjacentHTML('afterbegin', text);    
  })
