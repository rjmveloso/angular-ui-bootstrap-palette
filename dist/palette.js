/**
 * angular-bootstrap-palette - AngularJS Bootstrap palette
 * @version v1.0.0
 * @link https://github.com/rjmveloso/angular-ui-bootstrap-palette#readme
 * @license ISC
 */
(function() {
	'use strict';

	var template =
		'<div class="palette">\
		   <div class="col-md-4 palette-options">\
		     <div class="form-group">\
		       <label for="{{::optid}}" class="control-label">{{$ctrl.optionsLabel}}</label>\
		       <select id="{{::optid}}" multiple ng-model="$ctrl.optmodel" ng-disabled="$ctrl.disabled"\
		        ng-options="{{$ctrl.options}}" class="form-control">\
		       </select>\
		     </div>\
		   </div>\
		   <div class="col-md-2 text-center palette-controls">\
		     <button type="button" ng-disabled="$ctrl.disabled" ng-click="$ctrl.onMoveRight()" class="btn btn-primary">\
		       <i class="fa fa-chevron-right" aria-hidden="true"></i>\
		     </button>\
		     <button type="button" ng-disabled="$ctrl.disabled" ng-click="$ctrl.onMoveLeft()" class="btn btn-danger">\
		       <i class="fa fa-chevron-left" aria-hidden="true"></i>\
	         </button>\
		   </div>\
		   <div class="col-md-4 palette-selected">\
	         <div class="form-group">\
		       <label for="{{::selid}}" class="control-label">{{$ctrl.selectedLabel}}</label>\
		       <select id="{{::selid}}" multiple ng-model="$ctrl.selmodel" ng-disabled="$ctrl.disabled"\
		        ng-options="{{$ctrl.selected}}" class="form-control">\
		       </select>\
		     </div>\
		   </div>\
		 </div>';

	// @see https://github.com/angular/angular.js/blob/master/src/ng/directive/ngOptions.js#L236
	var OPTIONS_PATTERN = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([$\w][$\w]*)|(?:\(\s*([$\w][$\w]*)\s*,\s*([$\w][$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
	
	angular.module('angular-bootstrap-palette').component('palette', {
		bindings: {
			model: '=', // Is this needed?? selected expression should refer the model
			options: '@',
			selected: '@',
			preserve: '?', // Preserve selected options on move
			optionsLabel: '<?',
			selectedLabel: '<?'
		},
		transclude: {
			'options-header': '?optionsHeader',
			'selected-header': '?selectedHeader'
		},
		template: template,
		//templateUrl: 'palette.html',
		controller: PaletteController,
		controllerAs: '$palette'
	});

	PaletteController.$inject = [ '$scope', '$parse', '$attrs' ];
	function PaletteController($scope, $parse, $attrs) {

		$attrs.$observe('disabled', function(value) {
			this.disabled = value !== undefined ? value : false;
		});
		
		this.$onInit = function() {
			this.optid = $scope.$id;
			this.selid = $attrs['id'] || $scope.$id;
			
		    var options = this.options.match(OPTIONS_PATTERN);
		    var selected = this.selected.match(OPTIONS_PATTERN);

		    this.optmodel = this.selmodel = [];
		    this.optsource = $parse(options[8]);
		    this.selsource = $parse(selected[8]);
		    
		    watchable(this.optsource);
		    watchable(this.selsource);
		};
		
		this.onMoveLeft = function() {
			var source = this.selsource($scope);
			var target = this.optsource($scope);
			move(this.selmodel, source, target);
			this.model = source;
			this.optmodel = this.preserve === true ? this.selmodel : [];
			this.selmodel = [];
		};
		
		this.onMoveRight = function() {
		    var source = this.optsource($scope);
			var target = this.selsource($scope);
			move(this.optmodel, source, target);
			this.model = target;
			this.selmodel = this.preserve === true ? this.optmodel : [];
			this.optmodel = [];
		};
		
		function move(selected, from, to) {
			angular.forEach(selected, function(item) {
				var idx = from.indexOf(item);
				from.splice(idx, 1);
				to.push(item);
			});
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
/**
 * angular-bootstrap-palette - AngularJS Bootstrap palette
 * @version v1.0.0
 * @link https://github.com/rjmveloso/angular-ui-bootstrap-palette#readme
 * @license ISC
 */
angular.module('angular-bootstrap-palette').run(['$templateCache', function($templateCache) {$templateCache.put('main/palette.html','<div class="palette"><div class="col-md-4 palette-options"><div class="form-group"><label for="{{::optid}}" class="control-label">{{$ctrl.optionsLabel}}</label><select id="{{::optid}}" multiple="" ng-model="$ctrl.optmodel" ng-disabled="$ctrl.disabled" ng-options="{{$ctrl.options}}" class="form-control"></select></div></div><div class="col-md-2 text-center palette-controls"><button type="button" ng-disabled="$ctrl.disabled" ng-click="$ctrl.onMoveRight()" class="btn btn-primary"><i class="fa fa-chevron-right" aria-hidden="true"></i></button> <button type="button" ng-disabled="$ctrl.disabled" ng-click="$ctrl.onMoveLeft()" class="btn btn-danger"><i class="fa fa-chevron-left" aria-hidden="true"></i></button></div><div class="col-md-4 palette-selected"><div class="form-group"><label for="{{::selid}}" class="control-label">{{$ctrl.selectedLabel}}</label><select id="{{::selid}}" multiple="" ng-model="$ctrl.selmodel" ng-disabled="$ctrl.disabled" ng-options="{{$ctrl.selected}}" class="form-control"></select></div></div></div>');}]);