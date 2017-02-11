/**
 * angular-bootstrap-palette - AngularJS Bootstrap palette
 * @version v0.1.0
 * @link https://github.com/rjmveloso/angular-ui-bootstrap-palette
 * @license MIT
 */
(function() {
	'use strict';

	var palette = angular.module('angular.bootstrap.palette', [])
	
	palette.factory('paletteParser', ['$parse', function ($parse) {
		// @see https://github.com/angular/angular.js/blob/master/src/ng/directive/ngOptions.js#L236
		var OPTIONS_PATTERN = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([$\w][$\w]*)|(?:\(\s*([$\w][$\w]*)\s*,\s*([$\w][$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
	
		return function(expression) {
			var match = expression.match(OPTIONS_PATTERN);
			return $parse(match[8]);
		}
	}]);
			
	palette.component('palette', {
		bindings: {
			model: '=', // Is this needed?? selected expression should refer the model
			options: '@',
			selected: '@',
			optionsLabel: '<?',
			selectedLabel: '<?',
			//sort: '&?' // A function that defines a sort order on move
		},
		transclude: {
			'options-header': '?optionsHeader',
			'selected-header': '?selectedHeader'
		},
		templateUrl: 'palette.html',
		controller: PaletteController,
		controllerAs: '$palette'
	});

	PaletteController.$inject = [ '$scope', '$attrs', 'paletteParser' ];
	function PaletteController($scope, $attrs, paletteParser) {
		
		var config = {};
		
		$attrs.$observe('disabled', function(value) {
			this.disabled = value !== undefined ? value : false;
		});
		
		$attrs.$observe('required', function(value) {
			this.required = value !== undefined ? value : false;
		});
		
		this.$onInit = function() {
			this.optid = $scope.$id;
			this.selid = $attrs['palette-id'] || $scope.$id;
		
			// attribute: no need for interpolation {{preserve}}
			config.preserve = $scope.$eval($attrs.preserve);
			//config.sort = this.sort;
		    
		    var optsource = paletteParser(this.options);
		    var selsource = paletteParser(this.selected);
		    
		    this.optmodel = this.selmodel = [];
		    this.optsource = optsource($scope);
		    this.selsource = selsource($scope);
		    
		    watchable(optsource);
		    watchable(selsource);
		};
		
		this.onMoveLeft = function() {
			var source = this.selsource;
			var target = this.optsource;
			move(this.selmodel, source, target);
			rearrange(this.selmodel, this.optmodel, target);
			this.model = source;
		};
		
		this.onMoveRight = function() {
		    var source = this.optsource;
			var target = this.selsource;
			move(this.optmodel, source, target);
			rearrange(this.optmodel, this.selmodel, target);
			this.model = target;
		};
		
		function move(selected, source, target) {
			angular.forEach(selected, function(item) {
				var idx = source.indexOf(item);
				source.splice(idx, 1);
				target.push(item);
			});
		}
		
		function rearrange(selected, model, target) {
			model = config.preserve === true ? selected : [];
			selected = [];
		}
		
		function watchable(source) {
			var watch = function() {
				return source($scope.$parent);
			};
			
			$scope.$watchCollection(watch, function(items) {
		        // $scope is the component isolated scope
		        if (items === undefined || items === null) {
		          // If the user specifies undefined or null => reset the collection
		          // Special case: items can be undefined if the user did not initialized the collection on the scope
		          // i.e $scope.addresses = [] is missing
		        	source.assign($scope, []);
		        } else {
		        	source.assign($scope, items);
		        }
		    });
		}
	}
})();
angular.module('angular.bootstrap.palette').run(['$templateCache', function($templateCache) {$templateCache.put('template/palette.html','<div class="palette"><div class="col-md-4 palette-options"><div class="form-group"><div ng-transclude="options-header"><label for="{{::$ctrl.optid}}" class="control-label">{{$ctrl.optionsLabel}}</label></div><select id="{{::$ctrl.optid}}" multiple="" ng-model="$ctrl.optmodel" ng-options="{{$ctrl.options}}" \\="" ng-disabled="$ctrl.disabled" ng-required="$ctrl.required" class="form-control"></select></div></div><div class="col-md-2 text-center palette-controls"><button type="button" ng-disabled="$ctrl.disabled" ng-click="$ctrl.onMoveRight()" class="btn btn-primary"><i class="fa fa-chevron-right" aria-hidden="true"></i></button> <button type="button" ng-disabled="$ctrl.disabled" ng-click="$ctrl.onMoveLeft()" class="btn btn-danger"><i class="fa fa-chevron-left" aria-hidden="true"></i></button></div><div class="col-md-4 palette-selected"><div class="form-group"><div ng-transclude="selected-header"><label for="{{::$ctrl.selid}}" class="control-label">{{$ctrl.selectedLabel}}</label></div><select id="{{::$ctrl.selid}}" multiple="" ng-model="$ctrl.selmodel" ng-options="{{$ctrl.selected}}" \\="" ng-disabled="$ctrl.disabled" ng-required="$ctrl.required" class="form-control"></select></div></div></div>');}]);