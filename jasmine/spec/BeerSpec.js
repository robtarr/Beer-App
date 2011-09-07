describe('Beer model', function() {

  beforeEach(function() {
    this.beer = new app.BeerModel();
  });

  describe('when instantiated', function() {
    
    it('should exhibit attributes', function() {
      expect(this.beer.get('name')).toEqual('Beer Name');
      expect(this.beer.get('type')).toEqual('Beer Type');
      expect(this.beer.get('brewery')).toEqual('Brewery');
    });
    
  });
  
});

describe("Beer View", function() {
  
  beforeEach(function() {
    this.beer = new app.BeerModel();
    this.view = new app.BeerView({
      model: this.beer
    });
  });
  
  describe("when instantiated", function() {
    
    it("should create a list element", function() {
      expect(this.view.el.nodeName).toEqual("LI");
    });
    
  });
  
});