const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    /**
     * @TODO 7
     * Tuliskan kode alur logika dalam menambahkan komentar baru yang diambil dari `useCasePayload`
     * ke dalam database.
     *
     * Catatan:
     * - Manfaatkanlah entities `NewComment` untuk memastikan nilai `useCasePayload` valid.
     * - Gunakan `this._threadRepository` dan method abstract di dalamnya
     *   untuk berinteraksi dengan database.
     * - Jika thread tidak ditemukan (dilihat dari `threadId`),
     *   bangkitkan error dengan pesan 'ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND'
     * - Kembalikan method `execute` dengan nilai yang dihasilkan dari pemanggilan
     *   fungsi `this._commentRepository.addComment(newComment);`
     */

    // Validate payload using the NewComment entity
    const newComment = new NewComment(useCasePayload);

    // Check if the thread exists
    const isThreadExist = await this._threadRepository.isThreadExist(newComment.threadId);

    // Throw an error if the thread is not found
    if (!isThreadExist) {
      throw new Error('ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    }

    // Add the comment using the CommentRepository and return the result
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
