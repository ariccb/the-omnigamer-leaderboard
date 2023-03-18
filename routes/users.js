import express from "express";
import {
    getUsers,
    createUser,
    updateUser,
    patchUser,
    deleteUser,

    // deleteUser,
    // updateUser,
    // addUser,
    // getAllUsers,
} from "../controllers/userController.js";

const userRouter = express.Router();

// router.get("/", (req, res) => {
//    res.send(getAllUsers());
// });

// route to this whole endpoint is "/users"
userRouter.get("/", getUsers);
userRouter.post("/", createUser);
userRouter.put("/:_id", updateUser); //needs to send the whole body object
userRouter.patch("/:_id", patchUser);
userRouter.delete("/:_id", deleteUser);

export default userRouter;
/**my previous functionality:
router.post("/", (req, res) => {
   const newUser = req.body;
   addUser(newUser);
   res.send(getAllUsers());
});

router.patch("/:id", (req, res) => {
   const name = req.params.id;
   const update = req.body;
   updateUser(name, update);

   res.send(getAllUsers());
});

router.delete("/:id", (req, res) => {
   const userToDelete = req.params.id;
   deleteUser(userToDelete);

   res.send(getAllUsers());
});
**/

/** 
//youssef's example:
const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);

export default router;
**/
