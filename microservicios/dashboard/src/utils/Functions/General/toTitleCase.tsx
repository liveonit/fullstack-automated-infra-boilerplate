import lowerCase from 'lodash/lowerCase';

export function titleCase(str: string) {
  const strAux = lowerCase(str).split(' ');
  for (var i = 0; i < str.length; i++) {
    strAux[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return strAux.join(' ');
}

export default titleCase;