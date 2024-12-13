import { Upload } from './upload';

describe('Upload', () => {
  it('should create an instance', () => {
    expect(new Upload(new File(["test"], "test.txt"))).toBeTruthy();
  });
});
