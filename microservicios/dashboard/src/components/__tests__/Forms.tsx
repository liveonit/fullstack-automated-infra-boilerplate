import React from 'react';
import Enzyme from 'enzyme'
// TODO: hacer tests como los siguientes, para validar tanto campos de entrada como funciones de validacion
// en los intermedios verificar que no se envie, checkeando estados dde default y not required y en cada 
// paso verificar posibiliodad de envio, el siguiente codigo queda a modo de ejemplo de como se deberia hacer
// para validar cada tipo de cambio

// describe("<NewPost />", () => {
//   let wrapper;
//   const setState = jest.fn();
//   const useStateSpy = jest.spyOn(React, "useState")
//   useStateSpy.mockImplementation(init => [init, setState]);

//   beforeEach(() => {
//       wrapper = Enzyme.mount(Enzyme.shallow(<NewPost />).get(0))
//   });

//   afterEach(() => {
//       jest.clearAllMocks();
//   });

//   describe("Title input", () => {
//     it("Should capture title correctly onChange", () => {
//         const title = wrapper.find("input").at(0);
//         title.instance().value = "Test";
//         title.simulate("change");
//         expect(setState).toHaveBeenCalledWith("Test");
//     });
// });

// describe("Content input", () => {
//     it("Should capture content correctly onChange", () => {
//         const content = wrapper.find("input").at(1);
//         content.instance().value = "Testing";
//         content.simulate("change");
//         expect(setState).toHaveBeenCalledWith("Testing");
//     });
// });