var app = angular.module('ui.palette', ['ngSanitize', 'angular.bootstrap.palette']);

app.controller('PaletteCtrl', PaletteCtrl);

function PaletteCtrl() {
	var vm = this;
	
	vm.options = [
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
	
	vm.optionsLabel = 'Available';
	vm.selectedLabel = 'Selected';
	vm.encoder = 'value as value.name for value in $palette';
}