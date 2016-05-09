require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = require('react');

var Gravatar = require('react-gravatar');

var Option = React.createClass({
  displayName: 'Option',

  propTypes: {
    addLabelText: React.PropTypes.string,
    className: React.PropTypes.string,
    mouseDown: React.PropTypes.func,
    mouseEnter: React.PropTypes.func,
    mouseLeave: React.PropTypes.func,
    option: React.PropTypes.object.isRequired,
    renderFunc: React.PropTypes.func
  },

  render: function render() {
    var obj = this.props.option;
    var size = 15;

    return React.createElement(
      'div',
      { className: this.props.className,
        onMouseEnter: this.props.mouseEnter,
        onMouseLeave: this.props.mouseLeave,
        onMouseDown: this.props.mouseDown,
        onClick: this.props.mouseDown },
      React.createElement(Gravatar, { email: obj.email, size: size }),
      obj.value
    );
  }
});

module.exports = Option;

},{"react":undefined,"react-gravatar":14}],2:[function(require,module,exports){
'use strict';

var React = require('react');
var Gravatar = require('react-gravatar');

var SingleValue = React.createClass({
  displayName: 'SingleValue',

  propTypes: {
    placeholder: React.PropTypes.string,
    value: React.PropTypes.object
  },

  render: function render() {
    var obj = this.props.value;
    var size = 15;

    return React.createElement(
      'div',
      { className: 'Select-placeholder' },
      obj ? React.createElement(
        'div',
        null,
        React.createElement(Gravatar, { email: obj.email, size: size }),
        obj.value
      ) : this.props.placeholder
    );
  }
});

module.exports = SingleValue;

},{"react":undefined,"react-gravatar":14}],3:[function(require,module,exports){
/* eslint react/prop-types: 0 */

'use strict';

var React = require('react');
var Select = require('react-select');
var GravatarOption = require('./CustomOption');
var GravatarValue = require('./CustomSingleValue');

var STATES = require('./data/states');
var USERS = require('./data/users');
var id = 0;

function logChange() {
	console.log.apply(console, [].concat(['Select value changed: '], Array.prototype.slice.apply(arguments)));
}

var CountrySelect = React.createClass({
	displayName: 'CountrySelect',

	onClick: function onClick() {
		this.props.onSelect(this.props.value);
	},
	render: function render() {
		var className = this.props.value === this.props.selected ? 'active' : 'link';
		return React.createElement(
			'span',
			{ onClick: this.onClick, className: className },
			this.props.children
		);
	}
});

var UsersField = React.createClass({
	displayName: 'UsersField',

	getDefaultProps: function getDefaultProps() {
		return {
			searchable: true,
			label: 'Users: (with custom option and value component)'
		};
	},
	render: function render() {

		return React.createElement(
			'div',
			null,
			React.createElement(
				'label',
				null,
				this.props.label
			),
			React.createElement(Select, {
				onOptionLabelClick: this.onLabelClick,
				placeholder: 'Select user',
				optionComponent: GravatarOption,
				singleValueComponent: GravatarValue,
				options: USERS.users })
		);
	}
});

var ValuesAsNumbersField = React.createClass({
	displayName: 'ValuesAsNumbersField',

	getInitialState: function getInitialState() {
		return {
			options: [{ value: 10, label: 'Ten' }, { value: 11, label: 'Eleven' }, { value: 12, label: 'Twelve' }, { value: 23, label: 'Twenty-three' }, { value: 24, label: 'Twenty-three' }],
			matchPos: 'any',
			matchValue: true,
			matchLabel: true,
			value: null,
			multi: false
		};
	},

	onChangeMatchStart: function onChangeMatchStart(event) {
		this.setState({
			matchPos: event.target.checked ? 'start' : 'any'
		});
	},

	onChangeMatchValue: function onChangeMatchValue(event) {
		this.setState({
			matchValue: event.target.checked
		});
	},

	onChangeMatchLabel: function onChangeMatchLabel(event) {
		this.setState({
			matchLabel: event.target.checked
		});
	},

	onChange: function onChange(value, values) {
		this.setState({
			value: value
		});
		logChange(value, values);
	},

	onChangeMulti: function onChangeMulti(event) {
		this.setState({
			multi: event.target.checked
		});
	},

	render: function render() {

		var matchProp = 'any';

		if (this.state.matchLabel && !this.state.matchValue) {
			matchProp = 'label';
		}

		if (!this.state.matchLabel && this.state.matchValue) {
			matchProp = 'value';
		}

		return React.createElement(
			'div',
			null,
			React.createElement(
				'label',
				null,
				this.props.label
			),
			React.createElement(Select, {
				searchable: true,
				matchProp: matchProp,
				matchPos: this.state.matchPos,
				options: this.state.options,
				onChange: this.onChange,
				value: this.state.value,
				multi: this.state.multi
			}),
			React.createElement(
				'div',
				null,
				React.createElement(
					'label',
					{ htmlFor: 'values-as-numbers-multi' },
					'Multi-Select?'
				),
				React.createElement('input', { type: 'checkbox', id: 'values-as-numbers-multi', checked: this.state.multi, onChange: this.onChangeMulti }),
				React.createElement(
					'label',
					{ htmlFor: 'values-as-numbers-matchstart' },
					'Match only at start?'
				),
				React.createElement('input', { type: 'checkbox', id: 'values-as-numbers-matchstart', checked: this.state.matchPos === 'start', onChange: this.onChangeMatchStart }),
				React.createElement(
					'label',
					{ htmlFor: 'values-as-numbers-matchvalue' },
					'Match value?'
				),
				React.createElement('input', { type: 'checkbox', id: 'values-as-numbers-matchvalue', checked: this.state.matchValue, onChange: this.onChangeMatchValue }),
				React.createElement(
					'label',
					{ htmlFor: 'values-as-numbers-matchlabel' },
					'Match label?'
				),
				React.createElement('input', { type: 'checkbox', id: 'values-as-numbers-matchlabel', checked: this.state.matchLabel, onChange: this.onChangeMatchLabel })
			)
		);
	}
});

var StatesField = React.createClass({
	displayName: 'StatesField',

	getDefaultProps: function getDefaultProps() {
		return {
			searchable: true,
			label: 'States:'
		};
	},
	getInitialState: function getInitialState() {
		return {
			country: 'AU',
			disabled: false,
			id: ++id,
			selectValue: 'new-south-wales'
		};
	},
	switchCountry: function switchCountry(newCountry) {
		console.log('Country changed to ' + newCountry);
		this.setState({
			country: newCountry,
			selectValue: null
		});
	},
	updateValue: function updateValue(newValue) {
		logChange('State changed to ' + newValue);
		this.setState({
			selectValue: newValue || null
		});
	},
	focusStateSelect: function focusStateSelect() {
		this.refs.stateSelect.focus();
	},
	toggleDisabled: function toggleDisabled(e) {
		this.setState({ disabled: e.target.checked });
	},
	render: function render() {
		var ops = STATES[this.state.country];
		return React.createElement(
			'div',
			null,
			React.createElement(
				'label',
				null,
				this.props.label
			),
			React.createElement(Select, { ref: 'stateSelect', options: ops, disabled: this.state.disabled, value: this.state.selectValue, onChange: this.updateValue, searchable: this.props.searchable }),
			React.createElement(
				'div',
				{ className: 'switcher' },
				'Country:',
				React.createElement(
					CountrySelect,
					{ value: 'AU', selected: this.state.country, onSelect: this.switchCountry },
					'Australia'
				),
				React.createElement(
					CountrySelect,
					{ value: 'US', selected: this.state.country, onSelect: this.switchCountry },
					'US'
				),
				'  ',
				React.createElement(
					'button',
					{ type: 'button', onClick: this.focusStateSelect },
					'Focus Select'
				),
				'  ',
				React.createElement('input', { type: 'checkbox', checked: this.state.disabled, id: 'disable-states-' + this.state.id, onChange: this.toggleDisabled }),
				React.createElement(
					'label',
					{ htmlFor: 'disable-states-' + this.state.id },
					'Disable'
				)
			)
		);
	}
});

var RemoteSelectField = React.createClass({
	displayName: 'RemoteSelectField',

	loadOptions: function loadOptions(input, callback) {
		input = input.toLowerCase();
		var rtn = {
			options: [{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }, { label: 'Three', value: 'three' }],
			complete: true
		};
		if (input.slice(0, 1) === 'a') {
			if (input.slice(0, 2) === 'ab') {
				rtn = {
					options: [{ label: 'AB', value: 'ab' }, { label: 'ABC', value: 'abc' }, { label: 'ABCD', value: 'abcd' }],
					complete: true
				};
			} else {
				rtn = {
					options: [{ label: 'A', value: 'a' }, { label: 'AA', value: 'aa' }, { label: 'AB', value: 'ab' }],
					complete: false
				};
			}
		} else if (!input.length) {
			rtn.complete = false;
		}

		setTimeout(function () {
			callback(null, rtn);
		}, 500);
	},
	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'label',
				null,
				this.props.label
			),
			React.createElement(Select, { asyncOptions: this.loadOptions, className: 'remote-example' })
		);
	}
});

var MultiSelectField = React.createClass({
	displayName: 'MultiSelectField',

	getInitialState: function getInitialState() {
		return {
			disabled: false,
			value: []
		};
	},
	handleSelectChange: function handleSelectChange(value, values) {
		logChange('New value:', value, 'Values:', values);
		this.setState({ value: value });
	},
	toggleDisabled: function toggleDisabled(e) {
		this.setState({ 'disabled': e.target.checked });
	},
	render: function render() {
		var ops = [{ label: 'Chocolate', value: 'chocolate' }, { label: 'Vanilla', value: 'vanilla' }, { label: 'Strawberry', value: 'strawberry' }, { label: 'Caramel', value: 'caramel' }, { label: 'Cookies and Cream', value: 'cookiescream' }, { label: 'Peppermint', value: 'peppermint' }];
		return React.createElement(
			'span',
			null,
			React.createElement(
				'div',
				null,
				React.createElement(
					'label',
					null,
					this.props.label
				),
				React.createElement(Select, { multi: true, disabled: this.state.disabled, value: this.state.value, placeholder: 'Select your favourite(s)', options: ops, onChange: this.handleSelectChange })
			),
			React.createElement(
				'div',
				null,
				React.createElement('input', { type: 'checkbox', checked: this.state.disabled, id: 'disable-multiselect', onChange: this.toggleDisabled }),
				React.createElement(
					'label',
					{ htmlFor: 'disable-multiselect' },
					'Disable'
				)
			)
		);
	}
});

var SelectedValuesField = React.createClass({
	displayName: 'SelectedValuesField',

	onLabelClick: function onLabelClick(data, event) {
		console.log(data, event);
	},
	render: function render() {
		var ops = [{ label: 'Chocolate', value: 'chocolate' }, { label: 'Vanilla', value: 'vanilla' }, { label: 'Strawberry', value: 'strawberry' }, { label: 'Caramel', value: 'caramel' }, { label: 'Cookies and Cream', value: 'cookiescream' }, { label: 'Peppermint', value: 'peppermint' }];
		return React.createElement(
			'div',
			null,
			React.createElement(
				'label',
				null,
				this.props.label
			),
			React.createElement(Select, {
				onOptionLabelClick: this.onLabelClick,
				value: 'chocolate,vanilla,strawberry',
				multi: true,
				placeholder: 'Select your favourite(s)',
				options: ops,
				onChange: logChange })
		);
	}
});

var SelectedValuesFieldDisabled = React.createClass({
	displayName: 'SelectedValuesFieldDisabled',

	onLabelClick: function onLabelClick(data, event) {
		console.log(data, event);
	},
	render: function render() {
		var ops = [{ label: 'Chocolate', value: 'chocolate' }, { label: 'Vanilla', value: 'vanilla' }, { label: 'Strawberry', value: 'strawberry' }, { label: 'Caramel (You don\'t like it, apparently)', value: 'caramel', disabled: true }, { label: 'Cookies and Cream', value: 'cookiescream' }, { label: 'Peppermint', value: 'peppermint' }];
		return React.createElement(
			'div',
			null,
			React.createElement(
				'label',
				null,
				this.props.label
			),
			React.createElement(Select, {
				onOptionLabelClick: this.onLabelClick,
				value: 'chocolate,vanilla,strawberry',
				multi: true,
				placeholder: 'Select your favourite(s)',
				options: ops,
				onChange: logChange })
		);
	}
});

