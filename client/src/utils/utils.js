import _ from 'lodash';

export function uppercaseObjectValue(object) {
  if (typeof object === 'object') {
    const objectCloned = _.cloneDeep(object);
    for (const key in objectCloned) {
      objectCloned[key] = _.upperFirst(objectCloned[key]);
    }

    return objectCloned;
  }

  return object;
}

export function getKeyAsString(value, enumObject) {
  const enumInverted = _.invert(enumObject);
  return enumInverted[value];
}

export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function chooseBlackOrWhiteDependOnHex(hex) {
  const rgb = hexToRgb(hex);
  return rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 186 ? '#000' : '#fff';
}