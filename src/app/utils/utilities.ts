export const ROOT_REQUEST_URL = 'http://localhost:3004';

// export const createSpy = <T>(
//   prototypeOrMethods: T | Array<keyof T>,
//   params?: { [prop in keyof T]?: T[prop] }
// ): jasmine.SpyObj<T> => {
//   const methodsSpy: jasmine.SpyObj<T> =
//     prototypeOrMethods instanceof Array
//       ? createSpyObj(prototypeOrMethods)
//       : createSpyObj(
//         Object.getOwnPropertyNames(prototypeOrMethods).filter(
//           (propName: string) => propName !== 'constructor'
//         )
//       );
//   return { ... methodsSpy, ...params };
// }

// const createSpyObj = <T>(propNames: any): jasmine.SpyObj<T> => {
//   return propNames.length > 0
//     ? jasmine.createSpyObj<T>(propNames)
//     : ({} as jasmine.SpyObj<T>);
// };
