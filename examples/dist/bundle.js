require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = require('react');

var Option = React.createClass({
	displayName: 'Option',

	propTypes: {
		addLabelText: React.PropTypes.string, // string rendered in case of allowCreate option passed to ReactSelect
		className: React.PropTypes.string, // className (based on mouse position)
		mouseDown: React.PropTypes.func, // method to handle click on option element
		mouseEnter: React.PropTypes.func, // method to handle mouseEnter on option element
		mouseLeave: React.PropTypes.func, // method to handle mouseLeave on option element
		option: React.PropTypes.object.isRequired, // object that is base for that option
		renderFunc: React.PropTypes.func // method passed to ReactSelect component to render label text
	},

	render: function render() {
		var obj = this.props.option;
		var renderedLabel = this.props.renderFunc(obj);

		return obj.disabled ? React.createElement(
			'div',
			{ className: this.props.className },
			renderedLabel
		) : React.createElement(
			'div',
			{ className: this.props.className,
				onMouseEnter: this.props.mouseEnter,
				onMouseLeave: this.props.mouseLeave,
				onMouseDown: this.props.mouseDown,
				onClick: this.props.mouseDown },
			obj.create ? this.props.addLabelText.replace('{label}', obj.label) : renderedLabel
		);
	}
});

module.exports = Option;

},{"react":undefined}],2:[function(require,module,exports){
"use strict";

var React = require('react');

var SingleValue = React.createClass({
	displayName: "SingleValue",

	propTypes: {
		placeholder: React.PropTypes.string, // this is default value provided by React-Select based component
		value: React.PropTypes.object // selected option
	},
	render: function render() {
		return React.createElement(
			"div",
			{ className: "Select-placeholder" },
			this.props.placeholder
		);
	}
});

module.exports = SingleValue;

},{"react":undefined}],3:[function(require,module,exports){
'use strict';

var React = require('react');

var Value = React.createClass({

	displayName: 'Value',

	propTypes: {
		disabled: React.PropTypes.bool, // disabled prop passed to ReactSelect
		onOptionLabelClick: React.PropTypes.func, // method to handle click on value label
		onRemove: React.PropTypes.func, // method to handle remove of that value
		option: React.PropTypes.object.isRequired, // option passed to component
		optionLabelClick: React.PropTypes.bool, // indicates if onOptionLabelClick should be handled
		renderer: React.PropTypes.func // method to render option label passed to ReactSelect
	},

	blockEvent: function blockEvent(event) {
		event.stopPropagation();
	},

	handleOnRemove: function handleOnRemove(event) {
		if (!this.props.disabled) {
			this.props.onRemove(event);
		}
	},

	render: function render() {
		var label = this.props.option.label;
		if (this.props.renderer) {
			label = this.props.renderer(this.props.option);
		}

		if (!this.props.onRemove && !this.props.optionLabelClick) {
			return React.createElement(
				'div',
				{ className: 'Select-value' },
				label
			);
		}

		if (this.props.optionLabelClick) {
			label = React.createElement(
				'a',
				{ className: 'Select-item-label__a',
					onMouseDown: this.blockEvent,
					onTouchEnd: this.props.onOptionLabelClick,
					onClick: this.props.onOptionLabelClick },
				label
			);
		}

		return React.createElement(
			'div',
			{ className: 'Select-item' },
			React.createElement(
				'span',
				{ className: 'Select-item-icon',
					onMouseDown: this.blockEvent,
					onClick: this.handleOnRemove,
					onTouchEnd: this.handleOnRemove },
				'×'
			),
			React.createElement(
				'span',
				{ className: 'Select-item-label' },
				label
			)
		);
	}

});

module.exports = Value;

},{"react":undefined}],"react-select":[function(require,module,exports){
/* disable some rules until we refactor more completely; fixing them now would
 cause conflicts with some open PRs unnecessarily. */
/* eslint react/jsx-sort-prop-types: 0, react/sort-comp: 0, react/prop-types: 0 */

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var Input = require('react-input-autosize');
var classes = require('classnames');
var Value = require('./Value');
var SingleValue = require('./SingleValue');
var Option = require('./Option');

var requestId = 0;

var Select = React.createClass({

    displayName: 'Select',

    propTypes: {
        addLabelText: React.PropTypes.string, // placeholder displayed when you want to add a label on a multi-value input
        allowCreate: React.PropTypes.bool, // whether to allow creation of new entries
        asyncOptions: React.PropTypes.func, // function to call to get options
        autoload: React.PropTypes.bool, // whether to auto-load the default async options set
        backspaceRemoves: React.PropTypes.bool, // whether backspace removes an item if there is no text input
        cacheAsyncResults: React.PropTypes.bool, // whether to allow cache
        className: React.PropTypes.string, // className for the outer element
        clearAllText: React.PropTypes.string, // title for the "clear" control when multi: true
        clearValueText: React.PropTypes.string, // title for the "clear" control
        clearable: React.PropTypes.bool, // should it be possible to reset value
        delimiter: React.PropTypes.string, // delimiter to use to join multiple values
        disabled: React.PropTypes.bool, // whether the Select is disabled or not
        filterOption: React.PropTypes.func, // method to filter a single option: function(option, filterString)
        filterOptions: React.PropTypes.func, // method to filter the options array: function([options], filterString, [values])
        ignoreCase: React.PropTypes.bool, // whether to perform case-insensitive filtering
        inputProps: React.PropTypes.object, // custom attributes for the Input (in the Select-control) e.g: {'data-foo': 'bar'}
        matchPos: React.PropTypes.string, // (any|start) match the start or entire string when filtering
        matchProp: React.PropTypes.string, // (any|label|value) which option property to filter on
        multi: React.PropTypes.bool, // multi-value input
        name: React.PropTypes.string, // field name, for hidden <input /> tag
        newOptionCreator: React.PropTypes.func, // factory to create new options when allowCreate set
        noResultsText: React.PropTypes.string, // placeholder displayed when there are no matching search results
        onBlur: React.PropTypes.func, // onBlur handler: function(event) {}
        onChange: React.PropTypes.func, // onChange handler: function(newValue) {}
        onOpen: React.PropTypes.func, // fires when the menu is opened
        onClose: React.PropTypes.func, // fires when the menu is closed
        onFocus: React.PropTypes.func, // onFocus handler: function(event) {}
        onOptionLabelClick: React.PropTypes.func, // onCLick handler for value labels: function (value, event) {}
        optionComponent: React.PropTypes.func, // option component to render in dropdown
        optionRenderer: React.PropTypes.func, // optionRenderer: function(option) {}
        options: React.PropTypes.array, // array of options
        placeholder: React.PropTypes.string, // field placeholder, displayed when there's no value
        searchable: React.PropTypes.bool, // whether to enable searching feature or not
        searchPromptText: React.PropTypes.string, // label to prompt for search input
        singleValueComponent: React.PropTypes.func, // single value component when multiple is set to false
        value: React.PropTypes.any, // initial field value
        valueComponent: React.PropTypes.func, // value component to render in multiple mode
        valueRenderer: React.PropTypes.func // valueRenderer: function(option) {}
    },

    getDefaultProps: function getDefaultProps() {
        return {
            addLabelText: 'Add {label} ?',
            allowCreate: false,
            asyncOptions: undefined,
            autoload: true,
            backspaceRemoves: true,
            cacheAsyncResults: true,
            className: undefined,
            clearAllText: 'Clear all',
            clearValueText: 'Clear value',
            clearable: true,
            delimiter: ',',
            disabled: false,
            ignoreCase: true,
            inputProps: {},
            matchPos: 'any',
            matchProp: 'any',
            name: undefined,
            newOptionCreator: undefined,
            noResultsText: 'No results found',
            onChange: undefined,
            onOptionLabelClick: undefined,
            optionComponent: Option,
            options: undefined,
            placeholder: 'Select...',
            searchable: true,
            searchPromptText: 'Type to search',
            singleValueComponent: SingleValue,
            value: undefined,
            valueComponent: Value
        };
    },

    getInitialState: function getInitialState() {
        return {
            /*
             * set by getStateFromValue on componentWillMount:
             * - value
             * - values
             * - filteredOptions
             * - inputValue
             * - placeholder
             * - focusedOption
             */
            isFocused: false,
            isLoading: false,
            isOpen: false,
            options: this.props.options
        };
    },

    componentWillMount: function componentWillMount() {
        var _this = this;

        this._optionsCache = {};
        this._optionsFilterString = '';
        this._closeMenuIfClickedOutside = function (event) {
            if (!_this.state.isOpen) {
                return;
            }
            var menuElem = React.findDOMNode(_this.refs.selectMenuContainer);
            var controlElem = React.findDOMNode(_this.refs.control);

            var eventOccuredOutsideMenu = _this.clickedOutsideElement(menuElem, event);
            var eventOccuredOutsideControl = _this.clickedOutsideElement(controlElem, event);

            // Hide dropdown menu if click occurred outside of menu
            if (eventOccuredOutsideMenu && eventOccuredOutsideControl) {
                _this.setState({
                    isOpen: false
                }, _this._unbindCloseMenuIfClickedOutside);
            }
        };
        this._bindCloseMenuIfClickedOutside = function () {
            if (!document.addEventListener && document.attachEvent) {
                document.attachEvent('onclick', this._closeMenuIfClickedOutside);
            } else {
                document.addEventListener('click', this._closeMenuIfClickedOutside);
            }
        };
        this._unbindCloseMenuIfClickedOutside = function () {
            if (!document.removeEventListener && document.detachEvent) {
                document.detachEvent('onclick', this._closeMenuIfClickedOutside);
            } else {
                document.removeEventListener('click', this._closeMenuIfClickedOutside);
            }
        };
        this.setState(this.getStateFromValue(this.props.value));
    },

    componentDidMount: function componentDidMount() {
        if (this.props.asyncOptions && this.props.autoload) {
            this.autoloadAsyncOptions();
        }
    },

    componentWillUnmount: function componentWillUnmount() {
        clearTimeout(this._blurTimeout);
        if (this.state.isOpen) {
            this._unbindCloseMenuIfClickedOutside();
        }
    },

    componentWillReceiveProps: function componentWillReceiveProps(newProps) {
        var _this2 = this;

        var optionsChanged = false;
        if (JSON.stringify(newProps.options) !== JSON.stringify(this.props.options)) {
            optionsChanged = true;
            this.setState({
                options: newProps.options,
                filteredOptions: this.filterOptions(newProps.options)
            });
        }
        if (newProps.value !== this.state.value || newProps.placeholder !== this.props.placeholder || optionsChanged) {
            var setState = function setState(newState) {
                _this2.setState(_this2.getStateFromValue(newProps.value, newState && newState.options || newProps.options, newProps.placeholder));
            };
            if (this.props.asyncOptions) {
                this.loadAsyncOptions(newProps.value, {}, setState);
            } else {
                setState();
            }
        }
    },

    componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
        if (nextState.isOpen !== this.state.isOpen) {
            var handler = nextState.isOpen ? nextProps.onOpen : nextProps.onClose;
            handler && handler();
        }
    },

    componentDidUpdate: function componentDidUpdate() {
        if (!this.props.disabled) {
            clearTimeout(this._blurTimeout);
        }
        if (this._focusedOptionReveal) {
            if (this.refs.focused && this.refs.menu) {
                var focusedDOM = React.findDOMNode(this.refs.focused);
                var menuDOM = React.findDOMNode(this.refs.menu);
                var focusedRect = focusedDOM.getBoundingClientRect();
                var menuRect = menuDOM.getBoundingClientRect();

                if (focusedRect.bottom > menuRect.bottom || focusedRect.top < menuRect.top) {
                    menuDOM.scrollTop = focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight;
                }
            }
            this._focusedOptionReveal = false;
        }
    },

    focus: function focus() {
        this.getInputNode().focus();
    },

    clickedOutsideElement: function clickedOutsideElement(element, event) {
        var eventTarget = event.target ? event.target : event.srcElement;
        while (eventTarget != null) {
            if (eventTarget === element) {
                return false;
            }
            eventTarget = eventTarget.offsetParent;
        }
        return true;
    },

    getStateFromValue: function getStateFromValue(value, options, placeholder) {
        if (!options) {
            options = this.state.options;
        }
        if (!placeholder) {
            placeholder = this.props.placeholder;
        }

        // reset internal filter string
        this._optionsFilterString = '';

        var values = this.initValuesArray(value, options);
        var filteredOptions = this.filterOptions(options, values);

        var focusedOption;
        var valueForState = null;
        if (!this.props.multi && values.length) {
            focusedOption = values[0];
            valueForState = values[0].value;
        } else {
            for (var optionIndex = 0; optionIndex < filteredOptions.length; ++optionIndex) {
                if (!filteredOptions[optionIndex].disabled) {
                    focusedOption = filteredOptions[optionIndex];
                    break;
                }
            }
            valueForState = values.map(function (v) {
                return v.value;
            }).join(this.props.delimiter);
        }

        return {
            value: valueForState,
            values: values,
            inputValue: '',
            filteredOptions: filteredOptions,
            placeholder: !this.props.multi && values.length ? values[0].label : placeholder,
            focusedOption: focusedOption
        };
    },

    initValuesArray: function initValuesArray(values, options) {
        if (!Array.isArray(values)) {
            if (typeof values === 'string') {
                values = values === '' ? [] : values.split(this.props.delimiter);
            } else {
                values = values !== undefined && values !== null ? [values] : [];
            }
        }
        return values.map(function (val) {
            if (typeof val === 'string' || typeof val === 'number') {
                for (var key in options) {
                    if (options.hasOwnProperty(key) && options[key] && (options[key].value === val || typeof options[key].value === 'number' && options[key].value.toString() === val)) {
                        return options[key];
                    }
                }
                return { value: val, label: val };
            } else {
                return val;
            }
        });
    },

    setValue: function setValue(value) {
        var newState = this.getStateFromValue(value);
        newState.isOpen = false;
        this.fireChangeEvent(newState);
        this.setState(newState);
    },

    selectValue: function selectValue(value) {
        if (!this.props.multi) {
            this.setValue(value);
        } else if (value) {
            this.addValue(value);
        }
        this._unbindCloseMenuIfClickedOutside();
    },

    addValue: function addValue(value) {
        this.setValue(this.state.values.concat(value));
    },

    popValue: function popValue() {
        this.setValue(this.state.values.slice(0, this.state.values.length - 1));
    },

    removeValue: function removeValue(valueToRemove) {
        this.setValue(this.state.values.filter(function (value) {
            return value !== valueToRemove;
        }));
    },

    clearValue: function clearValue(event) {
        // if the event was triggered by a mousedown and not the primary
        // button, ignore it.
        if (event && event.type === 'mousedown' && event.button !== 0) {
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        this.setValue(null);
    },

    resetValue: function resetValue() {
        this.setValue(this.state.value === '' ? null : this.state.value);
    },

    getInputNode: function getInputNode() {
        var input = this.refs.input;
        return this.props.searchable ? input : React.findDOMNode(input);
    },

    fireChangeEvent: function fireChangeEvent(newState) {
        if (newState.value !== this.state.value && this.props.onChange) {
            this.props.onChange(newState.value, newState.values);
        }
    },

    handleMouseDown: function handleMouseDown(event) {
        // if the event was triggered by a mousedown and not the primary
        // button, or if the component is disabled, ignore it.
        if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
            return;
        }
        event.stopPropagation();
        event.preventDefault();

        // for the non-searchable select, close the dropdown when button is clicked
        if (this.state.isOpen && !this.props.searchable) {
            this.setState({
                isOpen: false
            }, this._unbindCloseMenuIfClickedOutside);
            return;
        }

        if (this.state.isFocused) {
            this.setState({
                isOpen: true
            }, this._bindCloseMenuIfClickedOutside);
        } else {
            this._openAfterFocus = true;
            this.getInputNode().focus();
        }
    },

    handleMouseDownOnArrow: function handleMouseDownOnArrow(event) {
        // if the event was triggered by a mousedown and not the primary
        // button, or if the component is disabled, ignore it.
        if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
            return;
        }
        // If not focused, handleMouseDown will handle it
        if (!this.state.isOpen) {
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        this.setState({
            isOpen: false
        }, this._unbindCloseMenuIfClickedOutside);
    },

    handleInputFocus: function handleInputFocus(event) {
        var newIsOpen = this.state.isOpen || this._openAfterFocus;
        this.setState({
            isFocused: true,
            isOpen: newIsOpen
        }, function () {
            if (newIsOpen) {
                this._bindCloseMenuIfClickedOutside();
            } else {
                this._unbindCloseMenuIfClickedOutside();
            }
        });
        this._openAfterFocus = false;
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    },

    handleInputBlur: function handleInputBlur(event) {
        var _this3 = this;

        this._blurTimeout = setTimeout(function () {
            _this3.setState({
                isFocused: false,
                isOpen: false
            });
        }, 50);
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    },

    handleKeyDown: function handleKeyDown(event) {
        if (this.props.disabled) {
            return;
        }
        switch (event.keyCode) {
            case 8:
                // backspace
                if (!this.state.inputValue && this.props.backspaceRemoves) {
                    this.popValue();
                }
                return;
            case 9:
                // tab
                if (event.shiftKey || !this.state.isOpen || !this.state.focusedOption) {
                    return;
                }
                this.selectFocusedOption();
                break;
            case 13:
                // enter
                if (!this.state.isOpen) {
                    return;
                }

                this.selectFocusedOption();
                break;
            case 27:
                // escape
                if (this.state.isOpen) {
                    this.resetValue();
                } else if (this.props.clearable) {
                    this.clearValue(event);
                }
                break;
            case 38:
                // up
                this.focusPreviousOption();
                break;
            case 40:
                // down
                this.focusNextOption();
                break;
            case 188:
                // ,
                if (this.props.allowCreate && this.props.multi) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.selectFocusedOption();
                } else {
                    return;
                }
                break;
            default:
                return;
        }
        event.preventDefault();
    },

    // Ensures that the currently focused option is available in filteredOptions.
    // If not, returns the first available option.
    _getNewFocusedOption: function _getNewFocusedOption(filteredOptions) {
        for (var key in filteredOptions) {
            if (filteredOptions.hasOwnProperty(key) && filteredOptions[key] === this.state.focusedOption) {
                return filteredOptions[key];
            }
        }
        return filteredOptions[0];
    },

    handleInputChange: function handleInputChange(event) {
        // assign an internal variable because we need to use
        // the latest value before setState() has completed.
        this._optionsFilterString = event.target.value;

        if (this.props.asyncOptions) {
            this.setState({
                isLoading: true,
                inputValue: event.target.value
            });
            this.loadAsyncOptions(event.target.value, {
                isLoading: false,
                isOpen: true
            }, this._bindCloseMenuIfClickedOutside);
        } else {
            var filteredOptions = this.filterOptions(this.state.options);
            this.setState({
                isOpen: true,
                inputValue: event.target.value,
                filteredOptions: filteredOptions,
                focusedOption: this._getNewFocusedOption(filteredOptions)
            }, this._bindCloseMenuIfClickedOutside);
        }
    },

    autoloadAsyncOptions: function autoloadAsyncOptions() {
        var _this4 = this;

        this.loadAsyncOptions(this.props.value || '', {}, function () {
            // update with fetched but don't focus
            _this4.setValue(_this4.props.value, false);
        });
    },

    loadAsyncOptions: function loadAsyncOptions(input, state, callback) {
        var _this5 = this;

        var thisRequestId = this._currentRequestId = requestId++;
        if (this.props.cacheAsyncResults) {
            for (var i = 0; i <= input.length; i++) {
                var cacheKey = input.slice(0, i);
                if (this._optionsCache[cacheKey] && (input === cacheKey || this._optionsCache[cacheKey].complete)) {
                    var options = this._optionsCache[cacheKey].options;
                    var filteredOptions = this.filterOptions(options);
                    var newState = {
                        options: options,
                        filteredOptions: filteredOptions,
                        focusedOption: this._getNewFocusedOption(filteredOptions)
                    };
                    for (var key in state) {
                        if (state.hasOwnProperty(key)) {
                            newState[key] = state[key];
                        }
                    }
                    this.setState(newState);
                    if (callback) {
                        callback.call(this, newState);
                    }
                    return;
                }
            }
        }

        this.props.asyncOptions(input, function (err, data) {
            if (err) {
                throw err;
            }
            if (_this5.props.cacheAsyncResults) {
                _this5._optionsCache[input] = data;
            }
            if (thisRequestId !== _this5._currentRequestId) {
                return;
            }
            var filteredOptions = _this5.filterOptions(data.options);
            var newState = {
                options: data.options,
                filteredOptions: filteredOptions,
                focusedOption: _this5._getNewFocusedOption(filteredOptions)
            };
            for (var key in state) {
                if (state.hasOwnProperty(key)) {
                    newState[key] = state[key];
                }
            }
            _this5.setState(newState);
            if (callback) {
                callback.call(_this5, newState);
            }
        });
    },

    filterOptions: function filterOptions(options, values) {
        var filterValue = this._optionsFilterString;
        var exclude = (values || this.state.values).map(function (i) {
            return i.value;
        });
        if (this.props.filterOptions) {
            return this.props.filterOptions.call(this, options, filterValue, exclude);
        } else {
            var filterOption = function filterOption(op) {
                if (this.props.multi && exclude.indexOf(op.value) > -1) {
                    return false;
                }
                if (this.props.filterOption) {
                    return this.props.filterOption.call(this, op, filterValue);
                }
                var valueTest = String(op.value),
                    labelTest = String(op.label);
                if (this.props.ignoreCase) {
                    valueTest = valueTest.toLowerCase();
                    labelTest = labelTest.toLowerCase();
                    filterValue = filterValue.toLowerCase();
                }
                return !filterValue || this.props.matchPos === 'start' ? this.props.matchProp !== 'label' && valueTest.substr(0, filterValue.length) === filterValue || this.props.matchProp !== 'value' && labelTest.substr(0, filterValue.length) === filterValue : this.props.matchProp !== 'label' && valueTest.indexOf(filterValue) >= 0 || this.props.matchProp !== 'value' && labelTest.indexOf(filterValue) >= 0;
            };
            return (options || []).filter(filterOption, this);
        }
    },

    selectFocusedOption: function selectFocusedOption() {
        if (this.props.allowCreate && !this.state.focusedOption) {
            return this.selectValue(this.state.inputValue);
        }
        return this.selectValue(this.state.focusedOption);
    },

    focusOption: function focusOption(op) {
        this.setState({
            focusedOption: op
        });
    },

    focusNextOption: function focusNextOption() {
        this.focusAdjacentOption('next');
    },

    focusPreviousOption: function focusPreviousOption() {
        this.focusAdjacentOption('previous');
    },

    focusAdjacentOption: function focusAdjacentOption(dir) {
        this._focusedOptionReveal = true;
        var ops = this.state.filteredOptions.filter(function (op) {
            return !op.disabled;
        });
        if (!this.state.isOpen) {
            this.setState({
                isOpen: true,
                inputValue: '',
                focusedOption: this.state.focusedOption || ops[dir === 'next' ? 0 : ops.length - 1]
            }, this._bindCloseMenuIfClickedOutside);
            return;
        }
        if (!ops.length) {
            return;
        }
        var focusedIndex = -1;
        for (var i = 0; i < ops.length; i++) {
            if (this.state.focusedOption === ops[i]) {
                focusedIndex = i;
                break;
            }
        }
        var focusedOption = ops[0];
        if (dir === 'next' && focusedIndex > -1 && focusedIndex < ops.length - 1) {
            focusedOption = ops[focusedIndex + 1];
        } else if (dir === 'previous') {
            if (focusedIndex > 0) {
                focusedOption = ops[focusedIndex - 1];
            } else {
                focusedOption = ops[ops.length - 1];
            }
        }
        this.setState({
            focusedOption: focusedOption
        });
    },

    unfocusOption: function unfocusOption(op) {
        if (this.state.focusedOption === op) {
            this.setState({
                focusedOption: null
            });
        }
    },

    buildMenu: function buildMenu() {
        var focusedValue = this.state.focusedOption ? this.state.focusedOption.value : null;
        var renderLabel = this.props.optionRenderer || function (op) {
            return op.label;
        };
        if (this.state.filteredOptions.length > 0) {
            focusedValue = focusedValue == null ? this.state.filteredOptions[0] : focusedValue;
        }
        // Add the current value to the filtered options in last resort
        var options = this.state.filteredOptions;
        if (this.props.allowCreate && this.state.inputValue.trim()) {
            var inputValue = this.state.inputValue;
            options = options.slice();
            var newOption = this.props.newOptionCreator ? this.props.newOptionCreator(inputValue) : {
                value: inputValue,
                label: inputValue,
                create: true
            };
            options.unshift(newOption);
        }
        var ops = Object.keys(options).map(function (key) {
            var op = options[key];
            var isSelected = this.state.value === op.value;
            var isFocused = focusedValue === op.value;
            var optionClass = classes({
                'Select-option': true,
                'is-selected': isSelected,
                'is-focused': isFocused,
                'is-disabled': op.disabled
            });
            var ref = isFocused ? 'focused' : null;
            var mouseEnter = this.focusOption.bind(this, op);
            var mouseLeave = this.unfocusOption.bind(this, op);
            var mouseDown = this.selectValue.bind(this, op);
            var optionResult = React.createElement(this.props.optionComponent, {
                key: 'option-' + op.value,
                className: optionClass,
                renderFunc: renderLabel,
                mouseEnter: mouseEnter,
                mouseLeave: mouseLeave,
                mouseDown: mouseDown,
                click: mouseDown,
                addLabelText: this.props.addLabelText,
                option: op,
                ref: ref
            });
            return optionResult;
        }, this);
        return ops.length ? ops : React.createElement(
            'div',
            { className: 'Select-noresults' },
            this.props.asyncOptions && !this.state.inputValue ? this.props.searchPromptText : this.props.noResultsText
        );
    },

    handleOptionLabelClick: function handleOptionLabelClick(value, event) {
        if (this.props.onOptionLabelClick) {
            this.props.onOptionLabelClick(value, event);
        }
    },

    render: function render() {
        var selectClass = classes('Select', this.props.className, {
            'is-multi': this.props.multi,
            'is-searchable': this.props.searchable,
            'is-open': this.state.isOpen,
            'is-focused': this.state.isFocused,
            'is-loading': this.state.isLoading,
            'is-disabled': this.props.disabled,
            'has-value': this.state.value
        });
        var value = [];
        if (this.props.multi) {
            this.state.values.forEach(function (val) {
                var onOptionLabelClick = this.handleOptionLabelClick.bind(this, val);
                var onRemove = this.removeValue.bind(this, val);
                var valueComponent = React.createElement(this.props.valueComponent, {
                    key: val.value,
                    option: val,
                    renderer: this.props.valueRenderer,
                    optionLabelClick: !!this.props.onOptionLabelClick,
                    onOptionLabelClick: onOptionLabelClick,
                    onRemove: onRemove,
                    disabled: this.props.disabled
                });
                value.push(valueComponent);
            }, this);
        }

        if (!this.state.inputValue && (!this.props.multi || !value.length)) {
            var val = this.state.values[0] || null;
            if (this.props.valueRenderer && !!this.state.values.length) {
                value.push(React.createElement(Value, {
                    key: 0,
                    option: val,
                    renderer: this.props.valueRenderer,
                    disabled: this.props.disabled }));
            } else {
                var singleValueComponent = React.createElement(this.props.singleValueComponent, {
                    key: 'placeholder',
                    value: val,
                    placeholder: this.state.placeholder
                });
                value.push(singleValueComponent);
            }
        }

        var loading = this.state.isLoading ? React.createElement('span', { className: 'Select-loading', 'aria-hidden': 'true' }) : null;
        var clear = this.props.clearable && this.state.value && !this.props.disabled ? React.createElement('span', { className: 'Select-clear',
            title: this.props.multi ? this.props.clearAllText : this.props.clearValueText,
            'aria-label': this.props.multi ? this.props.clearAllText : this.props.clearValueText,
            onMouseDown: this.clearValue,
            onClick: this.clearValue,
            dangerouslySetInnerHTML: { __html: '&times;' } }) : null;

        var menu;
        var menuProps;
        if (this.state.isOpen) {
            menuProps = {
                ref: 'menu',
                className: 'Select-menu'
            };
            if (this.props.multi) {
                menuProps.onMouseDown = this.handleMouseDown;
            }
            menu = React.createElement(
                'div',
                { ref: 'selectMenuContainer', className: 'Select-menu-outer' },
                React.createElement(
                    'div',
                    menuProps,
                    this.buildMenu()
                )
            );
        }

        var input;
        var inputProps = {
            ref: 'input',
            className: 'Select-input ' + (this.props.inputProps.className || ''),
            tabIndex: this.props.tabIndex || 0,
            onFocus: this.handleInputFocus,
            onBlur: this.handleInputBlur
        };
        for (var key in this.props.inputProps) {
            if (this.props.inputProps.hasOwnProperty(key) && key !== 'className') {
                inputProps[key] = this.props.inputProps[key];
            }
        }

        if (!this.props.disabled) {
            if (this.props.searchable) {
                input = React.createElement(Input, _extends({ value: this.state.inputValue, onChange: this.handleInputChange,
                    minWidth: '5' }, inputProps));
            } else {
                input = React.createElement(
                    'div',
                    inputProps,
                    ' '
                );
            }
        } else if (!this.props.multi || !this.state.values.length) {
            input = React.createElement(
                'div',
                { className: 'Select-input' },
                ' '
            );
        }

        return React.createElement(
            'div',
            { ref: 'wrapper', className: selectClass },
            React.createElement('input', { type: 'hidden', ref: 'value', name: this.props.name, value: this.state.value,
                disabled: this.props.disabled }),
            React.createElement(
                'div',
                { className: 'Select-control', ref: 'control', onKeyDown: this.handleKeyDown,
                    onMouseDown: this.handleMouseDown, onTouchEnd: this.handleMouseDown },
                value,
                input,
                React.createElement('span', { className: 'Select-arrow-zone', onMouseDown: this.handleMouseDownOnArrow }),
                React.createElement('span', { className: 'Select-arrow', onMouseDown: this.handleMouseDownOnArrow }),
                loading,
                clear
            ),
            menu
        );
    }

});

