# AngularJS palette component

[![Build Status](https://travis-ci.org/rjmveloso/angular-ui-bootstrap-palette.svg?branch=master)](https://travis-ci.org/rjmveloso/angular-ui-bootstrap-palette)


AngularJS palette (dual listbox) component.

Just add `angular.bootstrap.palette` dependency.

```html
<palette options="vm.options" selected="vm.selected" encoder="vm.encoder"
  options-label="vm.optionsLabel" selected-label="vm.selectedLabel">
</palette>
```

The following parameters can be set on a dual-list:

- **options**: the available options (immutable)  
- **selected**: the selected options  
- **encoder**: ng-option style expression  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;use $palette as a placeholder for the source part
- **options-label**: text to show above available options list
- **selected-label**: text to show above selected options list


```js
var app = angular.module('ui.palette', ['ngSanitize', 'angular.bootstrap.palette']);

app.controller('PaletteCtrl', function() {
	var vm = this;
	
	vm.optionsLabel = 'Available';
	vm.selectedLabel = 'Selected';
	
	vm.options = [{id: 18, name: 'ricvel'}, ...];
	vm.selected = [];
	vm.encoder = 'obj as obj.name for obj in $palette track by obj.id';
});
```