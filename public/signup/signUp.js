
async function signUp(e) {
    try {
        e.preventDefault()
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        const signUpObj = {
            name,
            email,
            password
        }
        const user = await axios.post("http://44.205.112.174:3000/user/sign-up", signUpObj)
        if (user.status === 201) {
            alert("user sign-up successfully");
            window.location.href = "http://44.205.112.174:3000/login/login.html"
        } else {
            throw new Error("user not created");
        }
    }
    catch (err) {
        if (err.status === 500) {
            window.alert("user is alredy there");
        } else {
            window.alert(err)
        }
    }
}