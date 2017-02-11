(function() {
	'use strict';

	// @see https://github.com/angular/angular.js/blob/master/src/ng/directive/ngOptions.js#L236
	var OPTIONS_PATTERN = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([$\w][$\w]*)|(?:\(\s*([$\w][$\w]*)\s*,\s*([$\w][$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
	
	angular.module('angular.bootstrap.palette', []).component('palette', {
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

	PaletteController.$inject = [ '$scope', '$parse', '$attrs' ];
	function PaletteController($scope, $parse, $attrs) {
		
		var config = {};
		
		$attrs.$observe('disabled', function(value) {
			this.disabled = value !== undefined ? value : false;
		});
		
		this.$onInit = function() {
			this.optid = $scope.$id;
			this.selid = $attrs['palette-id'] || $scope.$id;
		
			// attribute: no need for interpolation {{preserve}}
			config.preserve = $scope.$eval($attrs.preserve);
			//config.sort = this.sort;
			
		    var options = this.options.match(OPTIONS_PATTERN);
		    var selected = this.selected.match(OPTIONS_PATTERN);
		    
		    var optsource = $parse(options[8]);
		    var selsource = $parse(selected[8]);
		    
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