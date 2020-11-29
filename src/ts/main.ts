import $ from 'jquery';

console.log("simple-menu.js works");

const MIN_WIDTH_TRIGGER = 576;

let menuIsInited = false;
let $simpleMenu:JQuery<HTMLElement>;
let $simpleMenuFolded:JQuery<HTMLElement>;
let $simpleMenuFoldedSubmenu:JQuery<HTMLElement>;
let $overflowHolder:JQuery<HTMLElement>;

let $menuItems: JQuery<HTMLElement>;

let breakpoints:number[] = [];
let resizeTimeout:NodeJS.Timeout;


$( window ).on( "load", function() {
	$simpleMenu = $( '#mainMenu' );
	$simpleMenuFolded =  $('#foldedMenu');
	$simpleMenuFoldedSubmenu = $simpleMenuFolded.find('.simple-menu__overflow-holder .simple-menu__submenu');
	menuIsInited = true;
	updateMenu();
});
window.onresize = function() {
	if(resizeTimeout != null) {
		clearTimeout(resizeTimeout);
	}
	resizeTimeout = setTimeout(function(){
		updateMenu();
	},50);
};

function moveMenuItemToOther(){
	let lastChild = $simpleMenu.children().last();
	lastChild.prependTo($simpleMenuFoldedSubmenu);
}
function restoreDefault(){
		while(restoreMenuItemFromOther());
		hideFoldedMenu();
}
function restoreMenuItemFromOther():boolean{
	let firstStoredMenuItem = $simpleMenuFoldedSubmenu.children().first();
	firstStoredMenuItem.appendTo($simpleMenu);
	return firstStoredMenuItem.length > 0;
}
function hasMenuOverflow():boolean{
	let hasChildren = $simpleMenu.children().length > 0;
	if(!hasChildren){
		console.log('NO CHILDREN');
		return false;
	}
	let foldedMenuWidth = $simpleMenuFolded.hasClass('zigzag-display-none') ? 0 : $simpleMenuFolded[0].offsetWidth;
	let navigationWidth = $simpleMenu.parent()[0].offsetWidth || 0;
	let availableSpace = (navigationWidth) - (foldedMenuWidth || 0);
	console.log('navigation width:' + navigationWidth);
	console.log('menu width:' + getMenuWidth());
	console.log('available space:' + availableSpace );
	return getMenuWidth() > availableSpace;
}
function hasMenuUnderflow(){
	return breakpoints.length > 0 && getMenuWidth() >= breakpoints[breakpoints.length - 1] ;
}
function getMenuWidth(){
	return $simpleMenu[0].scrollWidth || 0;
}
function hideFoldedMenu(){
	console.log('hide folded menu');
	$simpleMenuFolded.addClass('zigzag-display-none');

}
function showFoldedMenu(){
	console.log('show folded menu');
	$simpleMenuFolded.removeClass('zigzag-display-none');
}
function proceedMenuOverflow(){
	if(hasMenuOverflow()){
		console.log('has menu overflow');
		breakpoints.push(getMenuWidth());
		moveMenuItemToOther();
		showFoldedMenu();
	}
	if(hasMenuOverflow()){
		proceedMenuOverflow();
	}
}
function proceedMenuUnderflow(){
	console.log('checking underflow');
	let firstStoredMenuItem = $simpleMenuFoldedSubmenu.children().first();

		if(hasMenuUnderflow() ){
			console.log('has menu underflow');
			breakpoints.pop();
			if(firstStoredMenuItem.length >= 0){
				restoreMenuItemFromOther();
			}
			else {
				console.log('no hidden elements left');
			}
		}
		if(hasMenuUnderflow()){
			proceedMenuUnderflow();
		}
		if(breakpoints.length == 0){
			console.log('no breakpoints');
			hideFoldedMenu();
		}

}
function updateMenu() {

	if ( !menuIsInited ) {
        return;
	}
	let windowWidth = window.innerWidth;
	if((windowWidth != null) && (windowWidth < MIN_WIDTH_TRIGGER)){
		restoreDefault();
		return;
	}
		proceedMenuOverflow();
		proceedMenuUnderflow();
}
