import { z } from "zod";
import { cloudinaryUtils } from "../config/cloudinary.js";
const userSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name cannot exceed 255 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  email: z
    .string()
    .email("Invalid email format")
    .max(100, "Email cannot exceed 100 characters"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters")
    .optional(),

  role: z.enum(["user", "student"], {
    required_error: "Role is required",
    invalid_type_error: "Invalid role selected",
  }),

  institution_id: z.number().nullable(),

  sub_status: z.enum(["none", "active", "expired"]).default("none"),
});

const adminSchema = z.object({
  fullname: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  email: z
    .string()
    .email("Invalid email format")
    .max(100, "Email cannot exceed 100 characters"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters")
    .optional(),

  role: z.enum(["admin", "staff"], {
    required_error: "Role is required",
    invalid_type_error: "Invalid role selected",
  }),
});

const institutionSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name cannot exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9\s\-'.]+$/,
      "Name can only contain letters, numbers, spaces, hyphens, apostrophes, and periods"
    ),

  email: z
    .string()
    .email("Invalid email format")
    .max(100, "Email cannot exceed 100 characters"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters")
    .optional(),

  sub_status: z
    .enum(["none", "active", "expired"], {
      invalid_type_error: "Invalid subscription status",
    })
    .default("none"),
});

const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .regex(
      /^[a-zA-Z0-9\s\-'.]+$/,
      "Name can only contain letters, numbers, spaces, hyphens, apostrophes, and periods"
    ),
});

const authorSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name cannot exceed 255 characters")
    .regex(
      /^[a-zA-Z\s\-'.]+$/,
      "Name can only contain letters, spaces, hyphens, apostrophes, and periods"
    ),
});

const subscriptionSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .regex(
      /^[a-zA-Z0-9\s\-'.]+$/,
      "Name can only contain letters, numbers, spaces, hyphens, apostrophes, and periods"
    ),

  type: z.enum(["user", "institution"], {
    required_error: "Type is required",
    invalid_type_error: "Type must be either 'user' or 'institution'",
  }),

  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(999999.99, "Price cannot exceed 999,999.99")
    .multipleOf(0.01, "Price must have at most 2 decimal places"),

  duration_days: z
    .number()
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 day")
    .max(3650, "Duration cannot exceed 10 years (3650 days)"),

  features: z
    .array(z.string())
    .min(1, "At least one feature is required")
    .max(10, "Cannot exceed 10 features")
    .refine((features) => features.every((f) => f.length <= 100), {
      message: "Each feature cannot exceed 100 characters",
    }),
});

const resourceSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(255, "Title cannot exceed 255 characters"),

  doi: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || /^10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i.test(val), {
      message: "Invalid DOI format",
    }),

  abstract: z
    .string()
    .min(10, "Abstract must be at least 10 characters")
    .max(5000, "Abstract cannot exceed 5000 characters"),

  type: z.enum(["Thesis", "Journal", "Book", "Article", "Report", "Other"], {
    required_error: "Type is required",
    invalid_type_error: "Invalid resource type",
  }),

  language: z.enum(["English", "Arabic", "Somali"], {
    required_error: "Language is required",
    invalid_type_error: "Invalid language",
  }),

  category_id: z
    .number()
    .int("Category ID must be an integer")
    .positive("Category ID must be positive"),

  publication_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional()
    .nullable(),

  author_ids: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch {
      return false;
    }
  }, "Author IDs must be a valid JSON array with at least one author"),

  paid: z.enum(["free", "premium"]).optional().default("free"),

  status: z
    .enum(["published", "unpublished"])
    .optional()
    .default("unpublished"),
});

