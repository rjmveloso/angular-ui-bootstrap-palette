'use strict';

describe('angular-bootstrap-palette', function() {
	var $scope, $compile, injected = {};
	//var $rscope;
	var options_size;
	
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
	
	beforeEach(inject(function($rootScope, $compile) {
		$scope = $rootScope;
//		$scope = $rscope.$new();
		$compile = $compile;

		$scope.options = [
		  { id: 1, name: 'Adam',      age: 12 },
		  { id: 2, name: 'Amalie',    age: 12 },
		  { id: 3, name: 'Adrian',    age: 21 },
		  { id: 4, name: 'Estefanía', age: 21 },
		  { id: 5, name: 'Samantha',  age: 30 },
		  { id: 6, name: 'Ricardo',   age: 35 },
		  { id: 7, name: 'Nicole',    age: 43 },
		  { id: 8, name: 'Natasha',   age: 54 }
		];

		$scope.selected = [];
		
		options_size = $scope.options.length;
		
		$scope.encoder = 'person as person.name for person in $palette track by person.id';
	}));
	
	function changes(name, value) {
		var changes = {};
		changes[name] = value;
		return changes;
	}
	
	// test controller
	describe('controller', function() {
		var ctrl;
		
		beforeEach(inject(function($componentController) {
			var locals = {};
			// the isolated scope
			locals.$scope = $scope.$new();
			locals.$attrs = injected.$attrs;
			
			var bindings = {};
			bindings.encoder = $scope.encoder;
			bindings.options = $scope.options;
			bindings.selected = $scope.selected;
			
			ctrl = $componentController('palette', locals, bindings);
			ctrl.$onChanges(changes('options', $scope.options));
			ctrl.$onInit();
		}));
		
		it('initial component state', function() {
			expect(ctrl.optmodel).toBeDefined();
			expect(ctrl.selmodel).toBeDefined();
			expect(ctrl.optmodel.length).toEqual(0);
			expect(ctrl.selmodel.length).toEqual(0);
			expect(ctrl.optsource.length).toEqual(options_size);
		});

		it('move options to the right', function() {
			ctrl.optmodel = [ 7 ];
			ctrl.onMoveRight();

			expect($scope.selected.length).toEqual(1);
			expect(ctrl.optmodel.length).toEqual(0);
			expect(ctrl.optsource.length).toEqual(options_size - 1);
		});

		it('watch changes in options collection', function() {
			ctrl.$onChanges(changes('options', $scope.options.pop()));
			expect(ctrl.optsource.length).toEqual(options_size - 1);
		});
	});

	// test component
	describe('palette', function() {
		var $compile;
		
		beforeEach(inject(function($rootScope, _$compile_) {
			$compile = _$compile_;
		}));
		
		function compile(template) {
			var element = angular.element(template);
			var compile = $compile(element)($scope);
			$scope.$digest();
			return compile;
		}
		
		function click(button) {
			button.triggerHandler('click');
		}
		
		function change(select) {
			select.triggerHandler('change');
		}
		
		// native solution. jquery not required.
		function select(select, values) {
			angular.forEach(select[0].options, function(option) {
				if(values.indexOf(parseInt(option.value)) != -1) {
					option.selected = true;
				}
			});
		}
		
		function moveRight(palette, values) {
			select(palette.find('select').eq(0), values);
			change(palette.find('select').eq(0));
			click(palette.find('button').eq(0));
		}
		
		function moveLeft(palette, values) {
			select(palette.find('select').eq(1), values);
			change(palette.find('select').eq(1));
			click(palette.find('button').eq(1));
		}
		
		it('should format the model correctly', function() {
			var palette = compile(
				'<palette options="options" selected="selected" encoder="encoder">\
				 </palette>');
			
		    moveRight(palette, [1, 7]);
		    
		    expect($scope.selected.length).toBe(2);
		});
	});
	
});