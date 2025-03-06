import Author from "../models/authorModel.js";

export const getAllAuthors = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(req.query.limit) || 15));

    const filters = {
      search: req.query.search,
      page,
      limit,
    };

    const { authors, total, totalPages } = await Author.findAllForAdmin(
      filters
    );

    res.json({
      success: true,
      data: authors,
      total,
      totalPages,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

export const getAuthorDetails = async (req, res, next) => {
  try {
    const author = await Author.findByIdForAdmin(req.params.id);

    if (!author) {
      return res.status(404).json({
        success: false,
        error: "Author not found",
      });
    }

    res.json({
      success: true,
      data: author,
    });
  } catch (error) {
    next(error);
  }
};

export const createAuthor = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Author name is required",
      });
    }

    const authorId = await Author.create({ name });
    const author = await Author.findByIdForAdmin(authorId);

    res.status(201).json({
      success: true,
      data: author,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAuthor = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Author name is required",
      });
    }

    const author = await Author.findByIdForAdmin(req.params.id);
    if (!author) {
      return res.status(404).json({
        success: false,
        error: "Author not found",
      });
    }

    const updatedAuthor = await Author.update(req.params.id, { name });

    res.json({
      success: true,
      data: updatedAuthor,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByIdForAdmin(req.params.id);
    if (!author) {
      return res.status(404).json({
        success: false,
        error: "Author not found",
      });
    }

    if (author.resource_count > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete author with associated resources",
      });
    }

    await Author.delete(req.params.id);

    res.json({
      success: true,
      message: "Author deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
