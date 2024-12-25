/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/Model.js":
/*!*********************************!*\
  !*** ./src/js/modules/Model.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Storage */ "./src/js/modules/Storage.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
 // working with local storage
var Model = /*#__PURE__*/function () {
  function Model() {
    _classCallCheck(this, Model);
    _defineProperty(this, "state", {
      todos: [],
      isEditMode: false,
      oldValue: '' // I need it in Editing mode
    });
  }
  return _createClass(Model, [{
    key: "getOldValue",
    value: function getOldValue() {
      return this.state.oldValue;
    }
  }, {
    key: "setOldValue",
    value: function setOldValue(val) {
      this.state.oldValue = val;
    }
  }, {
    key: "saveToLS",
    value: function saveToLS(key, value) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'primitive';
      if (!key || !value) return;
      _Storage__WEBPACK_IMPORTED_MODULE_0__["default"].save(key, value);
    }
  }, {
    key: "getFromLS",
    value: function getFromLS(key) {
      return _Storage__WEBPACK_IMPORTED_MODULE_0__["default"].get(key);
    }
  }, {
    key: "removeItemFromLS",
    value: function removeItemFromLS(key) {
      return _Storage__WEBPACK_IMPORTED_MODULE_0__["default"].remove(key);
    }
  }, {
    key: "pushToDo",
    value: function pushToDo(todo) {
      this.state.todos.push(todo);
    }
  }, {
    key: "pushTodosToLS",
    value: function pushTodosToLS() {
      this.saveToLS('todos', JSON.stringify(this.state.todos), 'array');
    }
  }, {
    key: "removeTodos",
    value: function removeTodos() {
      this.state.todos = [];
    }
  }, {
    key: "getStateTodos",
    value: function getStateTodos() {
      return this.state.todos;
    }
  }, {
    key: "removeTodo",
    value: function removeTodo(todoText) {
      var itsIndex = this.state.todos.indexOf(todoText);
      if (itsIndex < 0) return console.log("Not found");
      this.state.todos.splice(itsIndex, 1);
    }
  }, {
    key: "setEditMode",
    value: function setEditMode(booleanFlag) {
      this.state.isEditMode = booleanFlag;
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Model);

/***/ }),

/***/ "./src/js/modules/Storage.js":
/*!***********************************!*\
  !*** ./src/js/modules/Storage.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// to work with local storage
var LS = /*#__PURE__*/function () {
  function LS() {
    _classCallCheck(this, LS);
  }
  return _createClass(LS, [{
    key: "save",
    value:
    // save to local storage
    function save(key, item) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'primitive';
      if (type === 'primitive') {
        localStorage.setItem(key, item);
      } else {
        // it is an array
        localStorage.setItem(key, item);
      }
    }

    // get from local storage
  }, {
    key: "get",
    value: function get(item) {
      return localStorage.getItem(item);
    }

    // remove from local storage
  }, {
    key: "remove",
    value: function remove(item) {
      localStorage.removeItem(item);
    }

    // clear everything in local storge
  }, {
    key: "clear",
    value: function clear() {
      localStorage.clear();
      console.log("local storage is clear now");
    }

    // get how many items are stored there
  }, {
    key: "length",
    get: function get() {
      console.log("items in local storage:", localStorage.length);
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new LS()); // I export and instantiate it right here, so I don't have to instantiate it where I import it
// export default LS

/***/ }),

/***/ "./src/js/modules/View.js":
/*!********************************!*\
  !*** ./src/js/modules/View.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var View = /*#__PURE__*/function () {
  function View() {
    _classCallCheck(this, View);
    this.colorUI = "#32CD32"; // by default, it's less intense than 'lime'
    this.formEl = document.querySelector('form');
    this.itemsWrapperEl = document.querySelector('.items__wrapper');
    this.todosNumberEl = document.querySelector('.items__title span');
    this.filterInput = document.querySelector('.filter-input');
    this.clearBtn = document.querySelector('.clear-btn');
    this.filterBlock = document.querySelector('.filter');
    this.titleBlock = document.querySelector('.items__title');
    this.h2 = document.querySelector('h2');
    this.formInput = document.querySelector('.form-input');
    this.formBtn = document.querySelector('.form-btn');
  }

  // =======================================================================================================================================

  // handles the click on 'Change UI colour'
  return _createClass(View, [{
    key: "handleActionsClick",
    value: function handleActionsClick(handler) {
      var _this = this;
      document.querySelector('.actions').addEventListener('click', function (e) {
        /* 
        note: if I use an arrow fn as a cb fn of an event listener, 'this' within it points to the instance of the View class
        if I use a regular fn as a cb fn here, 'this' points to the DOM element that was clicked
        if you use 'bind(this)' inside the event listener like 'this.changeUIColors().bind(this)', it will not work because bind returns a new function, but the call to this.changeUIColors() executes before bind can take effect.
        Solution: You should bind the method before you attach it to the event listener, or a use an arrow function without 'bind'.
        Arrow functions basically skip one step, so to speak, and attach 'this' to one level higher than regular functions.
        */
        if (e.target.classList.contains('change-ui-color-btn')) {
          var newColor = _this.changeUIColors();
          handler('colorUI', newColor);
        }
      });
    }

    // =======================================================================================================================================

    // changes UI colour
  }, {
    key: "changeUIColors",
    value: function changeUIColors() {
      var newColor = prompt("Enter a new UI colour:");
      if (!newColor) return;
      if (!this.isValidHTMLColor(newColor)) return alert("".concat(newColor, " is not a valid HTML colour!"));
      document.documentElement.style.setProperty('--accent', newColor);
      this.colorUI = newColor;
      console.log("UI colour now: ".concat(newColor));
      return newColor;
    }

    // =======================================================================================================================================

    // small helper fn for this.changeUIColors()
  }, {
    key: "isValidHTMLColor",
    value: function isValidHTMLColor(color) {
      // returns boolean
      var element = document.createElement('div');
      element.style.color = color;
      return element.style.color !== '';
    }

    // =======================================================================================================================================

    // runs on app init: we check LS 'colorUI' and if exists, this fn runs
  }, {
    key: "setAccentColor",
    value: function setAccentColor(color) {
      if (!color) return;
      document.documentElement.style.setProperty('--accent', color);
      this.colorUI = color;
    }

    // =======================================================================================================================================

    // to be able to press tilda and change UI colours:
  }, {
    key: "handleKeyPresses",
    value: function handleKeyPresses(handler) {
      var _this2 = this;
      document.addEventListener('keydown', function (e) {
        // 'keypress' is deprecated
        if (e.code === 'Backquote') {
          // if it's tilda
          var newColor = _this2.changeUIColors(); // this fn returns the new UI color and we need it to update our state/local storage
          handler('colorUI', newColor);
        }
      });
    }

    // =======================================================================================================================================

    // form submit handler
  }, {
    key: "formSubmit",
    value: function formSubmit(handler) {
      var _this3 = this;
      this.formEl.addEventListener('submit', function (e) {
        e.preventDefault();
        var formInputValue = _this3.formEl.elements.forminput.value.trim();
        if (!formInputValue) return;
        handler(formInputValue); // key and value to update Model aka local storage
      });
    }

    // const allCurrentItems = Array.from(this.itemsWrapperEl.querySelectorAll('.item')).map(x => x.querySelector('.item__name').textContent.toLowerCase())
    // if(allCurrentItems.includes(formInputValue.toLowerCase())) return alert('You have already added this todo!')

    // =======================================================================================================================================

    // clears form input
  }, {
    key: "clearFormInput",
    value: function clearFormInput() {
      this.formEl.elements.forminput.value = ''; // clear the input
    }

    // =======================================================================================================================================

    // renders to-do in the DOM
  }, {
    key: "renderToDo",
    value: function renderToDo(toDoName) {
      var newToDo = document.createElement('div');
      newToDo.classList.add('item');
      newToDo.innerHTML = "<div class=\"item__name\" title=\"".concat(toDoName, "\">").concat(toDoName, "</div>\n                        <div class=\"item__btns\">\n                            <button class=\"item__btn item__btn--edit\" title=\"Edit\">\n                                <i class=\"fa-solid fa-pen\"></i>\n                            </button>\n                            <button class=\"item__btn item__btn--remove\" title=\"Delete\">\n                                <i class=\"fa-solid fa-trash\"></i>\n                            </button>\n                        </div>");
      this.itemsWrapperEl.appendChild(newToDo);
    }

    // =======================================================================================================================================

    // renders "Todos: [number]" in the UI
  }, {
    key: "renderTodosNumber",
    value: function renderTodosNumber(number) {
      this.todosNumberEl.textContent = number;
    }

    // =======================================================================================================================================

    // handles the filter input:
  }, {
    key: "handleFiltering",
    value: function handleFiltering() {
      var _this4 = this;
      this.filterInput.addEventListener('input', function (e) {
        var filterInputValue = _this4.filterInput.value.toLowerCase();
        var allTodoEls = document.querySelectorAll('.item');
        allTodoEls.forEach(function (todoEl) {
          var todoText = todoEl.querySelector('.item__name').textContent.toLowerCase();
          if (!todoText.includes(filterInputValue)) {
            todoEl.classList.add('hidden');
          } else {
            todoEl.classList.remove('hidden');
          }
        });
        var todosSatisfyingCriterion = Array.from(document.querySelectorAll('.item')).filter(function (x) {
          return !x.classList.contains('hidden');
        }).length;
        _this4.renderTodosNumber(todosSatisfyingCriterion);
        if (!filterInputValue) _this4.renderTodosNumber(document.querySelectorAll('.item').length);
      });
    }

    // =======================================================================================================================================

    // handles clicking on the Remove All Todos btn
  }, {
    key: "handleRemovingAllTodos",
    value: function handleRemovingAllTodos(handler) {
      var _this5 = this;
      this.clearBtn.addEventListener('click', function (e) {
        var choice = confirm("This will delete all of your todos. Are you certain?");
        if (!choice) return;
        while (_this5.itemsWrapperEl.firstChild) {
          _this5.itemsWrapperEl.removeChild(_this5.itemsWrapperEl.firstChild); // remove all from DOM
        }
        _this5.renderTodosNumber(0); // set Todos: to 0
        _this5.toggleExtraFeatures();
        handler();
      });
    }

    // =======================================================================================================================================

    // hides or shows Filter, 'Todos:' and the clear btn if there are no todos
  }, {
    key: "toggleExtraFeatures",
    value: function toggleExtraFeatures() {
      if (!this.itemsWrapperEl.firstChild) {
        this.filterBlock.classList.add('hidden');
        this.titleBlock.classList.add('hidden');
        this.clearBtn.classList.add('hidden');
      } else {
        this.filterBlock.classList.remove('hidden');
        this.titleBlock.classList.remove('hidden');
        this.clearBtn.classList.remove('hidden');
      }
    }
    // =======================================================================================================================================

    // handles clicking on the delete btn of any todo
  }, {
    key: "handleRemovingTodo",
    value: function handleRemovingTodo(handler) {
      var _this6 = this;
      this.itemsWrapperEl.addEventListener('click', function (e) {
        if (!e.target.closest('.item__btn--remove')) return;
        var text = e.target.closest('.item').querySelector('.item__name').textContent;
        var choice = confirm("Are you certain you want to delete this todo?\n\n".concat(text));
        if (!choice) return;
        e.target.closest('.item').remove(); // remove from DOM
        _this6.renderTodosNumber(document.querySelectorAll('.item').length); // update 'Todos:'
        handler(text);
      });
    }

    // =======================================================================================================================================

    // handles clicking on the edit btn of any todo
  }, {
    key: "handleEditingTodo",
    value: function handleEditingTodo(handler) {
      var _this7 = this;
      this.itemsWrapperEl.addEventListener('click', function (e) {
        if (!e.target.closest('.item__btn--edit')) return;
        _this7.changeH2('edit mode'); // changing H2
        _this7.changeFormBtn('edit mode'); // changing form btn: + Add --> Edit
        var valueToEdit = e.target.closest('.item').querySelector('.item__name').textContent;
        _this7.formInput.value = valueToEdit; // bringing the value to form
        _this7.formInput.focus();
        _this7.highlightTodo('highlight', e.target.closest('.item')); // highlight it visually
        handler(valueToEdit);
      });
    }

    // =======================================================================================================================================

    // changes H2 to reflect the current mode (Adding/Editing)
  }, {
    key: "changeH2",
    value: function changeH2(mode) {
      if (mode === 'edit mode') {
        this.h2.textContent = "Edit Your To-Do";
      } else {
        this.h2.textContent = "Add Your New To-Do";
      }
    }

    // =======================================================================================================================================

    // changes form btn to reflect the current mode (Adding/Editing)
  }, {
    key: "changeFormBtn",
    value: function changeFormBtn(mode) {
      if (mode === 'edit mode') {
        this.formBtn.innerHTML = "Edit";
      } else {
        this.formBtn.innerHTML = "<i class=\"fa-solid fa-plus\"></i>\nAdd";
      }
    }

    // =======================================================================================================================================

    // highlights a todo (in editing)
  }, {
    key: "highlightTodo",
    value: function highlightTodo(toggle, el) {
      if (toggle === 'highlight') {
        el.classList.add('highlight');
      } else {
        // de-highlight
        document.querySelectorAll('.item').forEach(function (x) {
          return x.classList.remove('highlight');
        });
      }
    }

    // =======================================================================================================================================

    // updates a todo (after form submit in editing)
  }, {
    key: "updateTodoElement",
    value: function updateTodoElement(el, value) {
      el.querySelector('.item__name').textContent = value;
      el.querySelector('.item__name').setAttribute('title', value);
    }

    // =======================================================================================================================================

    // changing the UI back to Adding mode: change H2, change form btn, and dehighlight all todos
  }, {
    key: "removeEditingMode",
    value: function removeEditingMode() {
      this.changeH2('adding mode');
      this.changeFormBtn('adding mode');
      this.highlightTodo('dehighlight');
    }

    // =======================================================================================================================================
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (View);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/styles/main.scss":
/*!***********************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/styles/main.scss ***!
  \***********************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* slightly paler than 'lime' but brighter than 'green' */
:root {
  --accent: #32CD32;
  --bg: #000;
  --fontsize: 16px;
}

*,
*:before,
*:after {
  padding: 0;
  margin: 0;
  border: 0;
  box-sizing: border-box;
}

html {
  height: 100%;
}

body {
  background-color: var(--bg);
  color: var(--accent);
  font-size: var(--fontsize);
  font-family: "Share Tech Mono", "Monaco", "Courier New", monospace, sans-serif;
  /* text-shadow: 0 0 10px var(--accent); */
  height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

input,
button,
select,
textarea {
  cursor: pointer;
  background-color: transparent;
  color: inherit;
  font-family: inherit;
  border: 1px solid var(--accent);
  outline: none;
  padding: 10px;
  font-size: inherit;
  transition: box-shadow 0.3s;
}

button {
  transition: all 0.3s;
}

input:focus,
textarea:focus {
  box-shadow: 0 0 10px var(--accent);
}

button:hover {
  background-color: var(--accent);
  color: #000;
  box-shadow: 0 0 10px var(--accent);
}

button:active {
  box-shadow: 0 0 1px var(--accent);
}

textarea {
  resize: vertical;
}

button {
  cursor: pointer;
}

input::placeholder {
  color: inherit;
  font-family: inherit;
  opacity: 1;
}

.container {
  max-width: 750px;
  margin: 0 auto;
  width: 100%;
}
@media (max-width: 767.98px) {
  .container {
    max-width: none;
    padding: 0 10px;
  }
}

.section {
  flex-grow: 1;
  margin-top: 20px;
}
.section h1 {
  text-align: center;
  margin-bottom: 50px;
  font-size: 40px;
}
.section h2 {
  text-align: center;
  margin-bottom: 20px;
}
.section form {
  display: flex;
  column-gap: 10px;
  text-align: center;
  margin-bottom: 70px;
}
.section form .form-input {
  flex-grow: 1;
}
.section form .form-btn {
  min-width: 71px;
}
.section .items {
  text-align: center;
}
.section .items__wrapper {
  max-height: 280px;
  margin-bottom: 20px;
  overflow-y: scroll;
  padding: 10px;
  padding-bottom: 0;
  /* Styling the track (background of the scrollbar) */
  /* Styling the handle (the draggable part of the scrollbar) */
  /* Styling the track (area where the scrollbar moves) */
  scrollbar-width: thin;
  scrollbar-color: black #grey;
  /* thumb color and track color */
}
.section .items__wrapper::-webkit-scrollbar {
  width: 5px;
  /* Scrollbar width */
}
.section .items__wrapper::-webkit-scrollbar-thumb {
  background-color: grey;
  /* Thumb color */
  border-radius: 0px;
  /* Optional, to make it rounded */
}
.section .items__wrapper::-webkit-scrollbar-track {
  background-color: #000;
  /* Track color */
  border-radius: 10px;
  /* Optional, to make it rounded */
}
.section .items .filter {
  margin-bottom: 50px;
}
.section .items .filter .filter-input {
  width: 100%;
}
.section .items__title {
  text-align: left;
  margin-bottom: 20px;
  font-size: 20px;
}
.section .items .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 10px;
  border: 1px solid var(--accent);
  padding: 10px 15px;
  margin-bottom: 20px;
  transition: box-shadow 0.2s;
}
.section .items .item:hover {
  box-shadow: 0 0 10px var(--accent);
}
.section .items .item__name {
  max-width: 615px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.section .items .item__btns {
  display: flex;
  align-items: center;
  column-gap: 10px;
}
.section input {
  min-height: 62px;
  padding-left: 15px;
}
.section input::placeholder {
  transition: opacity 0.3s;
}
.section input:focus::placeholder {
  opacity: 0.3;
}
.section button:focus {
  box-shadow: 0 0 10px var(--accent);
}

.actions {
  position: absolute;
  bottom: 10px;
  left: 10px;
}
.actions .action-btn {
  padding: 0;
  border: none;
  opacity: 0.2;
  transition: all 0.3s;
}
.actions .action-btn:hover {
  opacity: 1;
  background-color: transparent;
  color: var(--accent);
  box-shadow: none;
  text-decoration: underline;
}
.hidden {
  display: none !important;
}

.highlight {
  box-shadow: 0 0 10px var(--accent);
}`, "",{"version":3,"sources":["webpack://./src/styles/initial.scss","webpack://./src/styles/main.scss","webpack://./src/styles/page.scss"],"names":[],"mappings":"AACA,yDAAA;AAIA;EACI,iBAAA;EACA,UAAA;EACA,gBAAA;ACHJ;;ADQA;;;EAGI,UAAA;EACA,SAAA;EACA,SAAA;EACA,sBAAA;ACLJ;;ADOA;EAAM,YAAA;ACHN;;ADIA;EACI,2BAAA;EACA,oBAAA;EACA,0BAAA;EACA,8EAAA;EACA,yCAAA;EACA,YAAA;EACA,kBAAA;EACA,aAAA;EACA,sBAAA;EACA,8BAAA;ACDJ;;ADIA;;;;EAII,eAAA;EACA,6BAAA;EACA,cAAA;EACA,oBAAA;EACA,+BAAA;EACA,aAAA;EACA,aAAA;EACA,kBAAA;EACA,2BAAA;ACDJ;;ADIA;EACI,oBAAA;ACDJ;;ADIA;;EAEI,kCAAA;ACDJ;;ADIA;EACI,+BAAA;EACA,WA3DC;EA4DD,kCAAA;ACDJ;;ADIA;EACI,iCAAA;ACDJ;;ADIA;EACI,gBAAA;ACDJ;;ADIA;EACI,eAAA;ACDJ;;ADIA;EACI,cAAA;EACA,oBAAA;EACA,UAAA;ACDJ;;ADqBA;EACI,gBAAA;EACA,cAAA;EACA,WAAA;AClBJ;AD4BI;EAbJ;IAcQ,eAAA;IACA,eAAA;ECzBN;AACF;;ACzFA;EACA,YAAA;EACI,gBAAA;AD4FJ;AC1FI;EACI,kBAAA;EACA,mBAAA;EACA,eAAA;AD4FR;ACzFI;EACI,kBAAA;EACA,mBAAA;AD2FR;ACxFI;EACI,aAAA;EACA,gBAAA;EACA,kBAAA;EACA,mBAAA;AD0FR;ACxFQ;EACI,YAAA;AD0FZ;ACvFQ;EACI,eAAA;ADyFZ;AClFI;EACI,kBAAA;ADoFR;AClFQ;EACI,iBAAA;EACA,mBAAA;EACA,kBAAA;EACA,aAAA;EACA,iBAAA;EAEA,oDAAA;EAMA,6DAAA;EAQA,uDAAA;EAQA,qBAAA;EACA,4BAAA;EACA,gCAAA;ADgEZ;ACvFY;EACI,UAAA;EACA,oBAAA;ADyFhB;ACrFY;EACI,sBAAA;EACA,gBAAA;EACA,kBAAA;EACA,iCAAA;ADuFhB;ACnFY;EACI,sBAAA;EACA,gBAAA;EACA,mBAAA;EACA,iCAAA;ADqFhB;AC7EQ;EACI,mBAAA;AD+EZ;AC9EY;EACI,WAAA;ADgFhB;AC5EQ;EACI,gBAAA;EACA,mBAAA;EACA,eAAA;AD8EZ;AC1EQ;EACI,aAAA;EACA,mBAAA;EACA,8BAAA;EACA,gBAAA;EACA,+BAAA;EACA,kBAAA;EACA,mBAAA;EACA,2BAAA;AD4EZ;ACxEY;EACI,kCAAA;AD0EhB;ACxEY;EACI,gBAAA;EACA,gBAAA;EACA,uBAAA;EACA,mBAAA;AD0EhB;ACvEY;EACI,aAAA;EACA,mBAAA;EACA,gBAAA;ADyEhB;AC3DI;EACI,gBAAA;EACA,kBAAA;AD6DR;AC5DQ;EACQ,wBAAA;AD8DhB;AC3DY;EACI,YAAA;AD6DhB;ACxDQ;EACQ,kCAAA;AD0DhB;;ACnDA;EACI,kBAAA;EACA,YAAA;EACA,UAAA;ADsDJ;ACpDI;EACI,UAAA;EACA,YAAA;EACA,YAAA;EACA,oBAAA;ADsDR;ACrDQ;EACI,UAAA;EACA,6BAAA;EACA,oBAAA;EACA,gBAAA;EACA,0BAAA;ADuDZ;ACjDA;EACI,wBAAA;ADmDJ;;AChDA;EACI,kCAAA;ADmDJ","sourcesContent":["$accent: #32CD32;\n/* slightly paler than 'lime' but brighter than 'green' */\n$bg: #000;\n$fontsize: 16px;\n\n:root {\n    --accent: #{$accent};\n    --bg: #{$bg};\n    --fontsize: #{$fontsize};\n}\n\n// =============================================================================================\n\n*,\n*:before,\n*:after {\n    padding: 0;\n    margin: 0;\n    border: 0;\n    box-sizing: border-box;\n}\nhtml {height: 100%;}\nbody {\n    background-color: var(--bg);\n    color: var(--accent);\n    font-size: var(--fontsize);\n    font-family: \"Share Tech Mono\", \"Monaco\", \"Courier New\", monospace, sans-serif;\n    /* text-shadow: 0 0 10px var(--accent); */\n    height: 100%;\n    overflow-y: hidden;\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n}\n\ninput,\nbutton,\nselect,\ntextarea {\n    cursor: pointer;\n    background-color: transparent;\n    color: inherit;\n    font-family: inherit;\n    border: 1px solid var(--accent);\n    outline: none;\n    padding: 10px;\n    font-size: inherit;\n    transition: box-shadow .3s;\n}\n\nbutton {\n    transition: all .3s;\n}\n\ninput:focus,\ntextarea:focus {\n    box-shadow: 0 0 10px var(--accent);\n}\n\nbutton:hover {\n    background-color: var(--accent);\n    color: $bg;\n    box-shadow: 0 0 10px var(--accent);\n}\n\nbutton:active {\n    box-shadow: 0 0 1px var(--accent);\n}\n\ntextarea {\n    resize: vertical;\n}\n\nbutton {\n    cursor: pointer;\n}\n\ninput::placeholder {\n    color: inherit;\n    font-family: inherit;\n    opacity: 1;\n}\n\n// =============================================================================================\n\n\n//  TO MAKE IT RESPONSIVE\n\n$minwidth: 320px;\n\n$mw: 750; // the width of the content, the container width\n\n$md1: $mw+12; // 1st breakpoint\n$md2: 992.98; // for tablets, 1024х768px is a size of a little PC monitor or iPad\n$md3: 767.98; // for large phones; less than 768px is the hamburger menu time\n$md4: 479.98; // for small phones\n\n\n// =============================================================================================\n\n.container {\n    max-width: $mw+px;\n    margin: 0 auto;\n    width: 100%;\n\n    // @media (max-width: $md1+px) {\n    //     max-width: 970px;\n    // }\n\n    // @media (max-width: $md2+px) {\n    //     max-width: 750px;\n    // }\n\n    @media (max-width: $md3+px) {\n        max-width: none;\n        padding: 0 10px;\n    }\n}\n\n// =============================================================================================","/* slightly paler than 'lime' but brighter than 'green' */\n:root {\n  --accent: #32CD32;\n  --bg: #000;\n  --fontsize: 16px;\n}\n\n*,\n*:before,\n*:after {\n  padding: 0;\n  margin: 0;\n  border: 0;\n  box-sizing: border-box;\n}\n\nhtml {\n  height: 100%;\n}\n\nbody {\n  background-color: var(--bg);\n  color: var(--accent);\n  font-size: var(--fontsize);\n  font-family: \"Share Tech Mono\", \"Monaco\", \"Courier New\", monospace, sans-serif;\n  /* text-shadow: 0 0 10px var(--accent); */\n  height: 100%;\n  overflow-y: hidden;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n\ninput,\nbutton,\nselect,\ntextarea {\n  cursor: pointer;\n  background-color: transparent;\n  color: inherit;\n  font-family: inherit;\n  border: 1px solid var(--accent);\n  outline: none;\n  padding: 10px;\n  font-size: inherit;\n  transition: box-shadow 0.3s;\n}\n\nbutton {\n  transition: all 0.3s;\n}\n\ninput:focus,\ntextarea:focus {\n  box-shadow: 0 0 10px var(--accent);\n}\n\nbutton:hover {\n  background-color: var(--accent);\n  color: #000;\n  box-shadow: 0 0 10px var(--accent);\n}\n\nbutton:active {\n  box-shadow: 0 0 1px var(--accent);\n}\n\ntextarea {\n  resize: vertical;\n}\n\nbutton {\n  cursor: pointer;\n}\n\ninput::placeholder {\n  color: inherit;\n  font-family: inherit;\n  opacity: 1;\n}\n\n.container {\n  max-width: 750px;\n  margin: 0 auto;\n  width: 100%;\n}\n@media (max-width: 767.98px) {\n  .container {\n    max-width: none;\n    padding: 0 10px;\n  }\n}\n\n.section {\n  flex-grow: 1;\n  margin-top: 20px;\n}\n.section h1 {\n  text-align: center;\n  margin-bottom: 50px;\n  font-size: 40px;\n}\n.section h2 {\n  text-align: center;\n  margin-bottom: 20px;\n}\n.section form {\n  display: flex;\n  column-gap: 10px;\n  text-align: center;\n  margin-bottom: 70px;\n}\n.section form .form-input {\n  flex-grow: 1;\n}\n.section form .form-btn {\n  min-width: 71px;\n}\n.section .items {\n  text-align: center;\n}\n.section .items__wrapper {\n  max-height: 280px;\n  margin-bottom: 20px;\n  overflow-y: scroll;\n  padding: 10px;\n  padding-bottom: 0;\n  /* Styling the track (background of the scrollbar) */\n  /* Styling the handle (the draggable part of the scrollbar) */\n  /* Styling the track (area where the scrollbar moves) */\n  scrollbar-width: thin;\n  scrollbar-color: black #grey;\n  /* thumb color and track color */\n}\n.section .items__wrapper::-webkit-scrollbar {\n  width: 5px;\n  /* Scrollbar width */\n}\n.section .items__wrapper::-webkit-scrollbar-thumb {\n  background-color: grey;\n  /* Thumb color */\n  border-radius: 0px;\n  /* Optional, to make it rounded */\n}\n.section .items__wrapper::-webkit-scrollbar-track {\n  background-color: #000;\n  /* Track color */\n  border-radius: 10px;\n  /* Optional, to make it rounded */\n}\n.section .items .filter {\n  margin-bottom: 50px;\n}\n.section .items .filter .filter-input {\n  width: 100%;\n}\n.section .items__title {\n  text-align: left;\n  margin-bottom: 20px;\n  font-size: 20px;\n}\n.section .items .item {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  column-gap: 10px;\n  border: 1px solid var(--accent);\n  padding: 10px 15px;\n  margin-bottom: 20px;\n  transition: box-shadow 0.2s;\n}\n.section .items .item:hover {\n  box-shadow: 0 0 10px var(--accent);\n}\n.section .items .item__name {\n  max-width: 615px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.section .items .item__btns {\n  display: flex;\n  align-items: center;\n  column-gap: 10px;\n}\n.section input {\n  min-height: 62px;\n  padding-left: 15px;\n}\n.section input::placeholder {\n  transition: opacity 0.3s;\n}\n.section input:focus::placeholder {\n  opacity: 0.3;\n}\n.section button:focus {\n  box-shadow: 0 0 10px var(--accent);\n}\n\n.actions {\n  position: absolute;\n  bottom: 10px;\n  left: 10px;\n}\n.actions .action-btn {\n  padding: 0;\n  border: none;\n  opacity: 0.2;\n  transition: all 0.3s;\n}\n.actions .action-btn:hover {\n  opacity: 1;\n  background-color: transparent;\n  color: var(--accent);\n  box-shadow: none;\n  text-decoration: underline;\n}\n.hidden {\n  display: none !important;\n}\n\n.highlight {\n  box-shadow: 0 0 10px var(--accent);\n}","@use './initial' as *;\n\n.section {\nflex-grow: 1;\n    margin-top: 20px;\n\n    h1 {\n        text-align: center;\n        margin-bottom: 50px;\n        font-size: 40px;\n    }\n\n    h2 {\n        text-align: center;\n        margin-bottom: 20px;\n    }\n\n    form {\n        display: flex;\n        column-gap: 10px;\n        text-align: center;\n        margin-bottom: 70px;\n\n        .form-input {\n            flex-grow: 1;\n        }\n\n        .form-btn {\n            min-width: 71px;\n        }\n    }\n\n\n\n\n    .items {\n        text-align: center;\n\n        &__wrapper {\n            max-height: 280px;\n            margin-bottom: 20px;\n            overflow-y: scroll;\n            padding: 10px;\n            padding-bottom: 0;\n\n            /* Styling the track (background of the scrollbar) */\n            &::-webkit-scrollbar {\n                width: 5px;\n                /* Scrollbar width */\n            }\n            \n            /* Styling the handle (the draggable part of the scrollbar) */\n            &::-webkit-scrollbar-thumb {\n                background-color: grey;\n                /* Thumb color */\n                border-radius: 0px;\n                /* Optional, to make it rounded */\n            }\n            \n            /* Styling the track (area where the scrollbar moves) */\n            &::-webkit-scrollbar-track {\n                background-color: #000;\n                /* Track color */\n                border-radius: 10px;\n                /* Optional, to make it rounded */\n            }\n\n            scrollbar-width: thin;\n            scrollbar-color: black #grey;\n            /* thumb color and track color */\n        }\n\n        .filter {\n            margin-bottom: 50px;\n            .filter-input {\n                width: 100%;\n            }\n        }\n\n        &__title {\n            text-align: left;\n            margin-bottom: 20px;\n            font-size: 20px;\n        }\n\n\n        .item {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            column-gap: 10px;\n            border: 1px solid var(--accent);\n            padding: 10px 15px;\n            margin-bottom: 20px;\n            transition: box-shadow .2s;\n            // &:last-of-type {\n            //     margin-bottom: 50px;\n            // }\n            &:hover {\n                box-shadow: 0 0 10px var(--accent);\n            }\n            &__name {\n                max-width: 615px;\n                overflow: hidden;\n                text-overflow: ellipsis;\n                white-space: nowrap;\n            }\n\n            &__btns {\n                display: flex;\n                align-items: center;\n                column-gap: 10px;\n            }\n\n            &__btn {}\n\n            &__btn--edit {}\n\n            &__btn--remove {}\n        }\n\n        .clear-btn {}\n\n    }\n\n    input {\n        min-height: 62px;\n        padding-left: 15px;\n        &::placeholder {\n                transition: opacity .3s;\n            }\n        \n            &:focus::placeholder {\n                opacity: 0.3;\n            }\n    }\n\n    button {\n        &:focus {\n                box-shadow: 0 0 10px var(--accent);\n            }\n    }\n}\n\n\n\n.actions {\n    position: absolute;\n    bottom: 10px;\n    left: 10px;\n\n    .action-btn {\n        padding: 0;\n        border: none;\n        opacity: 0.2;\n        transition: all .3s;\n        &:hover {\n            opacity: 1;\n            background-color: transparent;\n            color: var(--accent);\n            box-shadow: none;\n            text-decoration: underline;\n        }\n    }\n    .change-ui-color-btn {}\n}\n\n.hidden {\n    display: none !important;\n}\n\n.highlight {\n    box-shadow: 0 0 10px var(--accent);\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles/main.scss":
/*!******************************!*\
  !*** ./src/styles/main.scss ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_main_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./main.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/styles/main.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_main_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_main_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_main_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_main_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/img/favicon.ico":
/*!*****************************!*\
  !*** ./src/img/favicon.ico ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "favicon.ico";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./src/js/Controller.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/main.scss */ "./src/styles/main.scss");
/* harmony import */ var _modules_Model_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/Model.js */ "./src/js/modules/Model.js");
/* harmony import */ var _modules_View_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/View.js */ "./src/js/modules/View.js");
/* harmony import */ var _img_favicon_ico__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../img/favicon.ico */ "./src/img/favicon.ico");






var Logic = new _modules_Model_js__WEBPACK_IMPORTED_MODULE_1__["default"]();
var Visual = new _modules_View_js__WEBPACK_IMPORTED_MODULE_2__["default"]();

// =======================================================================================================================================

// on app start:
function init() {
  var accentColor = Logic.getFromLS('colorUI');
  if (accentColor) {
    Visual.setAccentColor(accentColor);
  }
  var myTodos = Logic.getFromLS('todos');
  if (myTodos) {
    // if local storage for todos is not empty...
    var fetchedTodos = JSON.parse(myTodos);
    fetchedTodos.forEach(function (toDo) {
      Visual.renderToDo(toDo); // render each todo
      Logic.pushToDo(toDo); // push to Model's state
    });
    Visual.renderTodosNumber(fetchedTodos.length); // and render how many of them I have
  }
  Visual.toggleExtraFeatures();
  runEventListeners();
}
init();

// =======================================================================================================================================

function runEventListeners() {
  Visual.handleActionsClick(Logic.saveToLS); // handles the click on 'Change UI colour'
  Visual.handleKeyPresses(Logic.saveToLS); // to change the UI color by pressing the tilda key
  Visual.handleFiltering();
  Visual.handleRemovingAllTodos(deleteTodos);
  Visual.handleRemovingTodo(deleteTodo);
  Visual.handleEditingTodo(editTodo);
  Visual.formSubmit(handleFormSubmit); // handleFormSubmit is a general fn
}

// =======================================================================================================================================

function handleFormSubmit(value) {
  if (Logic.state.isEditMode) {
    // editing 
    var indexToChange = Logic.getStateTodos().indexOf(Logic.getOldValue());
    Visual.updateTodoElement(document.querySelector(".item:nth-child(".concat(indexToChange + 1, ")")), value);
    Logic.getStateTodos()[indexToChange] = value;
    Logic.pushTodosToLS(); // push to local storage
    Visual.removeEditingMode(); // change H2, change form btn, and dehighlight all todos
    Visual.clearFormInput();
    Logic.setEditMode(false);
  } else {
    // adding
    Visual.renderToDo(value); // creating a DOM element and appending it -- rendering
    Visual.clearFormInput(); // clear the input
    pushTodos(value);
  }
}

// =======================================================================================================================================

function pushTodos(newToDoValue) {
  // happens on form submission: 'handleFormSubmit' calls this fn with formInputValue
  if (!newToDoValue) return;
  Logic.pushToDo(newToDoValue); // push to Model's state
  Logic.pushTodosToLS(); // push to local storage
  Visual.renderTodosNumber(JSON.parse(Logic.getFromLS('todos')).length); // render how many of them I have
  Visual.toggleExtraFeatures();
}

// =======================================================================================================================================

function deleteTodos() {
  Logic.removeTodos(); // model state sets to []
  Logic.removeItemFromLS("todos"); // local storage remove whats stored under that key
}

// =======================================================================================================================================

function deleteTodo(todoText) {
  Logic.removeTodo(todoText); // removing from Model state
  Logic.pushTodosToLS(); // push to local storage
}

// =======================================================================================================================================

function editTodo(valueToEdit) {
  Logic.setOldValue(valueToEdit);
  Logic.setEditMode(true); // we clicked the Edit btn so the mode is Edit now...
}
})();

/******/ })()
;
//# sourceMappingURL=bundle.7f443fa1d89a5af796e6.js.map