module.exports = Select;

},{"./Option":1,"./SingleValue":2,"./Value":3,"classnames":undefined,"react":undefined,"react-input-autosize":undefined}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcGF0cmlja21ja2VsdnkvRG9jdW1lbnRzL3dvcmsvcmVhY3Qtc2VsZWN0L3NyYy9PcHRpb24uanMiLCIvVXNlcnMvcGF0cmlja21ja2VsdnkvRG9jdW1lbnRzL3dvcmsvcmVhY3Qtc2VsZWN0L3NyYy9TaW5nbGVWYWx1ZS5qcyIsIi9Vc2Vycy9wYXRyaWNrbWNrZWx2eS9Eb2N1bWVudHMvd29yay9yZWFjdC1zZWxlY3Qvc3JjL1ZhbHVlLmpzIiwiL1VzZXJzL3BhdHJpY2ttY2tlbHZ5L0RvY3VtZW50cy93b3JrL3JlYWN0LXNlbGVjdC9zcmMvU2VsZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUM5QixVQUFTLEVBQUU7QUFDVixjQUFZLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNO0FBQ3BDLFdBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07QUFDakMsV0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSTtBQUMvQixZQUFVLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0FBQ2hDLFlBQVUsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUk7QUFDaEMsUUFBTSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVU7QUFDekMsWUFBVSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSTtFQUNoQzs7QUFFRCxPQUFNLEVBQUUsa0JBQVc7QUFDbEIsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDNUIsTUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxD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LFdBQVcsQUFBQztZQUMxQywrQkFBTyxJQUFJLEVBQUcsUUFBUSxFQUFDLEdBQUcsRUFBRyxPQUFPLEVBQUMsSUFBSSxFQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxBQUFDLEVBQUMsS0FBSyxFQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxBQUFDO0FBQ2pGLHdCQUFRLEVBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEFBQUMsR0FBRTtZQUN6Qzs7a0JBQUssU0FBUyxFQUFHLGdCQUFnQixFQUFDLEdBQUcsRUFBRyxTQUFTLEVBQUMsU0FBUyxFQUFJLElBQUksQ0FBQyxhQUFhLEFBQUM7QUFDN0UsK0JBQVcsRUFBSSxJQUFJLENBQUMsZUFBZSxBQUFDLEVBQUMsVUFBVSxFQUFJLElBQUksQ0FBQyxlQUFlLEFBQUM7Z0JBQ3hFLEtBQUs7Z0JBQ0wsS0FBSztnQkFDTiw4QkFBTSxTQUFTLEVBQUcsbUJBQW1CLEVBQUMsV0FBVyxFQUFJLElBQUksQ0FBQyxzQkFBc0IsQUFBQyxHQUFFO2dCQUNuRiw4QkFBTSxTQUFTLEVBQUcsY0FBYyxFQUFDLFdBQVcsRUFBSSxJQUFJLENBQUMsc0JBQXNCLEFBQUMsR0FBRTtnQkFDN0UsT0FBTztnQkFDUCxLQUFLO2FBQ0o7WUFDTCxJQUFJO1NBQ0gsQ0FDUjtLQUNMOztDQUVKLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgT3B0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRwcm9wVHlwZXM6IHtcblx0XHRhZGRMYWJlbFRleHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgIC8vIHN0cmluZyByZW5kZXJlZCBpbiBjYXNlIG9mIGFsbG93Q3JlYXRlIG9wdGlvbiBwYXNzZWQgdG8gUmVhY3RTZWxlY3Rcblx0XHRjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgICAgIC8vIGNsYXNzTmFtZSAoYmFzZWQgb24gbW91c2UgcG9zaXRpb24pXG5cdFx0bW91c2VEb3duOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgICAvLyBtZXRob2QgdG8gaGFuZGxlIGNsaWNrIG9uIG9wdGlvbiBlbGVtZW50XG5cdFx0bW91c2VFbnRlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAvLyBtZXRob2QgdG8gaGFuZGxlIG1vdXNlRW50ZXIgb24gb3B0aW9uIGVsZW1lbnRcblx0XHRtb3VzZUxlYXZlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgIC8vIG1ldGhvZCB0byBoYW5kbGUgbW91c2VMZWF2ZSBvbiBvcHRpb24gZWxlbWVudFxuXHRcdG9wdGlvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLCAgICAgLy8gb2JqZWN0IHRoYXQgaXMgYmFzZSBmb3IgdGhhdCBvcHRpb25cblx0XHRyZW5kZXJGdW5jOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyAgICAgICAgICAgICAgIC8vIG1ldGhvZCBwYXNzZWQgdG8gUmVhY3RTZWxlY3QgY29tcG9uZW50IHRvIHJlbmRlciBsYWJlbCB0ZXh0XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgb2JqID0gdGhpcy5wcm9wcy5vcHRpb247XG5cdFx0dmFyIHJlbmRlcmVkTGFiZWwgPSB0aGlzLnByb3BzLnJlbmRlckZ1bmMob2JqKTtcblxuXHRcdHJldHVybiBvYmouZGlzYWJsZWQgPyAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc05hbWV9PntyZW5kZXJlZExhYmVsfTwvZGl2PlxuXHRcdCkgOiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc05hbWV9XG5cdFx0XHRcdG9uTW91c2VFbnRlcj17dGhpcy5wcm9wcy5tb3VzZUVudGVyfVxuXHRcdFx0XHRvbk1vdXNlTGVhdmU9e3RoaXMucHJvcHMubW91c2VMZWF2ZX1cblx0XHRcdFx0b25Nb3VzZURvd249e3RoaXMucHJvcHMubW91c2VEb3dufVxuXHRcdFx0XHRvbkNsaWNrPXt0aGlzLnByb3BzLm1vdXNlRG93bn0+XG5cdFx0XHRcdHsgb2JqLmNyZWF0ZSA/IHRoaXMucHJvcHMuYWRkTGFiZWxUZXh0LnJlcGxhY2UoJ3tsYWJlbH0nLCBvYmoubGFiZWwpIDogcmVuZGVyZWRMYWJlbCB9XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBPcHRpb247XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgU2luZ2xlVmFsdWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdHByb3BUeXBlczoge1xuXHRcdHBsYWNlaG9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAvLyB0aGlzIGlzIGRlZmF1bHQgdmFsdWUgcHJvdmlkZWQgYnkgUmVhY3QtU2VsZWN0IGJhc2VkIGNvbXBvbmVudFxuXHRcdHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0ICAgICAgICAgICAgICAvLyBzZWxlY3RlZCBvcHRpb25cblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJTZWxlY3QtcGxhY2Vob2xkZXJcIj57dGhpcy5wcm9wcy5wbGFjZWhvbGRlcn08L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTaW5nbGVWYWx1ZTtcbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBWYWx1ZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRkaXNwbGF5TmFtZTogJ1ZhbHVlJyxcblxuXHRwcm9wVHlwZXM6IHtcblx0XHRkaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAgICAgIC8vIGRpc2FibGVkIHByb3AgcGFzc2VkIHRvIFJlYWN0U2VsZWN0XG5cdFx0b25PcHRpb25MYWJlbENsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAvLyBtZXRob2QgdG8gaGFuZGxlIGNsaWNrIG9uIHZhbHVlIGxhYmVsXG5cdFx0b25SZW1vdmU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgICAgICAgICAgICAvLyBtZXRob2QgdG8gaGFuZGxlIHJlbW92ZSBvZiB0aGF0IHZhbHVlXG5cdFx0b3B0aW9uOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsICAgICAgICAvLyBvcHRpb24gcGFzc2VkIHRvIGNvbXBvbmVudFxuXHRcdG9wdGlvbkxhYmVsQ2xpY2s6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgLy8gaW5kaWNhdGVzIGlmIG9uT3B0aW9uTGFiZWxDbGljayBzaG91bGQgYmUgaGFuZGxlZFxuXHRcdHJlbmRlcmVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyAgICAgICAgICAgICAgICAgICAgLy8gbWV0aG9kIHRvIHJlbmRlciBvcHRpb24gbGFiZWwgcGFzc2VkIHRvIFJlYWN0U2VsZWN0XG5cdH0sXG5cblx0YmxvY2tFdmVudDogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0fSxcblxuXHRoYW5kbGVPblJlbW92ZTogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZiAoIXRoaXMucHJvcHMuZGlzYWJsZWQpIHtcblx0XHRcdHRoaXMucHJvcHMub25SZW1vdmUoZXZlbnQpO1xuXHRcdH1cblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBsYWJlbCA9IHRoaXMucHJvcHMub3B0aW9uLmxhYmVsO1xuXHRcdGlmICh0aGlzLnByb3BzLnJlbmRlcmVyKSB7XG5cdFx0XHRsYWJlbCA9IHRoaXMucHJvcHMucmVuZGVyZXIodGhpcy5wcm9wcy5vcHRpb24pO1xuXHRcdH1cblxuXHRcdGlmKCF0aGlzLnByb3BzLm9uUmVtb3ZlICYmICF0aGlzLnByb3BzLm9wdGlvbkxhYmVsQ2xpY2spIHtcblx0XHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIlNlbGVjdC12YWx1ZVwiPntsYWJlbH08L2Rpdj47XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMucHJvcHMub3B0aW9uTGFiZWxDbGljaykge1xuXHRcdFx0bGFiZWwgPSAoXG5cdFx0XHRcdDxhIGNsYXNzTmFtZT1cIlNlbGVjdC1pdGVtLWxhYmVsX19hXCJcblx0XHRcdFx0XHRvbk1vdXNlRG93bj17dGhpcy5ibG9ja0V2ZW50fVxuXHRcdFx0XHRcdG9uVG91Y2hFbmQ9e3RoaXMucHJvcHMub25PcHRpb25MYWJlbENsaWNrfVxuXHRcdFx0XHRcdG9uQ2xpY2s9e3RoaXMucHJvcHMub25PcHRpb25MYWJlbENsaWNrfT5cblx0XHRcdFx0XHR7bGFiZWx9XG5cdFx0XHRcdDwvYT5cblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiU2VsZWN0LWl0ZW1cIj5cblx0XHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiU2VsZWN0LWl0ZW0taWNvblwiXG5cdFx0XHRcdFx0b25Nb3VzZURvd249e3RoaXMuYmxvY2tFdmVudH1cblx0XHRcdFx0XHRvbkNsaWNrPXt0aGlzLmhhbmRsZU9uUmVtb3ZlfVxuXHRcdFx0XHRcdG9uVG91Y2hFbmQ9e3RoaXMuaGFuZGxlT25SZW1vdmV9PiZ0aW1lczs8L3NwYW4+XG5cdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cIlNlbGVjdC1pdGVtLWxhYmVsXCI+e2xhYmVsfTwvc3Bhbj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmFsdWU7XG4iLCIvKiBkaXNhYmxlIHNvbWUgcnVsZXMgdW50aWwgd2UgcmVmYWN0b3IgbW9yZSBjb21wbGV0ZWx5OyBmaXhpbmcgdGhlbSBub3cgd291bGRcbiBjYXVzZSBjb25mbGljdHMgd2l0aCBzb21lIG9wZW4gUFJzIHVubmVjZXNzYXJpbHkuICovXG4vKiBlc2xpbnQgcmVhY3QvanN4LXNvcnQtcHJvcC10eXBlczogMCwgcmVhY3Qvc29ydC1jb21wOiAwLCByZWFjdC9wcm9wLXR5cGVzOiAwICovXG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgSW5wdXQgPSByZXF1aXJlKCdyZWFjdC1pbnB1dC1hdXRvc2l6ZScpO1xudmFyIGNsYXNzZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG52YXIgVmFsdWUgPSByZXF1aXJlKCcuL1ZhbHVlJyk7XG52YXIgU2luZ2xlVmFsdWUgPSByZXF1aXJlKCcuL1NpbmdsZVZhbHVlJyk7XG52YXIgT3B0aW9uID0gcmVxdWlyZSgnLi9PcHRpb24nKTtcblxudmFyIHJlcXVlc3RJZCA9IDA7XG5cbnZhciBTZWxlY3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbiAgICBkaXNwbGF5TmFtZTogJ1NlbGVjdCcsXG5cbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgYWRkTGFiZWxUZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgIC8vIHBsYWNlaG9sZGVyIGRpc3BsYXllZCB3aGVuIHlvdSB3YW50IHRvIGFkZCBhIGxhYmVsIG9uIGEgbXVsdGktdmFsdWUgaW5wdXRcbiAgICAgICAgYWxsb3dDcmVhdGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgIC8vIHdoZXRoZXIgdG8gYWxsb3cgY3JlYXRpb24gb2YgbmV3IGVudHJpZXNcbiAgICAgICAgYXN5bmNPcHRpb25zOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgIC8vIGZ1bmN0aW9uIHRvIGNhbGwgdG8gZ2V0IG9wdGlvbnNcbiAgICAgICAgYXV0b2xvYWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgIC8vIHdoZXRoZXIgdG8gYXV0by1sb2FkIHRoZSBkZWZhdWx0IGFzeW5jIG9wdGlvbnMgc2V0XG4gICAgICAgIGJhY2tzcGFjZVJlbW92ZXM6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAvLyB3aGV0aGVyIGJhY2tzcGFjZSByZW1vdmVzIGFuIGl0ZW0gaWYgdGhlcmUgaXMgbm8gdGV4dCBpbnB1dFxuICAgICAgICBjYWNoZUFzeW5jUmVzdWx0czogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgLy8gd2hldGhlciB0byBhbGxvdyBjYWNoZVxuICAgICAgICBjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgLy8gY2xhc3NOYW1lIGZvciB0aGUgb3V0ZXIgZWxlbWVudFxuICAgICAgICBjbGVhckFsbFRleHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgLy8gdGl0bGUgZm9yIHRoZSBcImNsZWFyXCIgY29udHJvbCB3aGVuIG11bHRpOiB0cnVlXG4gICAgICAgIGNsZWFyVmFsdWVUZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAvLyB0aXRsZSBmb3IgdGhlIFwiY2xlYXJcIiBjb250cm9sXG4gICAgICAgIGNsZWFyYWJsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAvLyBzaG91bGQgaXQgYmUgcG9zc2libGUgdG8gcmVzZXQgdmFsdWVcbiAgICAgICAgZGVsaW1pdGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgIC8vIGRlbGltaXRlciB0byB1c2UgdG8gam9pbiBtdWx0aXBsZSB2YWx1ZXNcbiAgICAgICAgZGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLCAgICAgICAgICAgIC8vIHdoZXRoZXIgdGhlIFNlbGVjdCBpcyBkaXNhYmxlZCBvciBub3RcbiAgICAgICAgZmlsdGVyT3B0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgIC8vIG1ldGhvZCB0byBmaWx0ZXIgYSBzaW5nbGUgb3B0aW9uOiBmdW5jdGlvbihvcHRpb24sIGZpbHRlclN0cmluZylcbiAgICAgICAgZmlsdGVyT3B0aW9uczogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgIC8vIG1ldGhvZCB0byBmaWx0ZXIgdGhlIG9wdGlvbnMgYXJyYXk6IGZ1bmN0aW9uKFtvcHRpb25zXSwgZmlsdGVyU3RyaW5nLCBbdmFsdWVzXSlcbiAgICAgICAgaWdub3JlQ2FzZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsICAgICAgICAgIC8vIHdoZXRoZXIgdG8gcGVyZm9ybSBjYXNlLWluc2Vuc2l0aXZlIGZpbHRlcmluZ1xuICAgICAgICBpbnB1dFByb3BzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LCAgICAgICAgLy8gY3VzdG9tIGF0dHJpYnV0ZXMgZm9yIHRoZSBJbnB1dCAoaW4gdGhlIFNlbGVjdC1jb250cm9sKSBlLmc6IHsnZGF0YS1mb28nOiAnYmFyJ31cbiAgICAgICAgbWF0Y2hQb3M6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgIC8vIChhbnl8c3RhcnQpIG1hdGNoIHRoZSBzdGFydCBvciBlbnRpcmUgc3RyaW5nIHdoZW4gZmlsdGVyaW5nXG4gICAgICAgIG1hdGNoUHJvcDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAvLyAoYW55fGxhYmVsfHZhbHVlKSB3aGljaCBvcHRpb24gcHJvcGVydHkgdG8gZmlsdGVyIG9uXG4gICAgICAgIG11bHRpOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAgICAvLyBtdWx0aS12YWx1ZSBpbnB1dFxuICAgICAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgICAgLy8gZmllbGQgbmFtZSwgZm9yIGhpZGRlbiA8aW5wdXQgLz4gdGFnXG4gICAgICAgIG5ld09wdGlvbkNyZWF0b3I6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAvLyBmYWN0b3J5IHRvIGNyZWF0ZSBuZXcgb3B0aW9ucyB3aGVuIGFsbG93Q3JlYXRlIHNldFxuICAgICAgICBub1Jlc3VsdHNUZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgLy8gcGxhY2Vob2xkZXIgZGlzcGxheWVkIHdoZW4gdGhlcmUgYXJlIG5vIG1hdGNoaW5nIHNlYXJjaCByZXN1bHRzXG4gICAgICAgIG9uQmx1cjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAvLyBvbkJsdXIgaGFuZGxlcjogZnVuY3Rpb24oZXZlbnQpIHt9XG4gICAgICAgIG9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAvLyBvbkNoYW5nZSBoYW5kbGVyOiBmdW5jdGlvbihuZXdWYWx1ZSkge31cbiAgICAgICAgb25PcGVuOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgIC8vIGZpcmVzIHdoZW4gdGhlIG1lbnUgaXMgb3BlbmVkXG4gICAgICAgIG9uQ2xvc2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgICAgICAgICAvLyBmaXJlcyB3aGVuIHRoZSBtZW51IGlzIGNsb3NlZFxuICAgICAgICBvbkZvY3VzOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgLy8gb25Gb2N1cyBoYW5kbGVyOiBmdW5jdGlvbihldmVudCkge31cbiAgICAgICAgb25PcHRpb25MYWJlbENsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYywgIC8vIG9uQ0xpY2sgaGFuZGxlciBmb3IgdmFsdWUgbGFiZWxzOiBmdW5jdGlvbiAodmFsdWUsIGV2ZW50KSB7fVxuICAgICAgICBvcHRpb25Db21wb25lbnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgLy8gb3B0aW9uIGNvbXBvbmVudCB0byByZW5kZXIgaW4gZHJvcGRvd25cbiAgICAgICAgb3B0aW9uUmVuZGVyZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLCAgICAgIC8vIG9wdGlvblJlbmRlcmVyOiBmdW5jdGlvbihvcHRpb24pIHt9XG4gICAgICAgIG9wdGlvbnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSwgICAgICAgICAgICAvLyBhcnJheSBvZiBvcHRpb25zXG4gICAgICAgIHBsYWNlaG9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLCAgICAgICAvLyBmaWVsZCBwbGFjZWhvbGRlciwgZGlzcGxheWVkIHdoZW4gdGhlcmUncyBubyB2YWx1ZVxuICAgICAgICBzZWFyY2hhYmxlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCwgICAgICAgICAgLy8gd2hldGhlciB0byBlbmFibGUgc2VhcmNoaW5nIGZlYXR1cmUgb3Igbm90XG4gICAgICAgIHNlYXJjaFByb21wdFRleHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsICAvLyBsYWJlbCB0byBwcm9tcHQgZm9yIHNlYXJjaCBpbnB1dFxuICAgICAgICBzaW5nbGVWYWx1ZUNvbXBvbmVudDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsLy8gc2luZ2xlIHZhbHVlIGNvbXBvbmVudCB3aGVuIG11bHRpcGxlIGlzIHNldCB0byBmYWxzZVxuICAgICAgICB2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLmFueSwgICAgICAgICAgICAgICAgLy8gaW5pdGlhbCBmaWVsZCB2YWx1ZVxuICAgICAgICB2YWx1ZUNvbXBvbmVudDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsICAgICAgLy8gdmFsdWUgY29tcG9uZW50IHRvIHJlbmRlciBpbiBtdWx0aXBsZSBtb2RlXG4gICAgICAgIHZhbHVlUmVuZGVyZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jICAgICAgICAvLyB2YWx1ZVJlbmRlcmVyOiBmdW5jdGlvbihvcHRpb24pIHt9XG4gICAgfSxcblxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWRkTGFiZWxUZXh0OiAnQWRkIHtsYWJlbH0gPycsXG4gICAgICAgICAgICBhbGxvd0NyZWF0ZTogZmFsc2UsXG4gICAgICAgICAgICBhc3luY09wdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGF1dG9sb2FkOiB0cnVlLFxuICAgICAgICAgICAgYmFja3NwYWNlUmVtb3ZlczogdHJ1ZSxcbiAgICAgICAgICAgIGNhY2hlQXN5bmNSZXN1bHRzOiB0cnVlLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBjbGVhckFsbFRleHQ6ICdDbGVhciBhbGwnLFxuICAgICAgICAgICAgY2xlYXJWYWx1ZVRleHQ6ICdDbGVhciB2YWx1ZScsXG4gICAgICAgICAgICBjbGVhcmFibGU6IHRydWUsXG4gICAgICAgICAgICBkZWxpbWl0ZXI6ICcsJyxcbiAgICAgICAgICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGlnbm9yZUNhc2U6IHRydWUsXG4gICAgICAgICAgICBpbnB1dFByb3BzOiB7fSxcbiAgICAgICAgICAgIG1hdGNoUG9zOiAnYW55JyxcbiAgICAgICAgICAgIG1hdGNoUHJvcDogJ2FueScsXG4gICAgICAgICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBuZXdPcHRpb25DcmVhdG9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBub1Jlc3VsdHNUZXh0OiAnTm8gcmVzdWx0cyBmb3VuZCcsXG4gICAgICAgICAgICBvbkNoYW5nZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgb25PcHRpb25MYWJlbENsaWNrOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBvcHRpb25Db21wb25lbnQ6IE9wdGlvbixcbiAgICAgICAgICAgIG9wdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnU2VsZWN0Li4uJyxcbiAgICAgICAgICAgIHNlYXJjaGFibGU6IHRydWUsXG4gICAgICAgICAgICBzZWFyY2hQcm9tcHRUZXh0OiAnVHlwZSB0byBzZWFyY2gnLFxuICAgICAgICAgICAgc2luZ2xlVmFsdWVDb21wb25lbnQ6IFNpbmdsZVZhbHVlLFxuICAgICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHZhbHVlQ29tcG9uZW50OiBWYWx1ZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBzZXQgYnkgZ2V0U3RhdGVGcm9tVmFsdWUgb24gY29tcG9uZW50V2lsbE1vdW50OlxuICAgICAgICAgICAgICogLSB2YWx1ZVxuICAgICAgICAgICAgICogLSB2YWx1ZXNcbiAgICAgICAgICAgICAqIC0gZmlsdGVyZWRPcHRpb25zXG4gICAgICAgICAgICAgKiAtIGlucHV0VmFsdWVcbiAgICAgICAgICAgICAqIC0gcGxhY2Vob2xkZXJcbiAgICAgICAgICAgICAqIC0gZm9jdXNlZE9wdGlvblxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpc0ZvY3VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgIGlzT3BlbjogZmFsc2UsXG4gICAgICAgICAgICBvcHRpb25zOiB0aGlzLnByb3BzLm9wdGlvbnNcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX29wdGlvbnNDYWNoZSA9IHt9O1xuICAgICAgICB0aGlzLl9vcHRpb25zRmlsdGVyU3RyaW5nID0gJyc7XG4gICAgICAgIHRoaXMuX2Nsb3NlTWVudUlmQ2xpY2tlZE91dHNpZGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbWVudUVsZW0gPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuc2VsZWN0TWVudUNvbnRhaW5lcik7XG4gICAgICAgICAgICB2YXIgY29udHJvbEVsZW0gPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuY29udHJvbCk7XG5cbiAgICAgICAgICAgIHZhciBldmVudE9jY3VyZWRPdXRzaWRlTWVudSA9IHRoaXMuY2xpY2tlZE91dHNpZGVFbGVtZW50KG1lbnVFbGVtLCBldmVudCk7XG4gICAgICAgICAgICB2YXIgZXZlbnRPY2N1cmVkT3V0c2lkZUNvbnRyb2wgPSB0aGlzLmNsaWNrZWRPdXRzaWRlRWxlbWVudChjb250cm9sRWxlbSwgZXZlbnQpO1xuXG4gICAgICAgICAgICAvLyBIaWRlIGRyb3Bkb3duIG1lbnUgaWYgY2xpY2sgb2NjdXJyZWQgb3V0c2lkZSBvZiBtZW51XG4gICAgICAgICAgICBpZiAoZXZlbnRPY2N1cmVkT3V0c2lkZU1lbnUgJiYgZXZlbnRPY2N1cmVkT3V0c2lkZUNvbnRyb2wpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgaXNPcGVuOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0sIHRoaXMuX3VuYmluZENsb3NlTWVudUlmQ2xpY2tlZE91dHNpZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9iaW5kQ2xvc2VNZW51SWZDbGlja2VkT3V0c2lkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAmJiBkb2N1bWVudC5hdHRhY2hFdmVudCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmF0dGFjaEV2ZW50KCdvbmNsaWNrJywgdGhpcy5fY2xvc2VNZW51SWZDbGlja2VkT3V0c2lkZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2Nsb3NlTWVudUlmQ2xpY2tlZE91dHNpZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl91bmJpbmRDbG9zZU1lbnVJZkNsaWNrZWRPdXRzaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyICYmIGRvY3VtZW50LmRldGFjaEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGV0YWNoRXZlbnQoJ29uY2xpY2snLCB0aGlzLl9jbG9zZU1lbnVJZkNsaWNrZWRPdXRzaWRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fY2xvc2VNZW51SWZDbGlja2VkT3V0c2lkZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRTdGF0ZUZyb21WYWx1ZSh0aGlzLnByb3BzLnZhbHVlKSk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmFzeW5jT3B0aW9ucyAmJiB0aGlzLnByb3BzLmF1dG9sb2FkKSB7XG4gICAgICAgICAgICB0aGlzLmF1dG9sb2FkQXN5bmNPcHRpb25zKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2JsdXJUaW1lb3V0KTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLl91bmJpbmRDbG9zZU1lbnVJZkNsaWNrZWRPdXRzaWRlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gKG5ld1Byb3BzKSB7XG4gICAgICAgIHZhciBvcHRpb25zQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoSlNPTi5zdHJpbmdpZnkobmV3UHJvcHMub3B0aW9ucykgIT09IEpTT04uc3RyaW5naWZ5KHRoaXMucHJvcHMub3B0aW9ucykpIHtcbiAgICAgICAgICAgIG9wdGlvbnNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIG9wdGlvbnM6IG5ld1Byb3BzLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgZmlsdGVyZWRPcHRpb25zOiB0aGlzLmZpbHRlck9wdGlvbnMobmV3UHJvcHMub3B0aW9ucylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZXdQcm9wcy52YWx1ZSAhPT0gdGhpcy5zdGF0ZS52YWx1ZSB8fCBuZXdQcm9wcy5wbGFjZWhvbGRlciAhPT0gdGhpcy5wcm9wcy5wbGFjZWhvbGRlciB8fCBvcHRpb25zQ2hhbmdlZCkge1xuICAgICAgICAgICAgdmFyIHNldFN0YXRlID0gKG5ld1N0YXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFN0YXRlRnJvbVZhbHVlKG5ld1Byb3BzLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAobmV3U3RhdGUgJiYgbmV3U3RhdGUub3B0aW9ucykgfHwgbmV3UHJvcHMub3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgbmV3UHJvcHMucGxhY2Vob2xkZXIpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5hc3luY09wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRBc3luY09wdGlvbnMobmV3UHJvcHMudmFsdWUsIHt9LCBzZXRTdGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRTdGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNvbXBvbmVudFdpbGxVcGRhdGU6IGZ1bmN0aW9uIChuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgICAgICBpZiAobmV4dFN0YXRlLmlzT3BlbiAhPT0gdGhpcy5zdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXh0U3RhdGUuaXNPcGVuID8gbmV4dFByb3BzLm9uT3BlbiA6IG5leHRQcm9wcy5vbkNsb3NlO1xuICAgICAgICAgICAgaGFuZGxlciAmJiBoYW5kbGVyKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5wcm9wcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2JsdXJUaW1lb3V0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fZm9jdXNlZE9wdGlvblJldmVhbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucmVmcy5mb2N1c2VkICYmIHRoaXMucmVmcy5tZW51KSB7XG4gICAgICAgICAgICAgICAgdmFyIGZvY3VzZWRET00gPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuZm9jdXNlZCk7XG4gICAgICAgICAgICAgICAgdmFyIG1lbnVET00gPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMubWVudSk7XG4gICAgICAgICAgICAgICAgdmFyIGZvY3VzZWRSZWN0ID0gZm9jdXNlZERPTS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICB2YXIgbWVudVJlY3QgPSBtZW51RE9NLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZvY3VzZWRSZWN0LmJvdHRvbSA+IG1lbnVSZWN0LmJvdHRvbSB8fCBmb2N1c2VkUmVjdC50b3AgPCBtZW51UmVjdC50b3ApIHtcbiAgICAgICAgICAgICAgICAgICAgbWVudURPTS5zY3JvbGxUb3AgPSAoZm9jdXNlZERPTS5vZmZzZXRUb3AgKyBmb2N1c2VkRE9NLmNsaWVudEhlaWdodCAtIG1lbnVET00ub2Zmc2V0SGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9mb2N1c2VkT3B0aW9uUmV2ZWFsID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5nZXRJbnB1dE5vZGUoKS5mb2N1cygpO1xuICAgIH0sXG5cbiAgICBjbGlja2VkT3V0c2lkZUVsZW1lbnQ6IGZ1bmN0aW9uIChlbGVtZW50LCBldmVudCkge1xuICAgICAgICB2YXIgZXZlbnRUYXJnZXQgPSAoZXZlbnQudGFyZ2V0KSA/IGV2ZW50LnRhcmdldCA6IGV2ZW50LnNyY0VsZW1lbnQ7XG4gICAgICAgIHdoaWxlIChldmVudFRhcmdldCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnRUYXJnZXQgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBldmVudFRhcmdldCA9IGV2ZW50VGFyZ2V0Lm9mZnNldFBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgZ2V0U3RhdGVGcm9tVmFsdWU6IGZ1bmN0aW9uICh2YWx1ZSwgb3B0aW9ucywgcGxhY2Vob2xkZXIpIHtcbiAgICAgICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gdGhpcy5zdGF0ZS5vcHRpb25zO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gdGhpcy5wcm9wcy5wbGFjZWhvbGRlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlc2V0IGludGVybmFsIGZpbHRlciBzdHJpbmdcbiAgICAgICAgdGhpcy5fb3B0aW9uc0ZpbHRlclN0cmluZyA9ICcnO1xuXG4gICAgICAgIHZhciB2YWx1ZXMgPSB0aGlzLmluaXRWYWx1ZXNBcnJheSh2YWx1ZSwgb3B0aW9ucyk7XG4gICAgICAgIHZhciBmaWx0ZXJlZE9wdGlvbnMgPSB0aGlzLmZpbHRlck9wdGlvbnMob3B0aW9ucywgdmFsdWVzKTtcblxuICAgICAgICB2YXIgZm9jdXNlZE9wdGlvbjtcbiAgICAgICAgdmFyIHZhbHVlRm9yU3RhdGUgPSBudWxsO1xuICAgICAgICBpZiAoIXRoaXMucHJvcHMubXVsdGkgJiYgdmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9jdXNlZE9wdGlvbiA9IHZhbHVlc1swXTtcbiAgICAgICAgICAgIHZhbHVlRm9yU3RhdGUgPSB2YWx1ZXNbMF0udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBvcHRpb25JbmRleCA9IDA7IG9wdGlvbkluZGV4IDwgZmlsdGVyZWRPcHRpb25zLmxlbmd0aDsgKytvcHRpb25JbmRleCkge1xuICAgICAgICAgICAgICAgIGlmICghZmlsdGVyZWRPcHRpb25zW29wdGlvbkluZGV4XS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICBmb2N1c2VkT3B0aW9uID0gZmlsdGVyZWRPcHRpb25zW29wdGlvbkluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWVGb3JTdGF0ZSA9IHZhbHVlcy5tYXAoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHYudmFsdWU7IH0pLmpvaW4odGhpcy5wcm9wcy5kZWxpbWl0ZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZUZvclN0YXRlLFxuICAgICAgICAgICAgdmFsdWVzOiB2YWx1ZXMsXG4gICAgICAgICAgICBpbnB1dFZhbHVlOiAnJyxcbiAgICAgICAgICAgIGZpbHRlcmVkT3B0aW9uczogZmlsdGVyZWRPcHRpb25zLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICF0aGlzLnByb3BzLm11bHRpICYmIHZhbHVlcy5sZW5ndGggPyB2YWx1ZXNbMF0ubGFiZWwgOiBwbGFjZWhvbGRlcixcbiAgICAgICAgICAgIGZvY3VzZWRPcHRpb246IGZvY3VzZWRPcHRpb25cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgaW5pdFZhbHVlc0FycmF5OiBmdW5jdGlvbiAodmFsdWVzLCBvcHRpb25zKSB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMgPT09ICcnID8gW10gOiB2YWx1ZXMuc3BsaXQodGhpcy5wcm9wcy5kZWxpbWl0ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzID0gdmFsdWVzICE9PSB1bmRlZmluZWQgJiYgdmFsdWVzICE9PSBudWxsID8gW3ZhbHVlc10gOiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWVzLm1hcChmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2tleV0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIChvcHRpb25zW2tleV0udmFsdWUgPT09IHZhbCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBvcHRpb25zW2tleV0udmFsdWUgPT09ICdudW1iZXInICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1trZXldLnZhbHVlLnRvU3RyaW5nKCkgPT09IHZhbFxuICAgICAgICAgICAgICAgICAgICAgICAgKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ge3ZhbHVlOiB2YWwsIGxhYmVsOiB2YWx9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNldFZhbHVlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIG5ld1N0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21WYWx1ZSh2YWx1ZSk7XG4gICAgICAgIG5ld1N0YXRlLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZpcmVDaGFuZ2VFdmVudChuZXdTdGF0ZSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUobmV3U3RhdGUpO1xuICAgIH0sXG5cbiAgICBzZWxlY3RWYWx1ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICghdGhpcy5wcm9wcy5tdWx0aSkge1xuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVmFsdWUodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VuYmluZENsb3NlTWVudUlmQ2xpY2tlZE91dHNpZGUoKTtcbiAgICB9LFxuXG4gICAgYWRkVmFsdWU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuc3RhdGUudmFsdWVzLmNvbmNhdCh2YWx1ZSkpO1xuICAgIH0sXG5cbiAgICBwb3BWYWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuc3RhdGUudmFsdWVzLnNsaWNlKDAsIHRoaXMuc3RhdGUudmFsdWVzLmxlbmd0aCAtIDEpKTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlVmFsdWU6IGZ1bmN0aW9uICh2YWx1ZVRvUmVtb3ZlKSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5zdGF0ZS52YWx1ZXMuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZVRvUmVtb3ZlO1xuICAgICAgICB9KSk7XG4gICAgfSxcblxuICAgIGNsZWFyVmFsdWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvLyBpZiB0aGUgZXZlbnQgd2FzIHRyaWdnZXJlZCBieSBhIG1vdXNlZG93biBhbmQgbm90IHRoZSBwcmltYXJ5XG4gICAgICAgIC8vIGJ1dHRvbiwgaWdub3JlIGl0LlxuICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUobnVsbCk7XG4gICAgfSxcblxuICAgIHJlc2V0VmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLnN0YXRlLnZhbHVlID09PSAnJyA/IG51bGwgOiB0aGlzLnN0YXRlLnZhbHVlKTtcbiAgICB9LFxuXG4gICAgZ2V0SW5wdXROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IHRoaXMucmVmcy5pbnB1dDtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuc2VhcmNoYWJsZSA/IGlucHV0IDogUmVhY3QuZmluZERPTU5vZGUoaW5wdXQpO1xuICAgIH0sXG5cbiAgICBmaXJlQ2hhbmdlRXZlbnQ6IGZ1bmN0aW9uIChuZXdTdGF0ZSkge1xuICAgICAgICBpZiAobmV3U3RhdGUudmFsdWUgIT09IHRoaXMuc3RhdGUudmFsdWUgJiYgdGhpcy5wcm9wcy5vbkNoYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShuZXdTdGF0ZS52YWx1ZSwgbmV3U3RhdGUudmFsdWVzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBoYW5kbGVNb3VzZURvd246IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvLyBpZiB0aGUgZXZlbnQgd2FzIHRyaWdnZXJlZCBieSBhIG1vdXNlZG93biBhbmQgbm90IHRoZSBwcmltYXJ5XG4gICAgICAgIC8vIGJ1dHRvbiwgb3IgaWYgdGhlIGNvbXBvbmVudCBpcyBkaXNhYmxlZCwgaWdub3JlIGl0LlxuICAgICAgICBpZiAodGhpcy5wcm9wcy5kaXNhYmxlZCB8fCAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIC8vIGZvciB0aGUgbm9uLXNlYXJjaGFibGUgc2VsZWN0LCBjbG9zZSB0aGUgZHJvcGRvd24gd2hlbiBidXR0b24gaXMgY2xpY2tlZFxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc09wZW4gJiYgIXRoaXMucHJvcHMuc2VhcmNoYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaXNPcGVuOiBmYWxzZVxuICAgICAgICAgICAgfSwgdGhpcy5fdW5iaW5kQ2xvc2VNZW51SWZDbGlja2VkT3V0c2lkZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc0ZvY3VzZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlzT3BlbjogdHJ1ZVxuICAgICAgICAgICAgfSwgdGhpcy5fYmluZENsb3NlTWVudUlmQ2xpY2tlZE91dHNpZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fb3BlbkFmdGVyRm9jdXMgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5nZXRJbnB1dE5vZGUoKS5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGhhbmRsZU1vdXNlRG93bk9uQXJyb3c6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvLyBpZiB0aGUgZXZlbnQgd2FzIHRyaWdnZXJlZCBieSBhIG1vdXNlZG93biBhbmQgbm90IHRoZSBwcmltYXJ5XG4gICAgICAgIC8vIGJ1dHRvbiwgb3IgaWYgdGhlIGNvbXBvbmVudCBpcyBkaXNhYmxlZCwgaWdub3JlIGl0LlxuICAgICAgICBpZiAodGhpcy5wcm9wcy5kaXNhYmxlZCB8fCAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIG5vdCBmb2N1c2VkLCBoYW5kbGVNb3VzZURvd24gd2lsbCBoYW5kbGUgaXRcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlzT3BlbjogZmFsc2VcbiAgICAgICAgfSwgdGhpcy5fdW5iaW5kQ2xvc2VNZW51SWZDbGlja2VkT3V0c2lkZSk7XG4gICAgfSxcblxuICAgIGhhbmRsZUlucHV0Rm9jdXM6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgbmV3SXNPcGVuID0gdGhpcy5zdGF0ZS5pc09wZW4gfHwgdGhpcy5fb3BlbkFmdGVyRm9jdXM7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaXNGb2N1c2VkOiB0cnVlLFxuICAgICAgICAgICAgaXNPcGVuOiBuZXdJc09wZW5cbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKG5ld0lzT3Blbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRDbG9zZU1lbnVJZkNsaWNrZWRPdXRzaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91bmJpbmRDbG9zZU1lbnVJZkNsaWNrZWRPdXRzaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9vcGVuQWZ0ZXJGb2N1cyA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5vbkZvY3VzKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uRm9jdXMoZXZlbnQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGhhbmRsZUlucHV0Qmx1cjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuX2JsdXJUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBpc0ZvY3VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlzT3BlbjogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCA1MCk7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLm9uQmx1cikge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkJsdXIoZXZlbnQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGhhbmRsZUtleURvd246IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgICAgICAgY2FzZSA4OiAvLyBiYWNrc3BhY2VcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaW5wdXRWYWx1ZSAmJiB0aGlzLnByb3BzLmJhY2tzcGFjZVJlbW92ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BWYWx1ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjYXNlIDk6IC8vIHRhYlxuICAgICAgICAgICAgICAgIGlmIChldmVudC5zaGlmdEtleSB8fCAhdGhpcy5zdGF0ZS5pc09wZW4gfHwgIXRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0Rm9jdXNlZE9wdGlvbigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMzogLy8gZW50ZXJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaXNPcGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdEZvY3VzZWRPcHRpb24oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjc6IC8vIGVzY2FwZVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmlzT3Blbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5wcm9wcy5jbGVhcmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhclZhbHVlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM4OiAvLyB1cFxuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNQcmV2aW91c09wdGlvbigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0MDogLy8gZG93blxuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNOZXh0T3B0aW9uKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE4ODogLy8gLFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLmFsbG93Q3JlYXRlICYmIHRoaXMucHJvcHMubXVsdGkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0Rm9jdXNlZE9wdGlvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSxcblxuICAgIC8vIEVuc3VyZXMgdGhhdCB0aGUgY3VycmVudGx5IGZvY3VzZWQgb3B0aW9uIGlzIGF2YWlsYWJsZSBpbiBmaWx0ZXJlZE9wdGlvbnMuXG4gICAgLy8gSWYgbm90LCByZXR1cm5zIHRoZSBmaXJzdCBhdmFpbGFibGUgb3B0aW9uLlxuICAgIF9nZXROZXdGb2N1c2VkT3B0aW9uOiBmdW5jdGlvbiAoZmlsdGVyZWRPcHRpb25zKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBmaWx0ZXJlZE9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXJlZE9wdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBmaWx0ZXJlZE9wdGlvbnNba2V5XSA9PT0gdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkT3B0aW9uc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJlZE9wdGlvbnNbMF07XG4gICAgfSxcblxuICAgIGhhbmRsZUlucHV0Q2hhbmdlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgLy8gYXNzaWduIGFuIGludGVybmFsIHZhcmlhYmxlIGJlY2F1c2Ugd2UgbmVlZCB0byB1c2VcbiAgICAgICAgLy8gdGhlIGxhdGVzdCB2YWx1ZSBiZWZvcmUgc2V0U3RhdGUoKSBoYXMgY29tcGxldGVkLlxuICAgICAgICB0aGlzLl9vcHRpb25zRmlsdGVyU3RyaW5nID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmFzeW5jT3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaXNMb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlucHV0VmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRBc3luY09wdGlvbnMoZXZlbnQudGFyZ2V0LnZhbHVlLCB7XG4gICAgICAgICAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpc09wZW46IHRydWVcbiAgICAgICAgICAgIH0sIHRoaXMuX2JpbmRDbG9zZU1lbnVJZkNsaWNrZWRPdXRzaWRlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZE9wdGlvbnMgPSB0aGlzLmZpbHRlck9wdGlvbnModGhpcy5zdGF0ZS5vcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlzT3BlbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlOiBldmVudC50YXJnZXQudmFsdWUsXG4gICAgICAgICAgICAgICAgZmlsdGVyZWRPcHRpb25zOiBmaWx0ZXJlZE9wdGlvbnMsXG4gICAgICAgICAgICAgICAgZm9jdXNlZE9wdGlvbjogdGhpcy5fZ2V0TmV3Rm9jdXNlZE9wdGlvbihmaWx0ZXJlZE9wdGlvbnMpXG4gICAgICAgICAgICB9LCB0aGlzLl9iaW5kQ2xvc2VNZW51SWZDbGlja2VkT3V0c2lkZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYXV0b2xvYWRBc3luY09wdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5sb2FkQXN5bmNPcHRpb25zKCh0aGlzLnByb3BzLnZhbHVlIHx8ICcnKSwge30sICgpID0+IHtcbiAgICAgICAgICAgIC8vIHVwZGF0ZSB3aXRoIGZldGNoZWQgYnV0IGRvbid0IGZvY3VzXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMucHJvcHMudmFsdWUsIGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGxvYWRBc3luY09wdGlvbnM6IGZ1bmN0aW9uIChpbnB1dCwgc3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciB0aGlzUmVxdWVzdElkID0gdGhpcy5fY3VycmVudFJlcXVlc3RJZCA9IHJlcXVlc3RJZCsrO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5jYWNoZUFzeW5jUmVzdWx0cykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gaW5wdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2FjaGVLZXkgPSBpbnB1dC5zbGljZSgwLCBpKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9uc0NhY2hlW2NhY2hlS2V5XSAmJiAoaW5wdXQgPT09IGNhY2hlS2V5IHx8IHRoaXMuX29wdGlvbnNDYWNoZVtjYWNoZUtleV0uY29tcGxldGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5fb3B0aW9uc0NhY2hlW2NhY2hlS2V5XS5vcHRpb25zO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmlsdGVyZWRPcHRpb25zID0gdGhpcy5maWx0ZXJPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3U3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRPcHRpb25zOiBmaWx0ZXJlZE9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb2N1c2VkT3B0aW9uOiB0aGlzLl9nZXROZXdGb2N1c2VkT3B0aW9uKGZpbHRlcmVkT3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXRlW2tleV0gPSBzdGF0ZVtrZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUobmV3U3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgbmV3U3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByb3BzLmFzeW5jT3B0aW9ucyhpbnB1dCwgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLmNhY2hlQXN5bmNSZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3B0aW9uc0NhY2hlW2lucHV0XSA9IGRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpc1JlcXVlc3RJZCAhPT0gdGhpcy5fY3VycmVudFJlcXVlc3RJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZE9wdGlvbnMgPSB0aGlzLmZpbHRlck9wdGlvbnMoZGF0YS5vcHRpb25zKTtcbiAgICAgICAgICAgIHZhciBuZXdTdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBkYXRhLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgZmlsdGVyZWRPcHRpb25zOiBmaWx0ZXJlZE9wdGlvbnMsXG4gICAgICAgICAgICAgICAgZm9jdXNlZE9wdGlvbjogdGhpcy5fZ2V0TmV3Rm9jdXNlZE9wdGlvbihmaWx0ZXJlZE9wdGlvbnMpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RhdGVba2V5XSA9IHN0YXRlW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIG5ld1N0YXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGZpbHRlck9wdGlvbnM6IGZ1bmN0aW9uIChvcHRpb25zLCB2YWx1ZXMpIHtcbiAgICAgICAgdmFyIGZpbHRlclZhbHVlID0gdGhpcy5fb3B0aW9uc0ZpbHRlclN0cmluZztcbiAgICAgICAgdmFyIGV4Y2x1ZGUgPSAodmFsdWVzIHx8IHRoaXMuc3RhdGUudmFsdWVzKS5tYXAoZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBpLnZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuZmlsdGVyT3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZmlsdGVyT3B0aW9ucy5jYWxsKHRoaXMsIG9wdGlvbnMsIGZpbHRlclZhbHVlLCBleGNsdWRlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJPcHRpb24gPSBmdW5jdGlvbiAob3ApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5tdWx0aSAmJiBleGNsdWRlLmluZGV4T2Yob3AudmFsdWUpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5maWx0ZXJPcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZmlsdGVyT3B0aW9uLmNhbGwodGhpcywgb3AsIGZpbHRlclZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlVGVzdCA9IFN0cmluZyhvcC52YWx1ZSksIGxhYmVsVGVzdCA9IFN0cmluZyhvcC5sYWJlbCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMuaWdub3JlQ2FzZSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZVRlc3QgPSB2YWx1ZVRlc3QudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxUZXN0ID0gbGFiZWxUZXN0LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclZhbHVlID0gZmlsdGVyVmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICFmaWx0ZXJWYWx1ZSB8fCAodGhpcy5wcm9wcy5tYXRjaFBvcyA9PT0gJ3N0YXJ0JykgPyAoXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnByb3BzLm1hdGNoUHJvcCAhPT0gJ2xhYmVsJyAmJiB2YWx1ZVRlc3Quc3Vic3RyKDAsIGZpbHRlclZhbHVlLmxlbmd0aCkgPT09IGZpbHRlclZhbHVlKSB8fFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wcm9wcy5tYXRjaFByb3AgIT09ICd2YWx1ZScgJiYgbGFiZWxUZXN0LnN1YnN0cigwLCBmaWx0ZXJWYWx1ZS5sZW5ndGgpID09PSBmaWx0ZXJWYWx1ZSlcbiAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5wcm9wcy5tYXRjaFByb3AgIT09ICdsYWJlbCcgJiYgdmFsdWVUZXN0LmluZGV4T2YoZmlsdGVyVmFsdWUpID49IDApIHx8XG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnByb3BzLm1hdGNoUHJvcCAhPT0gJ3ZhbHVlJyAmJiBsYWJlbFRlc3QuaW5kZXhPZihmaWx0ZXJWYWx1ZSkgPj0gMClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiAob3B0aW9ucyB8fCBbXSkuZmlsdGVyKGZpbHRlck9wdGlvbiwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2VsZWN0Rm9jdXNlZE9wdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5hbGxvd0NyZWF0ZSAmJiAhdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RWYWx1ZSh0aGlzLnN0YXRlLmlucHV0VmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdFZhbHVlKHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbik7XG4gICAgfSxcblxuICAgIGZvY3VzT3B0aW9uOiBmdW5jdGlvbiAob3ApIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBmb2N1c2VkT3B0aW9uOiBvcFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZm9jdXNOZXh0T3B0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZm9jdXNBZGphY2VudE9wdGlvbignbmV4dCcpO1xuICAgIH0sXG5cbiAgICBmb2N1c1ByZXZpb3VzT3B0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZm9jdXNBZGphY2VudE9wdGlvbigncHJldmlvdXMnKTtcbiAgICB9LFxuXG4gICAgZm9jdXNBZGphY2VudE9wdGlvbjogZnVuY3Rpb24gKGRpcikge1xuICAgICAgICB0aGlzLl9mb2N1c2VkT3B0aW9uUmV2ZWFsID0gdHJ1ZTtcbiAgICAgICAgdmFyIG9wcyA9IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zLmZpbHRlcihmdW5jdGlvbiAob3ApIHtcbiAgICAgICAgICAgIHJldHVybiAhb3AuZGlzYWJsZWQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaXNPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBpc09wZW46IHRydWUsXG4gICAgICAgICAgICAgICAgaW5wdXRWYWx1ZTogJycsXG4gICAgICAgICAgICAgICAgZm9jdXNlZE9wdGlvbjogdGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uIHx8IG9wc1tkaXIgPT09ICduZXh0JyA/IDAgOiBvcHMubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIH0sIHRoaXMuX2JpbmRDbG9zZU1lbnVJZkNsaWNrZWRPdXRzaWRlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW9wcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZm9jdXNlZEluZGV4ID0gLTE7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uID09PSBvcHNbaV0pIHtcbiAgICAgICAgICAgICAgICBmb2N1c2VkSW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBmb2N1c2VkT3B0aW9uID0gb3BzWzBdO1xuICAgICAgICBpZiAoZGlyID09PSAnbmV4dCcgJiYgZm9jdXNlZEluZGV4ID4gLTEgJiYgZm9jdXNlZEluZGV4IDwgb3BzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGZvY3VzZWRPcHRpb24gPSBvcHNbZm9jdXNlZEluZGV4ICsgMV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGlyID09PSAncHJldmlvdXMnKSB7XG4gICAgICAgICAgICBpZiAoZm9jdXNlZEluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgIGZvY3VzZWRPcHRpb24gPSBvcHNbZm9jdXNlZEluZGV4IC0gMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb2N1c2VkT3B0aW9uID0gb3BzW29wcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGZvY3VzZWRPcHRpb246IGZvY3VzZWRPcHRpb25cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHVuZm9jdXNPcHRpb246IGZ1bmN0aW9uIChvcCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5mb2N1c2VkT3B0aW9uID09PSBvcCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgZm9jdXNlZE9wdGlvbjogbnVsbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYnVpbGRNZW51OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmb2N1c2VkVmFsdWUgPSB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24gPyB0aGlzLnN0YXRlLmZvY3VzZWRPcHRpb24udmFsdWUgOiBudWxsO1xuICAgICAgICB2YXIgcmVuZGVyTGFiZWwgPSB0aGlzLnByb3BzLm9wdGlvblJlbmRlcmVyIHx8IGZ1bmN0aW9uIChvcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcC5sYWJlbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmZpbHRlcmVkT3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb2N1c2VkVmFsdWUgPSBmb2N1c2VkVmFsdWUgPT0gbnVsbCA/IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zWzBdIDogZm9jdXNlZFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCB0aGUgY3VycmVudCB2YWx1ZSB0byB0aGUgZmlsdGVyZWQgb3B0aW9ucyBpbiBsYXN0IHJlc29ydFxuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMuc3RhdGUuZmlsdGVyZWRPcHRpb25zO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5hbGxvd0NyZWF0ZSAmJiB0aGlzLnN0YXRlLmlucHV0VmFsdWUudHJpbSgpKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXRWYWx1ZSA9IHRoaXMuc3RhdGUuaW5wdXRWYWx1ZTtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zLnNsaWNlKCk7XG4gICAgICAgICAgICB2YXIgbmV3T3B0aW9uID0gdGhpcy5wcm9wcy5uZXdPcHRpb25DcmVhdG9yID8gdGhpcy5wcm9wcy5uZXdPcHRpb25DcmVhdG9yKGlucHV0VmFsdWUpIDoge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBpbnB1dFZhbHVlLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBpbnB1dFZhbHVlLFxuICAgICAgICAgICAgICAgIGNyZWF0ZTogdHJ1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG9wdGlvbnMudW5zaGlmdChuZXdPcHRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvcHMgPSBPYmplY3Qua2V5cyhvcHRpb25zKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgdmFyIG9wID0gb3B0aW9uc1trZXldO1xuICAgICAgICAgICAgdmFyIGlzU2VsZWN0ZWQgPSB0aGlzLnN0YXRlLnZhbHVlID09PSBvcC52YWx1ZTtcbiAgICAgICAgICAgIHZhciBpc0ZvY3VzZWQgPSBmb2N1c2VkVmFsdWUgPT09IG9wLnZhbHVlO1xuICAgICAgICAgICAgdmFyIG9wdGlvbkNsYXNzID0gY2xhc3Nlcyh7XG4gICAgICAgICAgICAgICAgJ1NlbGVjdC1vcHRpb24nOiB0cnVlLFxuICAgICAgICAgICAgICAgICdpcy1zZWxlY3RlZCc6IGlzU2VsZWN0ZWQsXG4gICAgICAgICAgICAgICAgJ2lzLWZvY3VzZWQnOiBpc0ZvY3VzZWQsXG4gICAgICAgICAgICAgICAgJ2lzLWRpc2FibGVkJzogb3AuZGlzYWJsZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIHJlZiA9IGlzRm9jdXNlZCA/ICdmb2N1c2VkJyA6IG51bGw7XG4gICAgICAgICAgICB2YXIgbW91c2VFbnRlciA9IHRoaXMuZm9jdXNPcHRpb24uYmluZCh0aGlzLCBvcCk7XG4gICAgICAgICAgICB2YXIgbW91c2VMZWF2ZSA9IHRoaXMudW5mb2N1c09wdGlvbi5iaW5kKHRoaXMsIG9wKTtcbiAgICAgICAgICAgIHZhciBtb3VzZURvd24gPSB0aGlzLnNlbGVjdFZhbHVlLmJpbmQodGhpcywgb3ApO1xuICAgICAgICAgICAgdmFyIG9wdGlvblJlc3VsdCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQodGhpcy5wcm9wcy5vcHRpb25Db21wb25lbnQsIHtcbiAgICAgICAgICAgICAgICBrZXk6ICdvcHRpb24tJyArIG9wLnZhbHVlLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogb3B0aW9uQ2xhc3MsXG4gICAgICAgICAgICAgICAgcmVuZGVyRnVuYzogcmVuZGVyTGFiZWwsXG4gICAgICAgICAgICAgICAgbW91c2VFbnRlcjogbW91c2VFbnRlcixcbiAgICAgICAgICAgICAgICBtb3VzZUxlYXZlOiBtb3VzZUxlYXZlLFxuICAgICAgICAgICAgICAgIG1vdXNlRG93bjogbW91c2VEb3duLFxuICAgICAgICAgICAgICAgIGNsaWNrOiBtb3VzZURvd24sXG4gICAgICAgICAgICAgICAgYWRkTGFiZWxUZXh0OiB0aGlzLnByb3BzLmFkZExhYmVsVGV4dCxcbiAgICAgICAgICAgICAgICBvcHRpb246IG9wLFxuICAgICAgICAgICAgICAgIHJlZjogcmVmXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25SZXN1bHQ7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICByZXR1cm4gb3BzLmxlbmd0aCA/IG9wcyA6IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lID0gXCJTZWxlY3Qtbm9yZXN1bHRzXCI+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuYXN5bmNPcHRpb25zICYmICF0aGlzLnN0YXRlLmlucHV0VmFsdWUgPyB0aGlzLnByb3BzLnNlYXJjaFByb21wdFRleHQgOiB0aGlzLnByb3BzLm5vUmVzdWx0c1RleHR9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgaGFuZGxlT3B0aW9uTGFiZWxDbGljazogZnVuY3Rpb24gKHZhbHVlLCBldmVudCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5vbk9wdGlvbkxhYmVsQ2xpY2spIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25PcHRpb25MYWJlbENsaWNrKHZhbHVlLCBldmVudCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZWxlY3RDbGFzcyA9IGNsYXNzZXMoJ1NlbGVjdCcsIHRoaXMucHJvcHMuY2xhc3NOYW1lLCB7XG4gICAgICAgICAgICAnaXMtbXVsdGknOiB0aGlzLnByb3BzLm11bHRpLFxuICAgICAgICAgICAgJ2lzLXNlYXJjaGFibGUnOiB0aGlzLnByb3BzLnNlYXJjaGFibGUsXG4gICAgICAgICAgICAnaXMtb3Blbic6IHRoaXMuc3RhdGUuaXNPcGVuLFxuICAgICAgICAgICAgJ2lzLWZvY3VzZWQnOiB0aGlzLnN0YXRlLmlzRm9jdXNlZCxcbiAgICAgICAgICAgICdpcy1sb2FkaW5nJzogdGhpcy5zdGF0ZS5pc0xvYWRpbmcsXG4gICAgICAgICAgICAnaXMtZGlzYWJsZWQnOiB0aGlzLnByb3BzLmRpc2FibGVkLFxuICAgICAgICAgICAgJ2hhcy12YWx1ZSc6IHRoaXMuc3RhdGUudmFsdWVcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciB2YWx1ZSA9IFtdO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5tdWx0aSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS52YWx1ZXMuZm9yRWFjaChmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9uT3B0aW9uTGFiZWxDbGljayA9IHRoaXMuaGFuZGxlT3B0aW9uTGFiZWxDbGljay5iaW5kKHRoaXMsIHZhbCk7XG4gICAgICAgICAgICAgICAgdmFyIG9uUmVtb3ZlID0gdGhpcy5yZW1vdmVWYWx1ZS5iaW5kKHRoaXMsIHZhbCk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlQ29tcG9uZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudCh0aGlzLnByb3BzLnZhbHVlQ29tcG9uZW50LCB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogdmFsLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBvcHRpb246IHZhbCxcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXI6IHRoaXMucHJvcHMudmFsdWVSZW5kZXJlcixcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uTGFiZWxDbGljazogISF0aGlzLnByb3BzLm9uT3B0aW9uTGFiZWxDbGljayxcbiAgICAgICAgICAgICAgICAgICAgb25PcHRpb25MYWJlbENsaWNrOiBvbk9wdGlvbkxhYmVsQ2xpY2ssXG4gICAgICAgICAgICAgICAgICAgIG9uUmVtb3ZlOiBvblJlbW92ZSxcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6IHRoaXMucHJvcHMuZGlzYWJsZWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YWx1ZS5wdXNoKHZhbHVlQ29tcG9uZW50KTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmlucHV0VmFsdWUgJiYgKCF0aGlzLnByb3BzLm11bHRpIHx8ICF2YWx1ZS5sZW5ndGgpKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy5zdGF0ZS52YWx1ZXNbMF0gfHwgbnVsbDtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLnZhbHVlUmVuZGVyZXIgJiYgISF0aGlzLnN0YXRlLnZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZS5wdXNoKDxWYWx1ZVxuICAgICAgICAgICAgICAgICAgICBrZXkgPSB7MH1cbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uID0ge3ZhbH1cbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIgPSB7dGhpcy5wcm9wcy52YWx1ZVJlbmRlcmVyfVxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZCA9IHt0aGlzLnByb3BzLmRpc2FibGVkfS8+KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBzaW5nbGVWYWx1ZUNvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQodGhpcy5wcm9wcy5zaW5nbGVWYWx1ZUNvbXBvbmVudCwge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwbGFjZWhvbGRlcicsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWwsXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLnN0YXRlLnBsYWNlaG9sZGVyXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFsdWUucHVzaChzaW5nbGVWYWx1ZUNvbXBvbmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9hZGluZyA9IHRoaXMuc3RhdGUuaXNMb2FkaW5nID8gPHNwYW4gY2xhc3NOYW1lID0gXCJTZWxlY3QtbG9hZGluZ1wiIGFyaWEtaGlkZGVuID0gXCJ0cnVlXCIvPiA6IG51bGw7XG4gICAgICAgIHZhciBjbGVhciA9IHRoaXMucHJvcHMuY2xlYXJhYmxlICYmIHRoaXMuc3RhdGUudmFsdWUgJiYgIXRoaXMucHJvcHMuZGlzYWJsZWQgPyA8c3BhbiBjbGFzc05hbWUgPSBcIlNlbGVjdC1jbGVhclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IHt0aGlzLnByb3BzLm11bHRpID8gdGhpcy5wcm9wcy5jbGVhckFsbFRleHQgOiB0aGlzLnByb3BzLmNsZWFyVmFsdWVUZXh0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbCA9IHt0aGlzLnByb3BzLm11bHRpID8gdGhpcy5wcm9wcy5jbGVhckFsbFRleHQgOiB0aGlzLnByb3BzLmNsZWFyVmFsdWVUZXh0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZURvd24gPSB7dGhpcy5jbGVhclZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljayA9IHt0aGlzLmNsZWFyVmFsdWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTCA9IHt7IF9faHRtbDogJyZ0aW1lczsnIH19Lz4gOiBudWxsO1xuXG4gICAgICAgIHZhciBtZW51O1xuICAgICAgICB2YXIgbWVudVByb3BzO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgICAgIG1lbnVQcm9wcyA9IHtcbiAgICAgICAgICAgICAgICByZWY6ICdtZW51JyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdTZWxlY3QtbWVudSdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5tdWx0aSkge1xuICAgICAgICAgICAgICAgIG1lbnVQcm9wcy5vbk1vdXNlRG93biA9IHRoaXMuaGFuZGxlTW91c2VEb3duO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWVudSA9IChcbiAgICAgICAgICAgICAgICA8ZGl2IHJlZiA9IFwic2VsZWN0TWVudUNvbnRhaW5lclwiIGNsYXNzTmFtZSA9IFwiU2VsZWN0LW1lbnUtb3V0ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiB7Li4ubWVudVByb3BzfT57dGhpcy5idWlsZE1lbnUoKX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW5wdXQ7XG4gICAgICAgIHZhciBpbnB1dFByb3BzID0ge1xuICAgICAgICAgICAgcmVmOiAnaW5wdXQnLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnU2VsZWN0LWlucHV0ICcgKyAodGhpcy5wcm9wcy5pbnB1dFByb3BzLmNsYXNzTmFtZSB8fCAnJyksXG4gICAgICAgICAgICB0YWJJbmRleDogdGhpcy5wcm9wcy50YWJJbmRleCB8fCAwLFxuICAgICAgICAgICAgb25Gb2N1czogdGhpcy5oYW5kbGVJbnB1dEZvY3VzLFxuICAgICAgICAgICAgb25CbHVyOiB0aGlzLmhhbmRsZUlucHV0Qmx1clxuICAgICAgICB9O1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5wcm9wcy5pbnB1dFByb3BzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5pbnB1dFByb3BzLmhhc093blByb3BlcnR5KGtleSkgJiYga2V5ICE9PSAnY2xhc3NOYW1lJykge1xuICAgICAgICAgICAgICAgIGlucHV0UHJvcHNba2V5XSA9IHRoaXMucHJvcHMuaW5wdXRQcm9wc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5zZWFyY2hhYmxlKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSA8SW5wdXQgdmFsdWUgPSB7dGhpcy5zdGF0ZS5pbnB1dFZhbHVlfSBvbkNoYW5nZSA9IHt0aGlzLmhhbmRsZUlucHV0Q2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbldpZHRoID0gXCI1XCIgey4uLmlucHV0UHJvcHN9IC8+O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSA8ZGl2IHsuLi5pbnB1dFByb3BzfT4mbmJzcDs8L2Rpdj47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXRoaXMucHJvcHMubXVsdGkgfHwgIXRoaXMuc3RhdGUudmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgaW5wdXQgPSA8ZGl2IGNsYXNzTmFtZSA9IFwiU2VsZWN0LWlucHV0XCI+Jm5ic3A7PC9kaXY+O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgcmVmID0gXCJ3cmFwcGVyXCIgY2xhc3NOYW1lID0ge3NlbGVjdENsYXNzfT5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZSA9IFwiaGlkZGVuXCIgcmVmID0gXCJ2YWx1ZVwiIG5hbWUgPSB7dGhpcy5wcm9wcy5uYW1lfSB2YWx1ZSA9IHt0aGlzLnN0YXRlLnZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZCA9IHt0aGlzLnByb3BzLmRpc2FibGVkfS8+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWUgPSBcIlNlbGVjdC1jb250cm9sXCIgcmVmID0gXCJjb250cm9sXCIgb25LZXlEb3duID0ge3RoaXMuaGFuZGxlS2V5RG93bn1cbiAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VEb3duID0ge3RoaXMuaGFuZGxlTW91c2VEb3dufSBvblRvdWNoRW5kID0ge3RoaXMuaGFuZGxlTW91c2VEb3dufT5cbiAgICAgICAgICAgICAgICAgICAge3ZhbHVlfVxuICAgICAgICAgICAgICAgICAgICB7aW5wdXR9XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZSA9IFwiU2VsZWN0LWFycm93LXpvbmVcIiBvbk1vdXNlRG93biA9IHt0aGlzLmhhbmRsZU1vdXNlRG93bk9uQXJyb3d9Lz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lID0gXCJTZWxlY3QtYXJyb3dcIiBvbk1vdXNlRG93biA9IHt0aGlzLmhhbmRsZU1vdXNlRG93bk9uQXJyb3d9Lz5cbiAgICAgICAgICAgICAgICAgICAge2xvYWRpbmd9XG4gICAgICAgICAgICAgICAgICAgIHtjbGVhcn1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7bWVudX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0O1xuIl19
