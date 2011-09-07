var app = app || {};

$(function(){
  
  // Favorite Model
  // ----------
  app.FavoriteModel = Backbone.Model.extend({

    // Default attributes for favorites.
    defaults: function() {
      return {
        beer_id: "",
        order: app.Favorites.nextOrder(),
        rating: 1
      };
    },

    // Assign defaults to new favorites
    initialize: function() {
      for (var key in this.defaults) {
        if (!this.get(key)) {
          this.set({key: this.defaults[key]});
        }
      }
    },

    // Remove this favorite and delete its view.
    clear: function() {
      this.destroy();
      this.view.remove();
    }
  });

  // Favorite Collection
  // ---------------
  app.FavoritesCollection = Backbone.Collection.extend({
    
    // Assign a model to this collection
    model: app.FavoriteModel,

    // Create a store for our favorite beers
    localStorage: new Store('favoritebeers'),

    // Assign an order to this favorite (last + 1)
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    }
  });

  // Instantiate the FavoritesCollection
  app.Favorites = new app.FavoritesCollection();

  // Favorite Item View
  // --------------
  app.FavoriteView = Backbone.View.extend({

    // Root element for this view
    tagName:  "li",

    // Compiled Handlebars template
    template: Handlebars.compile($('#my-beers-tpl').html()),

    // Setup event handlers for dealing with favorites
    events: {
      "click .rating"  : "rate",
      "mouseup .rating"  : "rate",
      "click a.delete" : "clear"
    },

    // Setup some variables to be used by the favorites view
    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.view = this;
    },

    // Render this favorite to the DOM
    render: function() {
      var favorite = this.model.get('beer_id'),
          data = app.Beers.get(favorite).toJSON();

      data.rating = this.model.get('rating');
      $(this.el).html(this.template(data));
      return this;
    },

    // Remove favorite from the DOM
    remove: function() {
      $(this.el).remove();
    },

    // Remove favorite and destroy it's model
    clear: function() {
      this.model.clear();
    },
    
    // Update the rating for this favorite
    rate: function() {
      this.model.save({rating: $(this.el).find('.rating').val()});
      this.render();
    }
  });
  
  var subscriptions = {
    
    // Create a new favorite
    'beer:favorite': function(id) {
      app.Favorites.create({
        beer_id: id
      });    
    }
  };

  $.each(subscriptions, function(topic, fn) {
      $.subscribe(topic, fn);
  });
  
  // Handlebars helper to display the right pint glass
  Handlebars.registerHelper('list', function(count) {
    var list  = "<ul class=\"pint-glasses\">";

    for (var i = 0; i < count; i++) {
      list += '<li><img src="i/pint-glass.png"></li>';
    }
    for (i = 5 - count; i > 0; i--) {
      list += '<li><img src="i/empty-pint-glass.png"></li>';
    }

    return list + "</ul>";
  });
});
