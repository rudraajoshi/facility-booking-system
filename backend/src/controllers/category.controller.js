const categoryService = require('../services/category.service');
const { STATUS, MESSAGES } = require('../utils/constants');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');

// get categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAll();
    return successResponse(res, 'Categories fetched successfully', categories);
  } catch (error) {
    next(error);
  }
};

// get categories by id
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getById(req.params.id);
    if (!category) {
      return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.CATEGORY_NOT_FOUND);
    }
    return successResponse(res, 'Category fetched successfully', category);
  } catch (error) {
    next(error);
  }
};

// post categories
exports.createCategory = async (req, res, next) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      return errorResponse(res, STATUS.BAD_REQUEST, 'Category name is required');
    }

    const existing = await categoryService.findByName(category_name);
    if (existing) {
      return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.CATEGORY_EXISTS);
    }

    const category = await categoryService.create({ category_name });
    return createdResponse(res, MESSAGES.CATEGORY_CREATED, category);
  } catch (error) {
    next(error);
  }
};

// put categories by id
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.getById(req.params.id);
    if (!category) {
      return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.CATEGORY_NOT_FOUND);
    }

    const updated = await categoryService.update(category, req.body);
    return successResponse(res, MESSAGES.CATEGORY_UPDATED, updated);
  } catch (error) {
    next(error);
  }
};

// delete categories by id
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryService.getById(req.params.id);
    if (!category) {
      return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.CATEGORY_NOT_FOUND);
    }

    await categoryService.remove(category);
    return successResponse(res, MESSAGES.CATEGORY_DELETED);
  } catch (error) {
    next(error);
  }
};