let users = [
   {
      id: 0,
      firstName: "Aric",
      lastName: "Crosson Bouwers",
      email: "acbouwerstest@outlook.com",
      dateSignedUp: "2023-03-13 09:13:00",
   },
   {
      id: 1,
      firstName: "Sicily",
      lastName: "Crosson Bouwers",
      email: "sicily@outlook.com",
      dateSignedUp: "2023-03-13 09:13:00",
   },
   {
      id: 2,
      firstName: "Zee",
      lastName: "Unknown",
      email: "zeetheman@outlook.com",
      dateSignedUp: "2023-03-13 09:13:00",
   },
   {
      id: 3,
      firstName: "Deng",
      lastName: "Benjamin",
      email: "dengDJKhaled",
      dateSignedUp: "2023-03-13 10:44:00",
   },
];

export function getAllUsers() {
   return users;
}
export function addUser(newUser) {
   users.push(newUser);
}

export function updateUser(id, update) {
   const user = users.find((x) => x.id === +id);
   console.log(`found ${users.id}`);
   Object.assign(user, update);
}
// TODO - just need to figure out why i'm getting empty objects between new users {}

export function deleteUser(searchId) {
   users = users.filter((x) => x.id !== +searchId); // reassigns the entire users array back to
   // the same variable EXCEPT for the user object that has an id that matches the search ID
}
