/**
 * angular-bootstrap-palette - AngularJS Bootstrap palette
 * @version v0.1.0
 * @link https://github.com/rjmveloso/angular-ui-bootstrap-palette
 * @license MIT
 */
(function() {
	'use strict';

	var palette = angular.module('angular.bootstrap.palette', []);

	palette.component('palette', {
		bindings : {
			encoder : '<',
			//encoder: '&?', // Can use a callback function for each entry
			options : '<',
			selected : '=',
			optionsLabel : '<?',
			selectedLabel : '<?',
		//sortable: '&?' // A function that defines a sort order on move
		},
		transclude : {
			'options-header' : '?optionsHeader',
			'selected-header' : '?selectedHeader'
		},
		templateUrl : 'template/palette.html',
		controller : PaletteController,
		controllerAs : '$palette'
	});

	function configurer($palette, $attrs) {
		function _eval(value) {
			return value !== undefined ? value : false;
		}

		return function observe(property) {
			$attrs.$observe(property, function(value) {
				$palette[property] = _eval(value);
			});
		};
	}

	PaletteController.$inject = [ '$scope', '$attrs' ];
	function PaletteController($scope, $attrs) {
		var $palette = this;

		var config = {
			preserve : true
		};

		this.$onInit = function() {
			this.optid = $scope.$id;
			this.selid = $attrs['palette-id'] || $scope.$id;

			configure();

			this.optmodel = this.selmodel = [];

			this.optencoder = this.encoder.replace('$palette', '$palette.optsource');
			this.selencoder = this.encoder.replace('$palette', '$palette.selected');
		};

		function configure() {
			function _eval(value) {
				return value !== undefined ? value : false;
			}

			$attrs.$observe('disabled', function(value) {
				$palette.disabled = _eval(value);
			});

			$attrs.$observe('required', function(value) {
				$palette.required = _eval(value);
			});

			// attribute: no need for interpolation {{preserve}}
			config.preserve = $scope.$eval($attrs.preserve) || true;
		}

		this.$onChanges = function(object) {
			if (object.options) {
				this.optsource = angular.copy(this.options) || [];
				//this.selsource = angular.copy(this.selected) || [];
			}
		};

		this.onMoveLeft = function() {
			var source = this.selected;
			//var source = this.selsource;
			var target = this.optsource;
			move(this.selmodel, source, target);

			rearrange('selmodel', 'optmodel', target);
		};

		this.onMoveRight = function() {
			var source = this.optsource;
			//var target = this.selsource;
			var target = this.selected;
			move(this.optmodel, source, target);

			rearrange('optmodel', 'selmodel', target);
		};

		function move(selected, source, target) {
			angular.forEach(selected, function(item) {
				var idx = source.indexOf(item);
				source.splice(idx, 1);
				target.push(item);
			});
		}

		function rearrange(selected, model, target) {
			$palette[model] = config.preserve === true ? $palette[selected] : [];
			$palette[selected] = [];
		}
	}
})();
angular.module('angular.bootstrap.palette').run(['$templateCache', function($templateCache) {$templateCache.put('template/palette.html','<div class="palette"><div class="col-md-4 palette-options"><div class="form-group"><div ng-transclude="options-header"><label for="{{::$palette.optid}}" class="control-label">{{$palette.optionsLabel}}</label></div><select id="{{::$palette.optid}}" multiple="multiple" ng-model="$palette.optmodel" ng-options="{{$palette.optencoder}}" ng-disabled="$palette.disabled" ng-required="$palette.required" class="form-control"></select></div></div><div class="col-md-2 palette-controls"><button type="button" ng-disabled="$palette.disabled" ng-click="$palette.onMoveRight()" class="btn btn-primary"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button> <button type="button" ng-disabled="$palette.disabled" ng-click="$palette.onMoveLeft()" class="btn btn-danger"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button></div><div class="col-md-4 palette-selected"><div class="form-group"><div ng-transclude="selected-header"><label for="{{::$palette.selid}}" class="control-label">{{$palette.selectedLabel}}</label></div><select id="{{::$palette.selid}}" multiple="multiple" ng-model="$palette.selmodel" ng-options="{{$palette.selencoder}}" ng-disabled="$palette.disabled" ng-required="$palette.required" class="form-control"></select></div></div></div>');}]);