var SelectedValuesFieldCreate = React.createClass({
	displayName: 'SelectedValuesFieldCreate',

	onLabelClick: function onLabelClick(data, event) {
		console.log(data, event);
	},
	render: function render() {
		var ops = [{ label: 'First Option', value: 'first' }, { label: 'Second Option', value: 'second' }, { label: 'Third Option', value: 'third' }];
		return React.createElement(
			'div',
			null,
			React.createElement(
				'label',
				null,
				this.props.label
			),
			React.createElement(Select, {
				value: 'first',
				delimiter: ',',
				multi: true,
				allowCreate: true,
				placeholder: 'Select your favourite(s)',
				options: ops,
				onChange: logChange })
		);
	}
});

var CustomRenderField = React.createClass({
	displayName: 'CustomRenderField',

	onLabelClick: function onLabelClick(data, event) {
		console.log(data, event);
	},
	renderOption: function renderOption(option) {
		return React.createElement(
			'span',
			{ style: { color: option.hex } },
			option.label,
			' (',
			option.hex,
			')'
		);
	},
	renderValue: function renderValue(option) {
		return React.createElement(
			'strong',
			{ style: { color: option.hex } },
			option.label
		);
	},
	render: function render() {
		var ops = [{ label: 'Red', value: 'red', hex: '#EC6230' }, { label: 'Green', value: 'green', hex: '#4ED84E' }, { label: 'Blue', value: 'blue', hex: '#6D97E2' }];
		return React.createElement(
			'div',
			null,
			React.createElement(
				'label',
				null,
				this.props.label
			),
			React.createElement(Select, {
				allowCreate: true,
				placeholder: 'Select your favourite',
				options: ops,
				optionRenderer: this.renderOption,
				valueRenderer: this.renderValue,
				onChange: logChange })
		);
	}
});

var CustomRenderMultiField = React.createClass({
	displayName: 'CustomRenderMultiField',

	onLabelClick: function onLabelClick(data, event) {
		console.log(data, event);
	},
	renderOption: function renderOption(option) {
		return React.createElement(
			'span',
			{ style: { color: option.hex } },
			option.label,
			' (',
			option.hex,
			')'
		);
	},
	renderValue: function renderValue(option) {
		return React.createElement(
			'strong',
			{ style: { color: option.hex } },
			option.label
		);
	},
	render: function render() {
		var ops = [{ label: 'Red', value: 'red', hex: '#EC6230' }, { label: 'Green', value: 'green', hex: '#4ED84E' }, { label: 'Blue', value: 'blue', hex: '#6D97E2' }];
		return React.createElement(
			'div',
			null,
			React.createElement(
				'label',
				null,
				this.props.label
			),
			React.createElement(Select, {
				delimiter: ',',
				multi: true,
				allowCreate: true,
				placeholder: 'Select your favourite(s)',
				options: ops,
				optionRenderer: this.renderOption,
				valueRenderer: this.renderValue,
				onChange: logChange })
		);
	}
});

React.render(React.createElement(
	'div',
	null,
	React.createElement(StatesField, null),
	React.createElement(StatesField, { label: 'States (non-searchable):', searchable: false }),
	React.createElement(UsersField, null),
	React.createElement(ValuesAsNumbersField, { label: 'Values as numbers' }),
	React.createElement(MultiSelectField, { label: 'Multiselect:' }),
	React.createElement(SelectedValuesField, { label: 'Clickable labels (labels as links):' }),
	React.createElement(SelectedValuesFieldDisabled, { label: 'Disabled option:' }),
	React.createElement(SelectedValuesFieldCreate, { label: 'Option Creation (tags mode):' }),
	React.createElement(CustomRenderField, { label: 'Custom rendering for options and values:' }),
	React.createElement(CustomRenderMultiField, { label: 'Custom rendering for multiple options and values:' }),
	React.createElement(RemoteSelectField, { label: 'Remote Options:' })
), document.getElementById('example'));

},{"./CustomOption":1,"./CustomSingleValue":2,"./data/states":4,"./data/users":5,"react":undefined,"react-select":undefined}],4:[function(require,module,exports){
'use strict';

exports.AU = [{ value: 'australian-capital-territory', label: 'Australian Capital Territory' }, { value: 'new-south-wales', label: 'New South Wales' }, { value: 'victoria', label: 'Victoria' }, { value: 'queensland', label: 'Queensland' }, { value: 'western-australia', label: 'Western Australia' }, { value: 'south-australia', label: 'South Australia' }, { value: 'tasmania', label: 'Tasmania' }, { value: 'northern-territory', label: 'Northern Territory' }];

exports.US = [{ value: 'AL', label: 'Alabama', disabled: true }, { value: 'AK', label: 'Alaska' }, { value: 'AS', label: 'American Samoa' }, { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' }, { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'DC', label: 'District Of Columbia' }, { value: 'FM', label: 'Federated States Of Micronesia' }, { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' }, { value: 'GU', label: 'Guam' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' }, { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' }, { value: 'ME', label: 'Maine' }, { value: 'MH', label: 'Marshall Islands' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' }, { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' }, { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' }, { value: 'MP', label: 'Northern Mariana Islands' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' }, { value: 'OR', label: 'Oregon' }, { value: 'PW', label: 'Palau' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'PR', label: 'Puerto Rico' }, { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' }, { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' }, { value: 'VI', label: 'Virgin Islands' }, { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' }, { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }];

},{}],5:[function(require,module,exports){
'use strict';

exports.users = [{ value: 'John Smith', label: 'John Smith', email: 'john@smith.com' }, { value: 'Merry Jane', label: 'Merry Jane', email: 'merry@jane.com' }, { value: 'Stan Hoper', label: 'Stan Hoper', email: 'stan@hoper.com' }];

},{}],6:[function(require,module,exports){
var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;

},{}],7:[function(require,module,exports){
(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();

},{}],8:[function(require,module,exports){
/**
 * Determine if an object is Buffer
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 * `npm install is-buffer`
 */

module.exports = function (obj) {
  return !!(obj != null &&
    (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
      (obj.constructor &&
      typeof obj.constructor.isBuffer === 'function' &&
      obj.constructor.isBuffer(obj))
    ))
}

},{}],9:[function(require,module,exports){
module.exports = function() {
  var mediaQuery;
  if (typeof window !== "undefined" && window !== null) {
    mediaQuery = "(-webkit-min-device-pixel-ratio: 1.25), (min--moz-device-pixel-ratio: 1.25), (-o-min-device-pixel-ratio: 5/4), (min-resolution: 1.25dppx)";
    if (window.devicePixelRatio > 1.25) {
      return true;
    }
    if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
      return true;
    }
  }
  return false;
};

},{}],10:[function(require,module,exports){
(function(){
  var crypt = require('crypt'),
      utf8 = require('charenc').utf8,
      isBuffer = require('is-buffer'),
      bin = require('charenc').bin,

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message))
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if(typeof message == 'undefined')
      return;

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();

},{"charenc":6,"crypt":7,"is-buffer":8}],11:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],12:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],13:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":11,"./encode":12}],14:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
var React, isRetina, md5, querystring;

React = require('react');

md5 = require('md5');

querystring = require('querystring');

isRetina = require('is-retina');

