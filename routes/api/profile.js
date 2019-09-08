const express = require("express");
const router = express.Router();
const passport = require("passport");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

/**
 * @route get api/profile/test
 * @desc Test profile route
 * @access Public
 */
router.get("/test", (req, res) => {
  res.json({ msg: "All good for profile" });
});

/**
 * @route get api/profile/
 * @desc Get current user profile
 * @access Private
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({
      user: req.user.id
    })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

/**
 * @route get api/profile/
 * @desc POST Create or edit user profile
 * @access Private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Validation
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubUsername)
      profileFields.githubUsername = req.body.githubUsername;

    //Skills - Split into array
    if (typeof req.body.skills !== undefined)
      profileFields.skills = req.body.skills.split(",");

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;

    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          {
            user: req.user.id
          },
          {
            $set: profileFields
          },
          {
            new: true
          }
        ).then(profile => res.json(profile));
      } else {
        // Create
        // Check if handle exists
        Profile.findOne({
          handle: profileFields.handle
        }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            return res.status(400).json(errors);
          }
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

/**
 * @route get api/profile/handle/:handle
 * @desc Get Profile by handle
 * @access Public
 */
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({
    handle: req.params.handle
  })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(400).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

/**
 * @route get api/profile/user/:id
 * @desc Get Profile by user id
 * @access Public
 */
router.get("/user/:id", (req, res) => {
  const errors = {};
  Profile.findOne({
    user: req.params.id
  })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(400).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

/**
 * @route get api/profile/all
 * @desc Get All Profiles
 * @access Public
 */
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: "There are no profiles" }));
});

/**
 * @route post api/profile/experience
 * @desc post Add User Experience
 * @access Private
 */
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({
      user: req.user.id
    })
      .then(profile => {
        const newExperience = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };
        // Add to array
        profile.experience.unshift(newExperience);
        return profile.save();
      })
      .then(profile => res.json(profile))
        .catch(err => res.status(400).json(err));
  }
);

/**
 * @route post api/profile/education
 * @desc post Add User education
 * @access Private
 */
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({
      user: req.user.id
    })
      .then(profile => {
        const newEducation = {
          school: req.body.school,
          degree: req.body.degree,
          fieldOfStudy: req.body.fieldOfStudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };
        // Add to array
        profile.education.unshift(newEducation);
        return profile.save();
      })
      .then(profile => res.json(profile));
  }
);

/**
 * @route delete api/profile/experience/:id
 * @desc DELETE Delete experience from user profile
 * @access Private
 */
router.delete(
  "/experience/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    })
      .then(profile => {
        profile.experience = profile.experience.filter(
          exp => exp.id !== req.params.id
        );
        return profile.save();
      })
      .then(profile => res.json(profile))
      .catch(err => res.status(404).send(err));
  }
);

/**
 * @route delete api/profile/education/:id
 * @desc DELETE Delete education from user profile
 * @access Private
 */
router.delete(
  "/education/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    })
      .then(profile => {
        profile.education = profile.education.filter(
          exp => exp.id !== req.params.id
        );
        return profile.save();
      })
      .then(profile => res.json(profile))
      .catch(err => res.status(404).send(err));
  }
);

/**
 * @route delete api/profile/
 * @desc Delete user and profile
 * @access Private
 */
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({
      user: req.user.id
    })
      .then(() => {
        return User.findOneAndRemove({
          _id: req.user.id
        });
      })
      .then(() => res.json({ success: true }))
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