const userSubscriptionSchema = z
  .object({
    user_id: z
      .number()
      .int("User ID must be an integer")
      .positive("User ID must be positive")
      .nullable()
      .optional(),

    institution_id: z
      .number()
      .int("Institution ID must be an integer")
      .positive("Institution ID must be positive")
      .nullable()
      .optional(),

    subscription_id: z
      .number()
      .int("Subscription ID must be an integer")
      .positive("Subscription ID must be positive"),

    price: z
      .number()
      .min(0, "Price cannot be negative")
      .max(999999.99, "Price cannot exceed 999,999.99")
      .multipleOf(0.01, "Price must have at most 2 decimal places")
      .optional(),

    start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
      .optional(),

    expiry_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
      .optional(),

    payment_method: z
      .enum(["api", "manual"], {
        invalid_type_error: "Payment method must be either 'api' or 'manual'",
      })
      .optional()
      .default("manual"),

    status: z
      .enum(["pending", "active", "expired"], {
        invalid_type_error:
          "Status must be either 'pending', 'active', or 'expired'",
      })
      .optional()
      .default("pending"),

    confirmed_by: z
      .number()
      .int("Confirmed by ID must be an integer")
      .positive("Confirmed by ID must be positive")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      // Either user_id or institution_id must be provided, but not both
      return (
        (data.user_id && !data.institution_id) ||
        (!data.user_id && data.institution_id)
      );
    },
    {
      message:
        "Either user_id or institution_id must be provided, but not both",
    }
  );

export const validateUser = (isUpdate = false) => {
  return (req, res, next) => {
    try {
      const schema = isUpdate ? userSchema.partial() : userSchema;

      // Remove password if it's empty on update
      const dataToValidate =
        isUpdate && !req.body.password
          ? { ...req.body, password: undefined }
          : req.body;

      schema.parse(dataToValidate);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {}),
      });
    }
  };
};

export const validateAdmin = (isUpdate = false) => {
  return (req, res, next) => {
    try {
      const schema = isUpdate ? adminSchema.partial() : adminSchema;

      // Remove password if it's empty on update
      const dataToValidate =
        isUpdate && !req.body.password
          ? { ...req.body, password: undefined }
          : req.body;

      schema.parse(dataToValidate);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {}),
      });
    }
  };
};

export const validateInstitution = (isUpdate = false) => {
  return (req, res, next) => {
    try {
      const schema = isUpdate ? institutionSchema.partial() : institutionSchema;

      // Remove password if it's empty on update
      const dataToValidate =
        isUpdate && !req.body.password
          ? { ...req.body, password: undefined }
          : req.body;

      schema.parse(dataToValidate);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {}),
      });
    }
  };
};

export const validateCategory = () => {
  return (req, res, next) => {
    try {
      categorySchema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {}),
      });
    }
  };
};

export const validateAuthor = () => {
  return (req, res, next) => {
    try {
      authorSchema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {}),
      });
    }
  };
};

export const validateSubscription = () => {
  return (req, res, next) => {
    try {
      // Convert string numbers to actual numbers
      const data = {
        ...req.body,
        price: req.body.price ? Number(req.body.price) : undefined,
        duration_days: req.body.duration_days
          ? Number(req.body.duration_days)
          : undefined,
      };

      subscriptionSchema.parse(data);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {}),
      });
    }
  };
};

export const validateResource = (isUpdate = false) => {
  return async (req, res, next) => {
    try {
      // For updates, make all fields optional
      const schema = isUpdate ? resourceSchema.partial() : resourceSchema;

      // Convert category_id to number
      if (req.body.category_id) {
        req.body.category_id = Number(req.body.category_id);
      }

      // Validate the request body
      schema.parse(req.body);

      next();
    } catch (error) {
      // If validation fails, clean up any uploaded file
      if (req.file) {
        await cloudinaryUtils.cleanupUpload(req.file);
      }

      res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {}),
      });
    }
  };
};

export const validateUserSubscription = (data, isUpdate = false) => {
  try {
    if (isUpdate) {
      // For updates, make all fields optional except subscription_id
      const updateSchema = userSubscriptionSchema.partial().extend({
        subscription_id:
          userSubscriptionSchema.shape.subscription_id.optional(),
      });
      updateSchema.parse(data);
    } else {
      // For creation, subscription_id is required
      userSubscriptionSchema.parse(data);
    }
    return { isValid: true, errors: null };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path.join(".")] = err.message;
    });
    return { isValid: false, errors };
  }
};
