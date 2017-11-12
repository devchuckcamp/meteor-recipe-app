import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Recipes = new Mongo.Collection('recipes');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('recipes', function recipesPublication() {
    // return Recipes.find();
    return Recipes.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'recipes.insert'(name) {
    check(name, String);
    
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Recipes.insert({
      name,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
    toastr.success('Recipe <b style="color:red;">'+name+'</b> added');
  },
  'recipes.remove'(recipeId) {
    check(recipeId, String);
    console.log('ID:'+recipeId);

    var recipeInfo = Recipes.findOne(recipeId);
    var recipeOwner = recipeInfo.owner;
    
    if (recipeOwner == Meteor.userId()){
      console.log('Can Delete');
      Recipes.remove(recipeId);
      toastr.success('Recipe <b style="color:red;">'+recipeInfo.name+'</b> has been deleted.', 'Success');
      
    } else {
      toastr.warning('You\'re not allowed to remove <b style="color:red;">'+recipeInfo.name+'</b> because you\'re not the owner.', 'Permission');
      console.log('Not allowed to delete');
    }
    //Recipes.remove(recipeId);
  },
  'recipes.setChecked'(recipeId, setChecked) {
    check(recipeId, String);
    check(setChecked, Boolean);
 
    Recipes.update(recipeId, { $set: { checked: setChecked } });
  },
  'recipes.setPrivate'(recipeId, setToPrivate) {
    check(recipeId, String);
    check(setToPrivate, Boolean);
 
    const recipes = Recipes.findOne(recipeId);
 
    // Make sure only the recipes owner can make a recipes private
    if (recipes.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Recipes.update(recipeId, { $set: { private: setToPrivate } });
  },
  'recipes.ownBy'(recipeID) {
    check(recipeID, String);

    var rcp = Recipes.findOne({_id:recipeID});
    var rowner = Meteor.users.findOne(rcp.owner);
 
    // Make sure only the recipes owner can make a recipes private
    // if (recipes.owner !== Meteor.userId()) {
    //   throw new Meteor.Error('not-authorized');
    // }
    console.log(rowner);
    return rowner;
    //Recipes.update(recipeId, { $set: { private: setToPrivate } });
  },

});