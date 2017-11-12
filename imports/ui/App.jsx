import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types'; 

import { Recipes } from '../api/recipes.js';
import Recipe from './Recipes.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
 


// App component - represents the whole app
export class App extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: true,
    };
  }

  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const name = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call('recipes.insert', name);

    // Recipes.insert({
    //   name,
    //   createdAt: new Date(), // current time
    //   owner: Meteor.userId(),           // _id of logged in user
    //   username: Meteor.user().username,  // username of logged in user
    // });
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
  
  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderRecipe() {
    let filteredRecipe = this.props.recipes;
    if (this.state.hideCompleted) {
      filteredRecipe = filteredRecipe.filter(recipe => !recipe.checked);
    }


    // return filteredRecipe.map((recipe) => (
    //   <Recipe key={recipe._id} recipe={recipe} />
    // ));

    return filteredRecipe.map((recipe) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = recipe.owner === currentUserId;
 
      return (
        <Recipe
          key={recipe._id}
          recipe={recipe}
          showPrivateButton={showPrivateButton}
        />
      );
    });

  }
 
  render() {
    return (
      <div className="container">
        <header>
           <h1>Recipe App ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Unpublished Recipe
          </label>

          <AccountsUIWrapper />

          { this.props.currentUser ?
            <form className="new-recipe" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new recipes"
              />
            </form> : ''
          }

        </header>
        
        <ul>
          {this.renderRecipe()}
        </ul>
      </div>
    );
  }
}


App.propTypes = {
  recipes: PropTypes.array.isRequired,
};
 
export default createContainer(() => {
  Meteor.subscribe('recipes');

  return {
    recipes: Recipes.find({}, { sort: { createdAt: -1 } } ).fetch(),
    incompleteCount: Recipes.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);