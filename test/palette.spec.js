'use strict';

describe('angular-bootstrap-palette', function() {
	var $scope, injected = {};
	
	// @see $https://docs.angularjs.org/api/ngMock/service/$componentController
	// cannot use $componentController since we need $observe in $attrs
	// we need to extract those from $compile instead of use as locals
	angular.module('locals', []).controller('controller',
		['$attrs', function($attrs) {
			injected.$attrs = $attrs;
		}]
	);
	
	beforeEach(module('locals', 'angular.bootstrap.palette'));
	
	beforeEach(inject(function($rootScope, $compile) {
		// invoke dummy controller to get $attrs
		$compile('<span ng-controller="controller">')($rootScope);
	}));
	
	beforeEach(inject(function($rootScope) {
		$scope = $rootScope.$new();

		$scope.model = {};
		$scope.selected = [];
		
		$scope.options = [
		  { name: 'Adam',      age: 12 },
		  { name: 'Amalie',    age: 12 },
		  { name: 'Estefanía', age: 21 },
		  { name: 'Adrian',    age: 21 },
		  { name: 'Wladimir',  age: 30 },
		  { name: 'Samantha',  age: 30 },
		  { name: 'Ricardo',   age: 35 },
		  { name: 'Nicole',    age: 43 },
		  { name: 'Natasha',   age: 54 }
		];
	}));
	
	// test controller
	describe('controller', function() {
		var ctrl;
		
		beforeEach(inject(function($componentController) {
			
			var locals = {};
			locals.$scope = $scope;
			locals.$attrs = injected.$attrs;
			locals.length = $scope.options.length;
			
			var bindings = {};
			bindings.model = $scope.model;
			bindings.options = 'person as person.name for person in options';
			bindings.selected = 'person as person.name for person in selected';
			
			ctrl = $componentController('palette', locals, bindings);
			ctrl.$onInit();
		}));
		
		it('initial component state', function() {
			expect(ctrl.model).toBeDefined();
			expect(ctrl.selsource.length).toEqual(0);
			expect(ctrl.optsource.length).toEqual($scope.options.length);
		});
		
		if('move options to the right', function() {
			ctrl.optmodel = [ { name: 'Ricardo',   age: 35 } ];
			ctrl.onMoveRight();
			
			expect(ctrl.model.length).toEqual(1);
			expect(ctrl.optmodel.length).toEqual(0);
			expect(ctrl.selsource.length).toEqual(1);
			expect(ctrl.optsource.length).toEqual($scope.options.length - 1);
		});
		
		it('watch changes in options collection', function() {
			ctrl.optsource = [ { name: 'Ricardo',   age: 35 } ];
			
			expect(ctrl.optsource.length).toEqual(1);
		});
	});
	
	// TODO test user interactions
});