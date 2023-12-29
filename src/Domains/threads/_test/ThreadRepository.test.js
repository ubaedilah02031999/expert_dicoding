const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository abstract', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const threadRepository = new ThreadRepository();
    expect(async () => await threadRepository.addThread()).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(async () => await threadRepository.isThreadExist()).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(async () => await threadRepository.getThreadById()).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
