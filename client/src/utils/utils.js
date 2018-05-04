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