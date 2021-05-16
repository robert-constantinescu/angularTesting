

describe('my first test', () => {
  let sut;

  beforeEach(() => {
    /**
     * beforeEach function should have code that it resets your variables so that you don't pollute the other unit tests with changes from
     * previous tests
     */
    sut = {}
  })

  it('should be true if true', () => {
    //arrange
    sut.a = false

    //act
    sut.a = true

    //assert
    expect(sut.a).toBe(true);
  })

})
