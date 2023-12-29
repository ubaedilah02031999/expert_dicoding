const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });
  // 1
  afterAll(async () => {
    await pool.end();
  });
  // 2
  describe('addThread', () => {
    it('should persist new thread and return added thread correctly', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const threadData = {
        title: 'Thread Title',
        body: 'Thread Body',
        owner: 'user-123',
      };

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      // Action
      const addedThread = await repository.addThread(threadData);

      // Assert
      expect(addedThread).toEqual(new AddedThread({
        id: 'thread-123',
        title: threadData.title,
        owner: threadData.owner,
      }));

      // Check if the data is inserted into the database correctly
      const insertedThread = await ThreadsTableTestHelper.findThreadById(addedThread.id);
      expect(insertedThread).toEqual(expect.objectContaining({
        id: addedThread.id,
        title: threadData.title,
        body: threadData.body,
        date: expect.any(String),
        owner: threadData.owner,
      }));
    });
  });

  describe('isThreadExist', () => {
    it('should return true if thread exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const repository = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(repository.isThreadExist('thread-123')).resolves.toBe(true);
    });

    it('should return false if thread not exists', async () => {
      // Arrange
      const repository = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(repository.isThreadExist('thread-123')).resolves.toBe(false);
    });
  });

  describe('getThreadById', () => {
    it('should return null if thread not exists', async () => {
      // Arrange
      const repository = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await repository.getThreadById('thread-123');

      // Assert
      expect(thread).toBeNull();
    });

    it('should return thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const repository = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await repository.getThreadById('thread-123');

      // Assert
      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toEqual('title');
      expect(thread.body).toEqual('body');
      expect(thread.date).toEqual(expect.any(String));
      expect(thread.username).toEqual('dicoding');
      expect(thread.comments).toEqual([]);
    });
  });
});
