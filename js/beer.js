var app = app || {};

$(function(){

  // Beer Model
  // ----------
  app.BeerModel = Backbone.Model.extend({

    // Default attributes for the beer.
    defaults: {
      name: "Beer Name",
      type: "Beer Type",
      brewery: "Brewery"
    },

    // Assign defaults to new beers
    initialize: function() {
      for (var key in this.defaults) {
        if (!this.get(key)) {
          this.set({key: this.defaults[key]});
        }
      }
    },

    // Remove this Beer and delete its view.
    clear: function() {
      this.destroy();
      this.view.remove();
    }

  });

  // Beer Collection
  // ---------------
  app.BeerCollection = Backbone.Collection.extend({
    
    // Assign a model to this collection
    model: app.BeerModel,

    // Create a store for our beer list
    localStorage: new Store('beers'),

    // Assign an order to this favorite (last + 1)    
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    }
  });
  
  // Instantiate the BeerCollection
  app.Beers = new app.BeerCollection();
 
  // Beer Item View
  // --------------
  app.BeerView = Backbone.View.extend({

    // Root element for this view
    tagName:  "li",

    // Compiled Handlebars template
    template: Handlebars.compile($('#beer-list-tpl').html()),

    // Setup event handlers for dealing with beer list
    events: {
      "dblclick span.name" : "edit",
      "keypress span.name" : "updateOnEnter",
      "click .favorite"    : "favorite",
      "click a.delete"     : "clear"
    },

    // Setup some variables to be used by the beer view
    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.view = this;
    },

    // Render this favorite to the DOM
    render: function() {
      var name = this.model.get('name'),
          brewery = this.model.get('brewery');
          
      $(this.el).html(this.template(this.model.toJSON()));
      this.$('.name').text(name);
      this.$('.brewery').text(brewery);
      return this;
    },
    
    // Remove beer from the DOM
    remove: function() {
      $(this.el).remove();
    },

    // Remove beer and destroy it's model
    clear: function() {
      this.model.clear();
    },
        
    // TODO
    edit: function() {
      $(this.el).draggable('disable');
      this.el.contentEditable = true;
    },

    // Save & close
    close: function() {
      this.model.save({name: $(this.el).find('.name').text()});
      $(this.el).draggable('enable');
      this.el.contentEditable = false;
    },
    
    // Update on keypress == 'enter/return'
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },
    
    // Add this beer to the favorites collection
    favorite: function() {
      $.publish('beer:favorite', [this.model.get('id')]);
    }
  });
});