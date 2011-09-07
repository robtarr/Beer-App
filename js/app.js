var app = app || {};

$(function(){
  
  // The Application
  // ---------------
  app.AppView = Backbone.View.extend({

    // This is the root element for the app 
    el: $("#beerapp"),

    // Setup event handlers for creating beers
    events: {
      "keypress #new-beer, #new-brewery" : "createOnEnter",
      "click #add [type=submit]"         : "create",
      "click a.add-beer, .close"         : "openAdd"
    },

    // Setup some variables to be used by the main app view
    initialize: function() {
      this.beer_name = this.$("#new-beer");
      this.brewery = this.$("#new-brewery");
      
      app.Beers.bind('add',   this.addBeer, this);
      app.Beers.bind('reset', this.addAllBeers, this);
      app.Beers.fetch();
      
      app.Favorites.bind('add',   this.addFavorite, this);
      app.Favorites.bind('reset', this.addAllFavorites, this);      
      app.Favorites.fetch();
    },

    // Create new beer object and add to page
    addBeer: function(beer) {
      var view = new app.BeerView({model: beer});
      this.$("#beer-list").append(view.render().el);
    },

    // Go through all of the beers in the list, and render them to the page
    addAllBeers: function() {
      app.Beers.each(this.addBeer);
    },
    
    // Add favorite to the list of favorite beers
    addFavorite: function(favorite) {
      var view = new app.FavoriteView({model: favorite});
      this.$("#my-beers").append(view.render().el);
    },

    // Populate the favorites list
    addAllFavorites: function() {
      app.Favorites.each(this.addFavorite);
    },
    
    // Create the attributes for a new beer
    newAttributes: function() {
      return {
        name: this.beer_name.val(),
        brewery: this.brewery.val(),
        order: app.Beers.nextOrder()
      };
    },
    
    // Create a new beer item and clear out the fields
    create: function () {
      app.Beers.create(this.newAttributes());
      this.beer_name.val('');
      this.brewery.val('');
    },

    // If the keypress was 'enter/return', create 
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
            
      this.create();
    },

    // Open the form to add a new beer to the list
    openAdd: function(e) {
      e.preventDefault();
      $('#add').slideToggle();
      $('a.add-beer').toggle();
    }
  });

  // Start the app
  app.AppView = new app.AppView();
});
