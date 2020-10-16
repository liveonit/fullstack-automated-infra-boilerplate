import _ from 'lodash'

export const isArrayEqual = (x: any[], y: any[]) => _(x).xorWith(y, _.isEqual).isEmpty();