
 async function getUserData(token) {
        console.log("utils begin")

        let h = new Headers({
            'Content-Type': 'text/plain',
            'Authentication': 'Bearer ' +token
          });
          console.log(h)

          let response = await  fetch('/user/profile', { 
          method: 'GET',
          headers: h,
         mode: 'cors',//this & next line doesen't do anything
         cache: 'default' 
        }) 
        let data = await response.json()
        console.log( "Data from userUtils")

        console.log(data)
        return data;
      }
        