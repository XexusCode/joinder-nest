// @ts-ignore

export const repositoryMockFactory: jest.Mock<
  { findOne: jest.Mock<any, [undefined]> },
  any[]
> = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
  // ...
}));