module.exports = React.createClass({
  displayName: 'Gravatar',
  propTypes: {
    email: React.PropTypes.string.isRequired,
    size: React.PropTypes.number,
    rating: React.PropTypes.string,
    https: React.PropTypes.bool,
    "default": React.PropTypes.string,
    className: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      size: 50,
      rating: 'g',
      https: false,
      "default": "retro",
      email: '',
      className: ""
    };
  },
  render: function() {
    var base, query, src;
    base = this.props.https ? "https://secure.gravatar.com/avatar/" : 'http://www.gravatar.com/avatar/';
    query = querystring.stringify({
      s: isRetina() ? this.props.size * 2 : this.props.size,
      r: this.props.rating,
      d: this.props["default"]
    });
    src = base + md5(this.props.email) + "?" + query;
    return React.createElement("img", React.__spread({}, this.props, {
      "className": "react-gravatar " + this.props.className,
      "src": src,
      "height": this.props.size,
      "width": this.props.size
    }));
  }
});

},{"is-retina":9,"md5":10,"querystring":13,"react":undefined}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcGF0cmlja21ja2VsdnkvRG9jdW1lbnRzL3dvcmsvcmVhY3Qtc2VsZWN0L2V4YW1wbGVzL3NyYy9DdXN0b21PcHRpb24uanMiLCIvVXNlcnMvcGF0cmlja21ja2VsdnkvRG9jdW1lbnRzL3dvcmsvcmVhY3Qtc2VsZWN0L2V4YW1wbGVzL3NyYy9DdXN0b21TaW5nbGVWYWx1ZS5qcyIsIi9Vc2Vycy9wYXRyaWNrbWNrZWx2eS9Eb2N1bWVudHMvd29yay9yZWFjdC1zZWxlY3QvZXhhbXBsZXMvc3JjL2FwcC5qcyIsIi9Vc2Vycy9wYXRyaWNrbWNrZWx2eS9Eb2N1bWVudHMvd29yay9yZWFjdC1zZWxlY3QvZXhhbXBsZXMvc3JjL2RhdGEvc3RhdGVzLmpzIiwiL1VzZXJzL3BhdHJpY2ttY2tlbHZ5L0RvY3VtZW50cy93b3JrL3JlYWN0LXNlbGVjdC9leGFtcGxlcy9zcmMvZGF0YS91c2Vycy5qcyIsIm5vZGVfbW9kdWxlcy9jaGFyZW5jL2NoYXJlbmMuanMiLCJub2RlX21vZHVsZXMvY3J5cHQvY3J5cHQuanMiLCJub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2lzLXJldGluYS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tZDUvbWQ1LmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9kZWNvZGUuanMiLCJub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2VuY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVhY3QtZ3JhdmF0YXIvZGlzdC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsZ0JBQWdC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QUFFLEVBQ2xDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLEVBQ3ZDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQ2xDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQ25DLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLEVBQ3JDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQ2xDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQ2pDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQ2xDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQ2hDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLEVBQ3ZDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLEVBQ3BDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLEVBQ3BDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQ2xDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsRUFDeEMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsRUFDdEMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSwwQkFBMEIsRUFBRSxFQUNsRCxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUM5QixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUNsQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUNoQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUMvQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxFQUN0QyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxFQUNyQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxFQUN0QyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLEVBQ3hDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLEVBQ3RDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQ25DLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQy9CLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQzlCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQ2pDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsRUFDeEMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFDbEMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFDcEMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsRUFDdkMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsRUFDbkMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FDcEMsQ0FBQzs7Ozs7QUN2RUYsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUNaLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxFQUNyRSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsRUFDckUsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLENBQ3hFLENBQUM7OztBQ0pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBHcmF2YXRhciA9IHJlcXVpcmUoJ3JlYWN0LWdyYXZhdGFyJyk7XG5cbnZhciBPcHRpb24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHByb3BUeXBlczoge1xuICAgIGFkZExhYmVsVGV4dDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgbW91c2VEb3duOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICBtb3VzZUVudGVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICBtb3VzZUxlYXZlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICBvcHRpb246IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICByZW5kZXJGdW5jOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9iaiA9IHRoaXMucHJvcHMub3B0aW9uO1xuICAgIHZhciBzaXplID0gMTU7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfVxuICAgICAgICBvbk1vdXNlRW50ZXI9e3RoaXMucHJvcHMubW91c2VFbnRlcn1cbiAgICAgICAgb25Nb3VzZUxlYXZlPXt0aGlzLnByb3BzLm1vdXNlTGVhdmV9XG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLnByb3BzLm1vdXNlRG93bn1cbiAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5tb3VzZURvd259PlxuICAgICAgICA8R3JhdmF0YXIgZW1haWw9e29iai5lbWFpbH0gc2l6ZT17c2l6ZX0vPlxuICAgICAgICB7b2JqLnZhbHVlfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gT3B0aW9uO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBHcmF2YXRhciA9IHJlcXVpcmUoJ3JlYWN0LWdyYXZhdGFyJyk7XG5cbnZhciBTaW5nbGVWYWx1ZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgcGxhY2Vob2xkZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3RcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvYmogPSB0aGlzLnByb3BzLnZhbHVlO1xuICAgIHZhciBzaXplID0gMTU7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJTZWxlY3QtcGxhY2Vob2xkZXJcIj5cbiAgICAgICAge29iaiA/IChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxHcmF2YXRhciBlbWFpbD17b2JqLmVtYWlsfSBzaXplPXtzaXplfS8+XG4gICAgICAgICAgICAgIHtvYmoudmFsdWV9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgdGhpcy5wcm9wcy5wbGFjZWhvbGRlclxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2luZ2xlVmFsdWU7XG4iLCIvKiBlc2xpbnQgcmVhY3QvcHJvcC10eXBlczogMCAqL1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFNlbGVjdCA9IHJlcXVpcmUoJ3JlYWN0LXNlbGVjdCcpO1xudmFyIEdyYXZhdGFyT3B0aW9uID0gcmVxdWlyZSgnLi9DdXN0b21PcHRpb24nKTtcbnZhciBHcmF2YXRhclZhbHVlID0gcmVxdWlyZSgnLi9DdXN0b21TaW5nbGVWYWx1ZScpO1xuXG52YXIgU1RBVEVTID0gcmVxdWlyZSgnLi9kYXRhL3N0YXRlcycpO1xudmFyIFVTRVJTID0gcmVxdWlyZSgnLi9kYXRhL3VzZXJzJyk7XG52YXIgaWQgPSAwO1xuXG5mdW5jdGlvbiBsb2dDaGFuZ2UoKSB7XG5cdGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIFtdLmNvbmNhdChbJ1NlbGVjdCB2YWx1ZSBjaGFuZ2VkOiAnXSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cykpKTtcbn1cblxudmFyIENvdW50cnlTZWxlY3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdG9uQ2xpY2s6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucHJvcHMub25TZWxlY3QodGhpcy5wcm9wcy52YWx1ZSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IHRoaXMucHJvcHMudmFsdWUgPT09IHRoaXMucHJvcHMuc2VsZWN0ZWQgPyAnYWN0aXZlJyA6ICdsaW5rJztcblx0XHRyZXR1cm4gPHNwYW4gb25DbGljaz17dGhpcy5vbkNsaWNrfSBjbGFzc05hbWU9e2NsYXNzTmFtZX0+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9zcGFuPjtcblx0fVxufSk7XG5cbnZhciBVc2Vyc0ZpZWxkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VhcmNoYWJsZTogdHJ1ZSxcblx0XHRcdGxhYmVsOiAnVXNlcnM6ICh3aXRoIGN1c3RvbSBvcHRpb24gYW5kIHZhbHVlIGNvbXBvbmVudCknXG5cdFx0fTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8bGFiZWw+e3RoaXMucHJvcHMubGFiZWx9PC9sYWJlbD5cblx0XHRcdFx0PFNlbGVjdFxuXHRcdFx0XHRcdG9uT3B0aW9uTGFiZWxDbGljaz17dGhpcy5vbkxhYmVsQ2xpY2t9XG5cdFx0XHRcdFx0cGxhY2Vob2xkZXI9XCJTZWxlY3QgdXNlclwiXG5cdFx0XHRcdFx0b3B0aW9uQ29tcG9uZW50PXtHcmF2YXRhck9wdGlvbn1cblx0XHRcdFx0XHRzaW5nbGVWYWx1ZUNvbXBvbmVudD17R3JhdmF0YXJWYWx1ZX1cblx0XHRcdFx0XHRvcHRpb25zPXtVU0VSUy51c2Vyc30vPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbnZhciBWYWx1ZXNBc051bWJlcnNGaWVsZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0XG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRvcHRpb25zOiBbXG5cdFx0XHRcdHsgdmFsdWU6IDEwLCBsYWJlbDogJ1RlbicgfSxcblx0XHRcdFx0eyB2YWx1ZTogMTEsIGxhYmVsOiAnRWxldmVuJyB9LFxuXHRcdFx0XHR7IHZhbHVlOiAxMiwgbGFiZWw6ICdUd2VsdmUnIH0sXG5cdFx0XHRcdHsgdmFsdWU6IDIzLCBsYWJlbDogJ1R3ZW50eS10aHJlZScgfSxcblx0XHRcdFx0eyB2YWx1ZTogMjQsIGxhYmVsOiAnVHdlbnR5LXRocmVlJyB9XG5cdFx0XHRdLFxuXHRcdFx0bWF0Y2hQb3M6ICdhbnknLFxuXHRcdFx0bWF0Y2hWYWx1ZTogdHJ1ZSxcblx0XHRcdG1hdGNoTGFiZWw6IHRydWUsXG5cdFx0XHR2YWx1ZTogbnVsbCxcblx0XHRcdG11bHRpOiBmYWxzZVxuXHRcdH07XG5cdH0sXG5cdFxuXHRvbkNoYW5nZU1hdGNoU3RhcnQoZXZlbnQpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdG1hdGNoUG9zOiBldmVudC50YXJnZXQuY2hlY2tlZCA/ICdzdGFydCcgOiAnYW55J1xuXHRcdH0pO1xuXHR9LFxuXG5cdG9uQ2hhbmdlTWF0Y2hWYWx1ZShldmVudCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0bWF0Y2hWYWx1ZTogZXZlbnQudGFyZ2V0LmNoZWNrZWRcblx0XHR9KTtcblx0fSxcblxuXHRvbkNoYW5nZU1hdGNoTGFiZWwoZXZlbnQpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdG1hdGNoTGFiZWw6IGV2ZW50LnRhcmdldC5jaGVja2VkXG5cdFx0fSk7XG5cdH0sXG5cdFxuXHRvbkNoYW5nZSh2YWx1ZSwgdmFsdWVzKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHR2YWx1ZTogdmFsdWVcblx0XHR9KTtcblx0XHRsb2dDaGFuZ2UodmFsdWUsIHZhbHVlcyk7XG5cdH0sXG5cdFxuXHRvbkNoYW5nZU11bHRpKGV2ZW50KSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRtdWx0aTogZXZlbnQudGFyZ2V0LmNoZWNrZWRcblx0XHR9KTtcblx0fSxcblx0XG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdFxuXHRcdHZhciBtYXRjaFByb3AgPSAnYW55Jztcblx0XHRcblx0XHRpZiAodGhpcy5zdGF0ZS5tYXRjaExhYmVsICYmICF0aGlzLnN0YXRlLm1hdGNoVmFsdWUpIHtcblx0XHRcdG1hdGNoUHJvcCA9ICdsYWJlbCc7XG5cdFx0fVxuXHRcdFxuXHRcdGlmICghdGhpcy5zdGF0ZS5tYXRjaExhYmVsICYmIHRoaXMuc3RhdGUubWF0Y2hWYWx1ZSkge1xuXHRcdFx0bWF0Y2hQcm9wID0gJ3ZhbHVlJztcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXY+XG5cdFx0XHRcdDxsYWJlbD57dGhpcy5wcm9wcy5sYWJlbH08L2xhYmVsPlxuXHRcdFx0XHQ8U2VsZWN0XG5cdFx0XHRcdFx0c2VhcmNoYWJsZT17dHJ1ZX1cblx0XHRcdFx0XHRtYXRjaFByb3A9e21hdGNoUHJvcH1cblx0XHRcdFx0XHRtYXRjaFBvcz17dGhpcy5zdGF0ZS5tYXRjaFBvc31cblx0XHRcdFx0XHRvcHRpb25zPXt0aGlzLnN0YXRlLm9wdGlvbnN9XG5cdFx0XHRcdFx0b25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9XG5cdFx0XHRcdFx0dmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9XG5cdFx0XHRcdFx0bXVsdGk9e3RoaXMuc3RhdGUubXVsdGl9XG5cdFx0XHRcdFx0Lz5cblx0XHRcdFx0PGRpdj5cblx0XHRcdFx0XHQ8bGFiZWwgaHRtbEZvcj1cInZhbHVlcy1hcy1udW1iZXJzLW11bHRpXCI+TXVsdGktU2VsZWN0PzwvbGFiZWw+XG5cdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwidmFsdWVzLWFzLW51bWJlcnMtbXVsdGlcIiBjaGVja2VkPXt0aGlzLnN0YXRlLm11bHRpfSBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZU11bHRpfSAvPlxuXHRcdFx0XHRcdDxsYWJlbCBodG1sRm9yPVwidmFsdWVzLWFzLW51bWJlcnMtbWF0Y2hzdGFydFwiPk1hdGNoIG9ubHkgYXQgc3RhcnQ/PC9sYWJlbD5cblx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJ2YWx1ZXMtYXMtbnVtYmVycy1tYXRjaHN0YXJ0XCIgY2hlY2tlZD17dGhpcy5zdGF0ZS5tYXRjaFBvcyA9PT0gJ3N0YXJ0J30gb25DaGFuZ2U9e3RoaXMub25DaGFuZ2VNYXRjaFN0YXJ0fSAvPlxuXHRcdFx0XHRcdDxsYWJlbCBodG1sRm9yPVwidmFsdWVzLWFzLW51bWJlcnMtbWF0Y2h2YWx1ZVwiPk1hdGNoIHZhbHVlPzwvbGFiZWw+XG5cdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwidmFsdWVzLWFzLW51bWJlcnMtbWF0Y2h2YWx1ZVwiIGNoZWNrZWQ9e3RoaXMuc3RhdGUubWF0Y2hWYWx1ZX0gb25DaGFuZ2U9e3RoaXMub25DaGFuZ2VNYXRjaFZhbHVlfSAvPlxuXHRcdFx0XHRcdDxsYWJlbCBodG1sRm9yPVwidmFsdWVzLWFzLW51bWJlcnMtbWF0Y2hsYWJlbFwiPk1hdGNoIGxhYmVsPzwvbGFiZWw+XG5cdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwidmFsdWVzLWFzLW51bWJlcnMtbWF0Y2hsYWJlbFwiIGNoZWNrZWQ9e3RoaXMuc3RhdGUubWF0Y2hMYWJlbH0gb25DaGFuZ2U9e3RoaXMub25DaGFuZ2VNYXRjaExhYmVsfSAvPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgU3RhdGVzRmllbGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZWFyY2hhYmxlOiB0cnVlLFxuXHRcdFx0bGFiZWw6ICdTdGF0ZXM6J1xuXHRcdH07XG5cdH0sXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNvdW50cnk6ICdBVScsXG5cdFx0XHRkaXNhYmxlZDogZmFsc2UsXG5cdFx0XHRpZDogKytpZCxcblx0XHRcdHNlbGVjdFZhbHVlOiAnbmV3LXNvdXRoLXdhbGVzJ1xuXHRcdH07XG5cdH0sXG5cdHN3aXRjaENvdW50cnk6IGZ1bmN0aW9uKG5ld0NvdW50cnkpIHtcblx0XHRjb25zb2xlLmxvZygnQ291bnRyeSBjaGFuZ2VkIHRvICcgKyBuZXdDb3VudHJ5KTtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGNvdW50cnk6IG5ld0NvdW50cnksXG5cdFx0XHRzZWxlY3RWYWx1ZTogbnVsbFxuXHRcdH0pO1xuXHR9LFxuXHR1cGRhdGVWYWx1ZTogZnVuY3Rpb24obmV3VmFsdWUpIHtcblx0XHRsb2dDaGFuZ2UoJ1N0YXRlIGNoYW5nZWQgdG8gJyArIG5ld1ZhbHVlKTtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdHNlbGVjdFZhbHVlOiBuZXdWYWx1ZSB8fCBudWxsXG5cdFx0fSk7XG5cdH0sXG5cdGZvY3VzU3RhdGVTZWxlY3Q6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucmVmcy5zdGF0ZVNlbGVjdC5mb2N1cygpO1xuXHR9LFxuXHR0b2dnbGVEaXNhYmxlZDogZnVuY3Rpb24oZSkge1xuXHRcdHRoaXMuc2V0U3RhdGUoeyBkaXNhYmxlZDogZS50YXJnZXQuY2hlY2tlZCB9KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgb3BzID0gU1RBVEVTW3RoaXMuc3RhdGUuY291bnRyeV07XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXY+XG5cdFx0XHRcdDxsYWJlbD57dGhpcy5wcm9wcy5sYWJlbH08L2xhYmVsPlxuXHRcdFx0XHQ8U2VsZWN0IHJlZj1cInN0YXRlU2VsZWN0XCIgb3B0aW9ucz17b3BzfSBkaXNhYmxlZD17dGhpcy5zdGF0ZS5kaXNhYmxlZH0gdmFsdWU9e3RoaXMuc3RhdGUuc2VsZWN0VmFsdWV9IG9uQ2hhbmdlPXt0aGlzLnVwZGF0ZVZhbHVlfSBzZWFyY2hhYmxlPXt0aGlzLnByb3BzLnNlYXJjaGFibGV9IC8+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwic3dpdGNoZXJcIj5cblx0XHRcdFx0XHRDb3VudHJ5OlxuXHRcdFx0XHRcdDxDb3VudHJ5U2VsZWN0IHZhbHVlPVwiQVVcIiBzZWxlY3RlZD17dGhpcy5zdGF0ZS5jb3VudHJ5fSBvblNlbGVjdD17dGhpcy5zd2l0Y2hDb3VudHJ5fT5BdXN0cmFsaWE8L0NvdW50cnlTZWxlY3Q+XG5cdFx0XHRcdFx0PENvdW50cnlTZWxlY3QgdmFsdWU9XCJVU1wiIHNlbGVjdGVkPXt0aGlzLnN0YXRlLmNvdW50cnl9IG9uU2VsZWN0PXt0aGlzLnN3aXRjaENvdW50cnl9PlVTPC9Db3VudHJ5U2VsZWN0PlxuXHRcdFx0XHRcdCZuYnNwOyA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmZvY3VzU3RhdGVTZWxlY3R9PkZvY3VzIFNlbGVjdDwvYnV0dG9uPlxuXHRcdFx0XHRcdCZuYnNwOyA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17dGhpcy5zdGF0ZS5kaXNhYmxlZH0gaWQ9eydkaXNhYmxlLXN0YXRlcy0nICsgdGhpcy5zdGF0ZS5pZH0gb25DaGFuZ2U9e3RoaXMudG9nZ2xlRGlzYWJsZWR9Lz5cblx0XHRcdFx0XHQ8bGFiZWwgaHRtbEZvcj17J2Rpc2FibGUtc3RhdGVzLScgKyB0aGlzLnN0YXRlLmlkfT5EaXNhYmxlPC9sYWJlbD5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxudmFyIFJlbW90ZVNlbGVjdEZpZWxkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRsb2FkT3B0aW9uczogZnVuY3Rpb24oaW5wdXQsIGNhbGxiYWNrKSB7XG5cdFx0aW5wdXQgPSBpbnB1dC50b0xvd2VyQ2FzZSgpO1xuXHRcdHZhciBydG4gPSB7XG5cdFx0XHRvcHRpb25zOiBbXG5cdFx0XHRcdHsgbGFiZWw6ICdPbmUnLCB2YWx1ZTogJ29uZScgfSxcblx0XHRcdFx0eyBsYWJlbDogJ1R3bycsIHZhbHVlOiAndHdvJyB9LFxuXHRcdFx0XHR7IGxhYmVsOiAnVGhyZWUnLCB2YWx1ZTogJ3RocmVlJyB9XG5cdFx0XHRdLFxuXHRcdFx0Y29tcGxldGU6IHRydWVcblx0XHR9O1xuXHRcdGlmIChpbnB1dC5zbGljZSgwLCAxKSA9PT0gJ2EnKSB7XG5cdFx0XHRpZiAoaW5wdXQuc2xpY2UoMCwgMikgPT09ICdhYicpIHtcblx0XHRcdFx0cnRuID0ge1xuXHRcdFx0XHRcdG9wdGlvbnM6IFtcblx0XHRcdFx0XHRcdHsgbGFiZWw6ICdBQicsIHZhbHVlOiAnYWInIH0sXG5cdFx0XHRcdFx0XHR7IGxhYmVsOiAnQUJDJywgdmFsdWU6ICdhYmMnIH0sXG5cdFx0XHRcdFx0XHR7IGxhYmVsOiAnQUJDRCcsIHZhbHVlOiAnYWJjZCcgfVxuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0Y29tcGxldGU6IHRydWVcblx0XHRcdFx0fTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJ0biA9IHtcblx0XHRcdFx0XHRvcHRpb25zOiBbXG5cdFx0XHRcdFx0XHR7IGxhYmVsOiAnQScsIHZhbHVlOiAnYScgfSxcblx0XHRcdFx0XHRcdHsgbGFiZWw6ICdBQScsIHZhbHVlOiAnYWEnIH0sXG5cdFx0XHRcdFx0XHR7IGxhYmVsOiAnQUInLCB2YWx1ZTogJ2FiJyB9XG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRjb21wbGV0ZTogZmFsc2Vcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKCFpbnB1dC5sZW5ndGgpIHtcblx0XHRcdHJ0bi5jb21wbGV0ZSA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRjYWxsYmFjayhudWxsLCBydG4pO1xuXHRcdH0sIDUwMCk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXY+XG5cdFx0XHRcdDxsYWJlbD57dGhpcy5wcm9wcy5sYWJlbH08L2xhYmVsPlxuXHRcdFx0XHQ8U2VsZWN0IGFzeW5jT3B0aW9ucz17dGhpcy5sb2FkT3B0aW9uc30gY2xhc3NOYW1lPVwicmVtb3RlLWV4YW1wbGVcIiAvPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cblxudmFyIE11bHRpU2VsZWN0RmllbGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGRpc2FibGVkOiBmYWxzZSxcblx0XHRcdHZhbHVlOiBbXVxuXHRcdH07XG5cdH0sXG5cdGhhbmRsZVNlbGVjdENoYW5nZTogZnVuY3Rpb24odmFsdWUsIHZhbHVlcykge1xuXHRcdGxvZ0NoYW5nZSgnTmV3IHZhbHVlOicsIHZhbHVlLCAnVmFsdWVzOicsIHZhbHVlcyk7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB2YWx1ZSB9KTtcblx0fSxcblx0dG9nZ2xlRGlzYWJsZWQ6IGZ1bmN0aW9uKGUpIHtcblx0XHR0aGlzLnNldFN0YXRlKHsgJ2Rpc2FibGVkJzogZS50YXJnZXQuY2hlY2tlZCB9KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgb3BzID0gW1xuXHRcdFx0eyBsYWJlbDogJ0Nob2NvbGF0ZScsIHZhbHVlOiAnY2hvY29sYXRlJyB9LFxuXHRcdFx0eyBsYWJlbDogJ1ZhbmlsbGEnLCB2YWx1ZTogJ3ZhbmlsbGEnIH0sXG5cdFx0XHR7IGxhYmVsOiAnU3RyYXdiZXJyeScsIHZhbHVlOiAnc3RyYXdiZXJyeScgfSxcblx0XHRcdHsgbGFiZWw6ICdDYXJhbWVsJywgdmFsdWU6ICdjYXJhbWVsJyB9LFxuXHRcdFx0eyBsYWJlbDogJ0Nvb2tpZXMgYW5kIENyZWFtJywgdmFsdWU6ICdjb29raWVzY3JlYW0nIH0sXG5cdFx0XHR7IGxhYmVsOiAnUGVwcGVybWludCcsIHZhbHVlOiAncGVwcGVybWludCcgfVxuXHRcdF07XG5cdFx0cmV0dXJuIChcblx0XHRcdDxzcGFuPlxuXHRcdFx0XHQ8ZGl2PlxuXHRcdFx0XHRcdDxsYWJlbD57dGhpcy5wcm9wcy5sYWJlbH08L2xhYmVsPlxuXHRcdFx0XHRcdDxTZWxlY3QgbXVsdGk9e3RydWV9IGRpc2FibGVkPXt0aGlzLnN0YXRlLmRpc2FibGVkfSB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX0gcGxhY2Vob2xkZXI9XCJTZWxlY3QgeW91ciBmYXZvdXJpdGUocylcIiBvcHRpb25zPXtvcHN9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVNlbGVjdENoYW5nZX0gLz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXY+XG5cdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e3RoaXMuc3RhdGUuZGlzYWJsZWR9IGlkPVwiZGlzYWJsZS1tdWx0aXNlbGVjdFwiIG9uQ2hhbmdlPXt0aGlzLnRvZ2dsZURpc2FibGVkfS8+XG5cdFx0XHRcdFx0PGxhYmVsIGh0bWxGb3I9XCJkaXNhYmxlLW11bHRpc2VsZWN0XCI+RGlzYWJsZTwvbGFiZWw+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9zcGFuPlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgU2VsZWN0ZWRWYWx1ZXNGaWVsZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0b25MYWJlbENsaWNrOiBmdW5jdGlvbiAoZGF0YSwgZXZlbnQpIHtcblx0XHRjb25zb2xlLmxvZyhkYXRhLCBldmVudCk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG9wcyA9IFtcblx0XHRcdHsgbGFiZWw6ICdDaG9jb2xhdGUnLCB2YWx1ZTogJ2Nob2NvbGF0ZScgfSxcblx0XHRcdHsgbGFiZWw6ICdWYW5pbGxhJywgdmFsdWU6ICd2YW5pbGxhJyB9LFxuXHRcdFx0eyBsYWJlbDogJ1N0cmF3YmVycnknLCB2YWx1ZTogJ3N0cmF3YmVycnknIH0sXG5cdFx0XHR7IGxhYmVsOiAnQ2FyYW1lbCcsIHZhbHVlOiAnY2FyYW1lbCcgfSxcblx0XHRcdHsgbGFiZWw6ICdDb29raWVzIGFuZCBDcmVhbScsIHZhbHVlOiAnY29va2llc2NyZWFtJyB9LFxuXHRcdFx0eyBsYWJlbDogJ1BlcHBlcm1pbnQnLCB2YWx1ZTogJ3BlcHBlcm1pbnQnIH1cblx0XHRdO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8bGFiZWw+e3RoaXMucHJvcHMubGFiZWx9PC9sYWJlbD5cblx0XHRcdFx0PFNlbGVjdFxuXHRcdFx0XHRcdG9uT3B0aW9uTGFiZWxDbGljaz17dGhpcy5vbkxhYmVsQ2xpY2t9XG5cdFx0XHRcdFx0dmFsdWU9XCJjaG9jb2xhdGUsdmFuaWxsYSxzdHJhd2JlcnJ5XCJcblx0XHRcdFx0XHRtdWx0aT17dHJ1ZX1cblx0XHRcdFx0XHRwbGFjZWhvbGRlcj1cIlNlbGVjdCB5b3VyIGZhdm91cml0ZShzKVwiXG5cdFx0XHRcdFx0b3B0aW9ucz17b3BzfVxuXHRcdFx0XHRcdG9uQ2hhbmdlPXtsb2dDaGFuZ2V9IC8+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59KTtcblxuXG52YXIgU2VsZWN0ZWRWYWx1ZXNGaWVsZERpc2FibGVkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRvbkxhYmVsQ2xpY2s6IGZ1bmN0aW9uIChkYXRhLCBldmVudCkge1xuXHRcdGNvbnNvbGUubG9nKGRhdGEsIGV2ZW50KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgb3BzID0gW1xuXHRcdFx0eyBsYWJlbDogJ0Nob2NvbGF0ZScsIHZhbHVlOiAnY2hvY29sYXRlJyB9LFxuXHRcdFx0eyBsYWJlbDogJ1ZhbmlsbGEnLCB2YWx1ZTogJ3ZhbmlsbGEnIH0sXG5cdFx0XHR7IGxhYmVsOiAnU3RyYXdiZXJyeScsIHZhbHVlOiAnc3RyYXdiZXJyeScgfSxcblx0XHRcdHsgbGFiZWw6ICdDYXJhbWVsIChZb3UgZG9uXFwndCBsaWtlIGl0LCBhcHBhcmVudGx5KScsIHZhbHVlOiAnY2FyYW1lbCcsIGRpc2FibGVkOiB0cnVlIH0sXG5cdFx0XHR7IGxhYmVsOiAnQ29va2llcyBhbmQgQ3JlYW0nLCB2YWx1ZTogJ2Nvb2tpZXNjcmVhbScgfSxcblx0XHRcdHsgbGFiZWw6ICdQZXBwZXJtaW50JywgdmFsdWU6ICdwZXBwZXJtaW50JyB9XG5cdFx0XTtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdj5cblx0XHRcdFx0PGxhYmVsPnt0aGlzLnByb3BzLmxhYmVsfTwvbGFiZWw+XG5cdFx0XHRcdDxTZWxlY3Rcblx0XHRcdFx0XHRvbk9wdGlvbkxhYmVsQ2xpY2s9e3RoaXMub25MYWJlbENsaWNrfVxuXHRcdFx0XHRcdHZhbHVlPVwiY2hvY29sYXRlLHZhbmlsbGEsc3RyYXdiZXJyeVwiXG5cdFx0XHRcdFx0bXVsdGk9e3RydWV9XG5cdFx0XHRcdFx0cGxhY2Vob2xkZXI9XCJTZWxlY3QgeW91ciBmYXZvdXJpdGUocylcIlxuXHRcdFx0XHRcdG9wdGlvbnM9e29wc31cblx0XHRcdFx0XHRvbkNoYW5nZT17bG9nQ2hhbmdlfSAvPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cbnZhciBTZWxlY3RlZFZhbHVlc0ZpZWxkQ3JlYXRlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRvbkxhYmVsQ2xpY2s6IGZ1bmN0aW9uIChkYXRhLCBldmVudCkge1xuXHRcdGNvbnNvbGUubG9nKGRhdGEsIGV2ZW50KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgb3BzID0gW1xuXHRcdFx0eyBsYWJlbDogJ0ZpcnN0IE9wdGlvbicsIHZhbHVlOiAnZmlyc3QnIH0sXG5cdFx0XHR7IGxhYmVsOiAnU2Vjb25kIE9wdGlvbicsIHZhbHVlOiAnc2Vjb25kJyB9LFxuXHRcdFx0eyBsYWJlbDogJ1RoaXJkIE9wdGlvbicsIHZhbHVlOiAndGhpcmQnIH1cblx0XHRdO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8bGFiZWw+e3RoaXMucHJvcHMubGFiZWx9PC9sYWJlbD5cblx0XHRcdFx0PFNlbGVjdFxuXHRcdFx0XHRcdHZhbHVlPVwiZmlyc3RcIlxuXHRcdFx0XHRcdGRlbGltaXRlcj1cIixcIlxuXHRcdFx0XHRcdG11bHRpPXt0cnVlfVxuXHRcdFx0XHRcdGFsbG93Q3JlYXRlPXt0cnVlfVxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyPVwiU2VsZWN0IHlvdXIgZmF2b3VyaXRlKHMpXCJcblx0XHRcdFx0XHRvcHRpb25zPXtvcHN9XG5cdFx0XHRcdFx0b25DaGFuZ2U9e2xvZ0NoYW5nZX0gLz5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgQ3VzdG9tUmVuZGVyRmllbGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdG9uTGFiZWxDbGljazogZnVuY3Rpb24gKGRhdGEsIGV2ZW50KSB7XG5cdFx0Y29uc29sZS5sb2coZGF0YSwgZXZlbnQpO1xuXHR9LFxuXHRyZW5kZXJPcHRpb246IGZ1bmN0aW9uKG9wdGlvbikge1xuXHRcdHJldHVybiA8c3BhbiBzdHlsZT17eyBjb2xvcjogb3B0aW9uLmhleCB9fT57b3B0aW9uLmxhYmVsfSAoe29wdGlvbi5oZXh9KTwvc3Bhbj47XG5cblx0fSxcblx0cmVuZGVyVmFsdWU6IGZ1bmN0aW9uKG9wdGlvbikge1xuXHRcdHJldHVybiA8c3Ryb25nIHN0eWxlPXt7IGNvbG9yOiBvcHRpb24uaGV4IH19PntvcHRpb24ubGFiZWx9PC9zdHJvbmc+O1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBvcHMgPSBbXG5cdFx0XHR7IGxhYmVsOiAnUmVkJywgdmFsdWU6ICdyZWQnLCBoZXg6ICcjRUM2MjMwJyB9LFxuXHRcdFx0eyBsYWJlbDogJ0dyZWVuJywgdmFsdWU6ICdncmVlbicsIGhleDogJyM0RUQ4NEUnIH0sXG5cdFx0XHR7IGxhYmVsOiAnQmx1ZScsIHZhbHVlOiAnYmx1ZScsIGhleDogJyM2RDk3RTInIH1cblx0XHRdO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8bGFiZWw+e3RoaXMucHJvcHMubGFiZWx9PC9sYWJlbD5cblx0XHRcdFx0PFNlbGVjdFxuXHRcdFx0XHRcdGFsbG93Q3JlYXRlPXt0cnVlfVxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyPVwiU2VsZWN0IHlvdXIgZmF2b3VyaXRlXCJcblx0XHRcdFx0XHRvcHRpb25zPXtvcHN9XG5cdFx0XHRcdFx0b3B0aW9uUmVuZGVyZXI9e3RoaXMucmVuZGVyT3B0aW9ufVxuXHRcdFx0XHRcdHZhbHVlUmVuZGVyZXI9e3RoaXMucmVuZGVyVmFsdWV9XG5cdFx0XHRcdFx0b25DaGFuZ2U9e2xvZ0NoYW5nZX0gLz5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgQ3VzdG9tUmVuZGVyTXVsdGlGaWVsZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0b25MYWJlbENsaWNrOiBmdW5jdGlvbiAoZGF0YSwgZXZlbnQpIHtcblx0XHRjb25zb2xlLmxvZyhkYXRhLCBldmVudCk7XG5cdH0sXG5cdHJlbmRlck9wdGlvbjogZnVuY3Rpb24ob3B0aW9uKSB7XG5cdFx0cmV0dXJuIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBvcHRpb24uaGV4IH19PntvcHRpb24ubGFiZWx9ICh7b3B0aW9uLmhleH0pPC9zcGFuPjtcblxuXHR9LFxuXHRyZW5kZXJWYWx1ZTogZnVuY3Rpb24ob3B0aW9uKSB7XG5cdFx0cmV0dXJuIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IG9wdGlvbi5oZXggfX0+e29wdGlvbi5sYWJlbH08L3N0cm9uZz47XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG9wcyA9IFtcblx0XHRcdHsgbGFiZWw6ICdSZWQnLCB2YWx1ZTogJ3JlZCcsIGhleDogJyNFQzYyMzAnIH0sXG5cdFx0XHR7IGxhYmVsOiAnR3JlZW4nLCB2YWx1ZTogJ2dyZWVuJywgaGV4OiAnIzRFRDg0RScgfSxcblx0XHRcdHsgbGFiZWw6ICdCbHVlJywgdmFsdWU6ICdibHVlJywgaGV4OiAnIzZEOTdFMicgfVxuXHRcdF07XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXY+XG5cdFx0XHRcdDxsYWJlbD57dGhpcy5wcm9wcy5sYWJlbH08L2xhYmVsPlxuXHRcdFx0XHQ8U2VsZWN0XG5cdFx0XHRcdFx0ZGVsaW1pdGVyPVwiLFwiXG5cdFx0XHRcdFx0bXVsdGk9e3RydWV9XG5cdFx0XHRcdFx0YWxsb3dDcmVhdGU9e3RydWV9XG5cdFx0XHRcdFx0cGxhY2Vob2xkZXI9XCJTZWxlY3QgeW91ciBmYXZvdXJpdGUocylcIlxuXHRcdFx0XHRcdG9wdGlvbnM9e29wc31cblx0XHRcdFx0XHRvcHRpb25SZW5kZXJlcj17dGhpcy5yZW5kZXJPcHRpb259XG5cdFx0XHRcdFx0dmFsdWVSZW5kZXJlcj17dGhpcy5yZW5kZXJWYWx1ZX1cblx0XHRcdFx0XHRvbkNoYW5nZT17bG9nQ2hhbmdlfSAvPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufSk7XG5cblJlYWN0LnJlbmRlcihcblx0PGRpdj5cblx0XHQ8U3RhdGVzRmllbGQgLz5cblx0XHQ8U3RhdGVzRmllbGQgbGFiZWw9XCJTdGF0ZXMgKG5vbi1zZWFyY2hhYmxlKTpcIiBzZWFyY2hhYmxlPXtmYWxzZX0gLz5cblx0XHQ8VXNlcnNGaWVsZCAvPlxuXHRcdDxWYWx1ZXNBc051bWJlcnNGaWVsZCBsYWJlbD1cIlZhbHVlcyBhcyBudW1iZXJzXCIgLz5cblx0XHQ8TXVsdGlTZWxlY3RGaWVsZCBsYWJlbD1cIk11bHRpc2VsZWN0OlwiLz5cblx0XHQ8U2VsZWN0ZWRWYWx1ZXNGaWVsZCBsYWJlbD1cIkNsaWNrYWJsZSBsYWJlbHMgKGxhYmVscyBhcyBsaW5rcyk6XCIgLz5cblx0XHQ8U2VsZWN0ZWRWYWx1ZXNGaWVsZERpc2FibGVkIGxhYmVsPVwiRGlzYWJsZWQgb3B0aW9uOlwiIC8+XG5cdFx0PFNlbGVjdGVkVmFsdWVzRmllbGRDcmVhdGUgbGFiZWw9XCJPcHRpb24gQ3JlYXRpb24gKHRhZ3MgbW9kZSk6XCIgLz5cblx0XHQ8Q3VzdG9tUmVuZGVyRmllbGQgbGFiZWw9XCJDdXN0b20gcmVuZGVyaW5nIGZvciBvcHRpb25zIGFuZCB2YWx1ZXM6XCIgLz5cblx0XHQ8Q3VzdG9tUmVuZGVyTXVsdGlGaWVsZCBsYWJlbD1cIkN1c3RvbSByZW5kZXJpbmcgZm9yIG11bHRpcGxlIG9wdGlvbnMgYW5kIHZhbHVlczpcIiAvPlxuXHRcdDxSZW1vdGVTZWxlY3RGaWVsZCBsYWJlbD1cIlJlbW90ZSBPcHRpb25zOlwiLz5cblx0PC9kaXY+LFxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhhbXBsZScpXG4pO1xuIiwiZXhwb3J0cy5BVSA9IFtcblx0eyB2YWx1ZTogJ2F1c3RyYWxpYW4tY2FwaXRhbC10ZXJyaXRvcnknLCBsYWJlbDogJ0F1c3RyYWxpYW4gQ2FwaXRhbCBUZXJyaXRvcnknIH0sXG5cdHsgdmFsdWU6ICduZXctc291dGgtd2FsZXMnLCBsYWJlbDogJ05ldyBTb3V0aCBXYWxlcycgfSxcblx0eyB2YWx1ZTogJ3ZpY3RvcmlhJywgbGFiZWw6ICdWaWN0b3JpYScgfSxcblx0eyB2YWx1ZTogJ3F1ZWVuc2xhbmQnLCBsYWJlbDogJ1F1ZWVuc2xhbmQnIH0sXG5cdHsgdmFsdWU6ICd3ZXN0ZXJuLWF1c3RyYWxpYScsIGxhYmVsOiAnV2VzdGVybiBBdXN0cmFsaWEnIH0sXG5cdHsgdmFsdWU6ICdzb3V0aC1hdXN0cmFsaWEnLCBsYWJlbDogJ1NvdXRoIEF1c3RyYWxpYScgfSxcblx0eyB2YWx1ZTogJ3Rhc21hbmlhJywgbGFiZWw6ICdUYXNtYW5pYScgfSxcblx0eyB2YWx1ZTogJ25vcnRoZXJuLXRlcnJpdG9yeScsIGxhYmVsOiAnTm9ydGhlcm4gVGVycml0b3J5JyB9XG5dO1xuXG5leHBvcnRzLlVTID0gW1xuICAgIHsgdmFsdWU6ICdBTCcsIGxhYmVsOiAnQWxhYmFtYScsIGRpc2FibGVkOiB0cnVlIH0sXG4gICAgeyB2YWx1ZTogJ0FLJywgbGFiZWw6ICdBbGFza2EnIH0sXG4gICAgeyB2YWx1ZTogJ0FTJywgbGFiZWw6ICdBbWVyaWNhbiBTYW1vYScgfSxcbiAgICB7IHZhbHVlOiAnQVonLCBsYWJlbDogJ0FyaXpvbmEnIH0sXG4gICAgeyB2YWx1ZTogJ0FSJywgbGFiZWw6ICdBcmthbnNhcycgfSxcbiAgICB7IHZhbHVlOiAnQ0EnLCBsYWJlbDogJ0NhbGlmb3JuaWEnIH0sXG4gICAgeyB2YWx1ZTogJ0NPJywgbGFiZWw6ICdDb2xvcmFkbycgfSxcbiAgICB7IHZhbHVlOiAnQ1QnLCBsYWJlbDogJ0Nvbm5lY3RpY3V0JyB9LFxuICAgIHsgdmFsdWU6ICdERScsIGxhYmVsOiAnRGVsYXdhcmUnIH0sXG4gICAgeyB2YWx1ZTogJ0RDJywgbGFiZWw6ICdEaXN0cmljdCBPZiBDb2x1bWJpYScgfSxcbiAgICB7IHZhbHVlOiAnRk0nLCBsYWJlbDogJ0ZlZGVyYXRlZCBTdGF0ZXMgT2YgTWljcm9uZXNpYScgfSxcbiAgICB7IHZhbHVlOiAnRkwnLCBsYWJlbDogJ0Zsb3JpZGEnIH0sXG4gICAgeyB2YWx1ZTogJ0dBJywgbGFiZWw6ICdHZW9yZ2lhJyB9LFxuICAgIHsgdmFsdWU6ICdHVScsIGxhYmVsOiAnR3VhbScgfSxcbiAgICB7IHZhbHVlOiAnSEknLCBsYWJlbDogJ0hhd2FpaScgfSxcbiAgICB7IHZhbHVlOiAnSUQnLCBsYWJlbDogJ0lkYWhvJyB9LFxuICAgIHsgdmFsdWU6ICdJTCcsIGxhYmVsOiAnSWxsaW5vaXMnIH0sXG4gICAgeyB2YWx1ZTogJ0lOJywgbGFiZWw6ICdJbmRpYW5hJyB9LFxuICAgIHsgdmFsdWU6ICdJQScsIGxhYmVsOiAnSW93YScgfSxcbiAgICB7IHZhbHVlOiAnS1MnLCBsYWJlbDogJ0thbnNhcycgfSxcbiAgICB7IHZhbHVlOiAnS1knLCBsYWJlbDogJ0tlbnR1Y2t5JyB9LFxuICAgIHsgdmFsdWU6ICdMQScsIGxhYmVsOiAnTG91aXNpYW5hJyB9LFxuICAgIHsgdmFsdWU6ICdNRScsIGxhYmVsOiAnTWFpbmUnIH0sXG4gICAgeyB2YWx1ZTogJ01IJywgbGFiZWw6ICdNYXJzaGFsbCBJc2xhbmRzJyB9LFxuICAgIHsgdmFsdWU6ICdNRCcsIGxhYmVsOiAnTWFyeWxhbmQnIH0sXG4gICAgeyB2YWx1ZTogJ01BJywgbGFiZWw6ICdNYXNzYWNodXNldHRzJyB9LFxuICAgIHsgdmFsdWU6ICdNSScsIGxhYmVsOiAnTWljaGlnYW4nIH0sXG4gICAgeyB2YWx1ZTogJ01OJywgbGFiZWw6ICdNaW5uZXNvdGEnIH0sXG4gICAgeyB2YWx1ZTogJ01TJywgbGFiZWw6ICdNaXNzaXNzaXBwaScgfSxcbiAgICB7IHZhbHVlOiAnTU8nLCBsYWJlbDogJ01pc3NvdXJpJyB9LFxuICAgIHsgdmFsdWU6ICdNVCcsIGxhYmVsOiAnTW9udGFuYScgfSxcbiAgICB7IHZhbHVlOiAnTkUnLCBsYWJlbDogJ05lYnJhc2thJyB9LFxuICAgIHsgdmFsdWU6ICdOVicsIGxhYmVsOiAnTmV2YWRhJyB9LFxuICAgIHsgdmFsdWU6ICdOSCcsIGxhYmVsOiAnTmV3IEhhbXBzaGlyZScgfSxcbiAgICB7IHZhbHVlOiAnTkonLCBsYWJlbDogJ05ldyBKZXJzZXknIH0sXG4gICAgeyB2YWx1ZTogJ05NJywgbGFiZWw6ICdOZXcgTWV4aWNvJyB9LFxuICAgIHsgdmFsdWU6ICdOWScsIGxhYmVsOiAnTmV3IFlvcmsnIH0sXG4gICAgeyB2YWx1ZTogJ05DJywgbGFiZWw6ICdOb3J0aCBDYXJvbGluYScgfSxcbiAgICB7IHZhbHVlOiAnTkQnLCBsYWJlbDogJ05vcnRoIERha290YScgfSxcbiAgICB7IHZhbHVlOiAnTVAnLCBsYWJlbDogJ05vcnRoZXJuIE1hcmlhbmEgSXNsYW5kcycgfSxcbiAgICB7IHZhbHVlOiAnT0gnLCBsYWJlbDogJ09oaW8nIH0sXG4gICAgeyB2YWx1ZTogJ09LJywgbGFiZWw6ICdPa2xhaG9tYScgfSxcbiAgICB7IHZhbHVlOiAnT1InLCBsYWJlbDogJ09yZWdvbicgfSxcbiAgICB7IHZhbHVlOiAnUFcnLCBsYWJlbDogJ1BhbGF1JyB9LFxuICAgIHsgdmFsdWU6ICdQQScsIGxhYmVsOiAnUGVubnN5bHZhbmlhJyB9LFxuICAgIHsgdmFsdWU6ICdQUicsIGxhYmVsOiAnUHVlcnRvIFJpY28nIH0sXG4gICAgeyB2YWx1ZTogJ1JJJywgbGFiZWw6ICdSaG9kZSBJc2xhbmQnIH0sXG4gICAgeyB2YWx1ZTogJ1NDJywgbGFiZWw6ICdTb3V0aCBDYXJvbGluYScgfSxcbiAgICB7IHZhbHVlOiAnU0QnLCBsYWJlbDogJ1NvdXRoIERha290YScgfSxcbiAgICB7IHZhbHVlOiAnVE4nLCBsYWJlbDogJ1Rlbm5lc3NlZScgfSxcbiAgICB7IHZhbHVlOiAnVFgnLCBsYWJlbDogJ1RleGFzJyB9LFxuICAgIHsgdmFsdWU6ICdVVCcsIGxhYmVsOiAnVXRhaCcgfSxcbiAgICB7IHZhbHVlOiAnVlQnLCBsYWJlbDogJ1Zlcm1vbnQnIH0sXG4gICAgeyB2YWx1ZTogJ1ZJJywgbGFiZWw6ICdWaXJnaW4gSXNsYW5kcycgfSxcbiAgICB7IHZhbHVlOiAnVkEnLCBsYWJlbDogJ1ZpcmdpbmlhJyB9LFxuICAgIHsgdmFsdWU6ICdXQScsIGxhYmVsOiAnV2FzaGluZ3RvbicgfSxcbiAgICB7IHZhbHVlOiAnV1YnLCBsYWJlbDogJ1dlc3QgVmlyZ2luaWEnIH0sXG4gICAgeyB2YWx1ZTogJ1dJJywgbGFiZWw6ICdXaXNjb25zaW4nIH0sXG4gICAgeyB2YWx1ZTogJ1dZJywgbGFiZWw6ICdXeW9taW5nJyB9XG5dO1xuIiwiZXhwb3J0cy51c2VycyA9IFtcbiAgICB7IHZhbHVlOiAnSm9obiBTbWl0aCcsIGxhYmVsOiAnSm9obiBTbWl0aCcsIGVtYWlsOiAnam9obkBzbWl0aC5jb20nIH0sXG4gICAgeyB2YWx1ZTogJ01lcnJ5IEphbmUnLCBsYWJlbDogJ01lcnJ5IEphbmUnLCBlbWFpbDogJ21lcnJ5QGphbmUuY29tJyB9LFxuICAgIHsgdmFsdWU6ICdTdGFuIEhvcGVyJywgbGFiZWw6ICdTdGFuIEhvcGVyJywgZW1haWw6ICdzdGFuQGhvcGVyLmNvbScgfVxuXTtcbiIsInZhciBjaGFyZW5jID0ge1xuICAvLyBVVEYtOCBlbmNvZGluZ1xuICB1dGY4OiB7XG4gICAgLy8gQ29udmVydCBhIHN0cmluZyB0byBhIGJ5dGUgYXJyYXlcbiAgICBzdHJpbmdUb0J5dGVzOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIHJldHVybiBjaGFyZW5jLmJpbi5zdHJpbmdUb0J5dGVzKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzdHIpKSk7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgc3RyaW5nXG4gICAgYnl0ZXNUb1N0cmluZzogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKGNoYXJlbmMuYmluLmJ5dGVzVG9TdHJpbmcoYnl0ZXMpKSk7XG4gICAgfVxuICB9LFxuXG4gIC8vIEJpbmFyeSBlbmNvZGluZ1xuICBiaW46IHtcbiAgICAvLyBDb252ZXJ0IGEgc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxuICAgIHN0cmluZ1RvQnl0ZXM6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspXG4gICAgICAgIGJ5dGVzLnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBzdHJpbmdcbiAgICBieXRlc1RvU3RyaW5nOiBmdW5jdGlvbihieXRlcykge1xuICAgICAgZm9yICh2YXIgc3RyID0gW10sIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyspXG4gICAgICAgIHN0ci5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0pKTtcbiAgICAgIHJldHVybiBzdHIuam9pbignJyk7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJlbmM7XG4iLCIoZnVuY3Rpb24oKSB7XG4gIHZhciBiYXNlNjRtYXBcbiAgICAgID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nLFxuXG4gIGNyeXB0ID0ge1xuICAgIC8vIEJpdC13aXNlIHJvdGF0aW9uIGxlZnRcbiAgICByb3RsOiBmdW5jdGlvbihuLCBiKSB7XG4gICAgICByZXR1cm4gKG4gPDwgYikgfCAobiA+Pj4gKDMyIC0gYikpO1xuICAgIH0sXG5cbiAgICAvLyBCaXQtd2lzZSByb3RhdGlvbiByaWdodFxuICAgIHJvdHI6IGZ1bmN0aW9uKG4sIGIpIHtcbiAgICAgIHJldHVybiAobiA8PCAoMzIgLSBiKSkgfCAobiA+Pj4gYik7XG4gICAgfSxcblxuICAgIC8vIFN3YXAgYmlnLWVuZGlhbiB0byBsaXR0bGUtZW5kaWFuIGFuZCB2aWNlIHZlcnNhXG4gICAgZW5kaWFuOiBmdW5jdGlvbihuKSB7XG4gICAgICAvLyBJZiBudW1iZXIgZ2l2ZW4sIHN3YXAgZW5kaWFuXG4gICAgICBpZiAobi5jb25zdHJ1Y3RvciA9PSBOdW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0LnJvdGwobiwgOCkgJiAweDAwRkYwMEZGIHwgY3J5cHQucm90bChuLCAyNCkgJiAweEZGMDBGRjAwO1xuICAgICAgfVxuXG4gICAgICAvLyBFbHNlLCBhc3N1bWUgYXJyYXkgYW5kIHN3YXAgYWxsIGl0ZW1zXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG4ubGVuZ3RoOyBpKyspXG4gICAgICAgIG5baV0gPSBjcnlwdC5lbmRpYW4obltpXSk7XG4gICAgICByZXR1cm4gbjtcbiAgICB9LFxuXG4gICAgLy8gR2VuZXJhdGUgYW4gYXJyYXkgb2YgYW55IGxlbmd0aCBvZiByYW5kb20gYnl0ZXNcbiAgICByYW5kb21CeXRlczogZnVuY3Rpb24obikge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXTsgbiA+IDA7IG4tLSlcbiAgICAgICAgYnl0ZXMucHVzaChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYmlnLWVuZGlhbiAzMi1iaXQgd29yZHNcbiAgICBieXRlc1RvV29yZHM6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciB3b3JkcyA9IFtdLCBpID0gMCwgYiA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKywgYiArPSA4KVxuICAgICAgICB3b3Jkc1tiID4+PiA1XSB8PSBieXRlc1tpXSA8PCAoMjQgLSBiICUgMzIpO1xuICAgICAgcmV0dXJuIHdvcmRzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGJpZy1lbmRpYW4gMzItYml0IHdvcmRzIHRvIGEgYnl0ZSBhcnJheVxuICAgIHdvcmRzVG9CeXRlczogZnVuY3Rpb24od29yZHMpIHtcbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW10sIGIgPSAwOyBiIDwgd29yZHMubGVuZ3RoICogMzI7IGIgKz0gOClcbiAgICAgICAgYnl0ZXMucHVzaCgod29yZHNbYiA+Pj4gNV0gPj4+ICgyNCAtIGIgJSAzMikpICYgMHhGRik7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgaGV4IHN0cmluZ1xuICAgIGJ5dGVzVG9IZXg6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciBoZXggPSBbXSwgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBoZXgucHVzaCgoYnl0ZXNbaV0gPj4+IDQpLnRvU3RyaW5nKDE2KSk7XG4gICAgICAgIGhleC5wdXNoKChieXRlc1tpXSAmIDB4RikudG9TdHJpbmcoMTYpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoZXguam9pbignJyk7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBoZXggc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxuICAgIGhleFRvQnl0ZXM6IGZ1bmN0aW9uKGhleCkge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgYyA9IDA7IGMgPCBoZXgubGVuZ3RoOyBjICs9IDIpXG4gICAgICAgIGJ5dGVzLnB1c2gocGFyc2VJbnQoaGV4LnN1YnN0cihjLCAyKSwgMTYpKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBiYXNlLTY0IHN0cmluZ1xuICAgIGJ5dGVzVG9CYXNlNjQ6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciBiYXNlNjQgPSBbXSwgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMykge1xuICAgICAgICB2YXIgdHJpcGxldCA9IChieXRlc1tpXSA8PCAxNikgfCAoYnl0ZXNbaSArIDFdIDw8IDgpIHwgYnl0ZXNbaSArIDJdO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IDQ7IGorKylcbiAgICAgICAgICBpZiAoaSAqIDggKyBqICogNiA8PSBieXRlcy5sZW5ndGggKiA4KVxuICAgICAgICAgICAgYmFzZTY0LnB1c2goYmFzZTY0bWFwLmNoYXJBdCgodHJpcGxldCA+Pj4gNiAqICgzIC0gaikpICYgMHgzRikpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGJhc2U2NC5wdXNoKCc9Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmFzZTY0LmpvaW4oJycpO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYmFzZS02NCBzdHJpbmcgdG8gYSBieXRlIGFycmF5XG4gICAgYmFzZTY0VG9CeXRlczogZnVuY3Rpb24oYmFzZTY0KSB7XG4gICAgICAvLyBSZW1vdmUgbm9uLWJhc2UtNjQgY2hhcmFjdGVyc1xuICAgICAgYmFzZTY0ID0gYmFzZTY0LnJlcGxhY2UoL1teQS1aMC05K1xcL10vaWcsICcnKTtcblxuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgaSA9IDAsIGltb2Q0ID0gMDsgaSA8IGJhc2U2NC5sZW5ndGg7XG4gICAgICAgICAgaW1vZDQgPSArK2kgJSA0KSB7XG4gICAgICAgIGlmIChpbW9kNCA9PSAwKSBjb250aW51ZTtcbiAgICAgICAgYnl0ZXMucHVzaCgoKGJhc2U2NG1hcC5pbmRleE9mKGJhc2U2NC5jaGFyQXQoaSAtIDEpKVxuICAgICAgICAgICAgJiAoTWF0aC5wb3coMiwgLTIgKiBpbW9kNCArIDgpIC0gMSkpIDw8IChpbW9kNCAqIDIpKVxuICAgICAgICAgICAgfCAoYmFzZTY0bWFwLmluZGV4T2YoYmFzZTY0LmNoYXJBdChpKSkgPj4+ICg2IC0gaW1vZDQgKiAyKSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH1cbiAgfTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGNyeXB0O1xufSkoKTtcbiIsIi8qKlxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBCdWZmZXJcbiAqXG4gKiBBdXRob3I6ICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIExpY2Vuc2U6ICBNSVRcbiAqXG4gKiBgbnBtIGluc3RhbGwgaXMtYnVmZmVyYFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gISEob2JqICE9IG51bGwgJiZcbiAgICAob2JqLl9pc0J1ZmZlciB8fCAvLyBGb3IgU2FmYXJpIDUtNyAobWlzc2luZyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yKVxuICAgICAgKG9iai5jb25zdHJ1Y3RvciAmJlxuICAgICAgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iaikpXG4gICAgKSlcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBtZWRpYVF1ZXJ5O1xuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwpIHtcbiAgICBtZWRpYVF1ZXJ5ID0gXCIoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAxLjI1KSwgKG1pbi0tbW96LWRldmljZS1waXhlbC1yYXRpbzogMS4yNSksICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiA1LzQpLCAobWluLXJlc29sdXRpb246IDEuMjVkcHB4KVwiO1xuICAgIGlmICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA+IDEuMjUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEgJiYgd2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeSkubWF0Y2hlcykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG4iLCIoZnVuY3Rpb24oKXtcclxuICB2YXIgY3J5cHQgPSByZXF1aXJlKCdjcnlwdCcpLFxyXG4gICAgICB1dGY4ID0gcmVxdWlyZSgnY2hhcmVuYycpLnV0ZjgsXHJcbiAgICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnaXMtYnVmZmVyJyksXHJcbiAgICAgIGJpbiA9IHJlcXVpcmUoJ2NoYXJlbmMnKS5iaW4sXHJcblxyXG4gIC8vIFRoZSBjb3JlXHJcbiAgbWQ1ID0gZnVuY3Rpb24gKG1lc3NhZ2UsIG9wdGlvbnMpIHtcclxuICAgIC8vIENvbnZlcnQgdG8gYnl0ZSBhcnJheVxyXG4gICAgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT0gU3RyaW5nKVxyXG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmVuY29kaW5nID09PSAnYmluYXJ5JylcclxuICAgICAgICBtZXNzYWdlID0gYmluLnN0cmluZ1RvQnl0ZXMobWVzc2FnZSk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBtZXNzYWdlID0gdXRmOC5zdHJpbmdUb0J5dGVzKG1lc3NhZ2UpO1xyXG4gICAgZWxzZSBpZiAoaXNCdWZmZXIobWVzc2FnZSkpXHJcbiAgICAgIG1lc3NhZ2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChtZXNzYWdlLCAwKTtcclxuICAgIGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KG1lc3NhZ2UpKVxyXG4gICAgICBtZXNzYWdlID0gbWVzc2FnZS50b1N0cmluZygpO1xyXG4gICAgLy8gZWxzZSwgYXNzdW1lIGJ5dGUgYXJyYXkgYWxyZWFkeVxyXG5cclxuICAgIHZhciBtID0gY3J5cHQuYnl0ZXNUb1dvcmRzKG1lc3NhZ2UpLFxyXG4gICAgICAgIGwgPSBtZXNzYWdlLmxlbmd0aCAqIDgsXHJcbiAgICAgICAgYSA9ICAxNzMyNTg0MTkzLFxyXG4gICAgICAgIGIgPSAtMjcxNzMzODc5LFxyXG4gICAgICAgIGMgPSAtMTczMjU4NDE5NCxcclxuICAgICAgICBkID0gIDI3MTczMzg3ODtcclxuXHJcbiAgICAvLyBTd2FwIGVuZGlhblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIG1baV0gPSAoKG1baV0gPDwgIDgpIHwgKG1baV0gPj4+IDI0KSkgJiAweDAwRkYwMEZGIHxcclxuICAgICAgICAgICAgICgobVtpXSA8PCAyNCkgfCAobVtpXSA+Pj4gIDgpKSAmIDB4RkYwMEZGMDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUGFkZGluZ1xyXG4gICAgbVtsID4+PiA1XSB8PSAweDgwIDw8IChsICUgMzIpO1xyXG4gICAgbVsoKChsICsgNjQpID4+PiA5KSA8PCA0KSArIDE0XSA9IGw7XHJcblxyXG4gICAgLy8gTWV0aG9kIHNob3J0Y3V0c1xyXG4gICAgdmFyIEZGID0gbWQ1Ll9mZixcclxuICAgICAgICBHRyA9IG1kNS5fZ2csXHJcbiAgICAgICAgSEggPSBtZDUuX2hoLFxyXG4gICAgICAgIElJID0gbWQ1Ll9paTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG0ubGVuZ3RoOyBpICs9IDE2KSB7XHJcblxyXG4gICAgICB2YXIgYWEgPSBhLFxyXG4gICAgICAgICAgYmIgPSBiLFxyXG4gICAgICAgICAgY2MgPSBjLFxyXG4gICAgICAgICAgZGQgPSBkO1xyXG5cclxuICAgICAgYSA9IEZGKGEsIGIsIGMsIGQsIG1baSsgMF0sICA3LCAtNjgwODc2OTM2KTtcclxuICAgICAgZCA9IEZGKGQsIGEsIGIsIGMsIG1baSsgMV0sIDEyLCAtMzg5NTY0NTg2KTtcclxuICAgICAgYyA9IEZGKGMsIGQsIGEsIGIsIG1baSsgMl0sIDE3LCAgNjA2MTA1ODE5KTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsgM10sIDIyLCAtMTA0NDUyNTMzMCk7XHJcbiAgICAgIGEgPSBGRihhLCBiLCBjLCBkLCBtW2krIDRdLCAgNywgLTE3NjQxODg5Nyk7XHJcbiAgICAgIGQgPSBGRihkLCBhLCBiLCBjLCBtW2krIDVdLCAxMiwgIDEyMDAwODA0MjYpO1xyXG4gICAgICBjID0gRkYoYywgZCwgYSwgYiwgbVtpKyA2XSwgMTcsIC0xNDczMjMxMzQxKTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsgN10sIDIyLCAtNDU3MDU5ODMpO1xyXG4gICAgICBhID0gRkYoYSwgYiwgYywgZCwgbVtpKyA4XSwgIDcsICAxNzcwMDM1NDE2KTtcclxuICAgICAgZCA9IEZGKGQsIGEsIGIsIGMsIG1baSsgOV0sIDEyLCAtMTk1ODQxNDQxNyk7XHJcbiAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBtW2krMTBdLCAxNywgLTQyMDYzKTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsxMV0sIDIyLCAtMTk5MDQwNDE2Mik7XHJcbiAgICAgIGEgPSBGRihhLCBiLCBjLCBkLCBtW2krMTJdLCAgNywgIDE4MDQ2MDM2ODIpO1xyXG4gICAgICBkID0gRkYoZCwgYSwgYiwgYywgbVtpKzEzXSwgMTIsIC00MDM0MTEwMSk7XHJcbiAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBtW2krMTRdLCAxNywgLTE1MDIwMDIyOTApO1xyXG4gICAgICBiID0gRkYoYiwgYywgZCwgYSwgbVtpKzE1XSwgMjIsICAxMjM2NTM1MzI5KTtcclxuXHJcbiAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBtW2krIDFdLCAgNSwgLTE2NTc5NjUxMCk7XHJcbiAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBtW2krIDZdLCAgOSwgLTEwNjk1MDE2MzIpO1xyXG4gICAgICBjID0gR0coYywgZCwgYSwgYiwgbVtpKzExXSwgMTQsICA2NDM3MTc3MTMpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKyAwXSwgMjAsIC0zNzM4OTczMDIpO1xyXG4gICAgICBhID0gR0coYSwgYiwgYywgZCwgbVtpKyA1XSwgIDUsIC03MDE1NTg2OTEpO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKzEwXSwgIDksICAzODAxNjA4Myk7XHJcbiAgICAgIGMgPSBHRyhjLCBkLCBhLCBiLCBtW2krMTVdLCAxNCwgLTY2MDQ3ODMzNSk7XHJcbiAgICAgIGIgPSBHRyhiLCBjLCBkLCBhLCBtW2krIDRdLCAyMCwgLTQwNTUzNzg0OCk7XHJcbiAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBtW2krIDldLCAgNSwgIDU2ODQ0NjQzOCk7XHJcbiAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBtW2krMTRdLCAgOSwgLTEwMTk4MDM2OTApO1xyXG4gICAgICBjID0gR0coYywgZCwgYSwgYiwgbVtpKyAzXSwgMTQsIC0xODczNjM5NjEpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKyA4XSwgMjAsICAxMTYzNTMxNTAxKTtcclxuICAgICAgYSA9IEdHKGEsIGIsIGMsIGQsIG1baSsxM10sICA1LCAtMTQ0NDY4MTQ2Nyk7XHJcbiAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBtW2krIDJdLCAgOSwgLTUxNDAzNzg0KTtcclxuICAgICAgYyA9IEdHKGMsIGQsIGEsIGIsIG1baSsgN10sIDE0LCAgMTczNTMyODQ3Myk7XHJcbiAgICAgIGIgPSBHRyhiLCBjLCBkLCBhLCBtW2krMTJdLCAyMCwgLTE5MjY2MDc3MzQpO1xyXG5cclxuICAgICAgYSA9IEhIKGEsIGIsIGMsIGQsIG1baSsgNV0sICA0LCAtMzc4NTU4KTtcclxuICAgICAgZCA9IEhIKGQsIGEsIGIsIGMsIG1baSsgOF0sIDExLCAtMjAyMjU3NDQ2Myk7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krMTFdLCAxNiwgIDE4MzkwMzA1NjIpO1xyXG4gICAgICBiID0gSEgoYiwgYywgZCwgYSwgbVtpKzE0XSwgMjMsIC0zNTMwOTU1Nik7XHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krIDFdLCAgNCwgLTE1MzA5OTIwNjApO1xyXG4gICAgICBkID0gSEgoZCwgYSwgYiwgYywgbVtpKyA0XSwgMTEsICAxMjcyODkzMzUzKTtcclxuICAgICAgYyA9IEhIKGMsIGQsIGEsIGIsIG1baSsgN10sIDE2LCAtMTU1NDk3NjMyKTtcclxuICAgICAgYiA9IEhIKGIsIGMsIGQsIGEsIG1baSsxMF0sIDIzLCAtMTA5NDczMDY0MCk7XHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krMTNdLCAgNCwgIDY4MTI3OTE3NCk7XHJcbiAgICAgIGQgPSBISChkLCBhLCBiLCBjLCBtW2krIDBdLCAxMSwgLTM1ODUzNzIyMik7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krIDNdLCAxNiwgLTcyMjUyMTk3OSk7XHJcbiAgICAgIGIgPSBISChiLCBjLCBkLCBhLCBtW2krIDZdLCAyMywgIDc2MDI5MTg5KTtcclxuICAgICAgYSA9IEhIKGEsIGIsIGMsIGQsIG1baSsgOV0sICA0LCAtNjQwMzY0NDg3KTtcclxuICAgICAgZCA9IEhIKGQsIGEsIGIsIGMsIG1baSsxMl0sIDExLCAtNDIxODE1ODM1KTtcclxuICAgICAgYyA9IEhIKGMsIGQsIGEsIGIsIG1baSsxNV0sIDE2LCAgNTMwNzQyNTIwKTtcclxuICAgICAgYiA9IEhIKGIsIGMsIGQsIGEsIG1baSsgMl0sIDIzLCAtOTk1MzM4NjUxKTtcclxuXHJcbiAgICAgIGEgPSBJSShhLCBiLCBjLCBkLCBtW2krIDBdLCAgNiwgLTE5ODYzMDg0NCk7XHJcbiAgICAgIGQgPSBJSShkLCBhLCBiLCBjLCBtW2krIDddLCAxMCwgIDExMjY4OTE0MTUpO1xyXG4gICAgICBjID0gSUkoYywgZCwgYSwgYiwgbVtpKzE0XSwgMTUsIC0xNDE2MzU0OTA1KTtcclxuICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIG1baSsgNV0sIDIxLCAtNTc0MzQwNTUpO1xyXG4gICAgICBhID0gSUkoYSwgYiwgYywgZCwgbVtpKzEyXSwgIDYsICAxNzAwNDg1NTcxKTtcclxuICAgICAgZCA9IElJKGQsIGEsIGIsIGMsIG1baSsgM10sIDEwLCAtMTg5NDk4NjYwNik7XHJcbiAgICAgIGMgPSBJSShjLCBkLCBhLCBiLCBtW2krMTBdLCAxNSwgLTEwNTE1MjMpO1xyXG4gICAgICBiID0gSUkoYiwgYywgZCwgYSwgbVtpKyAxXSwgMjEsIC0yMDU0OTIyNzk5KTtcclxuICAgICAgYSA9IElJKGEsIGIsIGMsIGQsIG1baSsgOF0sICA2LCAgMTg3MzMxMzM1OSk7XHJcbiAgICAgIGQgPSBJSShkLCBhLCBiLCBjLCBtW2krMTVdLCAxMCwgLTMwNjExNzQ0KTtcclxuICAgICAgYyA9IElJKGMsIGQsIGEsIGIsIG1baSsgNl0sIDE1LCAtMTU2MDE5ODM4MCk7XHJcbiAgICAgIGIgPSBJSShiLCBjLCBkLCBhLCBtW2krMTNdLCAyMSwgIDEzMDkxNTE2NDkpO1xyXG4gICAgICBhID0gSUkoYSwgYiwgYywgZCwgbVtpKyA0XSwgIDYsIC0xNDU1MjMwNzApO1xyXG4gICAgICBkID0gSUkoZCwgYSwgYiwgYywgbVtpKzExXSwgMTAsIC0xMTIwMjEwMzc5KTtcclxuICAgICAgYyA9IElJKGMsIGQsIGEsIGIsIG1baSsgMl0sIDE1LCAgNzE4Nzg3MjU5KTtcclxuICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIG1baSsgOV0sIDIxLCAtMzQzNDg1NTUxKTtcclxuXHJcbiAgICAgIGEgPSAoYSArIGFhKSA+Pj4gMDtcclxuICAgICAgYiA9IChiICsgYmIpID4+PiAwO1xyXG4gICAgICBjID0gKGMgKyBjYykgPj4+IDA7XHJcbiAgICAgIGQgPSAoZCArIGRkKSA+Pj4gMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY3J5cHQuZW5kaWFuKFthLCBiLCBjLCBkXSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gQXV4aWxpYXJ5IGZ1bmN0aW9uc1xyXG4gIG1kNS5fZmYgID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxuICAgIHZhciBuID0gYSArIChiICYgYyB8IH5iICYgZCkgKyAoeCA+Pj4gMCkgKyB0O1xyXG4gICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcclxuICB9O1xyXG4gIG1kNS5fZ2cgID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxuICAgIHZhciBuID0gYSArIChiICYgZCB8IGMgJiB+ZCkgKyAoeCA+Pj4gMCkgKyB0O1xyXG4gICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcclxuICB9O1xyXG4gIG1kNS5faGggID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxuICAgIHZhciBuID0gYSArIChiIF4gYyBeIGQpICsgKHggPj4+IDApICsgdDtcclxuICAgIHJldHVybiAoKG4gPDwgcykgfCAobiA+Pj4gKDMyIC0gcykpKSArIGI7XHJcbiAgfTtcclxuICBtZDUuX2lpICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYyBeIChiIHwgfmQpKSArICh4ID4+PiAwKSArIHQ7XHJcbiAgICByZXR1cm4gKChuIDw8IHMpIHwgKG4gPj4+ICgzMiAtIHMpKSkgKyBiO1xyXG4gIH07XHJcblxyXG4gIC8vIFBhY2thZ2UgcHJpdmF0ZSBibG9ja3NpemVcclxuICBtZDUuX2Jsb2Nrc2l6ZSA9IDE2O1xyXG4gIG1kNS5fZGlnZXN0c2l6ZSA9IDE2O1xyXG5cclxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtZXNzYWdlLCBvcHRpb25zKSB7XHJcbiAgICBpZih0eXBlb2YgbWVzc2FnZSA9PSAndW5kZWZpbmVkJylcclxuICAgICAgcmV0dXJuO1xyXG5cclxuICAgIHZhciBkaWdlc3RieXRlcyA9IGNyeXB0LndvcmRzVG9CeXRlcyhtZDUobWVzc2FnZSwgb3B0aW9ucykpO1xyXG4gICAgcmV0dXJuIG9wdGlvbnMgJiYgb3B0aW9ucy5hc0J5dGVzID8gZGlnZXN0Ynl0ZXMgOlxyXG4gICAgICAgIG9wdGlvbnMgJiYgb3B0aW9ucy5hc1N0cmluZyA/IGJpbi5ieXRlc1RvU3RyaW5nKGRpZ2VzdGJ5dGVzKSA6XHJcbiAgICAgICAgY3J5cHQuYnl0ZXNUb0hleChkaWdlc3RieXRlcyk7XHJcbiAgfTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8vIElmIG9iai5oYXNPd25Qcm9wZXJ0eSBoYXMgYmVlbiBvdmVycmlkZGVuLCB0aGVuIGNhbGxpbmdcbi8vIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSB3aWxsIGJyZWFrLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvaXNzdWVzLzE3MDdcbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocXMsIHNlcCwgZXEsIG9wdGlvbnMpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIHZhciBvYmogPSB7fTtcblxuICBpZiAodHlwZW9mIHFzICE9PSAnc3RyaW5nJyB8fCBxcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIHJlZ2V4cCA9IC9cXCsvZztcbiAgcXMgPSBxcy5zcGxpdChzZXApO1xuXG4gIHZhciBtYXhLZXlzID0gMTAwMDtcbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMubWF4S2V5cyA9PT0gJ251bWJlcicpIHtcbiAgICBtYXhLZXlzID0gb3B0aW9ucy5tYXhLZXlzO1xuICB9XG5cbiAgdmFyIGxlbiA9IHFzLmxlbmd0aDtcbiAgLy8gbWF4S2V5cyA8PSAwIG1lYW5zIHRoYXQgd2Ugc2hvdWxkIG5vdCBsaW1pdCBrZXlzIGNvdW50XG4gIGlmIChtYXhLZXlzID4gMCAmJiBsZW4gPiBtYXhLZXlzKSB7XG4gICAgbGVuID0gbWF4S2V5cztcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgeCA9IHFzW2ldLnJlcGxhY2UocmVnZXhwLCAnJTIwJyksXG4gICAgICAgIGlkeCA9IHguaW5kZXhPZihlcSksXG4gICAgICAgIGtzdHIsIHZzdHIsIGssIHY7XG5cbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIGtzdHIgPSB4LnN1YnN0cigwLCBpZHgpO1xuICAgICAgdnN0ciA9IHguc3Vic3RyKGlkeCArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrc3RyID0geDtcbiAgICAgIHZzdHIgPSAnJztcbiAgICB9XG5cbiAgICBrID0gZGVjb2RlVVJJQ29tcG9uZW50KGtzdHIpO1xuICAgIHYgPSBkZWNvZGVVUklDb21wb25lbnQodnN0cik7XG5cbiAgICBpZiAoIWhhc093blByb3BlcnR5KG9iaiwgaykpIHtcbiAgICAgIG9ialtrXSA9IHY7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgIG9ialtrXS5wdXNoKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmpba10gPSBbb2JqW2tdLCB2XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5UHJpbWl0aXZlID0gZnVuY3Rpb24odikge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2O1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzRmluaXRlKHYpID8gdiA6ICcnO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHNlcCwgZXEsIG5hbWUpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbWFwKG9iamVjdEtleXMob2JqKSwgZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGtzID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcbiAgICAgIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgICAgcmV0dXJuIG1hcChvYmpba10sIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKHYpKTtcbiAgICAgICAgfSkuam9pbihzZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmpba10pKTtcbiAgICAgIH1cbiAgICB9KS5qb2luKHNlcCk7XG5cbiAgfVxuXG4gIGlmICghbmFtZSkgcmV0dXJuICcnO1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShuYW1lKSkgKyBlcSArXG4gICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9iaikpO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbmZ1bmN0aW9uIG1hcCAoeHMsIGYpIHtcbiAgaWYgKHhzLm1hcCkgcmV0dXJuIHhzLm1hcChmKTtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzLnB1c2goZih4c1tpXSwgaSkpO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmVzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5kZWNvZGUgPSBleHBvcnRzLnBhcnNlID0gcmVxdWlyZSgnLi9kZWNvZGUnKTtcbmV4cG9ydHMuZW5jb2RlID0gZXhwb3J0cy5zdHJpbmdpZnkgPSByZXF1aXJlKCcuL2VuY29kZScpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjkuM1xudmFyIFJlYWN0LCBpc1JldGluYSwgbWQ1LCBxdWVyeXN0cmluZztcblxuUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG5tZDUgPSByZXF1aXJlKCdtZDUnKTtcblxucXVlcnlzdHJpbmcgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xuXG5pc1JldGluYSA9IHJlcXVpcmUoJ2lzLXJldGluYScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdHcmF2YXRhcicsXG4gIHByb3BUeXBlczoge1xuICAgIGVtYWlsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICByYXRpbmc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgaHR0cHM6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgIFwiZGVmYXVsdFwiOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzaXplOiA1MCxcbiAgICAgIHJhdGluZzogJ2cnLFxuICAgICAgaHR0cHM6IGZhbHNlLFxuICAgICAgXCJkZWZhdWx0XCI6IFwicmV0cm9cIixcbiAgICAgIGVtYWlsOiAnJyxcbiAgICAgIGNsYXNzTmFtZTogXCJcIlxuICAgIH07XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJhc2UsIHF1ZXJ5LCBzcmM7XG4gICAgYmFzZSA9IHRoaXMucHJvcHMuaHR0cHMgPyBcImh0dHBzOi8vc2VjdXJlLmdyYXZhdGFyLmNvbS9hdmF0YXIvXCIgOiAnaHR0cDovL3d3dy5ncmF2YXRhci5jb20vYXZhdGFyLyc7XG4gICAgcXVlcnkgPSBxdWVyeXN0cmluZy5zdHJpbmdpZnkoe1xuICAgICAgczogaXNSZXRpbmEoKSA/IHRoaXMucHJvcHMuc2l6ZSAqIDIgOiB0aGlzLnByb3BzLnNpemUsXG4gICAgICByOiB0aGlzLnByb3BzLnJhdGluZyxcbiAgICAgIGQ6IHRoaXMucHJvcHNbXCJkZWZhdWx0XCJdXG4gICAgfSk7XG4gICAgc3JjID0gYmFzZSArIG1kNSh0aGlzLnByb3BzLmVtYWlsKSArIFwiP1wiICsgcXVlcnk7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgUmVhY3QuX19zcHJlYWQoe30sIHRoaXMucHJvcHMsIHtcbiAgICAgIFwiY2xhc3NOYW1lXCI6IFwicmVhY3QtZ3JhdmF0YXIgXCIgKyB0aGlzLnByb3BzLmNsYXNzTmFtZSxcbiAgICAgIFwic3JjXCI6IHNyYyxcbiAgICAgIFwiaGVpZ2h0XCI6IHRoaXMucHJvcHMuc2l6ZSxcbiAgICAgIFwid2lkdGhcIjogdGhpcy5wcm9wcy5zaXplXG4gICAgfSkpO1xuICB9XG59KTtcbiJdfQ==
