//IMPORTING PACKAGES
const express = require("express");
const Route = express.Router();
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const bcrypt = require("bcryptjs");
const User = mongoose.model("Auth");
const jwt = require("jsonwebtoken");
const { jwt_SECRET } = require("../config/key");
const requireLogin = require("../middleware/requireLogin");
const { response } = require("express");
const multer = require("multer");
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/userProfile/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        file.originalname.split(".")[0] +
        "." +
        file.originalname.split(".")[1]
    );
  },
});

let storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/messageImage/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        file.originalname.split(".")[0] +
        "." +
        file.originalname.split(".")[1]
    );
  },
});

let storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/messageFile/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        file.originalname.split(".")[0] +
        "." +
        file.originalname.split(".")[1]
    );
  },
});

const upload = multer({
  storage: storage,
});
const upload1 = multer({
  storage: storage1,
});

const upload2 = multer({
  storage: storage2,
});

//ROUTE1 CREATING USER
Route.post("/serverside/api/createuser", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Empty Field" });
  }
  User.findOne({ username })
    .then((response) => {
      if (response) {
        return res.status(422).json({ error: "Username already exist" });
      }
      bcrypt.hash(password, 12).then((hashed) => {
        const item = new User({
          username,
          password: hashed,
        });
        item
          .save()
          .then((response) => {
            res.json({ message: "User Created" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => console.log(err));
});

//ROUTE2.1 SIGNIN
Route.post("/serverside/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Empty Field" });
  }
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      bcrypt
        .compare(password, user.password)
        .then((Boolean) => {
          if (!Boolean) {
            return res.status(422).json({ error: "Invalid Email or Password" });
          } else {
            const token = jwt.sign({ _id: user._id }, jwt_SECRET);
            const { _id, username, photo } = user;
            User.findByIdAndUpdate({ _id }, { status: "Active" })
              .then((response) => {
                res.json({ token, details: { _id, username, photo } });
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

//ROUTE2.2 SIGNOUT
Route.get("/serverside/api/offline", requireLogin, (req, res) => {
  User.findByIdAndUpdate({ _id: req.user._id }, { status: new Date() })
    .then((response) => {
      res.json({ message: response.status });
    })
    .catch((err) => console.log(err));
});

//ROUTE3.1 ALL USERS
Route.get("/serverside/api/alluser", requireLogin, (req, res) => {
  User.find()
    .then((response) => {
      res.json({ users: response });
    })
    .catch((err) => console.log(err));
});
//ROUTE3.2 FETCHING FRIENDS
Route.get("/serverside/api/friends", requireLogin, (req, res) => {
  User.findOne(req.user._id)
    .then((response) => {
      res.json({ user: response });
    })
    .catch((err) => console.log(err));
});

//ROUTE4.1 REQUEST SENT
Route.get("/serverside/api/adduser/:id", requireLogin, (req, res) => {
  const { id } = req.params;
  let time = new Date();
  const re = req.user.friends.filter((i) => i.username === id);
  if (re.length > 0) {
    return res.json({ error: "Already a friend" });
  }
  User.findOne({ username: id })
    .then((response) => {
      const { messages } = response;
      const result = messages.filter((i) => i.username === req.user.username);
      if (result.length > 0) {
        //IF THERE IS MESSAGE BUT NOT FRIEND
        User.findOneAndUpdate(
          { username: id },
          {
            $push: {
              friends: {
                id: req.user._id,
                username: req.user.username,
                photo: req.user.photo,
                state: "request",
                time: time,
              },
            },
          },
          {
            new: true,
          }
        ).exec((err, result) => {
          if (!err) {
            const { _id, username, photo } = result;
            User.findOne({ _id: req.user._id }).then((response) => {
              const { messages } = response;
              const result = messages.filter((i) => i.username === id);
              if (result.length > 0) {
                //IF THERE IS MESSAGE IN MY LIST
                User.findByIdAndUpdate(
                  req.user._id,
                  {
                    $push: {
                      friends: {
                        id: _id,
                        username: username,
                        photo: photo,
                        state: "pending",
                        time: time,
                      },
                    },
                  },
                  {
                    new: true,
                  }
                ).exec((err, result) => {
                  if (result) {
                    const { _id, username } = result;
                    res.json({ message: "Success" });
                  } else {
                    res.json({ error: "error" });
                  }
                });
              } else {
                User.findByIdAndUpdate(
                  req.user._id,
                  {
                    $push: {
                      friends: {
                        id: _id,
                        username: username,
                        photo: photo,
                        state: "pending",
                        time: time,
                      },
                      messages: {
                        id: _id,
                        username: username,
                        photo: photo,
                        message: {
                          id: req.user._id,
                          msg: "Hi ✌",
                          identifier: "text",
                          time: time,
                        },
                        state: "pending",
                        time: time,
                      },
                    },
                  },
                  {
                    new: true,
                  }
                ).exec((err, result) => {
                  if (result) {
                    const { _id, username } = result;
                    res.json({ message: "Success" });
                  } else {
                    res.json({ error: "error" });
                  }
                });
              }
            });
          }
        });
      } else {
        //IF THERE IS NO MESSAGE AND NOT A FRIEND
        User.findOneAndUpdate(
          { username: id },
          {
            $push: {
              friends: {
                id: req.user._id,
                username: req.user.username,
                photo: req.user.photo,
                state: "request",
                time: time,
              },
              messages: {
                id: req.user._id,
                username: req.user.username,
                photo: req.user.photo,
                message: {
                  id: req.user._id,
                  msg: "Hi ✌",
                  identifier: "text",
                  time: time,
                },
                state: "request",
                time: time,
              },
            },
          },
          {
            new: true,
          }
        ).exec((err, result) => {
          if (!err) {
            const { _id, username, photo } = result;
            User.findOne({ _id: req.user._id }).then((response) => {
              const { messages } = response;
              const result = messages.filter((i) => i.username === id);
              if (result.length > 0) {
                //IF THERE IS MESSAGE IN MY LIST
                User.findByIdAndUpdate(
                  req.user._id,
                  {
                    $push: {
                      friends: {
                        id: _id,
                        username: username,
                        photo: photo,
                        state: "pending",
                        time: time,
                      },
                    },
                  },
                  {
                    new: true,
                  }
                ).exec((err, result) => {
                  if (result) {
                    const { _id, username } = result;
                    res.json({ message: "Success" });
                  } else {
                    res.json({ error: "error" });
                  }
                });
              } else {
                User.findByIdAndUpdate(
                  req.user._id,
                  {
                    $push: {
                      friends: {
                        id: _id,
                        username: username,
                        photo: photo,
                        state: "pending",
                        time: time,
                      },
                      messages: {
                        id: _id,
                        username: username,
                        photo: photo,
                        message: {
                          id: req.user._id,
                          msg: "Hi ✌",
                          identifier: "text",
                          time: time,
                        },
                        state: "pending",
                        time: time,
                      },
                    },
                  },
                  {
                    new: true,
                  }
                ).exec((err, result) => {
                  if (result) {
                    const { _id, username } = result;
                    res.json({ message: "Success" });
                  } else {
                    res.json({ error: "error" });
                  }
                });
              }
            });
          }
        });
      }
    })
    .catch((err) => console.log(err));
});
//ROUTE4.2 REQUEST APPROVED
Route.get("/serverside/api/approverequest/:id", requireLogin, (req, res) => {
  const { id } = req.params;
  User.findOneAndUpdate(
    { username: id, "friends.username": req.user.username },
    {
      $set: {
        "friends.$.state": "approved",
      },
    }
  ).exec((error, response) => {
    if (!error) {
      User.findOneAndUpdate(
        { username: id, "messages.username": req.user.username },
        {
          $set: {
            "messages.$.state": "approved",
          },
        }
      ).exec((error, response) => {
        if (!error) {
          User.findOneAndUpdate(
            { username: req.user.username, "friends.username": id },
            {
              $set: {
                "friends.$.state": "approved",
              },
            }
          ).exec((error, response) => {
            if (!error) {
              User.findOneAndUpdate(
                { username: req.user.username, "messages.username": id },
                {
                  $set: {
                    "messages.$.state": "approved",
                  },
                }
              ).exec((error, response) => {
                if (!error) {
                  console.log(response);
                } else {
                  console.log(error);
                }
              });
            } else {
              console.log(error);
            }
          });
        } else {
          console.log(error);
        }
      });
    } else {
      console.log(error);
    }
  });
});
//ROUTE4.3 REQUEST DECLINED
Route.get("/serverside/api/declinerequest/:id", requireLogin, (req, res) => {
  const { id } = req.params;
  User.findOne({ username: id })
    .then((response) => {
      const { messages } = response;
      const result = messages.filter(
        (i) => i.username === req.user.username && i.state === "approved"
      );
      if (result.length > 0) {
        User.findOneAndUpdate(
          { username: id, "friends.username": req.user.username },
          {
            $pull: {
              friends: { username: req.user.username },
            },
          }
        ).exec((error, response) => {
          if (!error) {
            User.findOneAndUpdate(
              { username: req.user.username, "friends.username": id },
              {
                $pull: {
                  friends: { username: id },
                },
              }
            ).exec((error, response) => {
              if (!error) {
                res.json({ message: "Success" });
              } else {
                console.log(error);
              }
            });
          } else {
            console.log(error);
          }
        });
      } else {
        User.findOneAndUpdate(
          { username: id, "friends.username": req.user.username },
          {
            $pull: {
              friends: { username: req.user.username },
            },
          }
        ).exec((error, response) => {
          if (!error) {
            User.findOneAndUpdate(
              { username: id, "messages.username": req.user.username },
              {
                $pull: {
                  messages: { username: req.user.username },
                },
              }
            ).exec((error, response) => {
              if (!error) {
                User.findOneAndUpdate(
                  { username: req.user.username, "friends.username": id },
                  {
                    $pull: {
                      friends: { username: id },
                    },
                  }
                ).exec((error, response) => {
                  if (!error) {
                    User.findOneAndUpdate(
                      { username: req.user.username, "messages.username": id },
                      {
                        $pull: {
                          messages: { username: id },
                        },
                      }
                    ).exec((error, response) => {
                      if (!error) {
                        res.json({ message: "Success" });
                      } else {
                        console.log(error);
                      }
                    });
                  } else {
                    console.log(error);
                  }
                });
              } else {
                console.log(error);
              }
            });
          } else {
            console.log(error);
          }
        });
      }
    })
    .catch((err) => console.log(err));
});
//ROUTE4.4 REQUEST UNFRIEND
Route.get("/serverside/api/unfriend/:id", requireLogin, (req, res) => {
  const { id } = req.params;
  User.findOneAndUpdate(
    { username: id, "friends.username": req.user.username },
    {
      $pull: {
        friends: { username: req.user.username },
      },
    }
  ).exec((error, response) => {
    if (!error) {
      const { messages } = response;
      const result = messages.filter(
        (i) => i.username === req.user.username && i.message.length <= 0
      );
      if (result.length > 0) {
        User.findOneAndUpdate(
          { username: id, "messages.username": req.user.username },
          {
            $pull: {
              messages: { username: req.user.username },
            },
          }
        ).exec((error, response) => {
          if (!error) {
            User.findOneAndUpdate(
              { username: req.user.username, "friends.username": id },
              {
                $pull: {
                  friends: { username: id },
                },
              }
            ).exec((error, response) => {
              if (!error) {
                const { messages } = response;
                const result = messages.filter(
                  (i) => i.username === id && i.message.length <= 0
                );
                if (result.length > 0) {
                  User.findOneAndUpdate(
                    { username: req.user.username, "messages.username": id },
                    {
                      $pull: {
                        messages: { username: id },
                      },
                    }
                  ).exec((error, response) => {
                    if (!error) {
                      res.json({ message: "Success" });
                    } else {
                      console.log(error);
                    }
                  });
                } else {
                  res.json({ message: "Success" });
                }
              } else {
                console.log(error);
              }
            });
          }
        });
      } else {
        User.findOneAndUpdate(
          { username: req.user.username, "friends.username": id },
          {
            $pull: {
              friends: { username: id },
            },
          }
        ).exec((error, response) => {
          if (!error) {
            const { messages } = response;
            const result = messages.filter(
              (i) => i.username === id && i.message.length <= 0
            );
            if (result.length > 0) {
              User.findOneAndUpdate(
                { username: req.user.username, "messages.username": id },
                {
                  $pull: {
                    messages: { username: id },
                  },
                }
              ).exec((error, response) => {
                if (!error) {
                  res.json({ message: "Success" });
                } else {
                  console.log(error);
                }
              });
            } else {
              res.json({ message: "Success" });
            }
          } else {
            console.log(error);
          }
        });
      }
    } else {
      console.log(error);
    }
  });
});
//ROUTE4.5 DELETE MESSAE
Route.get("/serverside/api/deletemessage/:id", requireLogin, (req, res) => {
  const { id } = req.params;
  User.findOneAndUpdate(
    { username: req.user.username, "messages.username": id },
    {
      $set: {
        "messages.$.message": [],
      },
    }
  ).exec((error, response) => {
    if (!error) {
      res.json({ message: "Deleted Success" });
    } else {
      console.log(error);
    }
  });
});

//ROUTE5 UPDATING PROFILE PHOTO
Route.post(
  "/serverside/api/updateprofile",
  upload.single("profileImg"),
  requireLogin,
  (req, res) => {
    User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          photo:
            req.file.fieldname +
            "-" +
            req.file.originalname.split(".")[0] +
            "." +
            req.file.originalname.split(".")[1],
        },
      }
    )
      .then((response) => {
        const { _id, username, photo } = response;
        res.json({ details: { _id, username, photo } });
      })
      .catch((err) => console.log(err));
  }
);

//ROUTE6.1 SENDING MESSAGE
Route.post("/serverside/api/sendmessage", requireLogin, (req, res) => {
  const { message, username, id } = req.body;
  let time = new Date();
  User.findOneAndUpdate(
    { username: username, "messages.username": req.user.username },
    {
      $push: {
        "messages.$.message": {
          id: req.user._id,
          msg: message,
          identifier: "text",
          time: time,
        },
      },
    },
    {
      new: true,
    }
  ).exec((error, result) => {
    if (!error) {
      User.findOneAndUpdate(
        { username: req.user.username, "messages.username": username },
        {
          $push: {
            "messages.$.message": {
              id: req.user._id,
              msg: message,
              identifier: "text",
              time: time,
            },
          },
        },
        {
          new: true,
        }
      ).exec((error, result) => {
        if (!error) {
          res.json({ message: "Success" });
        }
      });
    }
  });
});
//ROUTE6.2 SENDING IMAGES
Route.post(
  "/serverside/api/sendimage/:username",
  upload1.single("messageImage"),
  requireLogin,
  (req, res) => {
    const { username } = req.params;
    let time = new Date();
    User.findOneAndUpdate(
      { username: username, "messages.username": req.user.username },
      {
        $push: {
          "messages.$.message": {
            id: req.user._id,
            msg:
              req.file.fieldname +
              "-" +
              req.file.originalname.split(".")[0] +
              "." +
              req.file.originalname.split(".")[1],
            identifier: "photo",
            time: time,
          },
        },
      },
      {
        new: true,
      }
    ).exec((error, result) => {
      if (!error) {
        User.findOneAndUpdate(
          { username: req.user.username, "messages.username": username },
          {
            $push: {
              "messages.$.message": {
                id: req.user._id,
                msg:
                  req.file.fieldname +
                  "-" +
                  req.file.originalname.split(".")[0] +
                  "." +
                  req.file.originalname.split(".")[1],
                identifier: "photo",
                time: time,
              },
            },
          },
          {
            new: true,
          }
        ).exec((error, result) => {
          if (!error) {
            res.json({ message: "Success" });
          }
        });
      }
    });
  }
);
//ROUTE6.3 SENDING FILES
Route.post(
  "/serverside/api/sendfile/:username",
  upload2.single("messageFile"),
  requireLogin,
  (req, res) => {
    const { username } = req.params;
    let time = new Date();
    User.findOneAndUpdate(
      { username: username, "messages.username": req.user.username },
      {
        $push: {
          "messages.$.message": {
            id: req.user._id,
            msg:
              req.file.fieldname +
              "-" +
              req.file.originalname.split(".")[0] +
              "." +
              req.file.originalname.split(".")[1],
            identifier: "file",
            time: time,
          },
        },
      },
      {
        new: true,
      }
    ).exec((error, result) => {
      if (!error) {
        User.findOneAndUpdate(
          { username: req.user.username, "messages.username": username },
          {
            $push: {
              "messages.$.message": {
                id: req.user._id,
                msg:
                  req.file.fieldname +
                  "-" +
                  req.file.originalname.split(".")[0] +
                  "." +
                  req.file.originalname.split(".")[1],
                identifier: "file",
                time: time,
              },
            },
          },
          {
            new: true,
          }
        ).exec((error, result) => {
          if (!error) {
            res.json({ message: "Success" });
          }
        });
      }
    });
  }
);
module.exports = Route;
