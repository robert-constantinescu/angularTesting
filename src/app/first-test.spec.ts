

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
    //ARRANGE all necessary preconditions and inputs
    sut.a = false

    //ACT on the object or class under test
    sut.a = true

    //ASSERT that the expected result occurred
    expect(sut.a).toBe(true);
  })

})
