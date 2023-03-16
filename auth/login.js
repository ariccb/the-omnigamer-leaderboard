//prompt user to put in their email and password to log in to their account (stored and handled by supabase)
//make new account if no user with that email exists

let email = "";
let password = "";



async () => {
    const { error } = await supabase.auth.signInWithPassword({
       email,
       password,
    });
    if (error) alert(error.message);