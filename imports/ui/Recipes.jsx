import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Recipes } from '../api/recipes.js';

// export const Users = new Mongo.Collection('users');

// Task component - represents a single todo item
export default class Recipe extends Component {
  
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    // Recipes.update(this.props.recipe._id, {
    //   $set: { checked: !this.props.recipe.checked },
    // });
    Meteor.call('recipes.setChecked', this.props.recipe._id, !this.props.recipe.checked);
  }
 
  deleteThisRecipe() {
    // Recipes.remove(this.props.recipe._id);
  	Meteor.call('recipes.remove', this.props.recipe._id);
  }

  togglePrivate() {
    Meteor.call('recipes.setPrivate', this.props.recipe._id, ! this.props.recipe.private);
  }

  getOwner(id) {
    Meteor.call('recipes.ownBy',id);
  }

  render() {
  	// Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const recipeClassName = this.props.recipe.checked ? 'checked' : '';
    const isLogged = Meteor.user();
    var ownerID = this.props.recipe.owner;
    console.log(this.props.recipe);
    if( isLogged ){
    	
      // var owner = Meteor.users.findOne({ "_id":ownerID });
      // var ownBy = Meteor.call('recipes.getOwner', this.props.recipe.owner);
      // console.log(ownBy);
    }
    return (
      	<li className={recipeClassName}>
        	<button className="delete" onClick={this.deleteThisRecipe.bind(this)}>
          	&times;
        	</button>
 
	        <input
	          type="checkbox"
	          readOnly
	          checked={this.props.recipe.checked}
	          onClick={this.toggleChecked.bind(this)}
	        />
            
           { this.props.showPrivateButton ? (
              <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
                { this.props.recipe.private ? 'Private' : 'Public' }
              </button>
            ) : ''}

        	<span className="text">
          {isLogged ? <strong>{ this.props.recipe.username }'s</strong>: '' }  {this.props.recipe.name}
        </span>
      	</li>
    );
  }
}
 
Recipe.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  recipe: PropTypes.object.isRequired,
  showPrivateButton: PropTypes.bool.isRequired,
};